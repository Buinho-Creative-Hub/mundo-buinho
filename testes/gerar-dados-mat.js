/* Gera e VERIFICA os 10 jogos de matemática (4.º ano), cada um com
   3 níveis × 3 rounds. Recomputa todas as respostas a partir dos dados crus
   (regra de ouro do Albano) e só escreve static/js/dados-mat.js se 0 falhas.
   Correr:  node testes/gerar-dados-mat.js  */
'use strict';
const fs = require('fs');
const path = require('path');

let falhas = 0, total = 0;
const ok = (c, m) => { total++; if (!c) { falhas++; console.error('  ✗ ' + m); } };

// ---------- utilidades ----------
const virg = n => String(n).replace('.', ',');                 // 4.5 -> "4,5"
const eur  = c => (c / 100).toFixed(2).replace('.', ',') + ' €'; // cêntimos -> "1,25 €"

// opções para resposta inteira: correcta + 3 distratores próximos, únicos, >=0.
// A posição da correcta varia com `pos` (0..3) para não ser previsível.
function opInt(correct, pos) {
  const cand = [correct + 1, correct - 1, correct + 2, correct - 2, correct + 3, correct + 10];
  const distr = [];
  for (const c of cand) { if (c >= 0 && c !== correct && distr.indexOf(c) < 0) distr.push(c); if (distr.length === 3) break; }
  const arr = distr.slice(0, 3);
  arr.splice(((pos % 4) + 4) % 4, 0, correct);
  return arr;
}

// A partir de uma lista de rounds (cada um já com resposta), monta opcoes se faltarem.
// `verif` (opcional) recomputa a resposta e confirma.
function nivel(rounds) {
  return rounds.map((r, i) => {
    if (r.verif !== undefined) ok(r.verif === r.resposta, `[${r.pergunta}] verif ${r.verif} == resposta ${r.resposta}`);
    if (!r.opcoes) r.opcoes = opInt(r.resposta, r._pos != null ? r._pos : i + 1);
    ok(r.opcoes.length === 4, `[${r.pergunta}] tem 4 opções`);
    ok(new Set(r.opcoes.map(String)).size === 4, `[${r.pergunta}] opções únicas`);
    ok(r.opcoes.map(String).indexOf(String(r.resposta)) >= 0, `[${r.pergunta}] opções contêm a resposta (${r.resposta})`);
    const { verif, _pos, ...limpo } = r;
    return limpo;
  });
}

// ======================================================================
// Builders por tipo (computam a resposta)
// ======================================================================
const mult = (a, b) => ({ visual: 'nenhum', pergunta: `${a} × ${b} = ?`, resposta: a * b, verif: a * b });
const divE = (a, b) => ({ visual: 'nenhum', pergunta: `${a} : ${b} = ?`, resposta: a / b, verif: a / b });
const divR = (a, b) => ({ visual: 'nenhum', pergunta: `${a} : ${b} — quantos sobram?`, resposta: a % b, verif: a % b });
const fracQ = (num, den, tot, icone) => ({ visual: 'fracao', num, den, total: tot, icone,
  pergunta: `Quanto é ${num}/${den} de ${tot} ${icone ? '' : ''}?`.trim(), resposta: (tot / den) * num, verif: (tot / den) * num });
const seq = (termos, prox) => ({ visual: 'sequencia', termos, pergunta: 'Qual é o número que continua a sequência?', resposta: prox });
const retP = (comp, larg) => ({ visual: 'retangulo', tipo: 'perimetro', comp, larg,
  pergunta: 'Quantos metros de cerca (perímetro)?', resposta: 2 * (comp + larg), verif: 2 * (comp + larg) });
const retA = (comp, larg) => ({ visual: 'retangulo', tipo: 'area', comp, larg,
  pergunta: 'Quantos m² de terra (área)?', resposta: comp * larg, verif: comp * larg });
const retInvL = (comp, area) => ({ visual: 'retangulo', tipo: 'inv-lado', comp, larg: area / comp, area,
  pergunta: `A horta tem ${area} m² e ${comp} m de comprimento. Qual é a largura?`, resposta: area / comp, verif: area / comp });
