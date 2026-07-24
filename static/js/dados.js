/* Mundo Buinho — dados dos jogos
   Buinho FabLab, Messejana · CC-BY-SA 4.0

   ⚠️ TRANSCRITOS DO PROTÓTIPO SEM ALTERAÇÃO. Não inventar valores.

   ⚠️ GATE DE QUALIDADE PENDENTE (Magalhães, handoff 22 Jul):
   as doses do Jogo 1 (Água 120 / Agar 5 / Glicerina 15) têm de ser validadas
   contra strategy/biofabricacao-receitas.md ANTES de publicar.
   Regra selada: proporção sempre pela ÁGUA. Fonte canónica Ocloya/Materiom §6.
   Enquanto não houver validação, isto é protótipo — não material didáctico.

   ── JOGOS DE MATEMÁTICA (4.º ano) → static/js/dados-mat.js ──────────────────
   Os 10 jogos de matemática (Multiplicação, Divisão, Frações, Decimais,
   Dinheiro, Perímetro/Área, Sequências, Ângulos, Gráficos, Problemas) vivem
   em window.MB_JOGOS (dados-mat.js), cada um com 3 NÍVEIS × 3 ROUNDS e
   CRONÓMETRO (L1 25s · L2 18s · L3 10s; ao perder desce um nível). Esse ficheiro
   é GERADO e verificado por testes/gerar-dados-mat.js — 90 perguntas, toda a
   matemática recomputada em código. Ancorados nas AE 4.º + programa oficial.
   Aqui em baixo só ficam os 5 jogos de BIOFABRICAÇÃO (g1–g5) e o mapa. */

