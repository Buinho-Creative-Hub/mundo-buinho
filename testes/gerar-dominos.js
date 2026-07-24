/* Mundo Buinho — GERADOR + VERIFICADOR do Motor Dominó
   Buinho FabLab, Messejana · CC-BY-SA 4.0

   Motor "Dominó" (handoff Magalhães 2026-07-24): um só motor de correspondência
   por EQUIVALÊNCIA, reaplicado a várias categorias. Instancia 2 jogos:
     q14 — Dominó de Frações   (½ ↔ metade pintada ↔ 2/4)
     q15 — Dominó Decimal      (0,5 ↔ ½ ↔ 50%)

   Cada peça pede: "que representação vale O MESMO?". Corre no motor de quiz
   existente (q*), por isso herda automaticamente os 3 níveis, o cronómetro
   (L1 25s · L2 18s · L3 10s) e a descida de nível ao errar — a decisão B do
   Carlos (manter cronómetro + despromoção) fica cumprida sem código novo de tempo.

   ⚠️ REGRA DE OURO: nenhum valor depende da memória do modelo. TODA a
   equivalência é recomputada aqui a partir de frações reduzidas. Se algo não
   bater certo, este script FALHA (exit 1) e não escreve o ficheiro.

   Uso:  node testes/gerar-dominos.js
   Saída: static/js/dados-dominos.js  (window.MB_JOGOS += [q14, q15]) */

'use strict';
const fs = require('fs');
const path = require('path');

// ----------------------------------------------------------- aritmética base
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
function reduzir(n, d) { const g = gcd(n, d); return { n: n / g, d: d / g }; }
function equivale(a, b) { const x = reduzir(a.n, a.d), y = reduzir(b.n, b.d); return x.n === y.n && x.d === y.d; }

// d só tem factores 2 e 5 -> tem representação decimal (e percentagem) exacta
function decimalExacto(n, d) { let x = reduzir(n, d).d; while (x % 2 === 0) x /= 2; while (x % 5 === 0) x /= 5; return x === 1; }
function percentExacto(n, d) { return (n * 100) % d === 0; }

// -------------------------------------------------------- representações (labels)
function labFracao(n, d) { const r = reduzir(n, d); return r.n + '/' + r.d; }         // sempre reduzida
function labFracaoCrua(n, d) { return n + '/' + d; }                                   // forma dada (ex.: 2/4)
function labDecimal(n, d) {
  if (!decimalExacto(n, d)) throw new Error('decimal nao exacto ' + n + '/' + d);
  let s = (n / d).toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
  return s.replace('.', ',');                                                          // 0.5 -> "0,5"
}
function labPercent(n, d) {
  if (!percentExacto(n, d)) throw new Error('percent nao exacto ' + n + '/' + d);
  return (n * 100 / d) + '%';
}

// forma "crua" bonita para o modelo pintado: multiplica para um denominador legível (<=12)
function formaModelo(n, d, rng) {
  const r = reduzir(n, d);
  const mults = [];
  for (let m = 1; r.d * m <= 12; m++) mults.push(m);
  const m = mults[(rng() * mults.length) | 0] || 1;
  return { num: r.n * m, den: r.d * m };
}

// ------------------------------------------------------------------ PRNG semeado
// mulberry32 — determinístico, para diffs limpos ao regenerar.
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function baralhar(arr, rng) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (rng() * (i + 1)) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; }
function escolher(arr, rng) { return arr[(rng() * arr.length) | 0]; }

// ----------------------------------------------------------- pools de valores
// Cada valor é [n,d]. O denominador é o do modelo pintado de origem.
const POOL = {
  faceis:  [[1, 2], [1, 4], [3, 4], [1, 3], [2, 3]],
  medios:  [[1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10]],
  dificeis:[[1, 4], [3, 4], [1, 2], [1, 5], [2, 5], [3, 10], [9, 10], [1, 10]]
};

