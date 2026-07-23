# Mundo Buinho

**Jogos de biofabricação para os 8 aos 10 anos** · Buinho FabLab, Messejana, Alentejo

Cinco jogos sobre resíduos agroalimentares que se transformam em materiais —
bioplásticos, biocompósitos, biotêxteis — com uma mascote que dá pistas em
português de Portugal.

> ⚠️ **Estado: protótipo por validar.** As doses do Jogo 1 aguardam validação
> pedagógica do agente Magalhães contra `strategy/biofabricacao-receitas.md`
> (regra selada: proporção sempre pela ÁGUA). **Não usar como material didáctico
> antes disso.**

---

## Os cinco jogos

| # | Jogo | Competência |
|---|---|---|
| 1 | A Receita Certa | Medir e pesar |
| 2 | Do Lixo ao Material | Sequência e correspondência |
| 3 | Conta a Colheita | Cálculo mental |
| 4 | Circular ou Linear? | Raciocínio |
| 5 | Desenha a tua Folha | Criatividade (com IA) |

## Como correr

```bash
pip install -r requirements.txt
cp config_local.example.py config_local.py    # e pôr lá a chave do Mistral
python app.py                                  # http://localhost:5000
```

Sem chave, o jogo funciona na mesma: a mascote responde com frases pré-escritas.

## Testes

```bash
python teste_api.py     # backend: 22 testes
node ../teste.js        # frontend em DOM real: 36 testes
```

## Arquitectura

```
app.py                  Flask: serve estáticos + /api/dica e /api/desenho
static/js/dados.js      Dados dos 5 jogos (transcritos do protótipo)
static/js/nucleo.js     Estado, som, arrasto touch, mascote
static/js/jogos.js      Vistas e lógica de cada jogo
static/css/mundo.css    Identidade Buinho Educativo
sw.js                   Service worker (funciona offline)
```

Sem passo de build: HTML/JS puro. Faz-se upload e está no ar.

## Decisões que não são óbvias

**A mascote nunca fica muda.** Se a API falhar, ficar sem chave, exceder o rate
limit ou receber lixo, o servidor devolve sempre 200 com uma frase pré-escrita
em PT-PT. Com crianças à frente, um ecrã de erro é inaceitável.

**Pointer events, não mouse events.** O protótipo usava rato; em tablet não
chega. Arrasto e desenho usam `pointerdown`/`pointermove`, que cobrem dedo,
rato e caneta.

**O canvas do Jogo 5 sobrevive ao re-render.** O desenho vive nos pixels do
canvas, não no estado — um `innerHTML` cego apagava-o sempre que a criança
mudava de cor. O elemento é preservado e reinserido.

**Fontes locais.** Sem CDN: rede fraca nas escolas, e nenhum pedido dos tablets
das crianças para servidores de terceiros.

**Privacidade.** O Jogo 5 envia desenhos de menores para a API do Mistral
(dados na UE). Não se guardam imagens em disco nem se registam nos logs.
Antes de qualquer uso em sala com turmas reais é preciso tratar consentimento.

## Licença

CC BY-SA 4.0 — Buinho FabLab, Messejana, Alentejo, Portugal.

---

# Mundo Buinho (EN)

**Biofabrication games for ages 8–10** · Buinho FabLab, Messejana, Portugal

Five games about turning agri-food waste into materials — bioplastics,
biocomposites, biotextiles — with a mascot that gives hints in European
Portuguese.

> ⚠️ **Status: unvalidated prototype.** Game 1 recipe amounts await pedagogical
> validation. Not for classroom use yet.

## Running

```bash
pip install -r requirements.txt
cp config_local.example.py config_local.py    # add your Mistral key
python app.py                                  # http://localhost:5000
```

Works without a key — the mascot falls back to pre-written phrases.

## Design notes

The mascot never goes silent: any API failure returns a pre-written Portuguese
phrase rather than an error. Touch-first throughout (pointer events, ≥44px
targets). Offline-capable via service worker. Fonts served locally — rural
schools have poor connectivity, and children's tablets shouldn't ping third
parties. Children's drawings are sent to Mistral (EU data residency), never
stored or logged.

Built by **Albano**, the Buinho development agent, from a Claude Design
prototype. Pedagogical content by **Magalhães**. Visual identity by **Gris**.

## License

CC BY-SA 4.0 — Buinho FabLab, Messejana, Alentejo, Portugal.
