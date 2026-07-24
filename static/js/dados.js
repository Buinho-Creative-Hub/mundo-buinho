/* Mundo Buinho — dados dos jogos
   Buinho FabLab, Messejana · CC-BY-SA 4.0

   ⚠️ TRANSCRITOS DO PROTÓTIPO SEM ALTERAÇÃO. Não inventar valores.

   ⚠️ GATE DE QUALIDADE PENDENTE (Magalhães, handoff 22 Jul):
   as doses do Jogo 1 (Água 120 / Agar 5 / Glicerina 15) têm de ser validadas
   contra strategy/biofabricacao-receitas.md ANTES de publicar.
   Regra selada: proporção sempre pela ÁGUA. Fonte canónica Ocloya/Materiom §6.
   Enquanto não houver validação, isto é protótipo — não material didáctico.

   ── JOGOS 6–10 (Matemática 4.º ano — nível EXIGENTE) ────────────────────────
   Ancorados nas AE de Matemática do 4.º ano (strategy/ubbu-ae-sobreposicao.md)
   e no programa oficial (matematica.pt): exigem CONTA a sério, não reconhecimento.
   - 6 Fatias Certas: fração de uma QUANTIDADE (¾ de 12 = 9), apanhar do conjunto
   - 7 A Feira: TROCO com decimais (dois passos: paga−preço, compor o troco)
   - 8 A Horta Cercada: perímetro, ÁREA e INVERSO (área→lado) ⏱ cronómetro
   - 9 Castelos na Areia: sequências ×2 / quadrados / decrescente ⏱ cronómetro
   - 10 O Gráfico da Turma: pictograma com ESCALA, multipasso, fração do total ⏱
   Visual "mundo Buinho", contextos variados do quotidiano (não só biofabricação)
   — decisão do Carlos, 24 Jul. Dificuldade calibrada a pedido do Carlos ("fáceis
   demais para 9 anos") olhando o Hypatiamat + programa oficial.
   TODA a matemática verificada em testes/verificar-matematica.js. Os NÚMEROS não
   dependem da memória do modelo.
   🟡 Pendente Magalhães: validar o ENQUADRAMENTO pedagógico (progressão,
   redacção, tempos do cronómetro). A correcção matemática está garantida. */

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

  // =========================================================================
  // JOGOS DE MATEMÁTICA — 4.º ano (matemática verificada em código; ver topo)
  // =========================================================================

  // ------------------------------------------------- Jogo 6 — Fatias Certas
  // FRAÇÃO DE UMA QUANTIDADE: apanhar (num/den) de `total` objectos.
  // resposta = total/den*num (inteiro). Exige contas, não reconhecimento.
  g6: [
    { rotulo: '1/2', num: 1, den: 2, total: 8,  resposta: 4,  icone: '🍓', nome: 'morangos' },
    { rotulo: '3/4', num: 3, den: 4, total: 12, resposta: 9,  icone: '🍎', nome: 'maçãs' },
    { rotulo: '2/3', num: 2, den: 3, total: 15, resposta: 10, icone: '🥚', nome: 'ovos' },
    { rotulo: '4/5', num: 4, den: 5, total: 10, resposta: 8,  icone: '🌰', nome: 'castanhas' },
    { rotulo: '3/8', num: 3, den: 8, total: 16, resposta: 6,  icone: '🫐', nome: 'mirtilos' }
  ],

  // -------------------------------------------------------- Jogo 7 — A Feira
  // DAR O TROCO (dois passos): troco = paga - preço; compor o troco com moedas.
  g7: [
    { produto: 'o pão',    icone: '🥖', preco: 125, paga: 200, troco: 75,  tabuleiro: [50, 20, 5, 10, 20] },
    { produto: 'a maçã',   icone: '🍎', preco: 70,  paga: 100, troco: 30,  tabuleiro: [20, 10, 5, 20, 50] },
    { produto: 'o queijo', icone: '🧀', preco: 340, paga: 500, troco: 160, tabuleiro: [100, 50, 10, 20, 50] },
    { produto: 'o sumo',   icone: '🧃', preco: 250, paga: 300, troco: 50,  tabuleiro: [20, 20, 10, 50, 5] },
    { produto: 'o mel',    icone: '🍯', preco: 180, paga: 200, troco: 20,  tabuleiro: [10, 5, 20, 5, 10] }
  ],

  // ------------------------------------------------- Jogo 8 — A Horta Cercada
  // PERÍMETRO, ÁREA e INVERSO em retângulos com medidas (⏱ com cronómetro).
  // tipo: perimetro | area | inv-lado | inv-perim. resposta verificada no teste.
  g8: [
    { tipo: 'perimetro', comp: 7, larg: 4,           resposta: 22, opcoes: [21, 22, 24, 23], pergunta: 'Quantos metros de cerca?' },
    { tipo: 'area',      comp: 6, larg: 4,           resposta: 24, opcoes: [23, 24, 26, 25], pergunta: 'Quantos quadrados de terra (m²)?' },
    { tipo: 'area',      comp: 8, larg: 3,           resposta: 24, opcoes: [25, 23, 24, 26], pergunta: 'Quantos quadrados de terra (m²)?' },
    { tipo: 'inv-lado',  comp: 5, larg: 4, area: 20, resposta: 4,  opcoes: [5, 3, 4, 6],     pergunta: 'A horta tem 20 m² e 5 m de comprimento. Qual é a largura?' },
    { tipo: 'inv-perim', comp: 6, larg: 3, perim: 18, resposta: 3, opcoes: [4, 2, 3, 5],     pergunta: 'A cerca mede 18 m e o comprimento é 6 m. Qual é a largura?' }
  ],

  // -------------------------------------------- Jogo 9 — Castelos na Areia
  // SEQUÊNCIAS (⏱ com cronómetro): ×2, quadrados, decrescente, saltos que crescem.
  g9: [
    { termos: [2, 4, 8, 16],    resposta: 32, opcoes: [30, 32, 36, 34], pista: 'cada um é o dobro do anterior' },
    { termos: [1, 4, 9, 16],    resposta: 25, opcoes: [23, 25, 29, 27], pista: 'são os quadrados: 1×1, 2×2, 3×3...' },
    { termos: [50, 45, 40, 35], resposta: 30, opcoes: [32, 30, 34, 28], pista: 'desce de 5 em 5' },
    { termos: [1, 2, 4, 7, 11], resposta: 16, opcoes: [18, 16, 20, 14], pista: 'o salto cresce: +1, +2, +3, +4...' },
    { termos: [3, 6, 12, 24],   resposta: 48, opcoes: [46, 48, 52, 50], pista: 'cada um é o dobro do anterior' }
  ],

  // --------------------------------------------- Jogo 10 — O Gráfico da Turma
  // DADOS (⏱ com cronómetro): pictograma com escala, multipasso, fração do total.
  // resposta recomputada dos dados em testes/verificar-matematica.js.
  g10: [
    { titulo: 'Fruta preferida', modo: 'pictograma', escala: 2, unidade: 'votos', icone: '🍎',
      dados: [['Maçã', 3], ['Banana', 4], ['Pera', 2]],
      pergunta: 'Cada 🍎 vale 2 votos. Quantos votos teve a Banana?', resposta: 8,
      opcoes: [9, 8, 10, 7] },
    { titulo: 'Golos por equipa', modo: 'barras', unidade: 'golos', icone: '⚽',
      dados: [['Azuis', 7], ['Verdes', 4], ['Vermelhos', 5]],
      pergunta: 'Quantos golos a mais marcaram os Azuis do que os Verdes?', resposta: 3,
      opcoes: [4, 3, 5, 2] },
    { titulo: 'Livros lidos por mês', modo: 'barras', unidade: 'livros', icone: '📚',
      dados: [['Jan', 5], ['Fev', 8], ['Mar', 6], ['Abr', 3]],
      pergunta: 'Quantos livros foram lidos ao todo?', resposta: 22,
      opcoes: [23, 22, 24, 21] },
    { titulo: 'Animal preferido', modo: 'barras', unidade: 'votos', icone: '🐾',
      dados: [['Cão', 6], ['Gato', 3], ['Peixe', 3]],
      pergunta: 'Que fração da turma escolheu o Cão?', resposta: '1/2',
      opcoes: ['1/3', '1/2', '1/4', '2/3'] },
    { titulo: 'Flores no jardim', modo: 'barras', unidade: 'flores', icone: '🌷',
      dados: [['Rosa', 4], ['Tulipa', 9], ['Malmequer', 6]],
      pergunta: 'Quantas flores faltam à Rosa para igualar a Tulipa?', resposta: 5,
      opcoes: [6, 5, 7, 4] }
  ],

  // -------------------------------------------------- Mapa de níveis (home)
  // Posições em % / px, como no protótipo (mapa desenhado para ~820px).
  niveis: [
    { n: 1, ecra: 'g1', nome: 'A Receita Certa',    tema: 'Medir e pesar',      icone: '🥣', cor: '#2038A6', sombra: '#16296f', x: '25%',   y: 274 },
    { n: 2, ecra: 'g2', nome: 'Do Lixo ao Material', tema: 'Sequência',         icone: '♻️', cor: '#6B8F3E', sombra: '#55722f', x: '75%',   y: 474 },
    { n: 3, ecra: 'g3', nome: 'Conta a Colheita',    tema: 'Cálculo mental',    icone: '🍊', cor: '#FA6415', sombra: '#b23c0a', x: '26.5%', y: 694 },
    { n: 4, ecra: 'g4', nome: 'Circular ou Linear?', tema: 'Raciocínio',        icone: '🌍', cor: '#2038A6', sombra: '#16296f', x: '74%',   y: 874 },
    { n: 5, ecra: 'g5', nome: 'Desenha a tua Folha', tema: 'Criatividade',      icone: '🎨', cor: '#6B8F3E', sombra: '#55722f', x: '50%',   y: 1054 },
    { n: 6, ecra: 'g6',  nome: 'Fatias Certas',      tema: 'Frações',            icone: '🍫', cor: '#FA6415', sombra: '#b23c0a', x: '74%',   y: 1254 },
    { n: 7, ecra: 'g7',  nome: 'A Feira',            tema: 'Dinheiro e decimais', icone: '🪙', cor: '#2038A6', sombra: '#16296f', x: '26.5%', y: 1454 },
    { n: 8, ecra: 'g8',  nome: 'A Horta Cercada',    tema: 'Perímetro',          icone: '📏', cor: '#6B8F3E', sombra: '#55722f', x: '74%',   y: 1654 },
    { n: 9, ecra: 'g9',  nome: 'Castelos na Areia',  tema: 'Sequências',         icone: '🏰', cor: '#FA6415', sombra: '#b23c0a', x: '27%',   y: 1854 },
    { n: 10, ecra: 'g10', nome: 'O Gráfico da Turma', tema: 'Gráficos',          icone: '📊', cor: '#2038A6', sombra: '#16296f', x: '50%',   y: 2054 }
  ]
};
