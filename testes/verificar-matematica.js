/* Verificação da matemática dos jogos 6–10 (Matemática 4.º ano — nível EXIGENTE).
   Regra de ouro do Albano: números NUNCA dependem da memória do modelo — o código
   VERIFICA. Recomputa todas as respostas a partir dos dados crus e falha ruidosamente.
   Correr:  node testes/verificar-matematica.js  */
'use strict';

let falhas = 0;
const ok  = (c, m) => { if (!c) { falhas++; console.error('  ✗ ' + m); } };
const sec = m => console.log('\n— ' + m);

// ======================================================================
// JOGO 6 — Fatias Certas → FRAÇÃO DE UMA QUANTIDADE
// Apanha (num/den) de `total` objectos. resposta = num/den*total (inteiro).
// ======================================================================
const g6 = [
  { rotulo: '1/2', num: 1, den: 2, total: 8,  icone: '🍓', nome: 'morangos' },
  { rotulo: '3/4', num: 3, den: 4, total: 12, icone: '🍎', nome: 'maçãs' },
  { rotulo: '2/3', num: 2, den: 3, total: 15, icone: '🥚', nome: 'ovos' },
  { rotulo: '4/5', num: 4, den: 5, total: 10, icone: '🌰', nome: 'castanhas' },
  { rotulo: '3/8', num: 3, den: 8, total: 16, icone: '🫐', nome: 'mirtilos' }
];
sec('Jogo 6 — Fatias Certas (fração de uma quantidade)');
const g6final = g6.map((r, i) => {
  ok(r.total % r.den === 0, `g6[${i}] total divisível pelo denominador (${r.total}/${r.den})`);
  const resposta = (r.total / r.den) * r.num;
  ok(Number.isInteger(resposta) && resposta > 0 && resposta < r.total, `g6[${i}] resposta inteira 0<r<total (${resposta})`);
  console.log(`    ${r.rotulo} de ${r.total} ${r.nome} = ${resposta}`);
  return { ...r, resposta };
});

// ======================================================================
// JOGO 7 — A Feira → DAR O TROCO (decimais, dois passos)
// troco = paga - preco; escolher moedas que somam o troco. Verifica solução.
// ======================================================================
const g7 = [
  { produto: 'o pão',    icone: '🥖', preco: 125, paga: 200, tabuleiro: [50, 20, 5, 10, 20] },
  { produto: 'a maçã',   icone: '🍎', preco: 70,  paga: 100, tabuleiro: [20, 10, 5, 20, 50] },
  { produto: 'o queijo', icone: '🧀', preco: 340, paga: 500, tabuleiro: [100, 50, 10, 20, 50] },
  { produto: 'o sumo',   icone: '🧃', preco: 250, paga: 300, tabuleiro: [20, 20, 10, 50, 5] },
  { produto: 'o mel',    icone: '🍯', preco: 180, paga: 200, tabuleiro: [10, 5, 20, 5, 10] }
];
const MOEDAS_LEGAIS = new Set([200, 100, 50, 20, 10, 5, 2, 1]);
function existeSubconjunto(vals, alvo) {
  for (let m = 1; m < (1 << vals.length); m++) {
    let s = 0;
    for (let b = 0; b < vals.length; b++) if (m & (1 << b)) s += vals[b];
    if (s === alvo) return true;
  }
  return false;
}
sec('Jogo 7 — A Feira (troco com decimais)');
const g7final = g7.map((r, i) => {
  const troco = r.paga - r.preco;
  ok(troco > 0, `g7[${i}] troco positivo`);
  ok(r.tabuleiro.every(v => MOEDAS_LEGAIS.has(v)), `g7[${i}] só moedas reais`);
  ok(existeSubconjunto(r.tabuleiro, troco), `g7[${i}] existe combinação p/ troco de ${(troco/100).toFixed(2)}€`);
  console.log(`    ${r.produto}: custa ${(r.preco/100).toFixed(2)}€, paga ${(r.paga/100).toFixed(2)}€ → troco ${(troco/100).toFixed(2)}€`);
  return { ...r, troco };
});