const retInvP = (comp, perim) => ({ visual: 'retangulo', tipo: 'inv-perim', comp, larg: perim / 2 - comp, perim,
  pergunta: `A cerca mede ${perim} m e o comprimento é ${comp} m. Qual é a largura?`, resposta: perim / 2 - comp, verif: perim / 2 - comp });

// ======================================================================
// OS 10 JOGOS
// ======================================================================
const JOGOS = [];

// ---- q1 Multiplicação ----
JOGOS.push({ id: 'q1', nome: 'Multiplicação', icone: '✖️', niveis: [
  nivel([mult(6, 7), mult(8, 4), mult(9, 6)]),
  nivel([mult(12, 4), mult(13, 5), mult(23, 3)]),
  nivel([mult(14, 6), mult(25, 4), mult(18, 7)])
]});

// ---- q2 Divisão ----
JOGOS.push({ id: 'q2', nome: 'Divisão', icone: '➗', niveis: [
  nivel([divE(42, 6), divE(45, 5), divE(56, 8)]),
  nivel([divE(48, 4), divE(65, 5), divE(84, 7)]),
  nivel([divR(50, 6), divR(37, 5), divR(43, 8)])
]});

// ---- q3 Frações ----
JOGOS.push({ id: 'q3', nome: 'Frações', icone: '🍕', niveis: [
  nivel([fracQ(1, 2, 8, '🍓'), fracQ(1, 3, 9, '🍏'), fracQ(1, 4, 12, '🥚')]),
  nivel([fracQ(3, 4, 12, '🍎'), fracQ(2, 3, 15, '🌰'), fracQ(2, 5, 10, '🫐')]),
  nivel([
    fracQ(3, 5, 25, '🍇'),
    { visual: 'fracao', num: 2, den: 4, pergunta: '2/4 é igual a que fração?', resposta: '1/2', opcoes: ['1/2', '1/3', '2/3', '3/4'] },
    fracQ(7, 8, 16, '🍒')
  ])
]});

// ---- q4 Decimais ----
JOGOS.push({ id: 'q4', nome: 'Decimais', icone: '🔢', niveis: [
  nivel([
    { visual: 'nenhum', pergunta: '3,4 × 10 = ?', resposta: 34, verif: 34 },
    { visual: 'nenhum', pergunta: '0,7 × 10 = ?', resposta: 7, verif: 7 },
    { visual: 'nenhum', pergunta: '2,5 × 10 = ?', resposta: 25, verif: 25 }
  ]),
  nivel([
    { visual: 'nenhum', pergunta: '45 : 10 = ?', resposta: '4,5', opcoes: ['4,5', '0,45', '45', '5,4'] },
    { visual: 'nenhum', pergunta: '0,8 × 100 = ?', resposta: 80, verif: 80 },
    { visual: 'nenhum', pergunta: 'Qual é maior: 0,7 ou 0,45?', resposta: '0,7', opcoes: ['0,7', '0,45', 'são iguais', '0,4'] }
  ]),
  nivel([
    { visual: 'nenhum', pergunta: '3,25 × 10 = ?', resposta: '32,5', opcoes: ['32,5', '325', '3,25', '3250'] },
    { visual: 'nenhum', pergunta: '0,4 + 0,7 = ?', resposta: '1,1', opcoes: ['1,1', '0,11', '11', '1,0'] },
    { visual: 'nenhum', pergunta: '2,5 × 100 = ?', resposta: 250, verif: 250 }
  ])
]});