window.MB_DADOS = {

  // ---------------------------------------------- Jogo 1 — A Receita Certa
  g1: [
    { id: 'agua', nome: 'Água',      alvo: 120, passo: 20, cor: '#2038A6' },
    { id: 'agar', nome: 'Agar-agar', alvo: 5,   passo: 5,  cor: '#8A8578' },
    { id: 'glic', nome: 'Glicerina', alvo: 15,  passo: 5,  cor: '#FA6415' }
  ],

  // ------------------------------------------ Jogo 2 — Do Lixo ao Material
  g2Passos: [
    { k: 'pesar',    etiqueta: 'Pesar',    icone: '⚖️' },
    { k: 'cozinhar', etiqueta: 'Cozinhar', icone: '🔥' },
    { k: 'verter',   etiqueta: 'Verter',   icone: '🥣' },
    { k: 'secar',    etiqueta: 'Secar',    icone: '☀️' }
  ],

  g2Pares: [
    { rid: 'cafe',    rEtiqueta: 'Borra de café',    rIcone: '☕', mid: 'ceramica', mEtiqueta: 'Biocerâmica',     mIcone: '🏺' },
    { rid: 'ovo',     rEtiqueta: 'Casca de ovo',     rIcone: '🥚', mid: 'petreo',   mEtiqueta: 'Material pétreo', mIcone: '🪨' },
    { rid: 'la',      rEtiqueta: 'Lã',               rIcone: '🐑', mid: 'couro',    mEtiqueta: 'Tipo couro',      mIcone: '🧥' },
    { rid: 'laranja', rEtiqueta: 'Casca de laranja', rIcone: '🍊', mid: 'textil',   mEtiqueta: 'Biotêxtil',       mIcone: '🧵' }
  ],

  // ------------------------------------------- Jogo 3 — Conta a Colheita
  g3: [
    { icone: '🍊', total: 24, por: 6, grupos: 4, pergunta: 'Tens 24 laranjas e cada molde leva 6. Quantos moldes consegues encher?', resposta: 4,  opcoes: [3, 4, 6, 5] },
    { icone: '🥚', total: 18, por: 6, grupos: 3, pergunta: 'São 18 ovos. Cada caixa guarda 6. De quantas caixas precisas?',          resposta: 3,  opcoes: [2, 3, 4, 6] },
    { icone: '🌰', total: 28, por: 7, grupos: 4, pergunta: 'Enches 4 sacos com 7 azinhos cada. Quantos azinhos ao todo?',            resposta: 28, opcoes: [11, 21, 28, 35] },
    { icone: '🔴', total: 30, por: 5, grupos: 6, pergunta: 'Colheste 30 medronhos. Fazes grupos de 5. Quantos grupos ficam?',        resposta: 6,  opcoes: [5, 6, 7, 25] }
  ],

  // ------------------------------------------ Jogo 4 — Circular ou Linear?
  g4: [
    { icone: '🍊',  texto: 'Deitar a casca da laranja no caixote do lixo comum.',            r: 'linear'   },
    { icone: '🧵',  texto: 'Transformar a casca da laranja em biotêxtil.',                   r: 'circular' },
    { icone: '☕',  texto: 'Compostar a borra de café para adubar a horta.',                 r: 'circular' },
    { icone: '🛍️', texto: 'Um saco de plástico que fica 400 anos no solo.',                 r: 'linear'   },
    { icone: '🥤',  texto: 'Um copo de biomaterial que se desfaz na terra.',                 r: 'circular' },
    { icone: '🥚',  texto: 'Fazer biocerâmica com a casca de ovo em vez de a deitar fora.',  r: 'circular' }
  ],

  // ------------------------------------------ Jogo 5 — Desenha a tua Folha
  g5Desafios: [
    'Desenha uma folha que volta ao solo.',
    'Desenha o teu próprio biomaterial.',
    'Desenha o micélio a crescer na terra.',
    'Desenha o que farias com uma casca de laranja.'
  ],

  g5Cores: ['#22201C', '#2038A6', '#FA6415', '#6B8F3E', '#8A5A2B', '#9A927F'],

  // Os 10 jogos de MATEMÁTICA (4.º ano, com níveis + cronómetro) vivem em
  // static/js/dados-mat.js (window.MB_JOGOS), gerado e verificado por
  // testes/gerar-dados-mat.js. Aqui ficam só os 5 jogos de biofabricação.

  // -------------------------------------------------- Mapa de níveis (home)
  // 5 jogos de biofabricação (g1–g5) + 10 de matemática (q1–q10, motor de quiz).
  niveis: [
    { n: 1,  ecra: 'g1',  nome: 'A Receita Certa',     tema: 'Medir e pesar',   icone: '🥣', cor: '#2038A6', sombra: '#16296f', x: '25%',   y: 274 },
    { n: 2,  ecra: 'g2',  nome: 'Do Lixo ao Material', tema: 'Sequência',       icone: '♻️', cor: '#6B8F3E', sombra: '#55722f', x: '75%',   y: 474 },
    { n: 3,  ecra: 'g3',  nome: 'Conta a Colheita',    tema: 'Cálculo mental',  icone: '🍊', cor: '#FA6415', sombra: '#b23c0a', x: '26.5%', y: 694 },
    { n: 4,  ecra: 'g4',  nome: 'Circular ou Linear?', tema: 'Raciocínio',      icone: '🌍', cor: '#2038A6', sombra: '#16296f', x: '74%',   y: 874 },
    { n: 5,  ecra: 'g5',  nome: 'Desenha a tua Folha', tema: 'Criatividade',    icone: '🎨', cor: '#6B8F3E', sombra: '#55722f', x: '50%',   y: 1054 },
    { n: 6,  ecra: 'q1',  nome: 'Multiplicação',       tema: 'Tabuadas ⏱',      icone: '✖️', cor: '#FA6415', sombra: '#b23c0a', x: '74%',   y: 1254 },
    { n: 7,  ecra: 'q2',  nome: 'Divisão',             tema: 'Dividir ⏱',       icone: '➗', cor: '#2038A6', sombra: '#16296f', x: '26.5%', y: 1454 },
    { n: 8,  ecra: 'q3',  nome: 'Frações',             tema: 'Partes ⏱',        icone: '🍕', cor: '#6B8F3E', sombra: '#55722f', x: '74%',   y: 1654 },
    { n: 9,  ecra: 'q4',  nome: 'Decimais',            tema: 'Vírgulas ⏱',      icone: '🔢', cor: '#FA6415', sombra: '#b23c0a', x: '27%',   y: 1854 },
    { n: 10, ecra: 'q5',  nome: 'Dinheiro',            tema: 'Euros ⏱',         icone: '🪙', cor: '#2038A6', sombra: '#16296f', x: '50%',   y: 2054 },
    { n: 11, ecra: 'q6',  nome: 'Perímetro e Área',    tema: 'Medir ⏱',         icone: '📐', cor: '#6B8F3E', sombra: '#55722f', x: '74%',   y: 2254 },
    { n: 12, ecra: 'q7',  nome: 'Sequências',          tema: 'Padrões ⏱',       icone: '🏰', cor: '#FA6415', sombra: '#b23c0a', x: '26.5%', y: 2454 },
    { n: 13, ecra: 'q8',  nome: 'Ângulos',             tema: 'Voltas ⏱',        icone: '🧭', cor: '#2038A6', sombra: '#16296f', x: '74%',   y: 2654 },
    { n: 14, ecra: 'q9',  nome: 'Gráficos',            tema: 'Dados ⏱',         icone: '📊', cor: '#6B8F3E', sombra: '#55722f', x: '27%',   y: 2854 },
    { n: 15, ecra: 'q10', nome: 'Problemas',           tema: 'Pensar ⏱',        icone: '🧠', cor: '#FA6415', sombra: '#b23c0a', x: '50%',   y: 3054 }
  ]
};
