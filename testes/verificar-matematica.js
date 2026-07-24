/* Verificação da matemática dos jogos 6–10 (AE Matemática 4.º ano).
   Regra de ouro do Albano: números NUNCA dependem da memória do modelo — a
   plataforma/código VERIFICA. Este script recomputa todas as respostas a partir
   dos dados crus e falha ruidosamente se algo não bater certo.
   Correr:  node testes/verificar-matematica.js  */
'use strict';

let falhas = 0;
const ok  = (c, m) => { if (!c) { falhas++; console.error('  ✗ ' + m); } };
const sec = m => console.log('\n— ' + m);

// ---------- utilidades geométricas (perímetro a partir das células) ----------
function perimetro(cells) {
  const set = new Set(cells.map(c => c[0] + ',' + c[1]));
  // conta as arestas unitárias exteriores (vizinho ausente)
  let p = 0;
  for (const [c, r] of cells) {
    if (!set.has((c - 1) + ',' + r)) p++; // esquerda
    if (!set.has((c + 1) + ',' + r)) p++; // direita
    if (!set.has(c + ',' + (r - 1))) p++; // cima
    if (!set.has(c + ',' + (r + 1))) p++; // baixo
  }
  return p;
}
// método alternativo independente: 4n - 2*adjacências (tem de dar o mesmo)
function perimetroAlt(cells) {
  const set = new Set(cells.map(c => c[0] + ',' + c[1]));
  let adj = 0;
  for (const [c, r] of cells) {
    if (set.has((c + 1) + ',' + r)) adj++;
    if (set.has(c + ',' + (r + 1))) adj++;
  }
  return 4 * cells.length - 2 * adj;
}

// ======================================================================
// JOGO 6 — Fatias Certas (frações: parte de um todo)
// Pinta `num` de `partes` fatias iguais.
// ======================================================================
const g6 = [
  { contexto: 'Pinta metade do chocolate.',        icone: '🍫', partes: 2, num: 1 },
  { contexto: 'Pinta 3 quartos do bolo.',          icone: '🍰', partes: 4, num: 3 },
  { contexto: 'Pinta 2 terços da fita.',           icone: '🎀', partes: 3, num: 2 },
  { contexto: 'Pinta 5 sextos da barra.',          icone: '🟩', partes: 6, num: 5 },
  { contexto: 'Pinta 3 oitavos da melancia.',      icone: '🍉', partes: 8, num: 3 }
];
sec('Jogo 6 — Fatias Certas (frações)');
g6.forEach((r, i) => {
  ok(Number.isInteger(r.partes) && r.partes >= 2 && r.partes <= 10, `g6[${i}] partes válidas`);
  ok(Number.isInteger(r.num) && r.num >= 1 && r.num < r.partes, `g6[${i}] num entre 1 e partes-1 (${r.num}/${r.partes})`);
});

// ======================================================================
// JOGO 7 — A Feira (dinheiro / decimais). Escolhe um subconjunto de moedas
// (em cêntimos) que soma exactamente ao preço. Verifica que existe solução.
// ======================================================================
const g7 = [
  { produto: 'pão',    icone: '🥖', alvo: 180, tabuleiro: [100, 50, 20, 10, 20] },
  { produto: 'maçã',   icone: '🍎', alvo: 70,  tabuleiro: [50, 20, 10, 20, 5]  },
  { produto: 'queijo', icone: '🧀', alvo: 250, tabuleiro: [200, 50, 20, 50, 10] },
  { produto: 'sumo',   icone: '🧃', alvo: 125, tabuleiro: [100, 20, 5, 10, 50] },
  { produto: 'mel',    icone: '🍯', alvo: 340, tabuleiro: [200, 100, 20, 20, 50] }
];
const MOEDAS_LEGAIS = new Set([200, 100, 50, 20, 10, 5, 2, 1]);
function existeSubconjunto(vals, alvo) {
  // subset-sum exato (tabuleiros pequenos, força bruta 2^n)
  const n = vals.length;
  for (let m = 1; m < (1 << n); m++) {
    let s = 0;
    for (let b = 0; b < n; b++) if (m & (1 << b)) s += vals[b];
    if (s === alvo) return true;
  }
  return false;
}
sec('Jogo 7 — A Feira (dinheiro/decimais)');
g7.forEach((r, i) => {
  ok(r.tabuleiro.every(v => MOEDAS_LEGAIS.has(v)), `g7[${i}] só moedas de euro reais`);
  ok(existeSubconjunto(r.tabuleiro, r.alvo), `g7[${i}] existe combinação que paga ${(r.alvo/100).toFixed(2)}€`);
  ok(r.tabuleiro.reduce((a, b) => a + b, 0) >= r.alvo, `g7[${i}] tabuleiro chega ao preço`);
});

// ======================================================================
// JOGO 8 — A Horta Cercada (perímetro em grelha; cada aresta = 1 metro)
// ======================================================================
const g8 = [
  { nome: 'canteiro quadrado', cells: [[0,0],[1,0],[0,1],[1,1]] },                 // 2x2
  { nome: 'fila de couves',    cells: [[0,0],[1,0],[2,0],[3,0]] },                 // 4x1
  { nome: 'horta grande',      cells: [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]] }, // 3x3
  { nome: 'canteiro em L',     cells: [[0,0],[0,1],[0,2],[1,2],[2,2]] },           // L
  { nome: 'horta em cruz',     cells: [[1,0],[0,1],[1,1],[2,1],[1,2]] }            // +
];
sec('Jogo 8 — A Horta Cercada (perímetro)');
const g8final = g8.map((s, i) => {
  const p = perimetro(s.cells);
  const pa = perimetroAlt(s.cells);
  ok(p === pa, `g8[${i}] dois métodos de perímetro concordam (${p} vs ${pa})`);
  ok(p > 0 && p % 1 === 0, `g8[${i}] perímetro inteiro positivo`);
  console.log(`    ${s.nome}: perímetro = ${p} m`);
  return { ...s, perimetro: p };
});

