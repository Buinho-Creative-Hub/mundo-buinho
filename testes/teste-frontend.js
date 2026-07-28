/* Teste de comportamento do Mundo Buinho num DOM real (jsdom).
   Não valida pintura — valida lógica, render e transições de estado. */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const B = __dirname + '/..';
const html = fs.readFileSync(path.join(B, 'index.html'), 'utf8');

const dom = new JSDOM(html, {
  runScripts: 'outside-only',
  url: 'http://localhost/',
  pretendToBeVisual: true
});
const { window } = dom;

// stubs que o jsdom não tem
window.AudioContext = function () {
  return {
    currentTime: 0,
    createOscillator: () => ({ type: '', frequency: {}, connect() {}, start() {}, stop() {} }),
    createGain: () => ({ gain: { value: 0, exponentialRampToValueAtTime() {} }, connect() {} }),
    destination: {}
  };
};
window.HTMLCanvasElement.prototype.getContext = function () {
  return {
    fillStyle: '', strokeStyle: '', lineWidth: 0, lineCap: '', lineJoin: '',
    fillRect() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {}
  };
};
window.HTMLCanvasElement.prototype.toDataURL = () => 'data:image/png;base64,AAAA';
window.fetch = async () => ({ json: async () => ({ texto: 'pista de teste', fonte: 'mock' }) });

// carregar os scripts pela ordem do index.html
['static/js/dados.js', 'static/js/dados-mat.js', 'static/js/dados-dominos.js', 'static/js/dados-memoria.js',
 'static/js/dados-motores.js', 'static/js/nucleo.js', 'static/js/motores.js', 'static/js/jogos.js'].forEach(f => {
  window.eval(fs.readFileSync(path.join(B, f), 'utf8'));
});
window.document.dispatchEvent(new window.Event('DOMContentLoaded'));

const MB = window.MB;
const D = window.MB_DADOS;
const doc = window.document;
const $ = s => doc.querySelector(s);
const $$ = s => Array.from(doc.querySelectorAll(s));

let falhas = 0, passes = 0;
function ok(cond, msg) {
  if (cond) { passes++; console.log('  ✓ ' + msg); }
  else { falhas++; console.log('  ✗ FALHA: ' + msg); }
}
function grupo(t) { console.log('\n' + t); }

function clicar(el) {
  el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
}

// O jsdom não faz layout: getBoundingClientRect devolve tudo a zero, e a reta
// numérica divide pela largura da zona. Damos-lhe uma largura fixa de 300px
// para o cálculo de posição poder ser testado — é geometria, não pintura.
window.Element.prototype.getBoundingClientRect = function () {
  return { left: 0, top: 0, right: 300, bottom: 130, width: 300, height: 130, x: 0, y: 0 };
};
function clicarEm(el, x) {
  el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, clientX: x, clientY: 60 }));
}

// ---------------------------------------------------------------- arranque
grupo('ARRANQUE');
ok($('#app').innerHTML.length > 500, 'render inicial produz HTML');
ok(MB.estado().ecra === 'home', 'ecrã inicial é home');
ok($$('.cat-card').length === D.categorias.length, 'home mostra ' + D.categorias.length + ' categorias (tem ' + $$('.cat-card').length + ')');
ok(window.MB_JOGOS && window.MB_JOGOS.length === 15, 'há 15 jogos em MB_JOGOS (13 mat./lógica + 2 do motor Dominó)');
ok(D.categorias.find(c => c.id === 'logica').jogos.length === 4, 'a categoria Lógica tem 4 jogos (+ O Crivo)');
ok(D.categorias.find(c => c.id === 'geometria').jogos.length === 2, 'a categoria Geometria tem 2 jogos');

// ---------------------------------------------------------------- navegação por categorias
grupo('NAVEGAÇÃO (categorias → jogo → voltar)');
clicar($('[data-accao="ir-cat"][data-cat="biofab"]'));
ok(MB.estado().ecra === 'cat:biofab', 'abrir categoria Biofabricação');
ok($$('.jogo-card').length === 5, 'a categoria Biofabricação lista os 5 jogos');
clicar($('[data-accao="ir"][data-ecra="g3"]'));
ok(MB.estado().ecra === 'g3', 'entrar no jogo Conta a Colheita');
clicar($('[data-accao="voltar"]'));
ok(MB.estado().ecra === 'cat:biofab', 'voltar de um jogo regressa à SUA categoria');
clicar($('[data-accao="voltar"]'));
ok(MB.estado().ecra === 'home', 'voltar da categoria regressa ao menu');