// ---- q5 Dinheiro ----
JOGOS.push({ id: 'q5', nome: 'Dinheiro', icone: '🪙', niveis: [
  nivel([
    { visual: 'nenhum', pergunta: '1,20 € + 0,50 € = ?', resposta: '1,70 €', opcoes: ['1,70 €', '1,25 €', '1,80 €', '2,00 €'] },
    { visual: 'nenhum', pergunta: '0,80 € + 0,30 € = ?', resposta: '1,10 €', opcoes: ['1,10 €', '1,00 €', '0,90 €', '1,20 €'] },
    { visual: 'nenhum', pergunta: '2,00 € + 1,50 € = ?', resposta: '3,50 €', opcoes: ['3,50 €', '3,00 €', '2,50 €', '4,00 €'] }
  ]),
  nivel([
    { visual: 'nenhum', pergunta: 'Pagas 2 € por algo de 1,25 €. Qual é o troco?', resposta: '0,75 €', opcoes: ['0,75 €', '0,85 €', '1,25 €', '0,50 €'] },
    { visual: 'nenhum', pergunta: 'Pagas 5 € por algo de 3,40 €. Qual é o troco?', resposta: '1,60 €', opcoes: ['1,60 €', '1,40 €', '2,60 €', '1,50 €'] },
    { visual: 'nenhum', pergunta: 'Pagas 1 € por algo de 0,70 €. Qual é o troco?', resposta: '0,30 €', opcoes: ['0,30 €', '0,40 €', '0,20 €', '0,70 €'] }
  ]),
  nivel([
    { visual: 'nenhum', pergunta: '3 gelados a 0,80 € cada. Quanto pagas?', resposta: '2,40 €', opcoes: ['2,40 €', '2,00 €', '1,60 €', '3,20 €'] },
    { visual: 'nenhum', pergunta: '2 sumos a 1,25 € cada. Quanto pagas?', resposta: '2,50 €', opcoes: ['2,50 €', '2,25 €', '1,50 €', '3,50 €'] },
    { visual: 'nenhum', pergunta: 'Compras 2 pães de 1,30 € e pagas com 5 €. Troco?', resposta: '2,40 €', opcoes: ['2,40 €', '3,70 €', '2,60 €', '1,40 €'] }
  ])
]});

// ---- q6 Perímetro & Área ----
JOGOS.push({ id: 'q6', nome: 'Perímetro e Área', icone: '📐', niveis: [
  nivel([retP(5, 3), retP(6, 4), retP(7, 2)]),
  nivel([retA(5, 3), retA(6, 4), retA(7, 5)]),
  nivel([retInvL(5, 20), retInvP(6, 18), retInvL(8, 24)])
]});

// ---- q7 Sequências ----
JOGOS.push({ id: 'q7', nome: 'Sequências', icone: '🏰', niveis: [
  nivel([seq([2, 4, 6, 8], 10), seq([5, 10, 15, 20], 25), seq([3, 6, 9, 12], 15)]),
  nivel([seq([3, 6, 12, 24], 48), seq([50, 45, 40, 35], 30), seq([1, 4, 9, 16], 25)]),
  nivel([seq([1, 2, 4, 7, 11], 16), seq([2, 6, 18, 54], 162), seq([1, 3, 6, 10, 15], 21)])
]});
// verificação independente das sequências
(function () {
  const checks = [
    [[2,4,6,8],10,'+2'], [[5,10,15,20],25,'+5'], [[3,6,9,12],15,'+3'],
    [[3,6,12,24],48,'x2'], [[50,45,40,35],30,'-5'], [[1,4,9,16],25,'quad'],
    [[1,2,4,7,11],16,'dif+1'], [[2,6,18,54],162,'x3'], [[1,3,6,10,15],21,'tri']
  ];
  checks.forEach(([t, esperado, tipo]) => {
    let calc;
    const n = t.length;
    if (tipo === 'x2') calc = t[n-1]*2;
    else if (tipo === 'x3') calc = t[n-1]*3;
    else if (tipo === 'quad') calc = (n+1)*(n+1);
    else if (tipo === 'tri') calc = t[n-1] + (n+1);
    else if (tipo === 'dif+1') { const d = t[n-1]-t[n-2]; calc = t[n-1] + (d+1); }
    else { const p = t[1]-t[0]; calc = t[n-1] + p; }
    ok(calc === esperado, `sequência ${t.join(',')} → ${esperado} (calc ${calc}, ${tipo})`);
  });
})();