// ======================================================================
// JOGO 9 — Castelos na Areia (sequências de crescimento; próximo termo)
// ======================================================================
const g9 = [
  { termos: [2, 4, 6, 8],    regra: '+2' },
  { termos: [3, 6, 9, 12],   regra: '+3' },
  { termos: [5, 10, 15, 20], regra: '+5' },
  { termos: [1, 3, 5, 7],    regra: '+2 (ímpares)' },
  { termos: [1, 3, 6, 10],   regra: 'triangular (+2,+3,+4,+5)' }
];
sec('Jogo 9 — Castelos na Areia (sequências)');
const g9final = g9.map((r, i) => {
  const t = r.termos;
  let proximo;
  if (r.regra.startsWith('triangular')) {
    // diferenças crescem de 1: próxima diferença = (última diferença)+1
    const d = t[t.length - 1] - t[t.length - 2];
    proximo = t[t.length - 1] + (d + 1);
  } else {
    const passo = t[1] - t[0];
    // confirma progressão aritmética
    for (let k = 1; k < t.length; k++) ok(t[k] - t[k-1] === passo, `g9[${i}] passo constante ${passo}`);
    proximo = t[t.length - 1] + passo;
  }
  ok(Number.isInteger(proximo) && proximo > 0, `g9[${i}] próximo inteiro`);
  // opções: correcto + 3 distratores plausíveis, únicos
  const set = new Set([proximo, proximo + 1, proximo - 1, proximo + 2]);
  const opcoes = [...set].slice(0, 4);
  ok(opcoes.includes(proximo), `g9[${i}] opções contêm a resposta`);
  console.log(`    ${t.join(', ')}, ? → ${proximo}  (${r.regra})`);
  return { termos: t, resposta: proximo, opcoes };
});

// ======================================================================
// JOGO 10 — O Gráfico da Turma (ler gráfico de barras)
// Cada ronda tem dados + pergunta; a resposta é RECOMPUTADA dos dados.
// tipo: 'maior' | 'menor' | 'total' | 'diferenca' | 'valor'
// ======================================================================
const g10 = [
  { titulo: 'Fruta preferida da turma', unidade: 'votos', icone: '🍓',
    dados: [['Maçã',6],['Banana',9],['Laranja',4],['Uva',3]],
    tipo: 'maior', pergunta: 'Qual foi a fruta mais votada?' },
  { titulo: 'Livros lidos por mês', unidade: 'livros', icone: '📚',
    dados: [['Jan',5],['Fev',8],['Mar',6],['Abr',3]],
    tipo: 'diferenca', a: 'Fev', b: 'Abr', pergunta: 'Quantos livros a mais em Fevereiro do que em Abril?' },
  { titulo: 'Golos por equipa', unidade: 'golos', icone: '⚽',
    dados: [['Azuis',7],['Verdes',4],['Vermelhos',5]],
    tipo: 'total', pergunta: 'Quantos golos foram marcados ao todo?' },
  { titulo: 'Animais na quinta', unidade: 'animais', icone: '🐔',
    dados: [['Galinhas',12],['Ovelhas',7],['Vacas',3],['Cabras',5]],
    tipo: 'menor', pergunta: 'De que animal há menos na quinta?' },
  { titulo: 'Chuva na semana', unidade: 'mm', icone: '🌧️',
    dados: [['Seg',2],['Ter',6],['Qua',0],['Qui',4]],
    tipo: 'valor', a: 'Ter', pergunta: 'Quantos mm de chuva caíram na Terça?' }
];
sec('Jogo 10 — O Gráfico da Turma (gráficos)');
function resolverGrafico(r) {
  const d = r.dados;
  const val = nome => d.find(x => x[0] === nome)[1];
  switch (r.tipo) {
    case 'maior':     return d.reduce((m, x) => x[1] > m[1] ? x : m)[0];
    case 'menor':     return d.reduce((m, x) => x[1] < m[1] ? x : m)[0];
    case 'total':     return d.reduce((s, x) => s + x[1], 0);
    case 'diferenca': return Math.abs(val(r.a) - val(r.b));
    case 'valor':     return val(r.a);
  }
}
const g10final = g10.map((r, i) => {
  const resposta = resolverGrafico(r);
  // opções
  let opcoes;
  if (r.tipo === 'maior' || r.tipo === 'menor') {
    opcoes = r.dados.map(x => x[0]);                       // nomes das categorias
  } else {
    const base = Number(resposta);
    const set = new Set([base, base + 1, base + 2, Math.max(0, base - 2)]);
    opcoes = [...set].slice(0, 4);
  }
  ok(opcoes.map(String).includes(String(resposta)), `g10[${i}] opções contêm a resposta (${resposta})`);
  // valores dos dados são inteiros não-negativos
  ok(r.dados.every(x => Number.isInteger(x[1]) && x[1] >= 0), `g10[${i}] valores válidos`);
  console.log(`    ${r.titulo}: ${r.pergunta} → ${resposta}`);
  return { ...r, resposta, opcoes };
});

// ---------------------------------------------------------------- resultado
console.log('\n=======================================');
if (falhas === 0) {
  console.log('✓ TODA a matemática dos jogos 6–10 verificada. 0 falhas.');
} else {
  console.log('✗ ' + falhas + ' falha(s). NÃO codificar antes de resolver.');
  process.exit(1);
}

// exporta os dados finais verificados (para copiar para dados.js com confiança)
module.exports = { g6, g7, g8: g8final, g9: g9final, g10: g10final };
