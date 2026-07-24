/* Mundo Buinho — GERADOR + VERIFICADOR do Motor Memória de Pares
   Buinho FabLab, Messejana · CC-BY-SA 4.0

   Motor "Memória de pares" (handoff Magalhães 2026-07-24): um só motor, 3 jogos:
     m1 — Memória da Tabuada   (Multiplicação:  7×8 ↔ 56)
     m2 — Memória da Divisão   (Divisão:        56÷8 ↔ 7)
     m3 — Memória das Frações  (Frações:        1/2 ↔ 2/4 / 0,5)

   Vira duas cartas; se valem o mesmo, ficam. 3 níveis (tabuleiros 4→5→6 pares).
   Cronómetro por nível + descida ao esgotar o tempo = decisão B do Carlos
   (aplicada ao género: num jogo de memória despromover a CADA falha tornava-o
   injogável — as falhas são como se aprende o tabuleiro; por isso a despromoção
   dá-se ao ESGOTAR o tempo, que é a mecânica de B que faz sentido aqui).

   ⚠️ REGRA DE OURO: nada depende da memória do modelo. Todos os pares são
   recomputados aqui (produtos, quocientes, equivalência de frações). Falha => exit 1.

   Uso:  node testes/gerar-memoria.js  ->  static/js/dados-memoria.js  (window.MB_MEMORIA) */

'use strict';
const fs = require('fs');
const path = require('path');

function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
function reduzir(n, d) { const g = gcd(n, d); return { n: n / g, d: d / g }; }
function eqFrac(a, b) { const x = reduzir(a.n, a.d), y = reduzir(b.n, b.d); return x.n === y.n && x.d === y.d; }
function decimalExacto(n, d) { let x = reduzir(n, d).d; while (x % 2 === 0) x /= 2; while (x % 5 === 0) x /= 5; return x === 1; }
function labDecimal(n, d) { return (n / d).toFixed(4).replace(/0+$/, '').replace(/\.$/, '').replace('.', ','); }

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function baralhar(arr, rng) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (rng() * (i + 1)) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; }

// Constrói um nível: N pares distintos, sem valores de carta repetidos (senão o par é ambíguo).
// candidatos = lista de {a, b} já verificados. Devolve N pares com faces todas distintas.
function montarNivel(candidatos, N, rng) {
  const baralhados = baralhar(candidatos, rng);
  const escolhidos = [];
  const faces = new Set();
  for (const p of baralhados) {
    if (escolhidos.length >= N) break;
    if (faces.has(p.a) || faces.has(p.b) || p.a === p.b) continue;
    escolhidos.push(p); faces.add(p.a); faces.add(p.b);
  }
  if (escolhidos.length < N) throw new Error('candidatos insuficientes para nível de ' + N + ' pares');
  return escolhidos;
}

// ---------------------------------------------------------- candidatos por jogo
function tabuada(tabelas) {
  const out = [];
  tabelas.forEach(a => { for (let b = 2; b <= 10; b++) out.push({ a: a + '×' + b, b: String(a * b), _v: a * b }); });
  return out;
}
function divisao(tabelas) {
  const out = [];
  tabelas.forEach(a => { for (let b = 2; b <= 10; b++) out.push({ a: (a * b) + '÷' + a, b: String(b), _v: b }); });
  return out;
}
// frações: par = fração reduzida ↔ representação equivalente (fração crua ou decimal)
function fracoes(valores, comDecimal) {
  const out = [];
  valores.forEach(([n, d]) => {
    const red = reduzir(n, d);
    // forma crua equivalente (ex.: 1/2 -> 2/4)
    for (let m = 2; red.d * m <= 12; m++) out.push({ a: red.n + '/' + red.d, b: (red.n * m) + '/' + (red.d * m) });
    if (comDecimal && decimalExacto(n, d)) out.push({ a: red.n + '/' + red.d, b: labDecimal(n, d) });
  });
  return out;
}