// Constrói UMA peça (round). anchorTipo = como se mostra a ponta aberta.
// correctoTipo = em que forma vem a resposta certa (!= anchorTipo).
function fazerPeca(valor, anchorTipo, correctoTipo, poolDistr, rng) {
  const [n, d] = valor;
  const alvo = { n, d };

  // ---- ponta aberta (o "dom") ----
  let dom;
  if (anchorTipo === 'modelo') { const f = formaModelo(n, d, rng); dom = { tipo: 'modelo', num: f.num, den: f.den }; }
  else if (anchorTipo === 'fracao')  dom = { tipo: 'label', texto: labFracao(n, d), sub: 'fracao' };
  else if (anchorTipo === 'decimal') dom = { tipo: 'label', texto: labDecimal(n, d), sub: 'decimal' };
  else if (anchorTipo === 'percent') dom = { tipo: 'label', texto: labPercent(n, d), sub: 'percentagem' };

  // ---- opção correcta (na forma correctoTipo, valor equivalente ao alvo) ----
  let correcto;
  if (correctoTipo === 'fracao') {
    // metade das vezes forma reduzida, metade uma equivalente crua (ex.: 2/4) — ensina a equivalência
    if (rng() < 0.5) correcto = labFracao(n, d);
    else { const f = formaModelo(n, d, rng); correcto = labFracaoCrua(f.num, f.den); }
  } else if (correctoTipo === 'decimal') correcto = labDecimal(n, d);
  else if (correctoTipo === 'percent') correcto = labPercent(n, d);

  // ---- distractores: valores DIFERENTES, na mesma forma da correcta ----
  const distr = [];
  const usados = new Set([correcto]);
  const candidatos = baralhar(poolDistr.filter(v => !equivale({ n: v[0], d: v[1] }, alvo)), rng);
  for (const v of candidatos) {
    if (distr.length >= 3) break;
    const [vn, vd] = v;
    if (correctoTipo === 'decimal' && !decimalExacto(vn, vd)) continue;
    if (correctoTipo === 'percent' && !percentExacto(vn, vd)) continue;
    let lab;
    if (correctoTipo === 'fracao')  lab = labFracao(vn, vd);
    else if (correctoTipo === 'decimal') lab = labDecimal(vn, vd);
    else if (correctoTipo === 'percent') lab = labPercent(vn, vd);
    if (usados.has(lab)) continue;
    usados.add(lab); distr.push(lab);
  }
  if (distr.length < 3) return null;   // pool insuficiente para esta peça: descarta

  const opcoes = baralhar([correcto].concat(distr), rng);

  return {
    pergunta: 'Que peca vale o mesmo?',
    visual: 'domino',
    dom: dom,
    opcoes: opcoes,
    resposta: correcto,
    _alvo: alvo            // só para verificação; removido antes de escrever
  };
}

// Gera um jogo completo (3 níveis × 3 rounds) segundo um plano de tipos por nível.
function fazerJogo(id, nome, icone, plano, semente) {
  const rng = mulberry32(semente);
  const niveis = [];
  for (let L = 0; L < 3; L++) {
    const cfg = plano[L];
    const rounds = [];
    let tentativas = 0;
    const valores = baralhar(cfg.pool, rng);
    let vi = 0;
    while (rounds.length < 3 && tentativas < 400) {
      tentativas++;
      const valor = valores[vi % valores.length]; vi++;
      const anchorTipo = escolher(cfg.anchors, rng);
      const correctosPossiveis = cfg.correctos.filter(t => t !== anchorTipo);
      const correctoTipo = escolher(correctosPossiveis, rng);
      // guardas de exactidão
      if (correctoTipo === 'decimal' && !decimalExacto(valor[0], valor[1])) continue;
      if (correctoTipo === 'percent' && !percentExacto(valor[0], valor[1])) continue;
      if (anchorTipo === 'decimal' && !decimalExacto(valor[0], valor[1])) continue;
      if (anchorTipo === 'percent' && !percentExacto(valor[0], valor[1])) continue;
      const peca = fazerPeca(valor, anchorTipo, correctoTipo, cfg.pool, rng);
      if (peca) rounds.push(peca);
    }
    if (rounds.length < 3) throw new Error(id + ' nivel ' + (L + 1) + ': nao consegui 3 pecas validas');
    niveis.push(rounds);
  }
  return { id, nome, icone, niveis };
}

