/* Mundo Buinho — GERADOR + VERIFICADOR dos motores novos (handoff Magalhães 2026-07-24)
   Buinho FabLab, Messejana · CC-BY-SA 4.0

   Três motores, sete jogos dos 22 pedidos:

     RETA NUMÉRICA (arrastar para o sítio certo)
       r1 — Coloca a Fração            (#2  Frações)
       r2 — Coloca o Decimal           (#6  Decimais)
       r3 — Perto ou Longe?            (#20 Estimativa/arredondamento)

     CRIVO (grelha do 100, tocar todos os que servem)
       c1 — Caça aos Múltiplos         (#13 Múltiplos)
       c2 — O Crivo (primos)           (#14 Eratóstenes)

     FUSÃO PARA ALVO (juntar parcelas até dar o alvo)
       f1 — Chega ao 24                (#10 4 operações)
       f2 — Faz 100                    (#11 cálculo mental)

   ⚠️ GATE PEDAGÓGICO (handoff das mecânicas + maker-neurodiversidade v3)
   Estes motores são TÁCTEIS: o tempo não é a mecânica e não se força.
     - SEM cronómetro e SEM despromoção ao errar;
     - errar dá DICA e repete — é o "nunca errado" virado mecânica;
     - a dificuldade vem da matemática e da variedade, não do relógio.
   O modo desafio com cronómetro fica para quem o quiser, e é opcional por jogo
   (campo `desafio: true`), hoje desligado em todos.

   ⚠️ REGRA DE OURO da casa: nada depende da memória do modelo. Todos os valores
   são recomputados aqui — posições na reta, múltiplos, primos, somas do alvo.
   Uma verificação que falhe => exit 1 e não se gera ficheiro.

   Uso:  node testes/gerar-motores.js  ->  static/js/dados-motores.js
*/
'use strict';
const fs = require('fs');
const path = require('path');

let VERIF = 0, FALHAS = [];
function verificar(nome, cond, det) {
  VERIF++;
  if (!cond) FALHAS.push(nome + (det ? ' — ' + det : ''));
}

const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; };
const reduzir = (n, d) => { const g = gcd(n, d); return [n / g, d / g]; };
const arred = (x, c) => Math.round(x * c) / c;

// --------------------------------------------------------------- RETA NUMÉRICA
// Cada round: uma reta de `min` a `max`, marcas a cada `passo`, e um valor a
// colocar. `tolerancia` é a margem em unidades da reta — o dedo de uma criança
// de 9 anos num tablet não acerta no pixel, e exigir isso é castigar a motricidade,
// não avaliar a matemática.
function retaFracoes() {
  const niveis = [
    // n1: meios e quartos entre 0 e 1
    [[1, 2], [1, 4], [3, 4]],
    // n2: terços, quintos e oitavos
    [[1, 3], [2, 3], [3, 8], [5, 8]],
    // n3: frações impróprias entre 0 e 2
    [[3, 2], [5, 4], [7, 4], [4, 3]]
  ];
  return niveis.map((lista, ni) => lista.map(([n, d]) => {
    const valor = n / d;
    const max = ni === 2 ? 2 : 1;
    verificar(`r1 n${ni} ${n}/${d} dentro da reta`, valor > 0 && valor <= max, String(valor));
    const [rn, rd] = reduzir(n, d);
    return {
      pergunta: `Onde fica ${n}/${d}?`,
      etiqueta: `${n}/${d}`,
      min: 0, max: max, passo: max === 1 ? 1 / d : 0.5,
      valor: valor,
      tolerancia: max / 24,
      dica: rn === n && rd === d
        ? `${n}/${d} quer dizer: parte a reta em ${d} pedaços iguais e conta ${n}.`
        : `${n}/${d} é o mesmo que ${rn}/${rd}.`
    };
  }));
}

function retaDecimais() {
  const niveis = [
    [[2.5, 0, 5], [1.5, 0, 5], [3.5, 0, 5]],
    [[2.4, 0, 5], [0.7, 0, 5], [4.2, 0, 5], [1.8, 0, 5]],
    [[2.35, 2, 3], [0.85, 0, 1], [1.15, 1, 2], [3.6, 3, 4]]
  ];
  return niveis.map((lista, ni) => lista.map(([v, min, max]) => {
    verificar(`r2 n${ni} ${v} dentro da reta`, v >= min && v <= max, `${v} ∉ [${min},${max}]`);
    const amplitude = max - min;
    return {
      pergunta: `Onde fica ${String(v).replace('.', ',')}?`,
      etiqueta: String(v).replace('.', ','),
      min, max, passo: amplitude <= 1 ? 0.1 : (amplitude <= 3 ? 0.5 : 1),
      valor: v,
      tolerancia: amplitude / 24,
      dica: amplitude <= 1
        ? `Cada marca pequena vale um décimo (0,1).`
        : `Procura primeiro o número inteiro e só depois a parte decimal.`
    };
  }));
}

