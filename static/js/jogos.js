/* Mundo Buinho — vistas e lógica dos jogos
   Buinho FabLab, Messejana · CC-BY-SA 4.0 */

(function () {
  'use strict';

  const D = window.MB_DADOS;
  const raiz = () => document.getElementById('app');

  const MASCOTE_SVG = `<svg viewBox="0 0 100 100" aria-hidden="true">
    <path d="M50 88C24 88 14 68 16 48C18 30 32 16 50 16C68 16 82 30 84 48C86 68 76 88 50 88Z" fill="#2038A6"/>
    <path d="M50 20C50 8 58 2 68 4C64 14 58 20 50 22Z" fill="#6B8F3E"/>
    <circle cx="39" cy="52" r="8" fill="#FAF0E1"/><circle cx="61" cy="52" r="8" fill="#FAF0E1"/>
    <circle cx="41" cy="53" r="3.6" fill="#22201C"/><circle cx="59" cy="53" r="3.6" fill="#22201C"/>
    <path d="M40 68C45 74 55 74 60 68" stroke="#FAF0E1" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="30" cy="64" r="4" fill="#FA6415" opacity=".8"/><circle cx="70" cy="64" r="4" fill="#FA6415" opacity=".8"/>
  </svg>`;

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ------------------------------------------------------------ topo comum
  function topo(titulo, sub, comVoltar) {
    const S = MB.estado();
    return `<div class="topo">
      ${comVoltar
        ? `<button class="btn-redondo" data-accao="voltar" aria-label="Voltar ao mapa">←</button>`
        : `<div class="avatar">${MASCOTE_SVG.replace('<svg', '<svg style="width:38px;height:38px"')}</div>`}
      <div style="flex:1">
        <h1 class="topo-titulo">${esc(titulo)}</h1>
        ${sub ? `<p class="topo-sub">${esc(sub)}</p>` : ''}
      </div>
      <button class="btn-redondo" data-accao="som" aria-label="Ligar ou desligar o som">
        ${S.som ? '🔊' : '<span style="opacity:.5">🔇</span>'}
      </button>
    </div>`;
  }

  // ------------------------------------------------------------------ home
  // Menu por CATEGORIAS. Cada cartão abre a lista de jogos dessa categoria.
  function vistaHome() {
    const cards = D.categorias.map(c => `
      <button class="cat-card" data-accao="ir-cat" data-cat="${c.id}"
              style="--cor:${c.cor};--sombra:${c.sombra}">
        <span class="cat-icone" style="background:${c.cor};box-shadow:0 6px 0 ${c.sombra}">${c.icone}</span>
        <span class="cat-nome">${esc(c.nome)}</span>
        <span class="cat-n">${c.jogos.length} ${c.jogos.length === 1 ? 'jogo' : 'jogos'}</span>
      </button>`).join('');

    return `${topo('Mundo Buinho', 'Escolhe uma categoria', false)}
      <div class="home-mascote">
        <div class="mascote-bolha" style="width:64px;height:64px">
          ${MASCOTE_SVG.replace('<svg', '<svg style="width:48px;height:48px"')}
        </div>
        <span class="mapa-legenda">Em que queres treinar hoje?</span>
      </div>
      <div class="cats-grid">${cards}</div>`;
  }

  // ---------------------------------------------------------- categoria
  function catPorId(id) { return D.categorias.find(c => c.id === id); }
  function catDe(ecra) { const c = D.categorias.find(c => c.jogos.some(j => j.ecra === ecra)); return c ? c.id : null; }

  function vistaCategoria(id) {
    const c = catPorId(id);
    if (!c) return `${topo('Categoria', '', true)}<div class="painel"><p class="enunciado">Categoria não encontrada.</p></div>`;
    const cards = c.jogos.map(j => `
      <button class="jogo-card" data-accao="ir" data-ecra="${j.ecra}" style="--cor:${c.cor};--sombra:${c.sombra}">
        <span class="jogo-icone" style="background:${c.cor}">${c.icone}</span>
        <span class="jogo-txt">
          <span class="jogo-nome">${esc(j.nome)}</span>
          <span class="jogo-sub">${esc(j.sub || '')}</span>
        </span>
        <span class="jogo-seta" style="color:${c.sombra}">▶</span>
      </button>`).join('');
    return `${topo(c.icone + ' ' + c.nome, c.jogos.length + (c.jogos.length === 1 ? ' jogo' : ' jogos'), true)}
      <div class="jogos-lista">${cards}</div>`;
  }

  // ------------------------------------------- Jogo 1 — A Receita Certa
  function vistaG1() {
    const S = MB.estado();
    const a = S.g1.doses;
    const total = a.agua + a.agar + a.glic;
    const alvoTotal = D.g1.reduce((s, x) => s + x.alvo, 0);
    const alturaBar = alvoTotal ? Math.min(100, (total / alvoTotal) * 100) : 0;

    const linhas = D.g1.map(x => `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <button class="chip alvo" data-accao="g1-verter" data-id="${x.id}"
                style="flex:1;background:${x.cor};color:#fff;box-shadow:0 4px 0 rgba(0,0,0,.2)">
          <span>${esc(x.nome)}</span>
          <span style="margin-left:auto;font-family:Fredoka,sans-serif">+${x.passo}g</span>
        </button>
        <span style="font-family:Fredoka,sans-serif;font-weight:700;font-size:20px;min-width:70px;text-align:right">
          ${a[x.id]}g
        </span>
        <button class="btn-redondo" data-accao="g1-menos" data-id="${x.id}" aria-label="Tirar ${esc(x.nome)}">−</button>
      </div>`).join('');

    return `${topo('A Receita Certa', 'Arrasta ou toca para juntar', true)}
      <div class="painel">
        <p class="enunciado">Faz o biomaterial com as doses certas</p>
        <div style="display:flex;justify-content:center;margin-bottom:18px">
          <div id="taca" style="width:150px;height:120px;border-radius:0 0 60px 60px;background:var(--creme-escuro);
                      box-shadow:inset 0 -6px 0 var(--castanho-claro);position:relative;overflow:hidden">
            <div style="position:absolute;bottom:0;left:0;right:0;height:${alturaBar}%;
                        background:linear-gradient(180deg,#6B8F3E,#55722f);transition:height .35s ease"></div>
          </div>
        </div>
        ${linhas}
        <button class="botao verde" data-accao="g1-verificar" style="margin-top:8px">Verificar</button>
        <button class="botao-pequeno" data-accao="g1-ajuda" style="width:100%;margin-top:10px">Preciso de ajuda 🌱</button>
      </div>`;
  }

  function g1Verter(ev, id) {
    const ing = D.g1.find(x => x.id === id);
    MB.iniciarArrasto(ev, { cor: ing.cor, etiqueta: ing.nome }, alvo => {
      if (alvo && alvo.closest('#taca')) {
        MB.set(s => {
          const d = Object.assign({}, s.g1.doses);
          d[id] = Math.min(d[id] + ing.passo, ing.alvo * 3);
          return { g1: { doses: d } };
        });
      }
    });
  }

  function g1Menos(id) {
    const ing = D.g1.find(x => x.id === id);
    MB.sfx.toque();
    MB.set(s => {
      const d = Object.assign({}, s.g1.doses);
      d[id] = Math.max(0, d[id] - ing.passo);
      return { g1: { doses: d } };
    });
  }

  function g1Verificar() {
    const a = MB.estado().g1.doses;
    const ok = D.g1.every(x => a[x.id] === x.alvo);
    if (ok) {
      MB.celebrar('🧪', 'Receita perfeita!');
      setTimeout(() => MB.set({ g1: { doses: { agua: 0, agar: 0, glic: 0 } } }), 1500);
    } else {
      MB.sfx.errado();
      const fora = D.g1.filter(x => a[x.id] !== x.alvo)
        .map(x => x.nome + ' está em ' + a[x.id] + 'g (alvo ' + x.alvo + 'g)').join('; ');
      MB.pedirDica('No jogo A Receita Certa, a criança pôs doses erradas: ' + fora +
        '. Dá uma pista curta para ela olhar melhor os números, sem dizeres os valores certos.');
    }
  }

  // -------------------------------------- Jogo 2 — Do Lixo ao Material
  function vistaG2() {
    const S = MB.estado();

    if (S.g2.fase === 'ordem') {
      const slots = S.g2.slots.map((v, i) => `
        <div class="slot ${v !== null ? 'cheio' : ''}" data-slot="${i}">
          ${v !== null ? D.g2Passos[v].icone + ' ' + esc(D.g2Passos[v].etiqueta) : (i + 1) + 'º'}
        </div>`).join('');

      const pool = S.g2.pool.map(idx => `
        <button class="chip alvo" data-accao="g2-ordem" data-idx="${idx}">
          <span style="font-size:22px">${D.g2Passos[idx].icone}</span>
          <span>${esc(D.g2Passos[idx].etiqueta)}</span>
        </button>`).join('');

      return `${topo('Do Lixo ao Material', 'Põe os passos por ordem', true)}
        <div class="painel">
          <p class="enunciado">Qual é a ordem certa do processo?</p>
          <div class="grelha grelha-4" style="margin-bottom:18px">${slots}</div>
          <div class="grelha grelha-2">${pool}</div>
        </div>`;
    }

    // fase 'match'
    const ligadosM = {};
    Object.keys(S.g2.ligados).forEach(rid => {
      const p = D.g2Pares.find(x => x.rid === rid);
      if (p) ligadosM[p.mid] = true;
    });

    const residuos = D.g2Pares.map((p, i) => `
      <button class="chip alvo ${S.g2.ligados[p.rid] ? 'feito' : ''}" data-accao="g2-par" data-idx="${i}">
        <span style="font-size:22px">${p.rIcone}</span><span>${esc(p.rEtiqueta)}</span>
      </button>`).join('');

    const materiais = D.g2Pares.map(p => `
      <div class="chip ${ligadosM[p.mid] ? 'feito' : ''}" data-mid="${p.mid}"
           style="${ligadosM[p.mid] ? '' : 'background:rgba(32,56,166,.08);box-shadow:inset 0 0 0 2px var(--azul)'}">
        <span style="font-size:22px">${p.mIcone}</span><span>${esc(p.mEtiqueta)}</span>
      </div>`).join('');

    return `${topo('Do Lixo ao Material', 'Liga cada resíduo ao material', true)}
      <div class="painel">
        <p class="enunciado">Arrasta o resíduo para o material certo</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div style="display:flex;flex-direction:column;gap:10px">${residuos}</div>
          <div style="display:flex;flex-direction:column;gap:10px">${materiais}</div>
        </div>
      </div>`;
  }

  function g2Ordem(ev, idx) {
    const p = D.g2Passos[idx];
    MB.iniciarArrasto(ev, { cor: '#6B8F3E', icone: p.icone, etiqueta: p.etiqueta }, alvo => {
      const el = alvo && alvo.closest('[data-slot]');
      if (!el) return;
      const i = +el.dataset.slot;
      MB.set(s => {
        if (s.g2.slots[i] !== null) return {};
        const slots = s.g2.slots.slice();
        slots[i] = idx;
        const pool = s.g2.pool.filter(x => x !== idx);

        if (pool.length === 0) {
          const certo = slots.every((v, j) => v === j);
          if (certo) {
            setTimeout(() => {
              MB.celebrar('✨', 'Processo certo!');
              setTimeout(() => MB.set(ss => ({ g2: Object.assign({}, ss.g2, { fase: 'match' }) })), 1400);
            }, 120);
          } else {
            setTimeout(() => {
              MB.sfx.errado();
              MB.pedirDica('No jogo Do Lixo ao Material, a criança ordenou mal os passos do processo ' +
                '(a ordem certa é Pesar, Cozinhar, Verter, Secar). Dá uma pista sobre por onde começa ' +
                'o processo, sem dizeres a ordem toda.');
              MB.set(ss => ({ g2: Object.assign({}, ss.g2, { slots: [null, null, null, null], pool: MB.baralhar([0, 1, 2, 3]) }) }));
            }, 700);
          }
        }
        return { g2: Object.assign({}, s.g2, { slots, pool }) };
      });
    });
  }

  function g2Par(ev, i) {
    const p = D.g2Pares[i];
    if (MB.estado().g2.ligados[p.rid]) return;
    MB.iniciarArrasto(ev, { cor: '#FA6415', icone: p.rIcone, etiqueta: p.rEtiqueta }, alvo => {
      const el = alvo && alvo.closest('[data-mid]');
      if (!el || el.dataset.mid !== p.mid) {
        if (el) MB.sfx.errado();
        return;
      }
      MB.set(s => {
        const m = Object.assign({}, s.g2.ligados);
        m[p.rid] = true;
        if (Object.keys(m).length === 4) {
          setTimeout(() => {
            MB.celebrar('🎉', 'Tudo ligado!');
            setTimeout(() => MB.ir('home'), 1500);
          }, 120);
        } else {
          MB.sfx.toque();
        }
        return { g2: Object.assign({}, s.g2, { ligados: m }) };
      });
    });
  }

  // ---------------------------------------- Jogo 3 — Conta a Colheita
  function vistaG3() {
    const S = MB.estado();
    const p = D.g3[S.g3.idx] || D.g3[0];

    const objectos = Array.from({ length: p.total }).map((_, i) =>
      `<span style="font-size:30px;line-height:1;animation:buPop .3s ease ${(i * 0.012).toFixed(3)}s both">${p.icone}</span>`
    ).join('');

    const opcoes = p.opcoes.map(v => {
      const errado = S.g3.errado === v;
      return `<button class="botao ${errado ? 'errado' : ''}" data-accao="g3-resp" data-v="${v}">${v}</button>`;
    }).join('');

    const pontos = D.g3.map((_, i) =>
      `<span class="ponto ${i < S.g3.idx ? 'feito' : ''} ${i === S.g3.idx ? 'actual' : ''}"></span>`
    ).join('');

    return `${topo('Conta a Colheita', 'Problema ' + (S.g3.idx + 1) + ' de ' + D.g3.length, true)}
      <div class="painel">
        <p class="enunciado">${esc(p.pergunta)}</p>
        <div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:20px">${objectos}</div>
        <div class="grelha grelha-2">${opcoes}</div>
        <div class="pontos">${pontos}</div>
        <button class="botao-pequeno" data-accao="g3-ajuda" style="width:100%;margin-top:14px">Preciso de ajuda 🌱</button>
      </div>`;
  }

  function g3Responder(v) {
    const S = MB.estado();
    if (S.g3.aResolver) return;
    const p = D.g3[S.g3.idx];

    if (v === p.resposta) {
      MB.celebrar('✅', 'Certo!');
      MB.set(s => ({ g3: Object.assign({}, s.g3, { aResolver: true, errado: null }) }));
      setTimeout(() => {
        MB.set(s => {
          const ni = s.g3.idx + 1;
          if (ni >= D.g3.length) {
            setTimeout(() => MB.ir('home'), 300);
            return { g3: Object.assign({}, s.g3, { aResolver: false }) };
          }
          return { g3: { idx: ni, errado: null, aResolver: false } };
        });
      }, 900);
    } else {
      MB.sfx.errado();
      MB.set(s => ({ g3: Object.assign({}, s.g3, { errado: v }) }));
      MB.pedirDica('No jogo Conta a Colheita, a pergunta é: "' + p.pergunta +
        '". A criança respondeu ' + v + ', que está errado. Dá uma pista para ela contar por grupos, ' +
        'sem dizeres o resultado.');
    }
  }

  // ------------------------------------- Jogo 4 — Circular ou Linear?
  function vistaG4() {
    const S = MB.estado();

    if (S.g4.terminado || S.g4.idx >= D.g4.length) {
      return `${topo('Circular ou Linear?', 'Terminaste!', true)}
        <div class="painel" style="text-align:center">
          <p style="font-size:64px;margin:10px 0">🌍</p>
          <p class="enunciado">Muito bem! Já sabes distinguir.</p>
          <button class="botao verde" data-accao="g4-outra">Jogar outra vez</button>
          <button class="botao-pequeno" data-accao="voltar" style="width:100%;margin-top:10px">Voltar ao mapa</button>
        </div>`;
    }

    const c = D.g4[S.g4.idx];
    const pontos = D.g4.map((_, i) =>
      `<span class="ponto ${i < S.g4.idx ? 'feito' : ''} ${i === S.g4.idx ? 'actual' : ''}"></span>`
    ).join('');

    return `${topo('Circular ou Linear?', 'Cartão ' + (S.g4.idx + 1) + ' de ' + D.g4.length, true)}
      <div class="painel">
        <div style="text-align:center;padding:26px 10px;background:var(--creme);border-radius:22px;
                    box-shadow:0 5px 0 var(--creme-escuro);margin-bottom:20px;animation:buPop .3s ease both">
          <div style="font-size:64px;margin-bottom:12px">${c.icone}</div>
          <p class="enunciado" style="margin:0">${esc(c.texto)}</p>
        </div>
        <div class="grelha grelha-2">
          <button class="botao verde" data-accao="g4-resp" data-r="circular">↻ Circular</button>
          <button class="botao laranja" data-accao="g4-resp" data-r="linear">→ Linear</button>
        </div>
        <div class="pontos">${pontos}</div>
      </div>`;
  }

  function g4Responder(r) {
    const S = MB.estado();
    const c = D.g4[S.g4.idx];
    if (!c) return;

    if (r === c.r) {
      MB.celebrar(r === 'circular' ? '↻' : '→', r === 'circular' ? 'Circular!' : 'Linear!');
      MB.set(s => {
        const ni = s.g4.idx + 1;
        if (ni >= D.g4.length) {
          setTimeout(() => MB.celebrar('🌍', 'Muito bem!'), 1600);
          return { g4: { idx: ni, terminado: true } };
        }
        return { g4: { idx: ni, terminado: false } };
      });
    } else {
      MB.sfx.errado();
      MB.pedirDica('No jogo Circular ou Linear, o cartão diz: "' + c.texto +
        '". A criança respondeu ' + r + ', que está errado. Dá uma pista sobre se o material volta ' +
        'a ser usado ou se acaba no lixo, sem dares a resposta.');
    }
  }

  // ---------------------------------- Jogo 5 — Desenha a tua Folha
  function vistaG5() {
    const S = MB.estado();
    const desafio = D.g5Desafios[S.g5.desafioIdx];

    const cores = D.g5Cores.map(c =>
      `<button class="cor ${S.g5.cor === c ? 'activa' : ''}" data-accao="g5-cor" data-c="${c}"
               style="background:${c}" aria-label="Cor"></button>`
    ).join('');

    const espessuras = [{ s: 5, d: 10 }, { s: 12, d: 18 }, { s: 22, d: 28 }].map(o =>
      `<button class="espessura ${S.g5.espessura === o.s ? 'activa' : ''}" data-accao="g5-esp" data-s="${o.s}"
               aria-label="Espessura ${o.s}"><i style="width:${o.d}px;height:${o.d}px"></i></button>`
    ).join('');

    return `${topo('Desenha a tua Folha', 'Desenha com o dedo', true)}
      <div class="painel">
        <p class="enunciado">${esc(desafio)}</p>
        <canvas id="tela" class="tela" width="800" height="600"></canvas>
        <div class="paleta">${cores}</div>
        <div class="paleta">${espessuras}</div>
        <div style="display:flex;gap:10px;margin-top:16px">
          <button class="botao-pequeno" data-accao="g5-limpar" style="flex:1">Limpar</button>
          <button class="botao-pequeno" data-accao="g5-novo" style="flex:1">Outro desafio</button>
        </div>
        <button class="botao verde" data-accao="g5-mostrar" style="margin-top:10px">Mostrar ao Buinho 🌱</button>
      </div>`;
  }

  // Canvas: pointer events (dedo, rato e caneta). O protótipo usava mouse — não chega em tablet.
  let _ctx = null, _aDesenhar = false;

  function ligarCanvas() {
    const cv = document.getElementById('tela');
    if (!cv) return;
    _ctx = cv.getContext('2d');
    _ctx.fillStyle = '#fff';
    _ctx.fillRect(0, 0, cv.width, cv.height);
    _ctx.lineCap = 'round';
    _ctx.lineJoin = 'round';

    const ponto = ev => {
      const r = cv.getBoundingClientRect();
      return {
        x: (ev.clientX - r.left) * (cv.width / r.width),
        y: (ev.clientY - r.top) * (cv.height / r.height)
      };
    };

    cv.addEventListener('pointerdown', ev => {
      ev.preventDefault();
      try { cv.setPointerCapture(ev.pointerId); } catch (e) {}
      const S = MB.estado();
      _ctx.strokeStyle = S.g5.cor;
      _ctx.lineWidth = S.g5.espessura;
      _aDesenhar = true;
      const p = ponto(ev);
      _ctx.beginPath();
      _ctx.moveTo(p.x, p.y);
      // ponto isolado: um toque simples deve deixar marca
      _ctx.lineTo(p.x + 0.1, p.y + 0.1);
      _ctx.stroke();
    });

    cv.addEventListener('pointermove', ev => {
      if (!_aDesenhar) return;
      ev.preventDefault();
      const p = ponto(ev);
      _ctx.lineTo(p.x, p.y);
      _ctx.stroke();
    });

    const parar = () => { _aDesenhar = false; };
    cv.addEventListener('pointerup', parar);
    cv.addEventListener('pointercancel', parar);
    cv.addEventListener('pointerleave', parar);
  }

  function g5Limpar() {
    const cv = document.getElementById('tela');
    if (!cv || !_ctx) return;
    MB.sfx.toque();
    _ctx.fillStyle = '#fff';
    _ctx.fillRect(0, 0, cv.width, cv.height);
  }

  function g5Mostrar() {
    const cv = document.getElementById('tela');
    if (!cv) return;
    const base64 = cv.toDataURL('image/png').split(',')[1];
    const desafio = D.g5Desafios[MB.estado().g5.desafioIdx];
    MB.avaliarDesenho(base64, desafio);
  }

  // =======================================================================
  // MOTOR DE QUIZ — 10 jogos de matemática (q1..q10), 3 níveis × 3 rounds.
  // Cronómetro por nível (L1 25s · L2 18s · L3 10s). Ao errar/esgotar o tempo,
  // desce um nível e recomeça esse nível. Dados em window.MB_JOGOS (dados-mat.js).
  // =======================================================================

  const TEMPO_NIVEL = [25, 18, 10];
  const ehQuiz = e => /^q\d+$/.test(e);
  function jogo(gid) { return (window.MB_JOGOS || []).find(j => j.id === gid); }

  // ---- cronómetro (barra pintada pelo núcleo, fora do ciclo de render) ----
  function barraTempo() {
    return `<div class="tempo">
      <span class="tempo-icone">⏱</span>
      <div class="tempo-fundo"><div id="timer-barra" class="tempo-barra" style="width:${(MB.timerFrac() * 100).toFixed(1)}%"></div></div>
      <span id="timer-num" class="tempo-num">${MB.timerSeg()}s</span>
    </div>`;
  }

  let _tmEcra = null, _tmNivel = null, _tmRound = null;
  function gerirTimer(S) {
    if (!ehQuiz(S.ecra) || !jogo(S.ecra)) {
      if (_tmEcra) { MB.pararTimer(); _tmEcra = null; _tmNivel = null; _tmRound = null; }
      return;
    }
    const st = S[S.ecra];
    if (st.aResolver) return;                       // a celebrar: não reiniciar
    if (S.ecra === _tmEcra && st.nivel === _tmNivel && st.round === _tmRound) return;
    _tmEcra = S.ecra; _tmNivel = st.nivel; _tmRound = st.round;
    MB.iniciarTimer(TEMPO_NIVEL[st.nivel], () => aoEsgotarTempo(S.ecra));
  }

  function aoEsgotarTempo(gid) {
    MB.sfx.errado();
    descerNivel(gid, '⏰ Tempo esgotado!');
  }

  // ---- progresso 3 níveis × 3 rounds ----
  function progressoNiveis(S) {
    let out = '';
    for (let l = 0; l < 3; l++) {
      let dots = '';
      for (let r = 0; r < 3; r++) {
        const feito = (l < S.nivel) || (l === S.nivel && r < S.round);
        const actual = (l === S.nivel && r === S.round);
        dots += `<span class="qdot ${feito ? 'feito' : ''} ${actual ? 'actual' : ''}"></span>`;
      }
      out += `<div class="qnivel ${l === S.nivel ? 'nivel-actual' : ''} ${l < S.nivel ? 'nivel-feito' : ''}">
        <span class="qnivel-rot">Nível ${l + 1}</span><div class="qdots">${dots}</div></div>`;
    }
    return `<div class="qprogresso">${out}</div>`;
  }

  // ---- renderizadores visuais por tipo ----
  function visualQuiz(r) {
    switch (r.visual) {
      case 'retangulo': return visualRetangulo(r);
      case 'sequencia': return visualSequencia(r);
      case 'grafico':   return visualGrafico(r);
      case 'fracao':    return visualFracao(r);
      case 'angulo':    return visualAngulo(r);
      case 'domino':    return visualDomino(r);
      default:          return '';
    }
  }

  function visualRetangulo(r) {
    const inverso = r.tipo === 'inv-lado' || r.tipo === 'inv-perim';
    const escala = Math.min(180 / r.comp, 108 / r.larg, 28);
    const W = r.comp * escala, H = r.larg * escala, PAD = 38;
    const sW = W + PAD * 2, sH = H + PAD * 2;
    let grelha = '';
    if (r.tipo === 'area') {
      for (let c = 1; c < r.comp; c++) grelha += `<line x1="${PAD + c * escala}" y1="${PAD}" x2="${PAD + c * escala}" y2="${PAD + H}" stroke="#c9d8b3" stroke-width="1"/>`;
      for (let rr = 1; rr < r.larg; rr++) grelha += `<line x1="${PAD}" y1="${PAD + rr * escala}" x2="${PAD + W}" y2="${PAD + rr * escala}" stroke="#c9d8b3" stroke-width="1"/>`;
    }
    const labelLarg = inverso ? '?' : (r.larg + ' m');
    return `<svg viewBox="0 0 ${sW} ${sH}" class="horta-svg" style="max-width:${sW}px;width:100%">
      <rect x="${PAD}" y="${PAD}" width="${W}" height="${H}" rx="6" fill="#e7efd9" stroke="var(--verde)" stroke-width="3"/>${grelha}
      <text x="${PAD + W / 2}" y="${PAD + H + 26}" text-anchor="middle" class="medida">${r.comp} m</text>
      <text x="${PAD - 16}" y="${PAD + H / 2}" text-anchor="middle" class="medida ${inverso ? 'medida-incognita' : ''}" transform="rotate(-90 ${PAD - 16} ${PAD + H / 2})">${labelLarg}</text>
    </svg>`;
  }

  function visualSequencia(r) {
    const maxv = Math.max.apply(null, r.termos.concat([r.resposta]).map(Number));
    const cas = (v, rot, inc) => {
      const h = Math.round(24 + (Number(v) / maxv) * 104);
      return `<div class="castelo-col"><div class="castelo-bar ${inc ? 'incognita' : ''}" style="height:${h}px">${inc ? '?' : ''}</div><div class="castelo-rot">${esc(rot)}</div></div>`;
    };
    return `<div class="castelos">${r.termos.map(v => cas(v, String(v), false)).join('')}${cas(r.resposta, '?', true)}</div>`;
  }

  function visualGrafico(r) {
    const cores = ['#2038A6', '#FA6415', '#6B8F3E', '#f6b93b'];
    if (r.modo === 'pictograma') {
      const linhas = r.dados.map(d => {
        const ic = d[2] || '⭐';
        const simbolos = Array.from({ length: d[1] }).map(() => `<span class="pic-simb">${esc(ic)}</span>`).join('');
        return `<div class="pic-linha"><span class="pic-rot">${esc(d[0])}</span><span class="pic-simbolos">${simbolos}</span></div>`;
      }).join('');
      return `<div class="pictograma">${linhas}<div class="pic-legenda">1 símbolo = ${r.escala} ${esc(r.unidade)}</div></div>`;
    }
    const maxv = Math.max.apply(null, r.dados.map(d => d[1]).concat([1]));
    const barras = r.dados.map((d, i) => {
      const h = Math.round(10 + (d[1] / maxv) * 120);
      return `<div class="graf-col"><div class="graf-val">${d[1]}</div><div class="graf-bar" style="height:${h}px;background:${cores[i % cores.length]}"></div><div class="graf-rot">${esc(d[0])}</div></div>`;
    }).join('');
    return `<div class="grafico">${barras}</div>`;
  }

  function visualFracao(r) {
    if (r.total) {
      const objs = Array.from({ length: r.total }).map(() => `<span class="qfrac-obj">${esc(r.icone || '⚪')}</span>`).join('');
      return `<div class="qfrac-conjunto">${objs}</div><div class="qfrac-rotulo">${r.num}/${r.den} de ${r.total}</div>`;
    }
    const partes = Array.from({ length: r.den }).map((_, i) => `<div class="qfrac-parte ${i < r.num ? 'cheia' : ''}"></div>`).join('');
    return `<div class="qfrac-barra" style="grid-template-columns:repeat(${r.den},1fr)">${partes}</div>`;
  }

  function visualAngulo(r) {
    const g = r.graus, cx = 92, cy = 96, R = 74;
    const rad = d => d * Math.PI / 180;
    const x2 = (cx + R * Math.cos(rad(-g))).toFixed(1), y2 = (cy + R * Math.sin(rad(-g))).toFixed(1);
    const ax = cx + 30, ay = cy;
    const bx = (cx + 30 * Math.cos(rad(-g))).toFixed(1), by = (cy + 30 * Math.sin(rad(-g))).toFixed(1);
    const largo = g > 180 ? 1 : 0;
    return `<svg viewBox="0 0 184 150" class="angulo-svg" style="max-width:210px;width:70%">
      <path d="M ${ax} ${ay} A 30 30 0 ${largo} 0 ${bx} ${by}" fill="none" stroke="var(--laranja)" stroke-width="4"/>
      <line x1="${cx}" y1="${cy}" x2="${cx + R}" y2="${cy}" stroke="var(--azul)" stroke-width="5" stroke-linecap="round"/>
      <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="var(--azul)" stroke-width="5" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="4" fill="var(--tinta)"/>
    </svg>`;
  }

  // Motor Dominó (q14, q15): ponta aberta numa peça de dominó; a criança escolhe a
  // meia-peça que VALE O MESMO. Herda o motor de quiz (níveis + cronómetro + descida).
  function visualDomino(r) {
    const d = r.dom;
    let conteudo;
    if (d.tipo === 'modelo') {
      const partes = Array.from({ length: d.den }).map((_, i) =>
        `<div class="qfrac-parte ${i < d.num ? 'cheia' : ''}"></div>`).join('');
      conteudo = `<div class="qfrac-barra" style="grid-template-columns:repeat(${d.den},1fr);max-width:220px;margin:0 auto">${partes}</div>`;
    } else {
      conteudo = `<div class="domino-valor">${esc(d.texto)}</div>` +
                 (d.sub ? `<div class="domino-sub">${esc(d.sub)}</div>` : '');
    }
    return `<div class="domino-peca" aria-hidden="true">
      <div class="domino-meia domino-aberta">${conteudo}</div>
      <div class="domino-divisor"></div>
      <div class="domino-meia domino-incognita">?</div>
    </div>`;
  }

  // ---- vista principal ----
  function vistaQuiz(gid) {
    const j = jogo(gid);
    const S = MB.estado()[gid];
    if (!j || !S) return `${topo('Jogo', '', true)}<div class="painel"><p class="enunciado">Jogo não encontrado.</p></div>`;
    const r = j.niveis[S.nivel][S.round];
    const vis = visualQuiz(r);
    const opcoes = r.opcoes.map(v => {
      const errado = String(S.errado) === String(v);
      return `<button class="botao ${errado ? 'errado' : ''}" data-accao="quiz-resp" data-g="${gid}" data-v="${esc(String(v))}">${esc(String(v))}</button>`;
    }).join('');
    return `${topo(j.icone + ' ' + j.nome, 'Nível ' + (S.nivel + 1) + ' · pergunta ' + (S.round + 1) + ' de 3', true)}
      <div class="painel">
        ${barraTempo()}
        <p class="enunciado">${esc(r.pergunta)}</p>
        ${vis ? `<div class="quiz-visual">${vis}</div>` : ''}
        <div class="grelha grelha-2">${opcoes}</div>
        <button class="botao-pequeno" data-accao="quiz-ajuda" data-g="${gid}" style="width:100%;margin-top:12px">Preciso de ajuda 🌱</button>
        ${progressoNiveis(S)}
      </div>`;
  }

  // ---- lógica ----
  function quizResponder(gid, v) {
    const S = MB.estado()[gid];
    if (!S || S.aResolver) return;
    const j = jogo(gid);
    const r = j.niveis[S.nivel][S.round];
    if (String(v) === String(r.resposta)) {
      MB.pararTimer();
      const patch = {}; patch[gid] = Object.assign({}, S, { aResolver: true, errado: null });
      MB.set(patch);
      const fimNivel = S.round >= 2;
      const fimJogo = fimNivel && S.nivel >= 2;
      MB.celebrar(fimJogo ? '🏆' : (fimNivel ? '⭐' : '✅'), fimJogo ? 'Ganhaste o jogo!' : (fimNivel ? 'Nível ' + (S.nivel + 1) + ' feito!' : 'Certo!'));
      setTimeout(() => {
        const cur = MB.estado()[gid];
        if (fimJogo) { const cat = catDe(gid); setTimeout(() => MB.ir(cat ? 'cat:' + cat : 'home'), 400); const p = {}; p[gid] = { nivel: 0, round: 0, errado: null, aResolver: false }; MB.set(p); return; }
        let nivel = cur.nivel, round = cur.round + 1;
        if (round > 2) { nivel++; round = 0; }
        const p = {}; p[gid] = { nivel, round, errado: null, aResolver: false }; MB.set(p);
      }, fimNivel ? 1100 : 800);
    } else {
      MB.pararTimer();
      MB.sfx.errado();
      MB.set(s => { const p = {}; p[gid] = Object.assign({}, s[gid], { errado: v }); return p; });
      setTimeout(() => descerNivel(gid, 'Erraste!'), 650);
    }
  }

  function descerNivel(gid, motivo) {
    const S = MB.estado()[gid];
    if (!S) return;
    const novoNivel = Math.max(0, S.nivel - 1);
    const msg = S.nivel > 0
      ? (motivo + ' Voltas ao Nível ' + (novoNivel + 1) + '. 🌱')
      : (motivo + ' Tenta o Nível 1 outra vez. 🌱');
    const p = {}; p[gid] = { nivel: novoNivel, round: 0, errado: null, aResolver: false };
    MB.set(p);
    MB.set({ mascote: { aberta: true, aCarregar: false, texto: msg } });
  }

  function quizAjuda(gid) {
    const S = MB.estado()[gid]; const j = jogo(gid);
    if (!S || !j) return;
    const r = j.niveis[S.nivel][S.round];
    MB.pedirDica('A criança pediu ajuda no jogo de matemática "' + j.nome + '". A pergunta é: "' + r.pergunta +
      '". Dá uma pista curta e animadora para ela pensar no caminho, sem dares a resposta.');
  }

  // ------------------------------------------------------- mascote/celebração
  function camadaMascote() {
    const m = MB.estado().mascote;
    if (!m.aberta) return '';
    return `<div class="mascote-painel" role="status" aria-live="polite">
      <div class="mascote-bolha" style="width:56px;height:56px;flex:none;animation:none">
        ${MASCOTE_SVG.replace('<svg', '<svg style="width:42px;height:42px"')}
      </div>
      ${m.aCarregar
        ? '<div class="pontinhos"><span></span><span></span><span></span></div>'
        : `<p class="mascote-texto">${esc(m.texto)}</p>`}
      <button class="btn-redondo" data-accao="fechar-mascote" style="width:40px;height:40px;font-size:18px"
              aria-label="Fechar">✕</button>
    </div>`;
  }

  function camadaCelebracao() {
    const c = MB.estado().celebracao;
    if (!c) return '';
    const cores = ['#2038A6', '#FA6415', '#6B8F3E', '#f6b93b'];
    const confetes = Array.from({ length: 26 }).map((_, i) =>
      `<span class="confete" style="left:${(Math.random() * 100).toFixed(1)}%;
        width:${(8 + Math.random() * 8).toFixed(0)}px;height:${(10 + Math.random() * 10).toFixed(0)}px;
        background:${cores[i % cores.length]};
        animation:buFall ${(1.1 + Math.random() * 0.7).toFixed(2)}s ease-in ${(Math.random() * 0.3).toFixed(2)}s forwards"></span>`
    ).join('');
    return `<div class="celebracao">${confetes}
      <div class="celebracao-emoji">${c.emoji}</div>
      <div class="celebracao-texto">${esc(c.texto)}</div>
    </div>`;
  }

  // ------------------------------------------------------------------ render
  const VISTAS = {
    home: vistaHome, g1: vistaG1, g2: vistaG2, g3: vistaG3, g4: vistaG4, g5: vistaG5
  };

  let _ecraAnterior = null;

  function desenhar() {
    const S = MB.estado();
    // ecrã de categoria (cat:<id>), jogo de matemática (q*), ou biofab/home (VISTAS).
    let vista;
    if (S.ecra.indexOf('cat:') === 0) vista = () => vistaCategoria(S.ecra.slice(4));
    else if (ehQuiz(S.ecra)) vista = () => vistaQuiz(S.ecra);
    else vista = VISTAS[S.ecra] || vistaHome;

    // O canvas guarda o desenho da criança nos seus próprios pixels, não no estado.
    // Um innerHTML cego destrói o elemento e apaga o desenho — o que acontecia
    // sempre que se mudava de cor ou de espessura. Por isso, no g5, salvamos o
    // canvas antes de redesenhar e voltamos a pô-lo no sítio.
    const mesmoEcra = _ecraAnterior === S.ecra;
    const canvasVivo = (S.ecra === 'g5' && mesmoEcra) ? document.getElementById('tela') : null;

    raiz().innerHTML = `<div class="ecra">${vista()}</div>${camadaMascote()}${camadaCelebracao()}`;

    if (S.ecra === 'g5') {
      if (canvasVivo) {
        const novo = document.getElementById('tela');
        if (novo && novo !== canvasVivo) novo.replaceWith(canvasVivo);
      } else {
        ligarCanvas();
      }
    }

    // cronómetro dos jogos-quiz: arranca/pára conforme o ecrã e a ronda
    gerirTimer(S);

    _ecraAnterior = S.ecra;
  }

  // -------------------------------------------------------------- eventos
  // Delegação: um só listener, sobrevive a cada re-render.
  // Guarda de idempotência: se o script for carregado ou inicializado duas vezes,
  // os listeners duplicavam e cada toque contava a dobrar (apanhado em teste).
  let _eventosLigados = false;

  function ligarEventos() {
    if (_eventosLigados) return;
    _eventosLigados = true;
    const app = raiz();

    app.addEventListener('pointerdown', ev => {
      const el = ev.target.closest('[data-accao]');
      if (!el) return;
      const a = el.dataset.accao;
      // arrastos têm de arrancar no pointerdown, não no click
      if (a === 'g1-verter') { g1Verter(ev, el.dataset.id); }
      else if (a === 'g2-ordem') { g2Ordem(ev, +el.dataset.idx); }
      else if (a === 'g2-par') { g2Par(ev, +el.dataset.idx); }
    });

    app.addEventListener('click', ev => {
      const el = ev.target.closest('[data-accao]');
      if (!el) return;
      const a = el.dataset.accao;

      switch (a) {
        case 'ir': MB.ir(el.dataset.ecra); break;
        case 'ir-cat': MB.ir('cat:' + el.dataset.cat); break;
        case 'voltar': {
          // de dentro de um jogo, o "voltar" leva à categoria do jogo; senão ao menu.
          const e = MB.estado().ecra;
          const cat = catDe(e);
          MB.ir(cat ? 'cat:' + cat : 'home');
          break;
        }
        case 'som': MB.alternarSom(); break;
        case 'fechar-mascote': MB.fecharMascote(); break;

        case 'g1-menos': g1Menos(el.dataset.id); break;
        case 'g1-verificar': g1Verificar(); break;
        case 'g1-ajuda':
          MB.pedirDica('A criança pediu ajuda no jogo A Receita Certa (faz um biomaterial com as doses ' +
            'de água, agar e glicerina). Dá uma pista curta e animadora para ela ler bem os números e as doses.');
          break;

        case 'g3-resp': g3Responder(+el.dataset.v); break;
        case 'g3-ajuda': {
          const p = D.g3[MB.estado().g3.idx];
          MB.pedirDica('A criança pediu ajuda no jogo Conta a Colheita. A pergunta é: "' + p.pergunta +
            '". Dá uma pista para ela contar por grupos, sem dizeres o resultado.');
          break;
        }

        case 'g4-resp': g4Responder(el.dataset.r); break;
        case 'g4-outra': MB.sfx.toque(); MB.set({ g4: { idx: 0, terminado: false } }); break;

        case 'g5-cor': MB.sfx.toque(); MB.set(s => ({ g5: Object.assign({}, s.g5, { cor: el.dataset.c }) })); break;
        case 'g5-esp': MB.sfx.toque(); MB.set(s => ({ g5: Object.assign({}, s.g5, { espessura: +el.dataset.s }) })); break;
        case 'g5-limpar': g5Limpar(); break;
        case 'g5-novo':
          MB.sfx.toque();
          MB.set(s => ({ g5: Object.assign({}, s.g5, { desafioIdx: (s.g5.desafioIdx + 1) % D.g5Desafios.length }) }));
          break;
        case 'g5-mostrar': g5Mostrar(); break;

        // ---- Jogos de matemática (q1..q10) — motor de quiz
        case 'quiz-resp': quizResponder(el.dataset.g, el.dataset.v); break;
        case 'quiz-ajuda': quizAjuda(el.dataset.g); break;
      }
    });
  }

  // ---------------------------------------------------------------- arranque
  let _arrancado = false;
  function arrancar() {
    if (_arrancado) return;
    _arrancado = true;
    ligarEventos();
    MB.aoMudar(desenhar);
    desenhar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();   // script carregado tarde (defer/async): não ficar à espera de um evento já passado
  }

})();
