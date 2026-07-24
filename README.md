# Mundo Buinho

**Jogos educativos para os 8 aos 10 anos (3.º/4.º ano)** · Buinho FabLab, Messejana, Alentejo

Dez jogos — cinco sobre biofabricação (resíduos agroalimentares → materiais) e
cinco de **Matemática do 4.º ano** — com uma mascote que dá pistas em português
de Portugal.

> ⚠️ **Estado: protótipo por validar (enquadramento pedagógico).**
> - Jogos 1–5: as doses do Jogo 1 aguardam validação do agente Magalhães contra
>   `strategy/biofabricacao-receitas.md` (regra selada: proporção pela ÁGUA).
> - Jogos 6–10 (Matemática): **a matemática está verificada em código**
>   (`testes/verificar-matematica.js`), mas o **enquadramento didáctico**
>   (progressão, redacção dos enunciados) aguarda validação do Magalhães.
>
> **Não usar como material didáctico antes dessa validação.**

---

## Os dez jogos

**Biofabricação (1–5)**

| # | Jogo | Competência |
|---|---|---|
| 1 | A Receita Certa | Medir e pesar |
| 2 | Do Lixo ao Material | Sequência e correspondência |
| 3 | Conta a Colheita | Cálculo mental |
| 4 | Circular ou Linear? | Raciocínio |
| 5 | Desenha a tua Folha | Criatividade (com IA) |

**Matemática — 4.º ano (6–10)** · ancorados nas Aprendizagens Essenciais (ver `strategy/ubbu-ae-sobreposicao.md`)

| # | Jogo | Domínio AE | O que treina |
|---|---|---|---|
| 6 | Fatias Certas | Números e Operações | frações como parte de um todo (½, ¾, ⅔…) |
| 7 | A Feira | Números / Medida | dinheiro e decimais (compor um preço com moedas) |
| 8 | A Horta Cercada | Geometria e Medida | perímetro numa grelha (traçar a cerca) |
| 9 | Castelos na Areia | Álgebra | sequências de crescimento (tarefa oficial AE 4.º) |
| 10 | O Gráfico da Turma | Org. e Tratamento de Dados | ler gráficos de barras |

Tema visual "mundo Buinho", mas contextos variados do quotidiano — não só
biofabricação (decisão do Carlos, 24 Jul 2026).

## Como correr

```bash
pip install -r requirements.txt
cp config_local.example.py config_local.py    # e pôr lá a chave do Mistral
python app.py                                  # http://localhost:5000
```

Sem chave, o jogo funciona na mesma: a mascote responde com frases pré-escritas.

## Testes

```bash
python teste_api.py                     # backend: 22 testes
node testes/verificar-matematica.js     # matemática dos jogos 6–10 (recomputada)
node testes/teste-frontend.js           # frontend em DOM real: 61 testes
```

## Arquitectura

```
app.py                  Flask: serve estáticos + /api/dica e /api/desenho
static/js/dados.js      Dados dos 10 jogos (biofab transcritos + matemática 4.º)
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

**Educational games for ages 8–10 (grades 3–4)** · Buinho FabLab, Messejana, Portugal

Ten games — five on biofabrication (agri-food waste → materials) and five on
**4th-grade Maths** (fractions, money/decimals, perimeter, growing sequences,
reading bar charts) — with a mascot that gives hints in European Portuguese.

> ⚠️ **Status: unvalidated prototype (pedagogical framing).** Game 1 recipe
> amounts await validation; games 6–10 have code-verified maths but their
> didactic framing awaits Magalhães. Not for classroom use yet.

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