// ---- q8 Ângulos ----
JOGOS.push({ id: 'q8', nome: 'Ângulos', icone: '🧭', niveis: [
  nivel([
    { visual: 'angulo', graus: 90, pergunta: 'Um quarto de volta são quantos graus?', resposta: 90, opcoes: [90, 45, 180, 60] },
    { visual: 'angulo', graus: 180, pergunta: 'Meia volta são quantos graus?', resposta: 180, opcoes: [180, 90, 360, 270] },
    { visual: 'angulo', graus: 90, pergunta: 'Um ângulo reto tem quantos graus?', resposta: 90, opcoes: [90, 100, 45, 180] }
  ]),
  nivel([
    { visual: 'angulo', graus: 90, pergunta: 'Um ângulo de 90° chama-se...', resposta: 'reto', opcoes: ['reto', 'agudo', 'obtuso', 'raso'] },
    { visual: 'angulo', graus: 40, pergunta: 'Um ângulo de 40° chama-se...', resposta: 'agudo', opcoes: ['agudo', 'reto', 'obtuso', 'raso'] },
    { visual: 'angulo', graus: 130, pergunta: 'Um ângulo de 130° chama-se...', resposta: 'obtuso', opcoes: ['obtuso', 'agudo', 'reto', 'raso'] }
  ]),
  nivel([
    { visual: 'angulo', graus: 270, pergunta: 'Três quartos de volta são quantos graus?', resposta: 270, opcoes: [270, 180, 360, 240] },
    { visual: 'nenhum', pergunta: 'Quantos ângulos retos há numa volta completa?', resposta: 4, opcoes: [4, 2, 3, 6] },
    { visual: 'nenhum', pergunta: 'Dois ângulos retos juntos fazem quantos graus?', resposta: 180, opcoes: [180, 90, 360, 270] }
  ])
]});

// ---- q9 Gráficos ----
const PICT = (dados, escala, unidade, alvo, prox) => ({ visual: 'grafico', modo: 'pictograma', escala, unidade, dados });
JOGOS.push({ id: 'q9', nome: 'Gráficos', icone: '📊', niveis: [
  nivel([
    { visual: 'grafico', modo: 'pictograma', escala: 2, unidade: 'votos',
      dados: [['Maçã', 3, '🍎'], ['Banana', 4, '🍌'], ['Pera', 2, '🍐']],
      pergunta: 'Cada símbolo vale 2 votos. Quantos votos teve a Banana?', resposta: 8, verif: 8 },
    { visual: 'grafico', modo: 'barras', unidade: 'golos',
      dados: [['Azuis', 7, '🔵'], ['Verdes', 4, '🟢'], ['Rubros', 5, '🔴']],
      pergunta: 'Quantos golos foram marcados ao todo?', resposta: 16, verif: 16 },
    { visual: 'grafico', modo: 'barras', unidade: 'votos',
      dados: [['Cão', 6, '🐶'], ['Gato', 9, '🐱'], ['Peixe', 4, '🐟']],
      pergunta: 'Qual foi o animal mais votado?', resposta: 'Gato', opcoes: ['Gato', 'Cão', 'Peixe', 'Empate'] }
  ]),
  nivel([
    { visual: 'grafico', modo: 'barras', unidade: 'golos',
      dados: [['Azuis', 8, '🔵'], ['Verdes', 3, '🟢'], ['Rubros', 6, '🔴']],
      pergunta: 'Quantos golos a mais marcaram os Azuis do que os Verdes?', resposta: 5, verif: 5 },
    { visual: 'grafico', modo: 'pictograma', escala: 5, unidade: 'livros',
      dados: [['1.º ano', 2, '📕'], ['2.º ano', 4, '📗'], ['3.º ano', 3, '📘']],
      pergunta: 'Cada símbolo vale 5 livros. Quantos livros leu o 2.º ano?', resposta: 20, verif: 20 },
    { visual: 'grafico', modo: 'barras', unidade: 'animais',
      dados: [['Galinhas', 12, '🐔'], ['Ovelhas', 7, '🐑'], ['Vacas', 3, '🐄']],
      pergunta: 'De que animal há menos?', resposta: 'Vacas', opcoes: ['Vacas', 'Ovelhas', 'Galinhas', 'Empate'] }
  ]),
  nivel([
    { visual: 'grafico', modo: 'barras', unidade: 'votos',
      dados: [['Cão', 6, '🐶'], ['Gato', 3, '🐱'], ['Peixe', 3, '🐟']],
      pergunta: 'Que fração da turma escolheu o Cão?', resposta: '1/2', opcoes: ['1/2', '1/3', '1/4', '2/3'] },
    { visual: 'grafico', modo: 'barras', unidade: 'flores',
      dados: [['Rosa', 4, '🌹'], ['Tulipa', 9, '🌷'], ['Malmequer', 6, '🌼']],
      pergunta: 'Quantas flores faltam à Rosa para igualar a Tulipa?', resposta: 5, verif: 5 },
    { visual: 'grafico', modo: 'barras', unidade: 'chuva (mm)',
      dados: [['Seg', 2, '🌧️'], ['Ter', 6, '🌧️'], ['Qua', 4, '🌧️'], ['Qui', 8, '🌧️']],
      pergunta: 'Quantos mm de chuva caíram nos 4 dias?', resposta: 20, verif: 20 }
  ])
]});