function retaArredondar() {
  // #20 "Perto ou Longe?" — arrasta o número para a dezena/centena mais próxima.
  const casos = [
    [[47, 10], [83, 10], [25, 10]],
    [[126, 100], [178, 100], [349, 100], [251, 100]],
    [[1480, 1000], [2620, 1000], [3510, 1000], [849, 100]]
  ];
  return casos.map((lista, ni) => lista.map(([n, unidade]) => {
    const alvo = Math.round(n / unidade) * unidade;     // recomputado, não escrito à mão
    const min = Math.floor(n / unidade) * unidade - (ni === 0 ? 0 : 0);
    const max = min + unidade;
    verificar(`r3 n${ni} arredondar ${n}`, alvo === min || alvo === max,
      `${n}→${alvo} fora de [${min},${max}]`);
    const meio = (min + max) / 2;
    return {
      pergunta: `${n} está mais perto de quem? Arrasta ${n} para o seu lugar.`,
      etiqueta: String(n),
      min, max, passo: unidade / 10,
      valor: n,
      tolerancia: unidade / 12,
      alvoArredondado: alvo,
      dica: n === meio
        ? `Está mesmo no meio — nesse caso arredonda-se para cima.`
        : `Passa do meio (${meio})? Se sim, vai para ${max}. Se não, fica em ${min}.`
    };
  }));
}

