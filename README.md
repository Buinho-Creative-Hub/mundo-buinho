# Mundo Buinho

**Jogos educativos para os 8 aos 10 anos (3.º/4.º ano)** · Buinho FabLab, Messejana, Alentejo

**15 jogos:** 5 sobre biofabricação (resíduos agroalimentares → materiais) e
**10 de Matemática do 4.º ano**, estes com **cronómetro** e **3 níveis de
dificuldade**. Mascote que dá pistas em português de Portugal.

> ⚠️ **Estado: protótipo por validar (enquadramento pedagógico).**
> - Biofabricação: as doses do Jogo 1 aguardam validação do agente Magalhães.
> - Matemática: **toda a matemática está verificada em código**
>   (`testes/gerar-dados-mat.js`, 90 perguntas), mas o **enquadramento didáctico**
>   (progressão, redacção, tempos do cronómetro) aguarda validação do Magalhães.
>
> **Não usar como material didáctico antes dessa validação.**

---

## Os 15 jogos

**Biofabricação (5)** — A Receita Certa · Do Lixo ao Material · Conta a Colheita ·
Circular ou Linear? · Desenha a tua Folha (com IA).

**Matemática — 4.º ano (10, com cronómetro + 3 níveis)** · ancorados nas
Aprendizagens Essenciais (`strategy/ubbu-ae-sobreposicao.md`) e no programa
oficial (matematica.pt). Dados em `static/js/dados-mat.js` (gerado e verificado).

| Jogo | O que treina |
|---|---|
| Multiplicação | tabuadas → 2 dígitos × 1 |
| Divisão | divisão exata e com resto |
| Frações | fração de uma quantidade, equivalência |
| Decimais | ×÷ por 10/100, comparar, somar |
| Dinheiro | somar preços, troco, multi-passo |
| Perímetro e Área | perímetro, área e inverso (área→lado) |
| Sequências | ×2, quadrados, decrescentes, saltos que crescem |
| Ângulos | reto/agudo/obtuso, voltas → graus |
| Gráficos | pictograma com escala, diferenças, fração do total |
| Problemas | cálculo mental e problemas de vários passos |

**Estrutura de cada jogo de matemática:** 3 níveis × 3 rounds (9 perguntas).
Cronómetro por nível — **Nível 1: 25 s · Nível 2: 18 s · Nível 3: 10 s**.
Acertar as 3 perguntas sobe de nível; **errar ou esgotar o tempo faz descer um
nível**. Calibrado a pedido do Carlos (os primeiros jogos estavam fáceis demais)
olhando o Hypatiamat e o programa oficial.

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
