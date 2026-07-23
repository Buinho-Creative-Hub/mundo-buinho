"""
Mundo Buinho — backend
Buinho FabLab, Messejana · CC-BY-SA 4.0

Serve os estáticos do jogo e dois endpoints de IA:
  POST /api/dica      -> Mistral Small (texto)      : pista para a criança
  POST /api/desenho   -> Mistral visão (multimodal) : comentário a um desenho

REGRA CRÍTICA (spec Magalhães): o jogo NUNCA pode partir com crianças à frente.
Qualquer falha de API devolve 200 com um fallback PT-PT pré-escrito.
A chave do Mistral vive no servidor, nunca no cliente.
"""
import os
import json
import time
import random
import base64
import logging
import urllib.error
import urllib.request
from collections import defaultdict, deque

from flask import Flask, jsonify, request, send_from_directory

# ----------------------------------------------------------------------------
# Config
# ----------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

try:  # segredos fora do repo (padrão Buinho)
    import config_local  # noqa
    MISTRAL_API_KEY = getattr(config_local, "MISTRAL_API_KEY", "")
except ImportError:
    MISTRAL_API_KEY = ""

MISTRAL_API_KEY = os.environ.get("MISTRAL_API_KEY", MISTRAL_API_KEY)

# Nomes de modelo passam por env: o catálogo do Mistral muda de mês para mês
# e a spec avisa explicitamente para não assumir (Pixtral ou equivalente).
MODEL_TEXT = os.environ.get("MISTRAL_MODEL_TEXT", "mistral-small-latest")
MODEL_VISION = os.environ.get("MISTRAL_MODEL_VISION", "pixtral-12b-2409")

MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions"
TIMEOUT = 12          # segundos: acima disto a criança já desistiu de esperar
MAX_TOKENS = 160      # respostas são de 1-3 frases; tecto baixo = custo baixo

# Rate limit simples por IP (spec §6: tecto de gasto + travão a abuso)
RATE_MAX = 40         # pedidos
RATE_WINDOW = 60      # por minuto
_hits = defaultdict(deque)

app = Flask(__name__, static_folder=None)
log = logging.getLogger("mundo-buinho")

# ----------------------------------------------------------------------------
# System prompts — transcritos do protótipo SEM alterações (spec: "manter tal como estão")
# ----------------------------------------------------------------------------
HINT_SYS = (
    "És o Buinho, a mascote simpática de um laboratório de biofabricação no Alentejo "
    "(Messejana). Ajudas crianças de 8 a 10 anos. Responde SEMPRE em português de Portugal, "
    "em 1 ou 2 frases muito curtas, quentes e simples. Dás uma PISTA para a criança pensar "
    "sozinha — NUNCA dês a resposta nem o número/ordem final. Encoraja com carinho. "
    "No máximo um emoji."
)

EVAL_SYS = (
    "És o Buinho, mascote de um laboratório de biofabricação no Alentejo. Comentas desenhos "
    "de crianças de 8 a 10 anos. Responde SEMPRE em português de Portugal, 2 a 3 frases curtas "
    "e calorosas, como um professor querido. Diz primeiro algo bom e concreto que vês, depois "
    "UMA sugestão gentil para continuar. Nunca critiques nem digas que está mal. "
    "No máximo um emoji."
)

# Fallbacks — transcritos do protótipo. NÃO REMOVER.
FALLBACK_HINT = [
    "Hmm, quase! Olha outra vez com calma e conta devagarinho. Tu consegues! 🌱",
    "Pensa bem: o que é que muda quando fazes de outra maneira? Experimenta!",
    "Boa tentativa! Volta a ler o desafio e imagina passo a passo. Estou aqui contigo.",
]

FALLBACK_PRAISE = [
    "Que giro o teu desenho! Vê-se que puseste cuidado. E se juntasses mais uns pormenores da natureza? 🌱",
    "Adorei as tuas cores! Conta-me com o traço o que acontece a seguir na tua folha.",
    "Muito bem! O teu desenho tem vida. Experimenta acrescentar a terra por baixo, para ele voltar ao solo.",
]


# ----------------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------------
def _rate_ok(ip):
    """Janela deslizante por IP. Sem dependências externas."""
    now = time.time()
    q = _hits[ip]
    while q and now - q[0] > RATE_WINDOW:
        q.popleft()
    if len(q) >= RATE_MAX:
        return False
    q.append(now)
    return True