// ---------------------------------------------------------------------- CRIVO
// Grelha do 100. O jogo pede um conjunto; a criança toca. Tocar num que não
// serve não tira pontos nem despromove: acende a vermelho, dá dica, e continua.
function ehPrimo(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

function crivoMultiplos() {
  const niveis = [
    { de: 1, ate: 30, base: 2 },
    { de: 1, ate: 50, base: 4 },
    { de: 1, ate: 100, base: 7 }
  ];
  return niveis.map((n, ni) => {
    const certos = [];
    for (let i = n.de; i <= n.ate; i++) if (i % n.base === 0) certos.push(i);
    verificar(`c1 n${ni} múltiplos de ${n.base}`, certos.length > 0 && certos.every(x => x % n.base === 0));
    verificar(`c1 n${ni} nenhum a mais`, certos.length === Math.floor(n.ate / n.base));
    // um nível de crivo é UMA grelha — mas fica dentro de um array, para todos
    // os motores terem a mesma forma (nível = lista de rounds).
    return [{
      pergunta: `Toca em TODOS os múltiplos de ${n.base} até ${n.ate}.`,
      de: n.de, ate: n.ate, certos,
      dica: `Um múltiplo de ${n.base} é o que se obtém contando de ${n.base} em ${n.base}: ` +
            certos.slice(0, 4).join(', ') + '…'
    }];
  });
}

function crivoPrimos() {
  const niveis = [
    { de: 2, ate: 30 }, { de: 2, ate: 50 }, { de: 2, ate: 100 }
  ];
  return niveis.map((n, ni) => {
    const certos = [];
    for (let i = n.de; i <= n.ate; i++) if (ehPrimo(i)) certos.push(i);
    verificar(`c2 n${ni} primos até ${n.ate}`, certos[0] === 2 && certos.indexOf(9) === -1);
    verificar(`c2 n${ni} nenhum composto`, certos.every(ehPrimo));
    return [{
      pergunta: `Toca em todos os números PRIMOS até ${n.ate}.`,
      de: n.de, ate: n.ate, certos,
      dica: `Um primo só se pode dividir por 1 e por ele próprio. O 1 não conta. ` +
            `Começa por riscar os pares depois do 2.`
    }];
  });
}

// -------------------------------------------------------------- FUSÃO P/ ALVO
// Junta parcelas até chegar exactamente ao alvo. Verifica-se que existe pelo
// menos uma solução — um jogo impossível é o pior tipo de bug num jogo de escola.
function existeSoma(nums, alvo) {
  // subconjuntos (nums pequenos, força bruta chega e é auditável)
  const n = nums.length;
  for (let m = 1; m < (1 << n); m++) {
    let s = 0;
    for (let i = 0; i < n; i++) if (m & (1 << i)) s += nums[i];
    if (s === alvo) return true;
  }
  return false;
}

function fusaoAlvo(alvo, niveisNums, nome) {
  return niveisNums.map((rounds, ni) => rounds.map(nums => {
    verificar(`${nome} n${ni} [${nums}] chega a ${alvo}`, existeSoma(nums, alvo),
      `sem solução para ${alvo}`);
    return {
      pergunta: `Junta parcelas até dar exactamente ${alvo}.`,
      alvo, numeros: nums,
      dica: `Procura primeiro dois números que juntos fiquem perto de ${alvo}.`
    };
  }));
}

// ------------------------------------------------------------------ montagem
const JOGOS = [
  { id: 'r1', nome: 'Coloca a Fração', icone: '🍕', motor: 'reta',
    cat: 'fracoes', sub: 'arrasta para o sítio certo', niveis: retaFracoes() },
  { id: 'r2', nome: 'Coloca o Decimal', icone: '🔢', motor: 'reta',
    cat: 'decimais', sub: 'a vírgula na reta', niveis: retaDecimais() },
  { id: 'r3', nome: 'Perto ou Longe?', icone: '📏', motor: 'reta',
    cat: 'sequencias', sub: 'arredondar à dezena/centena', niveis: retaArredondar() },
  { id: 'c1', nome: 'Caça aos Múltiplos', icone: '🎯', motor: 'crivo',
    cat: 'mult', sub: 'todos os múltiplos na grelha', niveis: crivoMultiplos() },
  { id: 'c2', nome: 'O Crivo', icone: '🔎', motor: 'crivo',
    cat: 'logica', sub: 'os primos até 100', niveis: crivoPrimos() },
  { id: 'f1', nome: 'Chega ao 24', icone: '🎲', motor: 'fusao',
    cat: 'problemas', sub: 'combina até dar 24',
    niveis: fusaoAlvo(24, [
      [[10, 8, 6, 3], [12, 7, 5, 4], [20, 4, 9, 2]],
      [[7, 9, 8, 5, 3], [11, 6, 7, 4, 2], [13, 5, 6, 9, 3]],
      [[15, 6, 3, 9, 8, 2], [17, 4, 3, 11, 5, 6], [19, 5, 7, 2, 13, 3]]
    ], 'f1') },
  { id: 'f2', nome: 'Faz 100', icone: '💯', motor: 'fusao',
    cat: 'problemas', sub: 'parcelas até 100 exacto',
    niveis: fusaoAlvo(100, [
      [[50, 30, 20, 15], [40, 35, 25, 10], [60, 25, 15, 5]],
      [[45, 30, 25, 12, 8], [55, 20, 15, 10, 30], [35, 28, 22, 15, 25]],
      [[47, 33, 20, 18, 12, 9], [51, 29, 20, 13, 7, 6], [38, 27, 35, 14, 11, 5]]
    ], 'f2') }
];

// invariantes de estrutura — apanham um jogo mal montado antes de chegar ao tablet
JOGOS.forEach(j => {
  verificar(`${j.id} tem 3 níveis`, j.niveis.length === 3, String(j.niveis.length));
  j.niveis.forEach((n, i) => {
    // o crivo tem uma grelha por nível; os outros têm 3+ rounds
    const minimo = j.motor === 'crivo' ? 1 : 3;
    verificar(`${j.id} n${i} tem rounds que cheguem`, n.length >= minimo, String(n.length));
    n.forEach((r, k) => {
      verificar(`${j.id} n${i}r${k} tem pergunta`, !!r.pergunta);
      verificar(`${j.id} n${i}r${k} tem dica`, !!r.dica);   // o gate: errar dá DICA
    });
  });
});

if (FALHAS.length) {
  console.error(`\n❌ ${FALHAS.length} verificações falharam de ${VERIF}:`);
  FALHAS.forEach(f => console.error('   ' + f));
  process.exit(1);
}

const destino = path.join(__dirname, '..', 'static', 'js', 'dados-motores.js');
const cab = `/* Mundo Buinho — dados dos motores Reta numérica, Crivo e Fusão para alvo
   GERADO por testes/gerar-motores.js — NÃO editar à mão. Correr o gerador.
   ${VERIF} verificações, 0 falhas. Posições, múltiplos, primos e somas recomputados.
   SEM cronómetro e SEM despromoção: motores tácteis, o tempo não é a mecânica
   (gate pedagógico do handoff das mecânicas + maker-neurodiversidade v3). */\n`;
fs.writeFileSync(destino,
  cab + 'window.MB_MOTORES_JOGOS = ' + JSON.stringify(JOGOS, null, 2) + ';\n', 'utf8');

console.log(`✅ ${VERIF} verificações, 0 falhas`);
console.log(`   ${JOGOS.length} jogos · ${JOGOS.map(j => j.id).join(', ')}`);
console.log(`   → ${path.relative(process.cwd(), destino)}`);
