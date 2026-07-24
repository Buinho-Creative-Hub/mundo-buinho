/* Mundo Buinho — dados dos jogos
   Buinho FabLab, Messejana · CC-BY-SA 4.0

   ⚠️ TRANSCRITOS DO PROTÓTIPO SEM ALTERAÇÃO. Não inventar valores.

   ⚠️ GATE DE QUALIDADE PENDENTE (Magalhães, handoff 22 Jul):
   as doses do Jogo 1 (Água 120 / Agar 5 / Glicerina 15) têm de ser validadas
   contra strategy/biofabricacao-receitas.md ANTES de publicar.
   Regra selada: proporção sempre pela ÁGUA. Fonte canónica Ocloya/Materiom §6.
   Enquanto não houver validação, isto é protótipo — não material didáctico.

   ── JOGOS 6–10 (Matemática 4.º ano) ────────────────────────────────────────
   Ancorados nas Aprendizagens Essenciais de Matemática do 4.º ano (ver
   strategy/ubbu-ae-sobreposicao.md): Números e Operações (frações, decimais),
   Geometria e Medida (perímetro), Álgebra (sequências de crescimento —
   'Castelos na Areia' é tarefa oficial AE do 4.º) e Organização e Tratamento
   de Dados (gráficos). Visual "mundo Buinho" mas contextos variados do
   quotidiano (não só biofabricação) — decisão do Carlos, 24 Jul.
   TODA a matemática destes 5 jogos está verificada em código por
   testes/verificar-matematica.js. Os NÚMEROS não dependem da memória do modelo.
   🟡 Pendente Magalhães: validar o ENQUADRAMENTO pedagógico (progressão de
   dificuldade, redacção dos enunciados). A correcção matemática está garantida;
   a afinação didáctica é da área dele. */

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
  // Frações como parte de um todo: pintar `num` de `partes` fatias iguais.
  g6: [
    { rotulo: '1/2', enunciado: 'Pinta metade do chocolate.',       icone: '🍫', partes: 2, num: 1 },
    { rotulo: '3/4', enunciado: 'Pinta três quartos do bolo.',       icone: '🍰', partes: 4, num: 3 },
    { rotulo: '2/3', enunciado: 'Pinta dois terços da fita.',        icone: '🎀', partes: 3, num: 2 },
    { rotulo: '5/6', enunciado: 'Pinta cinco sextos da barra.',      icone: '🟩', partes: 6, num: 5 },
    { rotulo: '3/8', enunciado: 'Pinta três oitavos da melancia.',   icone: '🍉', partes: 8, num: 3 }
  ],

  // -------------------------------------------------------- Jogo 7 — A Feira
  // Dinheiro e decimais: escolher moedas (em cêntimos) que somam o preço.
  g7: [
    { produto: 'o pão',    icone: '🥖', alvo: 180, tabuleiro: [100, 50, 20, 10, 20] },
    { produto: 'a maçã',   icone: '🍎', alvo: 70,  tabuleiro: [50, 20, 10, 20, 5]  },
    { produto: 'o queijo', icone: '🧀', alvo: 250, tabuleiro: [200, 50, 20, 50, 10] },
    { produto: 'o sumo',   icone: '🧃', alvo: 125, tabuleiro: [100, 20, 5, 10, 50] },
    { produto: 'o mel',    icone: '🍯', alvo: 340, tabuleiro: [200, 100, 20, 20, 50] }
  ],

  // ------------------------------------------------- Jogo 8 — A Horta Cercada
  // Perímetro numa grelha: cada aresta exterior = 1 metro de cerca.
  // `perimetro` recomputado por 2 métodos em testes/verificar-matematica.js.
  g8: [
    { nome: 'o canteiro quadrado', cells: [[0,0],[1,0],[0,1],[1,1]],                                     perimetro: 8  },
    { nome: 'a fila de couves',    cells: [[0,0],[1,0],[2,0],[3,0]],                                     perimetro: 10 },
    { nome: 'a horta grande',      cells: [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]],       perimetro: 12 },
    { nome: 'o canteiro em L',     cells: [[0,0],[0,1],[0,2],[1,2],[2,2]],                               perimetro: 12 },
    { nome: 'a horta em cruz',     cells: [[1,0],[0,1],[1,1],[2,1],[1,2]],                               perimetro: 12 }
  ],

  // -------------------------------------------- Jogo 9 — Castelos na Areia
  // Sequências de crescimento (tarefa oficial AE 4.º): dá o próximo termo.
  g9: [
    { termos: [2, 4, 6, 8],    resposta: 10, opcoes: [10, 12, 9, 11],  pista: 'de 2 em 2' },
    { termos: [3, 6, 9, 12],   resposta: 15, opcoes: [14, 15, 17, 16], pista: 'de 3 em 3' },
    { termos: [5, 10, 15, 20], resposta: 25, opcoes: [26, 24, 25, 27], pista: 'de 5 em 5' },
    { termos: [1, 3, 5, 7],    resposta: 9,  opcoes: [10, 8, 11, 9],   pista: 'só os ímpares' },
    { termos: [1, 3, 6, 10],   resposta: 15, opcoes: [16, 15, 14, 17], pista: 'o salto cresce: +2, +3, +4...' }
  ],

  // --------------------------------------------- Jogo 10 — O Gráfico da Turma
  // Ler um gráfico de barras. `resposta` recomputada dos dados no teste.
  g10: [
    { titulo: 'Fruta preferida da turma', unidade: 'votos', icone: '🍓',
      dados: [['Maçã', 6], ['Banana', 9], ['Laranja', 4], ['Uva', 3]],
      pergunta: 'Qual foi a fruta mais votada?', resposta: 'Banana',
      opcoes: ['Maçã', 'Banana', 'Laranja', 'Uva'] },
    { titulo: 'Livros lidos por mês', unidade: 'livros', icone: '📚',
      dados: [['Jan', 5], ['Fev', 8], ['Mar', 6], ['Abr', 3]],
      pergunta: 'Quantos livros a mais em Fevereiro do que em Abril?', resposta: 5,
      opcoes: [6, 5, 7, 3] },
    { titulo: 'Golos por equipa', unidade: 'golos', icone: '⚽',
      dados: [['Azuis', 7], ['Verdes', 4], ['Vermelhos', 5]],
      pergunta: 'Quantos golos foram marcados ao todo?', resposta: 16,
      opcoes: [14, 17, 16, 18] },
    { titulo: 'Animais na quinta', unidade: 'animais', icone: '🐔',
      dados: [['Galinhas', 12], ['Ovelhas', 7], ['Vacas', 3], ['Cabras', 5]],
      pergunta: 'De que animal há menos na quinta?', resposta: 'Vacas',
      opcoes: ['Galinhas', 'Ovelhas', 'Vacas', 'Cabras'] },
    { titulo: 'Chuva na semana', unidade: 'mm', icone: '🌧️',
      dados: [['Seg', 2], ['Ter', 6], ['Qua', 0], ['Qui', 4]],
      pergunta: 'Quantos mm de chuva caíram na Terça?', resposta: 6,
      opcoes: [7, 8, 4, 6] }
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