// ======================================================================
// JOGO 8 — A Horta Cercada → PERÍMETRO, ÁREA e INVERSO (retângulos c/ medidas)
// tipo: 'perimetro' | 'area' | 'inv-lado' | 'inv-perim'
// ======================================================================
const g8 = [
  { tipo: 'perimetro', comp: 7, larg: 4, pergunta: 'Quantos metros de cerca?' },
  { tipo: 'area',      comp: 6, larg: 4, pergunta: 'Quantos quadrados de terra (m²)?' },
  { tipo: 'area',      comp: 8, larg: 3, pergunta: 'Quantos quadrados de terra (m²)?' },
  { tipo: 'inv-lado',  comp: 5, area: 20, pergunta: 'A horta tem 20 m² e 5 m de comprimento. Qual é a largura?' },
  { tipo: 'inv-perim', comp: 6, perim: 18, pergunta: 'A cerca mede 18 m e o comprimento é 6 m. Qual é a largura?' }
];
sec('Jogo 8 — A Horta Cercada (perímetro / área / inverso)');
function resolverG8(r) {
  switch (r.tipo) {
    case 'perimetro': return 2 * (r.comp + r.larg);
    case 'area':      return r.comp * r.larg;
    case 'inv-lado':  return r.area / r.comp;            // largura = área / comprimento
    case 'inv-perim': return (r.perim / 2) - r.comp;     // largura = perím/2 - comprimento
  }
}
const g8final = g8.map((r, i) => {
  const resposta = resolverG8(r);
  ok(Number.isInteger(resposta) && resposta > 0, `g8[${i}] resposta inteira positiva (${resposta})`);
  // largura implícita nos inversos tem de ser inteira e positiva
  if (r.tipo === 'inv-lado') ok(r.area % r.comp === 0, `g8[${i}] área divisível pelo comprimento`);
  if (r.tipo === 'inv-perim') ok(r.perim % 2 === 0 && (r.perim / 2) > r.comp, `g8[${i}] perímetro par e largura>0`);
  const set = new Set([resposta, resposta + 1, resposta - 1, resposta + 2, resposta - 2].filter(x => x > 0));
  const opcoes = [...set].slice(0, 4);
  ok(opcoes.includes(resposta), `g8[${i}] opções contêm a resposta`);
  console.log(`    ${r.tipo}: ${r.pergunta} → ${resposta}`);
  return { ...r, resposta, opcoes };
});

// ======================================================================
// JOGO 9 — Castelos na Areia → SEQUÊNCIAS (×2, quadrados, decrescente, diferenças)
// tipo: 'x2' | 'quad' | 'arit' | 'difcresce'
// ======================================================================
const g9 = [
  { termos: [2, 4, 8, 16],    tipo: 'x2',        pista: 'cada um é o dobro do anterior' },
  { termos: [1, 4, 9, 16],    tipo: 'quad',      pista: 'são os quadrados: 1×1, 2×2, 3×3, 4×4...' },
  { termos: [50, 45, 40, 35], tipo: 'arit',      pista: 'desce de 5 em 5' },
  { termos: [1, 2, 4, 7, 11], tipo: 'difcresce', pista: 'o salto cresce: +1, +2, +3, +4...' },
  { termos: [3, 6, 12, 24],   tipo: 'x2',        pista: 'cada um é o dobro do anterior' }
];
sec('Jogo 9 — Castelos na Areia (sequências)');
function proximoG9(r) {
  const t = r.termos, n = t.length;
  switch (r.tipo) {
    case 'x2':   return t[n - 1] * 2;
    case 'quad': return (n + 1) * (n + 1);                // próximo quadrado
    case 'arit': return t[n - 1] + (t[1] - t[0]);
    case 'difcresce': {
      const d = t[n - 1] - t[n - 2];
      return t[n - 1] + (d + 1);
    }
  }
}
const g9final = g9.map((r, i) => {
  // coerência da própria sequência
  if (r.tipo === 'quad') r.termos.forEach((v, k) => ok(v === (k + 1) * (k + 1), `g9[${i}] termo ${k} é quadrado`));
  if (r.tipo === 'x2') for (let k = 1; k < r.termos.length; k++) ok(r.termos[k] === r.termos[k-1] * 2, `g9[${i}] dobra`);
  if (r.tipo === 'arit') { const p = r.termos[1]-r.termos[0]; for (let k=1;k<r.termos.length;k++) ok(r.termos[k]-r.termos[k-1]===p, `g9[${i}] passo const`); }
  const resposta = proximoG9(r);
  ok(Number.isInteger(resposta), `g9[${i}] próximo inteiro (${resposta})`);
  const set = new Set([resposta, resposta + 2, resposta - 2, resposta + 4, resposta - 1].filter(x => x > 0));
  const opcoes = [...set].slice(0, 4);
  ok(opcoes.includes(resposta), `g9[${i}] opções contêm a resposta`);
  console.log(`    ${r.termos.join(', ')}, ? → ${resposta}  (${r.tipo})`);
  return { termos: r.termos, resposta, opcoes, pista: r.pista };
});

