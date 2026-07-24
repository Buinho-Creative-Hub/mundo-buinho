/* Mundo Buinho — núcleo
   Buinho FabLab, Messejana · CC-BY-SA 4.0

   Estado global, som, arrasto por toque, mascote e celebração.
   Portado do protótipo Claude Design (runtime <sc-if>/<sc-for> não existe fora dela). */

(function (global) {
  'use strict';

  // ---------------------------------------------------------------- estado
  const estadoInicial = () => Object.assign({
    ecra: 'home',
    som: true,
    mascote: { aberta: false, aCarregar: false, texto: '' },
    celebracao: null,
    g1: { doses: { agua: 0, agar: 0, glic: 0 } },
    g2: { fase: 'ordem', slots: [null, null, null, null], pool: baralhar([0, 1, 2, 3]), ligados: {} },
    g3: { idx: 0, errado: null, aResolver: false },
    g4: { idx: 0, terminado: false },
    g5: { desafioIdx: 0, cor: '#6B8F3E', espessura: 8 }
  }, estadoQuiz());

  // Estado dos 10 jogos de matemática (motor de quiz com níveis + cronómetro).
  // Cada jogo: nivel 0..2, round 0..2. Ao perder, desce um nível (round=0).
  function estadoQuiz() {
    const q = {};
    const n = (window.MB_JOGOS && window.MB_JOGOS.length) || 13;
    for (let i = 1; i <= n; i++) q['q' + i] = { nivel: 0, round: 0, errado: null, aResolver: false };
    return q;
  }

  let S = estadoInicial();
  const ouvintes = [];

  function baralhar(a) {
    const x = a.slice();
    for (let i = x.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [x[i], x[j]] = [x[j], x[i]];
    }
    return x;
  }

  /** Actualiza estado. Aceita objecto ou função, como o setState do protótipo. */
  function set(patch) {
    const delta = typeof patch === 'function' ? patch(S) : patch;
    S = Object.assign({}, S, delta);
    ouvintes.forEach(f => f(S));
  }

  function estado() { return S; }
  function aoMudar(f) { ouvintes.push(f); }
  function reiniciar() { S = estadoInicial(); ouvintes.forEach(f => f(S)); }

  // ------------------------------------------------------------------ som
  let _ac = null;
  function audio() {
    if (!_ac) {
      try { _ac = new (global.AudioContext || global.webkitAudioContext)(); }
      catch (e) { _ac = null; }
    }
    return _ac;
  }

  function tom(freq, dur, tipo, atraso, vol) {
    if (!S.som) return;
    const ac = audio();
    if (!ac) return;
    try {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = tipo || 'sine';
      o.frequency.value = freq;
      g.gain.value = vol == null ? 0.1 : vol;
      o.connect(g); g.connect(ac.destination);
      const t = ac.currentTime + (atraso || 0);
      o.start(t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.stop(t + dur + 0.02);
    } catch (e) { /* som é acessório: nunca parte o jogo */ }
  }

  const sfx = {
    toque:  () => tom(440, 0.06, 'sine', 0, 0.1),
    errado: () => { tom(196, 0.22, 'sawtooth', 0, 0.12); tom(155, 0.26, 'sawtooth', 0.1, 0.12); },
    certo:  () => { tom(523, 0.12, 'sine', 0, 0.12); tom(659, 0.12, 'sine', 0.1, 0.12); tom(784, 0.18, 'sine', 0.2, 0.12); }
  };

  // ------------------------------------------------------------- navegação
  function ir(ecra) {
    sfx.toque();
    set({ ecra, mascote: { aberta: false, aCarregar: false, texto: '' } });
  }

  function alternarSom() {
    set(s => ({ som: !s.som }));
    if (S.som) sfx.toque();
  }

  // ------------------------------------------------------------ celebração
  let _celTO = null;
  function celebrar(emoji, texto) {
    sfx.certo();
    set({ celebracao: { emoji, texto } });
    clearTimeout(_celTO);
    _celTO = setTimeout(() => set({ celebracao: null }), 1500);
  }

  // -------------------------------------------------------------- mascote
  /**
   * POST ao backend com timeout curto (AbortController). Devolve o JSON, ou lança.
   * O timeout é curto DE PROPÓSITO: a criança nunca espera pela rede — a frase
   * local já apareceu; isto é só a tentativa de a melhorar com a IA, em fundo.
   */
  function pedirAoServidor(rota, corpo, ms) {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), ms || 3500);
    return fetch(rota, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
      signal: ctrl.signal
    })
      .then(r => r.json())
      .then(d => { clearTimeout(to); return d; },
            e => { clearTimeout(to); throw e; });
  }

  /**
   * Pede uma pista. INSTANTÂNEO e OFFLINE: mostra já uma frase local; se houver
   * IA montada e a rede responder depressa, substitui pela pista da IA.
   */
  async function pedirDica(contexto) {
    // 1) frase local imediata — sem spinner, sem espera, funciona sem rede.
    set({ mascote: { aberta: true, aCarregar: false, texto: fallbackDica() } });
    // 2) em fundo, tenta uma pista melhor da IA (só substitui se vier MESMO da IA).
    try {
      const d = await pedirAoServidor('/api/dica', { contexto });
      if (d && d.fonte === 'mistral' && d.texto && d.texto.trim() && S.mascote.aberta) {
        set({ mascote: { aberta: true, aCarregar: false, texto: d.texto.trim() } });
      }
    } catch (e) { /* offline/lento: a frase local já está no ecrã */ }
  }

  async function avaliarDesenho(base64, desafio) {
    // Elogio local imediato; a IA (se houver) comenta o desenho logo a seguir.
    set({ mascote: { aberta: true, aCarregar: false, texto: fallbackElogio() } });
    try {
      const d = await pedirAoServidor('/api/desenho', { imagem: base64, desafio });
      if (d && d.fonte === 'mistral' && d.texto && d.texto.trim() && S.mascote.aberta) {
        set({ mascote: { aberta: true, aCarregar: false, texto: d.texto.trim() } });
      }
    } catch (e) { /* sem rede: o elogio local já foi mostrado */ }
  }

  function fecharMascote() {
    set({ mascote: { aberta: false, aCarregar: false, texto: '' } });
  }

  // Fallbacks do lado do cliente — se nem o servidor responder (rede caiu).
  const DICAS = [
    'Hmm, quase! Olha outra vez com calma e conta devagarinho. Tu consegues! 🌱',
    'Pensa bem: o que é que muda quando fazes de outra maneira? Experimenta!',
    'Boa tentativa! Volta a ler o desafio e imagina passo a passo. Estou aqui contigo.'
  ];
  const ELOGIOS = [
    'Que giro o teu desenho! Vê-se que puseste cuidado. E se juntasses mais uns pormenores da natureza? 🌱',
    'Adorei as tuas cores! Conta-me com o traço o que acontece a seguir na tua folha.',
    'Muito bem! O teu desenho tem vida. Experimenta acrescentar a terra por baixo, para ele voltar ao solo.'
  ];
  const fallbackDica   = () => DICAS[(Math.random() * DICAS.length) | 0];
  const fallbackElogio = () => ELOGIOS[(Math.random() * ELOGIOS.length) | 0];

  // ---------------------------------------------------------- arrasto touch
  /**
   * Arrasto com Pointer Events — funciona com dedo, rato e caneta.
   * O protótipo usava mouse events; em tablet isso não chega.
   * @param ev     evento pointerdown
   * @param visual {cor, icone, etiqueta} para o fantasma
   * @param aoLargar callback(elementoAlvo) -> void
   */
  function iniciarArrasto(ev, visual, aoLargar) {
    ev.preventDefault();
    sfx.toque();

    const fantasma = document.createElement('div');
    fantasma.className = 'fantasma';
    fantasma.style.background = visual.cor || 'var(--azul)';
    fantasma.style.left = ev.clientX + 'px';
    fantasma.style.top = ev.clientY + 'px';
    fantasma.innerHTML =
      (visual.icone ? '<span style="font-size:22px">' + visual.icone + '</span>' : '') +
      '<span>' + (visual.etiqueta || '') + '</span>';
    document.body.appendChild(fantasma);

    const mover = e => {
      fantasma.style.left = e.clientX + 'px';
      fantasma.style.top = e.clientY + 'px';
    };

    const largar = e => {
      document.removeEventListener('pointermove', mover);
      document.removeEventListener('pointerup', largar);
      document.removeEventListener('pointercancel', largar);
      fantasma.remove();
      // elementFromPoint é o que permite largar em qualquer alvo sem HTML5 DnD
      const alvo = document.elementFromPoint(e.clientX, e.clientY);
      try { aoLargar(alvo); } catch (err) { console.error(err); }
    };

    document.addEventListener('pointermove', mover);
    document.addEventListener('pointerup', largar);
    document.addEventListener('pointercancel', largar);
  }

  // ---------------------------------------------------------- cronómetro
  // Conta decrescente para os jogos-quiz (estilo Hypatiamat). Actualiza um
  // elemento do DOM directamente (sem passar pelo ciclo de render, senão
  // re-renderizava o ecrã 10x por segundo). Ao esgotar, chama aoEsgotar().
  let _tId = null, _tFim = 0, _tDur = 0, _tCb = null, _tFrac = 1, _tSeg = 0;

  function _pintarTimer() {
    const bar = document.getElementById('timer-barra');
    const num = document.getElementById('timer-num');
    if (bar) {
      bar.style.width = (_tFrac * 100).toFixed(1) + '%';
      bar.style.background = _tFrac < 0.25 ? 'var(--laranja)' : (_tFrac < 0.5 ? 'var(--sol,#f6b93b)' : 'var(--verde)');
    }
    if (num) num.textContent = _tSeg + 's';
  }

  function iniciarTimer(segundos, aoEsgotar) {
    pararTimer();
    _tDur = segundos * 1000;
    _tFim = Date.now() + _tDur;
    _tCb = aoEsgotar;
    _tFrac = 1; _tSeg = segundos;
    _pintarTimer();
    _tId = setInterval(() => {
      const resta = Math.max(0, _tFim - Date.now());
      _tFrac = _tDur ? resta / _tDur : 0;
      _tSeg = Math.ceil(resta / 1000);
      _pintarTimer();
      if (resta <= 0) {
        const cb = _tCb;        // capturar ANTES de pararTimer (que põe _tCb a null)
        pararTimer();
        if (cb) try { cb(); } catch (e) { /* nunca partir o jogo */ }
      }
    }, 100);
  }

  function pararTimer() {
    if (_tId) { clearInterval(_tId); _tId = null; }
    _tCb = null;
  }

  const timerFrac = () => _tFrac;
  const timerSeg = () => _tSeg;
  const timerActivo = () => _tId !== null;

  // ------------------------------------------------------------------ api
  global.MB = {
    estado, set, aoMudar, reiniciar, baralhar,
    sfx, ir, alternarSom, celebrar,
    pedirDica, avaliarDesenho, fecharMascote,
    iniciarArrasto,
    iniciarTimer, pararTimer, timerFrac, timerSeg, timerActivo
  };

})(window);
