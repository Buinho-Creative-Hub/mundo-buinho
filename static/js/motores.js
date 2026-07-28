/* Mundo Buinho — motores novos: Reta numérica · Crivo · Fusão para alvo
   Buinho FabLab, Messejana · CC-BY-SA 4.0
   Handoff Magalhães 2026-07-24 ("constrói +22 jogos, por motor").

   POR QUE É QUE ISTO É UM FICHEIRO À PARTE
   O jogos.js tem os motores antigos (quiz, memória, biofab) e já é grande. Um
   motor novo não precisa de lá entrar: regista-se em MB_MOTOR e o jogos.js só
   pergunta "isto é teu?". Assim um motor novo nunca parte um motor velho — e
   podem ser construídos em paralelo sem conflitos de merge.

   ⚠️ O GATE PEDAGÓGICO ESTÁ AQUI DENTRO, NÃO NOS DADOS
   Estes três motores são TÁCTEIS. Decisão do handoff das mecânicas, cruzada com
   a doutrina maker-neurodiversidade v3:
     · SEM cronómetro e SEM despromoção — errar não faz descer de nível;
     · errar acende, dá DICA da mascote, e deixa tentar outra vez;
     · a dificuldade vem da matemática, não do relógio.
   Se algum dia se quiser modo desafio com tempo, é um campo por jogo e opcional.
   Não voltar a pôr o relógio por defeito: foi decisão pedagógica, não estética.
*/
(function (w) {
  'use strict';

  const JOGOS = () => (w.MB_MOTORES_JOGOS || []);
  const jogo = gid => JOGOS().find(j => j.id === gid);
  const esc = s => String(s).replace(/[&<>"]/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------------------------------------------------------------- estado
  // Um saco por jogo dentro do estado global, como o motor de memória faz.
  function st(gid) { return (MB.estado().mot || {})[gid]; }
  function setSt(gid, patch) {
    MB.set(s => {
      const mot = Object.assign({}, s.mot);
      mot[gid] = Object.assign({}, mot[gid], patch);
      return { mot: mot };
    });
  }

  function round(gid) {
    const j = jogo(gid), S = st(gid);
    if (!j || !S) return null;
    return j.niveis[S.nivel][S.round];
  }

  function iniciar(gid, nivel) {
    const j = jogo(gid); if (!j) return;
    setSt(gid, {
      nivel: nivel || 0, round: 0, feito: false, erro: false,
      valor: null, tocados: [], escolhidos: []
    });
  }

  // Avançar. Sem despromoção: quando acerta, segue; quando erra, repete o mesmo.
  function avancar(gid) {
    const j = jogo(gid), S = st(gid);
    const rounds = j.niveis[S.nivel];
    if (S.round + 1 < rounds.length) {
      MB.sfx.certo();
      setSt(gid, { round: S.round + 1, feito: false, erro: false,
                   valor: null, tocados: [], escolhidos: [] });
      return;
    }
    if (S.nivel >= j.niveis.length - 1) {
      MB.celebrar('🏆', 'Ganhaste o jogo!');
      setTimeout(() => MB.ir(catDe(gid) ? 'cat:' + catDe(gid) : 'home'), 1400);
    } else {
      MB.celebrar('⭐', 'Nível ' + (S.nivel + 2) + '!');
      setTimeout(() => iniciar(gid, S.nivel + 1), 1400);
    }
  }

  function errar(gid, texto) {
    MB.sfx.errado();
    setSt(gid, { erro: true });
    // A dica é a mecânica de correcção. Não há descida de nível: o handoff das
    // mecânicas é explícito — descer ao errar deprime quem tem ansiedade.
    MB.set({ mascote: { aberta: true, aCarregar: false, texto: '💡 ' + texto } });
  }

  function catDe(gid) {
    const j = jogo(gid);
    return j ? j.cat : null;
  }

  // ------------------------------------------------------------ topo comum
  function cabecalho(gid) {
    const j = jogo(gid), S = st(gid);
    const rounds = j.niveis[S.nivel].length;
    return `<div class="topo">
      <button class="btn-redondo" data-accao="voltar" aria-label="Voltar">←</button>
      <div style="flex:1">
        <h1 class="topo-titulo">${esc(j.nome)}</h1>
        <p class="topo-sub">Nível ${S.nivel + 1} · ${S.round + 1}/${rounds}</p>
      </div>
      <button class="btn-redondo" data-accao="mot-dica" data-g="${gid}"
              aria-label="Pedir uma dica">💡</button>
    </div>`;
  }

  // ====================================================== MOTOR: RETA NUMÉRICA
  // Arrasta a etiqueta para o sítio certo da reta. A tolerância vem dos dados —
  // o dedo de uma criança não acerta no pixel e isso não é matemática.
  function vistaReta(gid) {
    const S = st(gid), r = round(gid);
    const marcas = [];
    const n = Math.round((r.max - r.min) / r.passo);
    for (let i = 0; i <= n; i++) {
      const v = r.min + i * r.passo;
      const pc = ((v - r.min) / (r.max - r.min)) * 100;
      const rotulo = Number.isInteger(v) ? String(v)
        : String(Math.round(v * 100) / 100).replace('.', ',');
      marcas.push(`<div class="rt-marca" style="left:${pc}%">
        <span class="rt-tick"></span><span class="rt-num">${rotulo}</span></div>`);
    }
    const pos = S.valor == null ? null
      : ((S.valor - r.min) / (r.max - r.min)) * 100;

    return `${cabecalho(gid)}
      <div class="mot-pergunta">${esc(r.pergunta)}</div>
      <div class="rt-zona" data-accao="rt-pousar" data-g="${gid}">
        <div class="rt-linha"></div>
        ${marcas.join('')}
        ${pos == null ? '' : `<div class="rt-pin ${S.feito ? 'ok' : (S.erro ? 'mal' : '')}"
             style="left:${pos}%">${esc(r.etiqueta)}</div>`}
      </div>
      ${S.valor == null
        ? `<div class="rt-etiqueta-fora">Toca na reta onde achas que fica
             <b>${esc(r.etiqueta)}</b></div>`
        : (S.feito
            ? `<button class="btn-grande" data-accao="mot-seguir" data-g="${gid}">Seguinte →</button>`
            : `<button class="btn-grande" data-accao="rt-confirmar" data-g="${gid}">Confirmar</button>`)}`;
  }

  function rtPousar(ev, gid) {
    const S = st(gid); if (S.feito) return;
    const r = round(gid);
    const zona = ev.target.closest('.rt-zona');
    if (!zona) return;
    const cx = ev.clientX != null ? ev.clientX : (ev.touches && ev.touches[0].clientX);
    const cr = zona.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (cx - cr.left) / cr.width));
    MB.sfx.toque();
    setSt(gid, { valor: r.min + frac * (r.max - r.min), erro: false });
  }

  function rtConfirmar(gid) {
    const S = st(gid), r = round(gid);
    if (S.valor == null) return;
    // O que conta é a distância ao valor certo, na escala da reta.
    const alvo = r.alvoArredondado != null ? r.alvoArredondado : r.valor;
    if (Math.abs(S.valor - alvo) <= r.tolerancia) {
      setSt(gid, { feito: true, erro: false, valor: alvo });
      MB.sfx.certo();
    } else {
      errar(gid, r.dica);
    }
  }

  // ============================================================= MOTOR: CRIVO
  // Grelha do 100. Toca em todos os que servem. Tocar num errado acende a
  // vermelho e dá dica — não tira pontos nem faz descer.
  function vistaCrivo(gid) {
    const S = st(gid), r = round(gid);
    const cels = [];
    for (let n = r.de; n <= r.ate; n++) {
      const tocado = S.tocados.indexOf(n) >= 0;
      const certo = r.certos.indexOf(n) >= 0;
      const cls = tocado ? (certo ? 'ok' : 'mal') : '';
      cels.push(`<button class="cv-cel ${cls}" data-accao="cv-tocar"
                   data-g="${gid}" data-n="${n}" ${tocado && certo ? 'disabled' : ''}>${n}</button>`);
    }
    const acertados = S.tocados.filter(x => r.certos.indexOf(x) >= 0).length;
    return `${cabecalho(gid)}
      <div class="mot-pergunta">${esc(r.pergunta)}</div>
      <div class="cv-contador">${acertados} de ${r.certos.length}</div>
      <div class="cv-grelha" style="--cols:10">${cels.join('')}</div>
      ${S.feito ? `<button class="btn-grande" data-accao="mot-seguir" data-g="${gid}">Seguinte →</button>` : ''}`;
  }

  function cvTocar(gid, n) {
    const S = st(gid), r = round(gid);
    if (S.feito) return;
    if (S.tocados.indexOf(n) >= 0 && r.certos.indexOf(n) >= 0) return;
    const tocados = S.tocados.concat([n]);
    if (r.certos.indexOf(n) >= 0) {
      MB.sfx.toque();
      const acertados = tocados.filter(x => r.certos.indexOf(x) >= 0);
      const completo = acertados.length === r.certos.length;
      setSt(gid, { tocados: tocados, erro: false, feito: completo });
      if (completo) MB.sfx.certo();
    } else {
      setSt(gid, { tocados: tocados });
      errar(gid, r.dica);
      // o errado apaga-se sozinho — fica a marca do momento, não um castigo
      setTimeout(() => {
        const cur = st(gid); if (!cur) return;
        setSt(gid, { tocados: cur.tocados.filter(x => x !== n) });
      }, 900);
    }
  }

  // ==================================================== MOTOR: FUSÃO PARA ALVO
  // Escolhe parcelas até somar exactamente o alvo. Passar do alvo não é derrota:
  // avisa e deixa tirar.
  function vistaFusao(gid) {
    const S = st(gid), r = round(gid);
    const soma = S.escolhidos.reduce((a, i) => a + r.numeros[i], 0);
    const pecas = r.numeros.map((v, i) => {
      const on = S.escolhidos.indexOf(i) >= 0;
      return `<button class="fu-peca ${on ? 'on' : ''}" data-accao="fu-peca"
                data-g="${gid}" data-i="${i}">${v}</button>`;
    }).join('');
    const estado = soma === r.alvo ? 'ok' : (soma > r.alvo ? 'mal' : '');
    return `${cabecalho(gid)}
      <div class="mot-pergunta">${esc(r.pergunta)}</div>
      <div class="fu-alvo ${estado}">
        <span class="fu-soma">${soma}</span>
        <span class="fu-de">de ${r.alvo}</span>
      </div>
      <div class="fu-pecas">${pecas}</div>
      ${soma > r.alvo ? `<p class="fu-aviso">Passaste ${soma - r.alvo}. Tira uma peça.</p>` : ''}
      ${S.feito
        ? `<button class="btn-grande" data-accao="mot-seguir" data-g="${gid}">Seguinte →</button>`
        : `<button class="btn-grande" data-accao="fu-confirmar" data-g="${gid}"
             ${soma === r.alvo ? '' : 'disabled'}>Confirmar</button>`}`;
  }

  function fuPeca(gid, i) {
    const S = st(gid); if (S.feito) return;
    MB.sfx.toque();
    const tem = S.escolhidos.indexOf(i) >= 0;
    setSt(gid, {
      escolhidos: tem ? S.escolhidos.filter(x => x !== i) : S.escolhidos.concat([i]),
      erro: false
    });
  }

  function fuConfirmar(gid) {
    const S = st(gid), r = round(gid);
    const soma = S.escolhidos.reduce((a, i) => a + r.numeros[i], 0);
    if (soma === r.alvo) { setSt(gid, { feito: true }); MB.sfx.certo(); }
    else errar(gid, r.dica);
  }

  // ------------------------------------------------------------- integração
  // Contrato com o jogos.js: ehMeu / vista / accao. Nada mais.
  w.MB_MOTOR = {
    ehMeu: function (ecra) { return !!jogo(ecra); },

    // O jogos.js pergunta ANTES de desenhar. Se o tabuleiro ainda não existe,
    // manda iniciar e sai — iniciar() faz MB.set, que já re-desenha. Sem isto,
    // desenhar dentro do render volta a entrar no render (foi o que o motor de
    // memória também teve de resolver).
    pronto: function (gid) { return !!st(gid); },
    iniciar: iniciar,

    vista: function (gid) {
      if (!st(gid)) { iniciar(gid, 0); }
      const j = jogo(gid);
      if (j.motor === 'reta') return vistaReta(gid);
      if (j.motor === 'crivo') return vistaCrivo(gid);
      if (j.motor === 'fusao') return vistaFusao(gid);
      return '<div class="estado">motor desconhecido</div>';
    },

    // devolve true se tratou a acção (o jogos.js não precisa de saber mais)
    accao: function (a, el, ev) {
      const gid = el && el.dataset ? el.dataset.g : null;
      if (!gid || !jogo(gid)) return false;
      switch (a) {
        case 'rt-pousar':    rtPousar(ev, gid); return true;
        case 'rt-confirmar': rtConfirmar(gid); return true;
        case 'cv-tocar':     cvTocar(gid, +el.dataset.n); return true;
        case 'fu-peca':      fuPeca(gid, +el.dataset.i); return true;
        case 'fu-confirmar': fuConfirmar(gid); return true;
        case 'mot-seguir':   avancar(gid); return true;
        case 'mot-dica':     MB.set({ mascote: { aberta: true, aCarregar: false,
                               texto: '💡 ' + round(gid).dica } }); return true;
        default: return false;
      }
    },

    // para o jogos.js saber que estes ecrãs não levam cronómetro
    semTimer: true
  };
})(window);