// ---- q10 Problemas ----
JOGOS.push({ id: 'q10', nome: 'Problemas', icone: '🧠', niveis: [
  nivel([
    { visual: 'nenhum', pergunta: '12 + 9 = ?', resposta: 21, verif: 21 },
    { visual: 'nenhum', pergunta: '24 − 8 = ?', resposta: 16, verif: 16 },
    { visual: 'nenhum', pergunta: '15 + 18 = ?', resposta: 33, verif: 33 }
  ]),
  nivel([
    { visual: 'nenhum', pergunta: 'Tinha 24 cromos e dei 9. Com quantos fiquei?', resposta: 15, verif: 15 },
    { visual: 'nenhum', pergunta: '5 sacos com 6 maçãs cada. Quantas maçãs ao todo?', resposta: 30, verif: 30 },
    { visual: 'nenhum', pergunta: '18 rebuçados a dividir por 3 amigos. Quantos a cada um?', resposta: 6, verif: 6 }
  ]),
  nivel([
    { visual: 'nenhum', pergunta: '3 caixas de 8 bolos. Comi 4. Quantos sobram?', resposta: 20, verif: 20 },
    { visual: 'nenhum', pergunta: 'Tinha 50 €, gastei 22 € e depois 15 €. Quanto sobra?', resposta: 13, verif: 13 },
    { visual: 'nenhum', pergunta: 'O dobro de 17, mais 6. Quanto é?', resposta: 40, verif: 40 }
  ])
]});

// ======================================================================
// Verificação estrutural + escrita
// ======================================================================
ok(JOGOS.length === 10, 'são 10 jogos');
JOGOS.forEach(j => {
  ok(j.niveis.length === 3, `${j.id} tem 3 níveis`);
  j.niveis.forEach((n, li) => ok(n.length === 3, `${j.id} nível ${li + 1} tem 3 rounds`));
});

console.log(`\n${total} verificações, ${falhas} falha(s).`);
if (falhas > 0) { console.error('✗ NÃO escrevi o ficheiro.'); process.exit(1); }

const saida = '/* Mundo Buinho — jogos de matemática 4.º ano (10 jogos × 3 níveis × 3 rounds)\n' +
  '   GERADO por testes/gerar-dados-mat.js — não editar à mão; toda a matemática\n' +
  '   está verificada em código. Nível: L1 25s, L2 18s, L3 10s. Descer de nível ao perder. */\n' +
  'window.MB_JOGOS = ' + JSON.stringify(JOGOS, null, 2) + ';\n';
fs.writeFileSync(path.join(__dirname, '..', 'static', 'js', 'dados-mat.js'), saida, 'utf8');
console.log('✓ 10 jogos, 90 rounds — escritos em static/js/dados-mat.js');