// ======================================================================
// JOGO 10 — O Gráfico da Turma → DADOS (pictograma c/ escala, multipasso, fração/%)
// tipo: 'pictograma-valor' | 'diferenca' | 'total' | 'fracao-total' | 'faltam'
// ======================================================================
const g10 = [
  { titulo: 'Fruta preferida (pictograma)', modo: 'pictograma', escala: 2, unidade: 'votos', icone: '🍎',
    dados: [['Maçã', 3], ['Banana', 4], ['Pera', 2]],   // valores em SÍMBOLOS; cada símbolo = 2 votos
    tipo: 'pictograma-valor', alvo: 'Banana', pergunta: 'Cada 🍎 vale 2 votos. Quantos votos teve a Banana?' },
  { titulo: 'Golos por equipa', modo: 'barras', unidade: 'golos', icone: '⚽',
    dados: [['Azuis', 7], ['Verdes', 4], ['Vermelhos', 5]],
    tipo: 'diferenca', a: 'Azuis', b: 'Verdes', pergunta: 'Quantos golos a mais marcaram os Azuis do que os Verdes?' },
  { titulo: 'Livros lidos por mês', modo: 'barras', unidade: 'livros', icone: '📚',
    dados: [['Jan', 5], ['Fev', 8], ['Mar', 6], ['Abr', 3]],
    tipo: 'total', pergunta: 'Quantos livros foram lidos ao todo?' },
  { titulo: 'Animal preferido da turma', modo: 'barras', unidade: 'votos', icone: '🐾',
    dados: [['Cão', 6], ['Gato', 3], ['Peixe', 3]],
    tipo: 'fracao-total', alvo: 'Cão', pergunta: 'Que fração da turma escolheu o Cão?' },
  { titulo: 'Flores no jardim', modo: 'barras', unidade: 'flores', icone: '🌷',
    dados: [['Rosa', 4], ['Tulipa', 9], ['Malmequer', 6]],
    tipo: 'faltam', a: 'Rosa', b: 'Tulipa', pergunta: 'Quantas flores faltam à Rosa para igualar a Tulipa?' }
];
sec('Jogo 10 — O Gráfico da Turma (dados)');
function fracaoSimplificada(n, d) {
  const g = (a, b) => b ? g(b, a % b) : a;
  const k = g(n, d);
  return (n / k) + '/' + (d / k);
}
function resolverG10(r) {
  const val = nome => r.dados.find(x => x[0] === nome)[1];
  switch (r.tipo) {
    case 'pictograma-valor': return val(r.alvo) * r.escala;
    case 'diferenca':        return val(r.a) - val(r.b);
    case 'total':            return r.dados.reduce((s, x) => s + x[1], 0);
    case 'faltam':           return val(r.b) - val(r.a);
    case 'fracao-total': {
      const tot = r.dados.reduce((s, x) => s + x[1], 0);
      return fracaoSimplificada(val(r.alvo), tot);
    }
  }
}
const g10final = g10.map((r, i) => {
  const resposta = resolverG10(r);
  let opcoes;
  if (r.tipo === 'fracao-total') {
    opcoes = ['1/2', '1/3', '1/4', '2/3'];
    ok(opcoes.includes(String(resposta)), `g10[${i}] fração está nas opções (${resposta})`);
  } else {
    const base = Number(resposta);
    const set = new Set([base, base + 1, base + 2, Math.max(0, base - 1)]);
    opcoes = [...set].slice(0, 4);
    ok(opcoes.map(String).includes(String(resposta)), `g10[${i}] opções contêm a resposta (${resposta})`);
  }
  ok(r.dados.every(x => Number.isInteger(x[1]) && x[1] >= 0), `g10[${i}] valores válidos`);
  console.log(`    ${r.titulo}: ${r.pergunta} → ${resposta}`);
  return { ...r, resposta, opcoes };
});

// ---------------------------------------------------------------- resultado
console.log('\n=======================================');
if (falhas === 0) {
  console.log('✓ TODA a matemática (nível exigente) dos jogos 6–10 verificada. 0 falhas.');
} else {
  console.log('✗ ' + falhas + ' falha(s). NÃO codificar antes de resolver.');
  process.exit(1);
}
module.exports = { g6: g6final, g7: g7final, g8: g8final, g9: g9final, g10: g10final };
