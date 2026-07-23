# Deploy — Mundo Buinho (Webtuga / cPanel + Passenger)

> Escrito a partir de `buinho-os/workflows/deploy-webtuga-CHECKLIST.md`.
> **Render está fora** por decisão do Carlos (23 Jul 2026).

## Decisão 0 — shared ou VPS?

**Shared (cPanel).** O `requirements.txt` é Flask + gunicorn: Python puro, sem C extensions.
Corre bem via Passenger.

## ⚠️ Princípio que custou 2h em Mai 2026

**COMMIT NO GITHUB ≠ DEPLOY NO WEBTUGA.** O Webtuga não puxa do GitHub.
Fluxo: `commit` → `download do zip` → `upload no File Manager` → `RESTART` → testar.

---

## Passos

### 1. Subdomínio PRIMEIRO
cPanel → Domínios → criar o subdomínio (ex. `mundo.buinho.pt` ou `jogos.buinho.pt`).
**Tem de existir antes** de aparecer no dropdown da Python App. Depois F5 nessa página.

⚠️ Criar na conta cPanel certa — a que tem o domínio-pai.

### 2. Setup Python App
- **Versão Python: mudar para 3.10+.** O default é 2.7 e o Flask 3 não corre lá. É o primeiro campo.
- Application root: pasta nova, ex. `mundo-buinho` (NÃO uma pasta que já tenha outro site)
- Application URL: o subdomínio do passo 1
- Startup file: `passenger_wsgi.py`
- Entry point: `application`

### 3. Upload
Descarregar o zip do repo (Code → Download ZIP) ou usar o `mundo-buinho-deploy.zip` que o Albano
entrega. **Extrair na RAIZ da pasta da app** — os ficheiros ficam directamente lá dentro,
não numa subpasta.

⚠️ **O zip do Albano vem sem pasta wrapper de propósito.** O zip do GitHub vem com uma pasta
`mundo-buinho-main/` — se usares esse, entra lá dentro e move os ficheiros para cima.

Confirmação: `app.py` e `index.html` têm de estar na raiz da pasta da app.

### 4. requirements.txt
No painel da Python App, campo **"Configuration files"**: escrever `requirements.txt` + Enter.
Só depois é que o botão **"Executar Pip Install"** deixa de estar cinzento. Carregar.

⚠️ O pip corre em silêncio, sem modal. Não confiar na mensagem — validar no passo 6.

### 5. A chave do Mistral — `config_local.py`, NÃO variáveis de ambiente
O checklist é explícito: **env vars no Webtuga causaram confusão** (gravadas a meio, nome errado,
a app não as vê). Em vez disso, criar à mão no File Manager, na raiz da app:

```python
# config_local.py
MISTRAL_API_KEY = "a-chave-do-Bitwarden"
MISTRAL_MODEL_TEXT = "mistral-small-latest"
MISTRAL_MODEL_VISION = "confirmar-no-catalogo-actual"
```

Está no `.gitignore` — nunca vai para o GitHub.

**Sem este ficheiro a app funciona à mesma**: a mascote responde com as frases pré-escritas.
Bom para o primeiro teste — valida os jogos e o toque sem gastar nada.

### 6. RESTART e validação
Restart, do mais fiável ao menos: (a) botão **GRAVAR** no painel; (b) criar/tocar `tmp/restart.txt`
na raiz da app. Sem restart efectivo o Passenger serve o código antigo em memória.

Depois abrir: **`https://<subdominio>/api/saude`**

Deve devolver JSON com `"ok": true` e `"chave_montada": true` (ou `false` se ainda não puseste
o `config_local.py`). Se der 404 ou erro do WordPress, ver a secção seguinte.

### 7. SSL
AutoSSL trata sozinho em minutos. Cadeado vermelho num subdomínio acabado de criar é normal.
Não mexer no "Force HTTPS" até ficar verde.

---

## Se não funcionar

**404 ou página de outro site em `/api/saude`:** o docroot do subdomínio tem um `.htaccess` com
bloco `# BEGIN WordPress` que vem ANTES do bloco Passenger e, em LiteSpeed, rouba tudo.
Remover o bloco WordPress, deixar só `SetEnv noabort 1` + `CLOUDLINUX PASSENGER CONFIGURATION`.
(Mordeu no deploy do buinho-pt-cms a 22 Jul.)

**Nada muda depois do deploy:** 90% das vezes é ficheiro antigo no servidor (upload não substituiu,
ou extraiu para subpasta) ou restart que não pegou. Abrir o `app.py` no File Manager → Editar →
confirmar que é a versão nova.

**"Pip install completed" mas a app rebenta:** pode ter instalado um requirements antigo.
Validar pelo import real, não pela mensagem.

**Erro 500:** ver o log em `stderr.log` na pasta da app, ou `logs/` do cPanel.

---

## ⚠️ Antes de mostrar a crianças

1. **Doses do Jogo 1 por validar** (Água 120 / Agar 5 / Glicerina 15) com o Magalhães contra
   `strategy/biofabricacao-receitas.md`. Regra selada: proporção pela ÁGUA. Gate de qualidade.
2. **Nome do modelo de visão do Mistral** — confirmar no catálogo actual; muda de mês para mês.
3. **Tecto de gasto** na conta Mistral (o rate limit por IP já está no código: 40/min).
4. **Fontes** `.woff2` em `static/fonts/` (ver `LEIA-ME.md` lá). Sem elas cai para fonte de
   sistema: funciona, fica menos on-brand.

## Privacidade

O Jogo 5 envia desenhos de crianças para a API do Mistral (dados UE). Não se guardam nem se
registam. Antes de uso em sala com turmas: consentimento dos encarregados de educação.