// categoria de matemática abre um quiz
clicar($('[data-accao="ir-cat"][data-cat="logica"]'));
ok(MB.estado().ecra === 'cat:logica', 'abrir categoria Lógica');
ok($$('.jogo-card').length === 4, 'Lógica lista 4 jogos (Padrões, Adivinha, Quem é?, O Crivo)');
MB.ir('home');

// ------------------------------------------------------- Jogo 3 (resposta certa)
grupo('JOGO 3 — Conta a Colheita');
MB.ir('g3');
const p0 = D.g3[0];
const btnCerto = $$('[data-accao="g3-resp"]').find(b => +b.dataset.v === p0.resposta);
ok(!!btnCerto, 'existe botão com a resposta certa (' + p0.resposta + ')');
clicar(btnCerto);
ok(MB.estado().celebracao !== null, 'resposta certa dispara celebração');

// avanço de pergunta é assíncrono (900ms)
const esperar = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  await esperar(1000);
  ok(MB.estado().g3.idx === 1, 'avança para a pergunta 2 (idx=' + MB.estado().g3.idx + ')');

  // resposta errada
  const p1 = D.g3[1];
  const btnErrado = $$('[data-accao="g3-resp"]').find(b => +b.dataset.v !== p1.resposta);
  clicar(btnErrado);
  ok(MB.estado().g3.errado !== null, 'resposta errada marca estado errado');
  await esperar(50);
  ok(MB.estado().mascote.aberta, 'resposta errada abre a mascote com pista');

  // -------------------------------------------------------- Jogo 4
  grupo('JOGO 4 — Circular ou Linear?');
  MB.ir('g4');
  const c0 = D.g4[0];
  ok($('.enunciado').textContent.includes('casca da laranja'), 'g4 mostra o 1º cartão');
  clicar($$('[data-accao="g4-resp"]').find(b => b.dataset.r === c0.r));
  ok(MB.estado().g4.idx === 1, 'resposta certa avança cartão');

  // percorrer todos e chegar ao fim
  MB.set({ g4: { idx: D.g4.length - 1, terminado: false } });
  const cUlt = D.g4[D.g4.length - 1];
  clicar($$('[data-accao="g4-resp"]').find(b => b.dataset.r === cUlt.r));
  ok(MB.estado().g4.terminado === true, 'último cartão marca terminado');
  ok($('.enunciado').textContent.includes('Muito bem'), 'ecrã final do g4 aparece');

  // -------------------------------------------------------- Jogo 1
  grupo('JOGO 1 — A Receita Certa');
  MB.ir('g1');
  ok($$('[data-accao="g1-verter"]').length === 3, 'g1 mostra 3 ingredientes');

  // pôr doses certas via estado e verificar
  MB.set({ g1: { doses: { agua: 120, agar: 5, glic: 15 } } });
  clicar($('[data-accao="g1-verificar"]'));
  ok(MB.estado().celebracao !== null, 'doses certas disparam celebração');

  await esperar(1600);
  const d = MB.estado().g1.doses;
  ok(d.agua === 0 && d.agar === 0 && d.glic === 0, 'taça esvazia após acertar');

  // doses erradas
  MB.set({ g1: { doses: { agua: 100, agar: 5, glic: 15 } } });
  clicar($('[data-accao="g1-verificar"]'));
  await esperar(50);
  ok(MB.estado().mascote.aberta, 'doses erradas abrem a mascote');

  // botão menos (reler o botão DEPOIS do set: o re-render substitui o elemento)
  MB.fecharMascote();
  MB.set({ g1: { doses: { agua: 100, agar: 5, glic: 15 } } });
  clicar($('[data-accao="g1-menos"][data-id="agua"]'));
  ok(MB.estado().g1.doses.agua === 80, 'botão − tira um passo (100→80), tem ' + MB.estado().g1.doses.agua);
  MB.set({ g1: { doses: { agua: 0, agar: 0, glic: 0 } } });
  clicar($('[data-accao="g1-menos"][data-id="agua"]'));
  ok(MB.estado().g1.doses.agua === 0, 'botão − não desce abaixo de zero');

  // -------------------------------------------------------- Jogo 2
  grupo('JOGO 2 — Do Lixo ao Material');
  MB.ir('g2');
  ok(MB.estado().g2.fase === 'ordem', 'g2 arranca na fase de ordem');
  ok($$('[data-slot]').length === 4, 'mostra 4 slots');
  ok($$('[data-accao="g2-ordem"]').length === 4, 'mostra 4 passos na pool');

  // simular ordem certa via estado
  MB.set(s => ({ g2: Object.assign({}, s.g2, { fase: 'match' }) }));
  ok($$('[data-mid]').length === 4, 'fase match mostra 4 materiais');
  ok($$('[data-accao="g2-par"]').length === 4, 'fase match mostra 4 resíduos');

  // -------------------------------------------------------- Jogo 5
  grupo('JOGO 5 — Desenha a tua Folha');
  MB.ir('g5');
  ok(!!$('#tela'), 'canvas existe');
  ok($$('[data-accao="g5-cor"]').length === D.g5Cores.length, 'paleta com ' + D.g5Cores.length + ' cores');

  const desenhoAntes = MB.estado().g5.desafioIdx;
  clicar($('[data-accao="g5-novo"]'));
  ok(MB.estado().g5.desafioIdx !== desenhoAntes, 'botão outro desafio muda o desafio');

  clicar($('[data-accao="g5-mostrar"]'));
  await esperar(50);
  ok(MB.estado().mascote.aberta, 'mostrar ao Buinho abre a mascote');

  // ⚠️ o teste crítico: mudar de cor re-renderiza e apaga o canvas?
  grupo('REGRESSÃO — canvas sobrevive a re-render?');
  MB.fecharMascote();
  const telaAntes = $('#tela');
  clicar($('[data-accao="g5-cor"][data-c="#FA6415"]'));
  const telaDepois = $('#tela');
  ok(telaAntes === telaDepois,
     'o elemento canvas é O MESMO depois de mudar de cor (senão o desenho apaga-se)');
  ok(MB.estado().g5.cor === '#FA6415', 'a cor mudou mesmo (estado actualizado)');
  clicar($('[data-accao="g5-esp"][data-s="22"]'));
  ok($('#tela') === telaAntes, 'canvas sobrevive também a mudar a espessura');
  MB.ir('home'); MB.ir('g5');
  ok($('#tela') !== telaAntes, 'sair e voltar ao jogo cria canvas novo (tela limpa)');

  // ==================================================================
  // MOTOR DE QUIZ — 10 jogos de matemática (q1..q10)
  // ==================================================================
  grupo('MOTOR DE QUIZ — níveis, cronómetro e descida ao perder');

  function jogoDe(gid) { return window.MB_JOGOS.find(j => j.id === gid); }
  function respostaActual(gid) { const s = MB.estado()[gid]; return jogoDe(gid).niveis[s.nivel][s.round].resposta; }
  function clicarCerto(gid) {
    const r = respostaActual(gid);
    const b = $$('[data-accao="quiz-resp"]').find(x => x.dataset.v === String(r));
    clicar(b);
  }

  MB.ir('q1');
  ok(MB.estado().ecra === 'q1', 'entra no jogo q1');
  ok(!!$('#timer-barra'), 'q1 tem barra de cronómetro');
  ok($$('[data-accao="quiz-resp"]').length === 4, 'q1 mostra 4 opções');
  ok($$('.qnivel').length === 3, 'mostra os 3 níveis no progresso');

  // acertar os 3 rounds do nível 1 -> sobe ao nível 2
  clicarCerto('q1'); await esperar(900);
  ok(MB.estado().q1.round === 1, 'acertar avança de round (round=1)');
  clicarCerto('q1'); await esperar(900);
  clicarCerto('q1'); await esperar(1300);
  ok(MB.estado().q1.nivel === 1 && MB.estado().q1.round === 0, 'completar 3 rounds sobe ao nível 2');

  // errar no nível 2 -> desce ao nível 1 + mascote
  const rq1 = respostaActual('q1');
  clicar($$('[data-accao="quiz-resp"]').find(x => x.dataset.v !== String(rq1)));
  await esperar(800);
  ok(MB.estado().q1.nivel === 0 && MB.estado().q1.round === 0, 'errar no nível 2 desce ao nível 1');
  ok(MB.estado().mascote.aberta, 'ao descer de nível abre a mascote');
  MB.fecharMascote();

  // completar o jogo inteiro (9 acertos) -> volta à categoria do jogo
  MB.ir('q2');
  for (let k = 0; k < 9; k++) { clicarCerto('q2'); await esperar(k % 3 === 2 ? 1300 : 900); }
  await esperar(600);
  ok(MB.estado().ecra === 'cat:div', 'completar os 3 níveis volta à categoria (cat:div)');

  // visuais
  grupo('QUIZ — visuais');
  MB.ir('q6'); ok(!!$('.horta-svg'), 'q6 (Perímetro/Área) desenha o retângulo com medidas');
  MB.ir('q7'); ok($$('.castelo-col').length >= 4, 'q7 (Sequências) desenha as barras da sequência');
  MB.ir('q8'); ok(!!$('.angulo-svg') || $$('[data-accao="quiz-resp"]').length === 4, 'q8 (Ângulos) mostra o ângulo/opções');
  MB.ir('q9');
  const linhas9 = $$('.pic-linha');
  ok(linhas9.length === 3, 'q9 (Gráficos) 1ª ronda é pictograma com 3 linhas');
  const icones9 = linhas9.map(l => (l.querySelector('.pic-simb') || {}).textContent);
  ok(new Set(icones9).size >= 2, 'as linhas do pictograma usam ícones DIFERENTES (maçã/laranja/pera), não todos iguais');
  MB.ir('home');

  // ==================================================================
  // MOTOR DOMINÓ — q14/q15 (corre no motor de quiz: timer + níveis + descida)
  // ==================================================================
  grupo('MOTOR DOMINÓ — equivalências');
  ok(!!jogoDe('q14'), 'q14 (Dominó de Frações) existe em MB_JOGOS');
  ok(!!jogoDe('q15'), 'q15 (Dominó Decimal) existe em MB_JOGOS');
  ok(!!MB.estado().q14, 'q14 tem estado inicial (chaveado pelo id real)');
  MB.ir('q14');
  ok(MB.estado().ecra === 'q14', 'entra no q14');
  ok(!!$('.domino-peca'), 'q14 desenha a peça de dominó');
  ok(!!$('#timer-barra'), 'q14 herda o cronómetro do motor de quiz');
  ok($$('[data-accao="quiz-resp"]').length === 4, 'q14 mostra 4 meias-peças');
  clicarCerto('q14'); await esperar(900);
  ok(MB.estado().q14.round === 1, 'acertar a equivalência avança de round');
  clicarCerto('q14'); await esperar(900);
  clicarCerto('q14'); await esperar(1300);
  ok(MB.estado().q14.nivel === 1 && MB.estado().q14.round === 0, 'completar o nível 1 sobe ao nível 2');
  const rq14 = respostaActual('q14');
  clicar($$('[data-accao="quiz-resp"]').find(x => x.dataset.v !== String(rq14)));
  await esperar(800);
  ok(MB.estado().q14.nivel === 0, 'errar desce de nível (despromoção mantida — decisão B do Carlos)');
  MB.fecharMascote();
  MB.ir('q15');
  ok(!!$('.domino-peca'), 'q15 (Dominó Decimal) também desenha a peça');
  ok($$('[data-accao="quiz-resp"]').length === 4, 'q15 mostra 4 meias-peças');
  MB.ir('home');

  // ==================================================================
  // MOTOR MEMÓRIA DE PARES — m1/m2/m3 (tabuleiro, níveis, cronómetro, descida)
  // ==================================================================
  grupo('MOTOR MEMÓRIA — pares e equivalências');
  ok(!!window.MB_MEMORIA && window.MB_MEMORIA.length === 3, 'há 3 jogos de memória (m1,m2,m3)');
  MB.ir('m1');
  ok(MB.estado().ecra === 'm1', 'entra no m1');
  ok(!!MB.estado().mem.m1, 'm1 monta o tabuleiro ao entrar');
  ok($$('.mem-carta').length === 8, 'nível 1 = 8 cartas (4 pares)');
  ok(!!$('#timer-barra'), 'm1 tem cronómetro (decisão B)');

  const cartas = MB.estado().mem.m1.cartas;
  const doisDoPar = p => { const r = []; cartas.forEach((c, i) => { if (c.par === p) r.push(i); }); return r; };
  const cartaEl = i => $(`[data-accao="mem-virar"][data-idx="${i}"]`);

  // par certo -> resolve
  let [a0, b0] = doisDoPar(0);
  clicar(cartaEl(a0));
  ok(MB.estado().mem.m1.viradas.length === 1, 'virar 1 carta regista a virada');
  clicar(cartaEl(b0));
  ok(MB.estado().mem.m1.resolvidos.indexOf(0) >= 0, 'duas cartas do mesmo par ficam resolvidas');

  // par errado -> bloqueia e volta a fechar
  clicar(cartaEl(doisDoPar(1)[0]));
  clicar(cartaEl(doisDoPar(2)[0]));
  ok(MB.estado().mem.m1.bloqueado === true, 'duas cartas diferentes bloqueiam o tabuleiro');
  await esperar(950);
  ok(MB.estado().mem.m1.viradas.length === 0 && !MB.estado().mem.m1.bloqueado, 'cartas erradas voltam a fechar');

  // limpar o resto do nível -> sobe de nível
  [1, 2, 3].forEach(p => { const [x, y] = doisDoPar(p); clicar(cartaEl(x)); clicar(cartaEl(y)); });
  await esperar(1600);
  ok(MB.estado().mem.m1.nivel === 1, 'limpar o nível 1 sobe ao nível 2');
  ok($$('.mem-carta').length === 10, 'nível 2 = 10 cartas (5 pares)');
  MB.ir('home');

  // -------------------------------------------------------- Cronómetro (núcleo)
  grupo('CRONÓMETRO');
  let esgotou = false;
  MB.iniciarTimer(0.2, () => { esgotou = true; });
  await esperar(400);
  ok(esgotou, 'o cronómetro chama aoEsgotar quando o tempo acaba');
  MB.pararTimer();


  // ==================================================================
  // MOTORES TÁCTEIS — reta (r*), crivo (c*), fusão (f*)
  // O que estes testes protegem é o GATE PEDAGÓGICO: sem cronómetro,
  // sem despromoção, errar dá dica e deixa repetir. Se alguém um dia
  // voltar a pôr o relógio nestes ecrãs, isto falha aqui e não na escola.
  // ==================================================================
  grupo('MOTORES TÁCTEIS — registo e contrato');
  ok(!!window.MB_MOTOR, 'motores.js regista-se em window.MB_MOTOR');
  ok((window.MB_MOTORES_JOGOS || []).length === 7, '7 jogos novos nos dados dos motores');
  ok(window.MB_MOTOR.ehMeu('r1') && !window.MB_MOTOR.ehMeu('q1'),
     'ehMeu reconhece os seus e não rouba os dos outros');
  ok(window.MB_MOTOR.semTimer === true, 'o motor declara-se sem cronómetro');
  // todos os jogos dos motores têm de estar no menu, senão ninguém lá chega
  const semMenu = window.MB_MOTORES_JOGOS
    .filter(j => !D.categorias.some(c => c.jogos.some(x => x.ecra === j.id)))
    .map(j => j.id);
  ok(semMenu.length === 0, 'os 7 jogos estão no menu por categorias' +
     (semMenu.length ? ' (fora: ' + semMenu.join(', ') + ')' : ''));

  grupo('MOTOR RETA NUMÉRICA (r1)');
  MB.ir('r1');
  ok(MB.estado().ecra === 'r1', 'entra no r1');
  ok(!!MB.estado().mot && !!MB.estado().mot.r1, 'r1 monta o estado ao entrar');
  ok(!!$('.rt-zona'), 'desenha a reta');
  ok(!$('#timer-barra'), 'r1 NÃO tem cronómetro (gate pedagógico)');
  const r1r = window.MB_MOTORES_JOGOS.find(j => j.id === 'r1').niveis[0][0];

  // toque longe do sítio certo -> erro, dica, e continua no mesmo round
  clicarEm($('.rt-zona'), 8);
  ok(MB.estado().mot.r1.valor != null, 'tocar na reta pousa a etiqueta');
  clicar($('[data-accao="rt-confirmar"]'));
  await esperar(50);
  ok(MB.estado().mot.r1.erro === true, 'errar marca erro');
  ok(MB.estado().mascote.aberta, 'errar abre a mascote com a dica');
  ok(MB.estado().mot.r1.round === 0 && MB.estado().mot.r1.nivel === 0,
     'errar NÃO faz descer de nível nem saltar round');

  // toque no sítio certo -> acerta e deixa seguir
  const fracCerta = (r1r.valor - r1r.min) / (r1r.max - r1r.min);
  clicarEm($('.rt-zona'), Math.round(fracCerta * 300));
  clicar($('[data-accao="rt-confirmar"]'));
  ok(MB.estado().mot.r1.feito === true, 'acertar dentro da tolerância marca feito');
  clicar($('[data-accao="mot-seguir"]'));
  ok(MB.estado().mot.r1.round === 1, 'seguir avança de round');

  grupo('MOTOR CRIVO (c2 — primos)');
  MB.ir('c2');
  ok(!!$('.cv-grelha'), 'desenha a grelha do crivo');
  ok(!$('#timer-barra'), 'c2 NÃO tem cronómetro (gate pedagógico)');
  const c2r = window.MB_MOTORES_JOGOS.find(j => j.id === 'c2').niveis[0][0];
  const cel = n => $$('.cv-cel').find(b => +b.dataset.n === n);
  const errado = (() => { for (let n = c2r.de; n <= c2r.ate; n++) if (c2r.certos.indexOf(n) < 0) return n; })();
  clicar(cel(errado));
  await esperar(50);
  ok(MB.estado().mascote.aberta, 'tocar num errado dá dica');
  await esperar(1000);
  ok(MB.estado().mot.c2.tocados.indexOf(errado) < 0, 'a marca do errado apaga-se sozinha');
  c2r.certos.forEach(n => { const b = cel(n); if (b) clicar(b); });
  ok(MB.estado().mot.c2.feito === true, 'apanhar todos os certos fecha o round');

  grupo('MOTOR FUSÃO PARA ALVO (f1 — chega ao 24)');
  MB.ir('f1');
  ok(!!$('.fu-pecas'), 'desenha as parcelas');
  ok(!$('#timer-barra'), 'f1 NÃO tem cronómetro (gate pedagógico)');
  const f1r = window.MB_MOTORES_JOGOS.find(j => j.id === 'f1').niveis[0][0];
  ok($('[data-accao="fu-confirmar"]').hasAttribute('disabled'),
     'confirmar está travado enquanto a soma não bate certo');
  // procurar um subconjunto que soma o alvo (o gerador garante que existe)
  const sub = (() => {
    const N = f1r.numeros;
    for (let m = 1; m < (1 << N.length); m++) {
      let s = 0, idx = [];
      for (let i = 0; i < N.length; i++) if (m & (1 << i)) { s += N[i]; idx.push(i); }
      if (s === f1r.alvo) return idx;
    }
    return null;
  })();
  ok(!!sub, 'existe combinação que dá o alvo (invariante do gerador)');
  sub.forEach(i => clicar($$('.fu-peca')[i]));
  ok(!$('[data-accao="fu-confirmar"]').hasAttribute('disabled'),
     'com a soma exacta o confirmar destrava');
  clicar($('[data-accao="fu-confirmar"]'));
  ok(MB.estado().mot.f1.feito === true, 'confirmar com a soma certa fecha o round');
  MB.ir('home');

  // ---------------------------------------------------------- som
  grupo('SOM');
  MB.ir('home');
  const somAntes = MB.estado().som;
  clicar($('[data-accao="som"]'));
  ok(MB.estado().som !== somAntes, 'botão de som alterna');

  // ---------------------------------------------------------- resumo
  console.log('\n' + '='.repeat(50));
  console.log(`RESULTADO: ${passes} passaram, ${falhas} falharam`);
  console.log('='.repeat(50));
  process.exit(falhas ? 1 : 0);
})();