def _client_ip():
    fwd = request.headers.get("X-Forwarded-For", "")
    return fwd.split(",")[0].strip() if fwd else (request.remote_addr or "?")


def _mistral(model, system, user_content):
    """
    Chama o Mistral e devolve texto, ou None em qualquer falha.
    Nunca levanta excepção — quem chama decide o fallback.
    """
    if not MISTRAL_API_KEY:
        log.warning("MISTRAL_API_KEY em falta — a servir fallback")
        return None

    payload = {
        "model": model,
        "max_tokens": MAX_TOKENS,
        "temperature": 0.7,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user_content},
        ],
    }
    req = urllib.request.Request(
        MISTRAL_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            data = json.loads(r.read().decode("utf-8"))
        text = (data["choices"][0]["message"]["content"] or "").strip()
        return text or None
    except urllib.error.HTTPError as e:
        # corpo do erro ajuda a distinguir chave inválida de modelo inexistente
        body = ""
        try:
            body = e.read().decode("utf-8")[:300]
        except Exception:
            pass
        log.error("Mistral HTTP %s (%s): %s", e.code, model, body)
        return None
    except Exception as e:  # timeout, DNS, JSON malformado
        log.error("Mistral falhou (%s): %s", model, e)
        return None


# ----------------------------------------------------------------------------
# API
# ----------------------------------------------------------------------------
@app.post("/api/dica")
def api_dica():
    """Pista de texto. Espera {"contexto": "..."} e devolve sempre 200."""
    if not _rate_ok(_client_ip()):
        return jsonify(texto=random.choice(FALLBACK_HINT), fonte="limite"), 200

    ctx = (request.json or {}).get("contexto", "").strip()
    if not ctx:
        return jsonify(texto=random.choice(FALLBACK_HINT), fonte="fallback"), 200

    texto = _mistral(MODEL_TEXT, HINT_SYS, ctx[:1200])
    if texto:
        return jsonify(texto=texto, fonte="mistral"), 200
    return jsonify(texto=random.choice(FALLBACK_HINT), fonte="fallback"), 200


@app.post("/api/desenho")
def api_desenho():
    """
    Comentário a um desenho. Espera {"imagem": "<base64 PNG>", "desafio": "..."}.

    PRIVACIDADE (spec §6): a imagem é um desenho de menor. NÃO se guarda em disco,
    NÃO se loga o conteúdo, e só viaja para a API (Mistral, dados UE). Se um dia
    houver uso em sala, tratar consentimento antes.
    """
    if not _rate_ok(_client_ip()):
        return jsonify(texto=random.choice(FALLBACK_PRAISE), fonte="limite"), 200

    body = request.json or {}
    img = (body.get("imagem") or "").strip()
    desafio = (body.get("desafio") or "").strip()

    if not img:
        return jsonify(texto=random.choice(FALLBACK_PRAISE), fonte="fallback"), 200

    # validação barata: tem de ser base64 credível e não gigante
    if len(img) > 4_000_000:
        return jsonify(texto=random.choice(FALLBACK_PRAISE), fonte="fallback"), 200
    try:
        base64.b64decode(img[:120], validate=True)
    except Exception:
        return jsonify(texto=random.choice(FALLBACK_PRAISE), fonte="fallback"), 200

    user_content = [
        {"type": "image_url", "image_url": f"data:image/png;base64,{img}"},
        {
            "type": "text",
            "text": (
                f'Uma criança de 8-10 anos desenhou isto a partir do desafio: "{desafio}". '
                "Diz o que vês de bom e dá uma sugestão gentil para continuar."
            ),
        },
    ]

    texto = _mistral(MODEL_VISION, EVAL_SYS, user_content)
    if texto:
        return jsonify(texto=texto, fonte="mistral"), 200
    return jsonify(texto=random.choice(FALLBACK_PRAISE), fonte="fallback"), 200


@app.get("/api/saude")
def api_saude():
    """Diagnóstico: mostra se a chave está montada, sem nunca a revelar."""
    return jsonify(
        ok=True,
        app="mundo-buinho",
        chave_montada=bool(MISTRAL_API_KEY),
        modelo_texto=MODEL_TEXT,
        modelo_visao=MODEL_VISION,
    )


# ----------------------------------------------------------------------------
# Estáticos
# ----------------------------------------------------------------------------
@app.get("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.get("/<path:caminho>")
def estaticos(caminho):
    return send_from_directory(BASE_DIR, caminho)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
