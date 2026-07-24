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
['static/js/dados.js', 'static/js/nucleo.js', 'static/js/jogos.js'].forEach(f => {
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

// ---------------------------------------------------------------- arranque
grupo('ARRANQUE');
ok($('#app').innerHTML.length > 500, 'render inicial produz HTML');
ok(MB.estado().ecra === 'home', 'ecrã inicial é home');
ok($$('.nivel').length === 10, 'mapa mostra 10 níveis (tem ' + $$('.nivel').length + ')');

// níveis dentro da altura do mapa
const alturaMapa = parseInt($('.mapa').style.height);
const maxY = Math.max(...D.niveis.map(n => n.y));
ok(maxY < alturaMapa, `nível mais baixo (y=${maxY}) cabe no mapa (${alturaMapa}px)`);

// ---------------------------------------------------------------- navegação
grupo('NAVEGAÇÃO');
clicar($('[data-accao="ir"][data-ecra="g3"]'));
ok(MB.estado().ecra === 'g3', 'clicar no nível 3 navega para g3');
ok($('.enunciado').textContent.includes('laranjas'), 'g3 mostra a 1ª pergunta');

clicar($('[data-accao="voltar"]'));
ok(MB.estado().ecra === 'home', 'botão voltar regressa ao mapa');

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
  // JOGOS DE MATEMÁTICA — 4.º ano (6–10)
  // ==================================================================

  // -------------------------------------------------------- Jogo 6 (fração de quantidade)
  grupo('JOGO 6 — Fatias Certas (fração de uma quantidade)');
  MB.ir('g6');
  const p6 = D.g6[0];
  ok($$('.fruto').length === p6.total, 'g6 mostra ' + p6.total + ' objectos no 1º problema');
  // apanhar exactamente `resposta` = num/den*total
  for (let i = 0; i < p6.resposta; i++) clicar($('[data-accao="g6-apanhar"][data-i="' + i + '"]'));
  ok(MB.estado().g6.apanhadas.length === p6.resposta, 'apanha ' + p6.resposta + ' (=' + p6.rotulo + ' de ' + p6.total + ')');
  clicar($('[data-accao="g6-verificar"]'));
  ok(MB.estado().celebracao !== null, 'quantidade certa dispara celebração');
  await esperar(1200);
  ok(MB.estado().g6.idx === 1, 'avança para o problema 2 (idx=' + MB.estado().g6.idx + ')');
  // errado: apanhar a menos
  clicar($('[data-accao="g6-apanhar"][data-i="0"]'));
  clicar($('[data-accao="g6-verificar"]'));
  await esperar(50);
  ok(MB.estado().mascote.aberta, 'quantidade errada abre a mascote');

  // -------------------------------------------------------- Jogo 7 (troco)
  grupo('JOGO 7 — A Feira (troco com decimais)');
  MB.fecharMascote();
  MB.ir('g7');
  ok($$('.moeda').length === D.g7[0].tabuleiro.length, 'g7 mostra o tabuleiro de moedas');
  // dar o troco exacto (força bruta sobre o tabuleiro)
  function subsetQuePaga(vals, alvo) {
    for (let m = 1; m < (1 << vals.length); m++) {
      let s = 0, idx = [];
      for (let b = 0; b < vals.length; b++) if (m & (1 << b)) { s += vals[b]; idx.push(b); }
      if (s === alvo) return idx;
    }
    return null;
  }
  const idx7 = subsetQuePaga(D.g7[0].tabuleiro, D.g7[0].troco);
  ok(!!idx7, 'existe combinação para o troco de ' + D.g7[0].troco + ' cêntimos');
  idx7.forEach(i => clicar($('[data-accao="g7-moeda"][data-i="' + i + '"]')));
  clicar($('[data-accao="g7-pagar"]'));
  ok(MB.estado().celebracao !== null, 'troco certo dispara celebração');
  await esperar(1100);
  ok(MB.estado().g7.idx === 1, 'avança para a compra 2');
  // troco vazio = errado
  clicar($('[data-accao="g7-pagar"]'));
  await esperar(50);
  ok(MB.estado().mascote.aberta, 'troco errado abre a mascote');

  // -------------------------------------------------------- Jogo 8 (perímetro/área/inverso)
  grupo('JOGO 8 — A Horta Cercada (perímetro/área/inverso)');
  MB.fecharMascote();
  MB.ir('g8');
  ok($$('[data-accao="g8-resp"]').length === 4, 'g8 mostra 4 opções');
  ok(!!$('#timer-barra'), 'g8 mostra a barra do cronómetro');
  const btn8 = $$('[data-accao="g8-resp"]').find(b => +b.dataset.v === D.g8[0].resposta);
  ok(!!btn8, 'existe botão com a resposta certa (' + D.g8[0].resposta + ')');
  clicar(btn8);
  ok(MB.estado().celebracao !== null, 'resposta certa dispara celebração');
  await esperar(1000);
  ok(MB.estado().g8.idx === 1, 'avança para a horta 2');
  const btn8e = $$('[data-accao="g8-resp"]').find(b => +b.dataset.v !== D.g8[1].resposta);
  clicar(btn8e);
  await esperar(50);
  ok(MB.estado().mascote.aberta, 'resposta errada abre a mascote');

  // -------------------------------------------------------- Jogo 9 (sequências)
  grupo('JOGO 9 — Castelos na Areia (sequências)');
  MB.fecharMascote();
  MB.ir('g9');
  ok($$('.castelo-col').length === D.g9[0].termos.length + 1, 'g9 mostra os castelos + o incógnito');
  ok(!!$('#timer-barra'), 'g9 mostra a barra do cronómetro');
  const btn9 = $$('[data-accao="g9-resp"]').find(b => +b.dataset.v === D.g9[0].resposta);
  ok(!!btn9, 'existe botão com o próximo termo certo (' + D.g9[0].resposta + ')');
  clicar(btn9);
  ok(MB.estado().celebracao !== null, 'próximo termo certo dispara celebração');
  await esperar(1000);
  ok(MB.estado().g9.idx === 1, 'avança para a sequência 2');
  const btn9errado = $$('[data-accao="g9-resp"]').find(b => +b.dataset.v !== D.g9[1].resposta);
  clicar(btn9errado);
  await esperar(50);
  ok(MB.estado().mascote.aberta, 'termo errado abre a mascote');

  // -------------------------------------------------------- Jogo 10 (dados)
  grupo('JOGO 10 — O Gráfico da Turma (dados)');
  MB.fecharMascote();
  MB.ir('g10');
  ok($$('.pic-linha').length === D.g10[0].dados.length, 'g10 desenha o pictograma (1 linha por categoria)');
  const btn10 = $$('[data-accao="g10-resp"]').find(b => b.dataset.v === String(D.g10[0].resposta));
  ok(!!btn10, 'existe botão com a resposta certa do pictograma (' + D.g10[0].resposta + ')');
  clicar(btn10);
  ok(MB.estado().celebracao !== null, 'leitura certa do pictograma dispara celebração');
  await esperar(1000);
  ok(MB.estado().g10.idx === 1, 'avança para o gráfico 2 (barras)');
  ok($$('.graf-bar').length === D.g10[1].dados.length, 'o gráfico 2 usa barras');
  const btn10errado = $$('[data-accao="g10-resp"]').find(b => b.dataset.v !== String(D.g10[1].resposta));
  clicar(btn10errado);
  await esperar(50);
  ok(MB.estado().mascote.aberta, 'resposta errada abre a mascote');
  MB.fecharMascote();

  // -------------------------------------------------------- Cronómetro (núcleo)
  grupo('CRONÓMETRO');
  let esgotou = false;
  MB.iniciarTimer(0.2, () => { esgotou = true; });
  await esperar(400);
  ok(esgotou, 'o cronómetro chama aoEsgotar quando o tempo acaba');
  MB.pararTimer();

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