// --------------------------------------------------------------- planos dos jogos
const jogos = [
  fazerJogo('q14', 'Dominó de Frações', '🁫', [
    { pool: POOL.faceis,   anchors: ['modelo'],            correctos: ['fracao'] },
    { pool: POOL.faceis,   anchors: ['modelo', 'fracao'],   correctos: ['fracao', 'decimal'] },
    { pool: POOL.dificeis, anchors: ['modelo', 'fracao', 'percent'], correctos: ['fracao', 'decimal', 'percent'] }
  ], 0x0D014),
  fazerJogo('q15', 'Dominó Decimal', '🁣', [
    { pool: [[1, 2], [1, 4], [3, 4], [1, 10], [3, 10]],                          anchors: ['decimal'],            correctos: ['fracao'] },
    { pool: [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [1, 10], [3, 10]],  anchors: ['decimal', 'fracao'],  correctos: ['fracao', 'decimal'] },
    { pool: [[1, 4], [3, 4], [1, 2], [1, 5], [2, 5], [3, 10], [9, 10], [1, 10]], anchors: ['decimal', 'percent'], correctos: ['fracao', 'percent'] }
  ], 0x0D015)
];

// interpreta qualquer label ("3/4", "0,75", "75%") como fracção
function parseLabel(s) {
  s = String(s).trim();
  if (s.indexOf('/') >= 0) { const p = s.split('/').map(Number); return { n: p[0], d: p[1] }; }
  if (s.indexOf('%') >= 0) { const v = Number(s.replace('%', '')); return { n: v, d: 100 }; }
  if (s.indexOf(',') >= 0 || /^\d+(\.\d+)?$/.test(s)) {
    const v = s.replace(',', '.'); const casas = (v.split('.')[1] || '').length;
    const den = Math.pow(10, casas); return { n: Math.round(Number(v) * den), d: den };
  }
  throw new Error('label nao interpretavel: ' + s);
}

// ================================================================ VERIFICAÇÃO
let checks = 0, falhas = 0;
function assert(cond, msg) { checks++; if (!cond) { falhas++; console.log('  x ' + msg); } }

jogos.forEach(j => {
  assert(j.niveis.length === 3, j.id + ' tem 3 niveis');
  j.niveis.forEach((rounds, L) => {
    assert(rounds.length === 3, j.id + ' N' + (L + 1) + ' tem 3 rounds');
    rounds.forEach((r, ri) => {
      const tag = j.id + ' N' + (L + 1) + ' r' + (ri + 1);
      const equivalentes = r.opcoes.filter(op => equivale(parseLabel(op), r._alvo));
      assert(equivalentes.length === 1, tag + ': exactamente 1 opcao equivalente (tem ' + equivalentes.length + ')');
      assert(equivale(parseLabel(r.resposta), r._alvo), tag + ': a resposta bate com o alvo');
      if (r.dom.tipo === 'modelo') assert(equivale({ n: r.dom.num, d: r.dom.den }, r._alvo), tag + ': modelo pintado = alvo');
      if (r.dom.tipo === 'label')  assert(equivale(parseLabel(r.dom.texto), r._alvo), tag + ': ponta aberta = alvo');
      assert(r.opcoes.length === 4, tag + ': 4 opcoes');
      assert(new Set(r.opcoes).size === 4, tag + ': opcoes sem repeticoes');
    });
  });
});

if (falhas) { console.log('\nx ' + falhas + '/' + checks + ' verificacoes FALHARAM — ficheiro NAO escrito.'); process.exit(1); }

// ------------------------------------------------------------------ escrever
const limpo = jogos.map(j => ({ id: j.id, nome: j.nome, icone: j.icone,
  niveis: j.niveis.map(rs => rs.map(r => ({ pergunta: r.pergunta, visual: r.visual, dom: r.dom, opcoes: r.opcoes, resposta: r.resposta }))) }));

const cab = `/* Mundo Buinho — dados do Motor Domino (q14, q15)
   GERADO por testes/gerar-dominos.js — NAO editar a mao. Correr o gerador.
   Toda a equivalencia foi recomputada e verificada (${checks} verificacoes, 0 falhas).
   Anexa ao motor de quiz existente, por isso herda niveis + cronometro + descida. */
(function (w) {
  w.MB_JOGOS = (w.MB_JOGOS || []).concat(`;
const rodape = `);
})(window);
`;
const saida = cab + JSON.stringify(limpo, null, 2) + rodape;
const destino = path.join(__dirname, '..', 'static', 'js', 'dados-dominos.js');
fs.writeFileSync(destino, saida, 'utf8');
console.log('ok Motor Domino: ' + checks + ' verificacoes, 0 falhas. Escrito ' + destino);
console.log('   Jogos: ' + limpo.map(j => j.id + ' ' + j.nome).join(' - '));