// ------------------------------------------------------------ montar os 3 jogos
function fazerJogo(id, nome, icone, poolsPorNivel, semente) {
  const rng = mulberry32(semente);
  const tamanhos = [4, 5, 6];
  const niveis = poolsPorNivel.map((pool, L) => montarNivel(pool, tamanhos[L], rng));
  return { id, nome, icone, niveis };
}

const jogos = [
  fazerJogo('m1', 'Memória da Tabuada', '✖️', [
    tabuada([2, 3, 4, 5]), tabuada([2, 3, 4, 5, 6, 7]), tabuada([6, 7, 8, 9])
  ], 0x0E001),
  fazerJogo('m2', 'Memória da Divisão', '➗', [
    divisao([2, 3, 4, 5]), divisao([2, 3, 4, 5, 6, 7]), divisao([6, 7, 8, 9])
  ], 0x0E002),
  fazerJogo('m3', 'Memória das Frações', '🍕', [
    fracoes([[1, 2], [1, 4], [3, 4], [1, 3], [2, 3]], false),
    fracoes([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5]], true),
    fracoes([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 10], [7, 10]], true)
  ], 0x0E003)
];

// ===================================================================== VERIFICAÇÃO
function parseVal(s) {
  s = String(s).trim();
  if (s.indexOf('×') >= 0) { const p = s.split('×').map(Number); return p[0] * p[1]; }
  if (s.indexOf('÷') >= 0) { const p = s.split('÷').map(Number); return p[0] / p[1]; }
  if (s.indexOf('/') >= 0) { const p = s.split('/').map(Number); return p[0] / p[1]; }
  if (s.indexOf('%') >= 0) return Number(s.replace('%', '')) / 100;
  return Number(s.replace(',', '.'));
}
let checks = 0, falhas = 0;
function assert(c, m) { checks++; if (!c) { falhas++; console.log('  x ' + m); } }

jogos.forEach(j => {
  assert(j.niveis.length === 3, j.id + ' tem 3 níveis');
  j.niveis.forEach((pares, L) => {
    const alvo = [4, 5, 6][L];
    assert(pares.length === alvo, j.id + ' N' + (L + 1) + ' tem ' + alvo + ' pares');
    const faces = [];
    pares.forEach((p, i) => {
      const tag = j.id + ' N' + (L + 1) + ' par' + (i + 1) + ' (' + p.a + '|' + p.b + ')';
      assert(Math.abs(parseVal(p.a) - parseVal(p.b)) < 1e-9, tag + ': as duas cartas valem o mesmo');
      faces.push(p.a, p.b);
    });
    assert(new Set(faces).size === faces.length, j.id + ' N' + (L + 1) + ': todas as cartas têm faces distintas (sem par ambíguo)');
  });
});

if (falhas) { console.log('\nx ' + falhas + '/' + checks + ' verificações FALHARAM — ficheiro NÃO escrito.'); process.exit(1); }

// ------------------------------------------------------------------ escrever
const limpo = jogos.map(j => ({ id: j.id, nome: j.nome, icone: j.icone,
  niveis: j.niveis.map(ps => ps.map(p => ({ a: p.a, b: p.b }))) }));
const cab = `/* Mundo Buinho — dados do Motor Memória de Pares (m1, m2, m3)
   GERADO por testes/gerar-memoria.js — NÃO editar à mão. Correr o gerador.
   Pares todos recomputados e verificados (${checks} verificações, 0 falhas). */
window.MB_MEMORIA = `;
const saida = cab + JSON.stringify(limpo, null, 2) + ';\n';
const destino = path.join(__dirname, '..', 'static', 'js', 'dados-memoria.js');
fs.writeFileSync(destino, saida, 'utf8');
console.log('ok Motor Memória: ' + checks + ' verificações, 0 falhas. Escrito ' + destino);
console.log('   Jogos: ' + limpo.map(j => j.id + ' ' + j.nome).join(' · '));
