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
  function vistaHome() {
    const alturaMapa = 2160; // acomoda os 10 níveis (o último em y=2054)
    const niveis = D.niveis.map(l => `
      <button class="nivel" data-accao="ir" data-ecra="${l.ecra}"
              style="left:${l.x};top:${l.y}px;--cor:${l.cor};--sombra:${l.sombra}">
        <span class="nivel-bola" style="background:${l.cor};box-shadow:0 9px 0 ${l.sombra},0 16px 26px rgba(34,32,28,.22)">
          ${l.icone}
          <span class="nivel-num" style="color:${l.sombra}">${l.n}</span>
        </span>
        <span class="nivel-nome">${esc(l.nome)}</span>
        <span class="nivel-tema">${esc(l.tema)}</span>
      </button>`).join('');

    return `${topo('Mundo Buinho', 'Matemática e ciência a brincar', false)}
      <div class="mapa" style="height:${alturaMapa}px">
        <div class="mapa-mascote">
          <div class="mascote-bolha" style="width:76px;height:76px">
            ${MASCOTE_SVG.replace('<svg', '<svg style="width:56px;height:56px"')}
          </div>
          <span class="mapa-legenda">Escolhe um jogo!</span>
        </div>
        ${niveis}
      </div>`;
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
  // JOGOS DE MATEMÁTICA — 4.º ano (matemática verificada; ver dados.js)
  // =======================================================================

  // avança para a ronda seguinte ou volta ao mapa; devolve o patch de estado.
  function avancar(chave, novoEstado) {
    return s => {
      const ni = s[chave].idx + 1;
      const total = D[chave].length;
      if (ni >= total) { setTimeout(() => MB.ir('home'), 300); return {}; }
      const p = {}; p[chave] = novoEstado(ni); return p;
    };
  }

  // ---------------------------------------- Jogo 6 — Fatias Certas (frações)
  function vistaG6() {
    const S = MB.estado();
    const p = D.g6[S.g6.idx] || D.g6[0];
    const pintadas = S.g6.pintadas;
    const fatias = Array.from({ length: p.partes }).map((_, i) => {
      const on = pintadas.indexOf(i) >= 0;
      return `<button class="fatia ${on ? 'pintada' : ''}" data-accao="g6-fatia" data-i="${i}"
               aria-label="Fatia ${i + 1}"${on ? ' aria-pressed="true"' : ''}></button>`;
    }).join('');
    const pontos = D.g6.map((_, i) =>
      `<span class="ponto ${i < S.g6.idx ? 'feito' : ''} ${i === S.g6.idx ? 'actual' : ''}"></span>`).join('');
    return `${topo('Fatias Certas', 'Problema ' + (S.g6.idx + 1) + ' de ' + D.g6.length, true)}
      <div class="painel">
        <p class="enunciado">${esc(p.icone)} ${esc(p.enunciado)}</p>
        <div class="fracao-alvo">${esc(p.rotulo)}</div>
        <div class="barra-fatias" style="grid-template-columns:repeat(${p.partes},1fr)">${fatias}</div>
        <p class="contador">Pintaste ${pintadas.length} de ${p.partes}</p>
        <button class="botao verde" data-accao="g6-verificar">Verificar</button>
        <button class="botao-pequeno" data-accao="g6-ajuda" style="width:100%;margin-top:10px">Preciso de ajuda 🌱</button>
        <div class="pontos">${pontos}</div>
      </div>`;
  }

  function g6Fatia(i) {
    const S = MB.estado();
    if (S.g6.aResolver) return;
    MB.sfx.toque();
    MB.set(s => {
      const set = s.g6.pintadas.slice();
      const j = set.indexOf(i);
      if (j >= 0) set.splice(j, 1); else set.push(i);
      return { g6: Object.assign({}, s.g6, { pintadas: set }) };
    });
  }

  function g6Verificar() {
    const S = MB.estado();
    const p = D.g6[S.g6.idx];
    if (S.g6.pintadas.length === p.num) {
      MB.celebrar('🍰', 'Fração certa!');
      MB.set(s => ({ g6: Object.assign({}, s.g6, { aResolver: true }) }));
      setTimeout(() => MB.set(avancar('g6', () => ({ idx: MB.estado().g6.idx + 1, pintadas: [], aResolver: false }))), 900);
    } else {
      MB.sfx.errado();
      MB.pedirDica('No jogo Fatias Certas, o desafio é "' + p.enunciado + '" (fração ' + p.rotulo +
        '). A criança pintou ' + S.g6.pintadas.length + ' de ' + p.partes +
        ' fatias. Dá uma pista curta: o número de cima da fração diz quantas fatias pintar. Não digas o número.');
    }
  }

  // ------------------------------------------- Jogo 7 — A Feira (dinheiro)
  function euros(cents) { return (cents / 100).toFixed(2).replace('.', ',') + ' €'; }

  function vistaG7() {
    const S = MB.estado();
    const p = D.g7[S.g7.idx] || D.g7[0];
    const escolhidas = S.g7.escolhidas;
    const total = escolhidas.reduce((sum, i) => sum + p.tabuleiro[i], 0);
    const moedas = p.tabuleiro.map((c, i) => {
      const on = escolhidas.indexOf(i) >= 0;
      const cls = c >= 100 ? 'ouro' : 'prata';
      return `<button class="moeda ${cls} ${on ? 'escolhida' : ''}" data-accao="g7-moeda" data-i="${i}">${euros(c)}</button>`;
    }).join('');
    const pontos = D.g7.map((_, i) =>
      `<span class="ponto ${i < S.g7.idx ? 'feito' : ''} ${i === S.g7.idx ? 'actual' : ''}"></span>`).join('');
    return `${topo('A Feira', 'Compra ' + (S.g7.idx + 1) + ' de ' + D.g7.length, true)}
      <div class="painel">
        <p class="enunciado">${esc(p.icone)} Paga ${esc(p.produto)} — custa <b>${euros(p.alvo)}</b></p>
        <div class="carteira">Na tua mão: <b>${euros(total)}</b></div>
        <div class="moedas">${moedas}</div>
        <button class="botao verde" data-accao="g7-pagar" style="margin-top:16px">Pagar</button>
        <div style="display:flex;gap:10px;margin-top:10px">
          <button class="botao-pequeno" data-accao="g7-limpar" style="flex:1">Limpar</button>
          <button class="botao-pequeno" data-accao="g7-ajuda" style="flex:1">Ajuda 🌱</button>
        </div>
        <div class="pontos">${pontos}</div>
      </div>`;
  }

  function g7Moeda(i) {
    const S = MB.estado();
    if (S.g7.aResolver) return;
    MB.sfx.toque();
    MB.set(s => {
      const set = s.g7.escolhidas.slice();
      const j = set.indexOf(i);
      if (j >= 0) set.splice(j, 1); else set.push(i);
      return { g7: Object.assign({}, s.g7, { escolhidas: set }) };
    });
  }

  function g7Limpar() { MB.sfx.toque(); MB.set(s => ({ g7: Object.assign({}, s.g7, { escolhidas: [] }) })); }

  function g7Pagar() {
    const S = MB.estado();
    const p = D.g7[S.g7.idx];
    const total = S.g7.escolhidas.reduce((sum, i) => sum + p.tabuleiro[i], 0);
    if (total === p.alvo) {
      MB.celebrar('🪙', 'Certo!');
      MB.set(s => ({ g7: Object.assign({}, s.g7, { aResolver: true }) }));
      setTimeout(() => MB.set(avancar('g7', () => ({ idx: MB.estado().g7.idx + 1, escolhidas: [], aResolver: false }))), 900);
    } else {
      MB.sfx.errado();
      const dir = total > p.alvo ? 'a mais' : 'a menos';
      MB.pedirDica('No jogo A Feira, é preciso pagar exactamente ' + euros(p.alvo) + '. A criança juntou ' +
        euros(total) + ', que é ' + dir + '. Dá uma pista curta para trocar ou juntar moedas, sem dizeres a combinação.');
    }
  }

  // -------------------------------------- Jogo 8 — A Horta Cercada (perímetro)
  // Arestas exteriores da forma (vizinho ausente). Cada aresta = 1 metro de cerca.
  function arestasExteriores(cells) {
    const set = new Set(cells.map(c => c[0] + ',' + c[1]));
    const arr = [];
    const add = (x1, y1, x2, y2) => arr.push({ k: x1 + ',' + y1 + '_' + x2 + ',' + y2, x1, y1, x2, y2 });
    for (const cell of cells) {
      const c = cell[0], r = cell[1];
      if (!set.has((c - 1) + ',' + r)) add(c, r, c, r + 1);       // esquerda
      if (!set.has((c + 1) + ',' + r)) add(c + 1, r, c + 1, r + 1); // direita
      if (!set.has(c + ',' + (r - 1))) add(c, r, c + 1, r);       // cima
      if (!set.has(c + ',' + (r + 1))) add(c, r + 1, c + 1, r + 1); // baixo
    }
    return arr;
  }

  function vistaG8() {
    const S = MB.estado();
    const p = D.g8[S.g8.idx] || D.g8[0];
    const cells = p.cells;
    const cols = cells.map(c => c[0]), rows = cells.map(c => c[1]);
    const minc = Math.min.apply(null, cols), maxc = Math.max.apply(null, cols);
    const minr = Math.min.apply(null, rows), maxr = Math.max.apply(null, rows);
    const CELL = 52, PAD = 18;
    const W = (maxc - minc + 1) * CELL + PAD * 2, H = (maxr - minr + 1) * CELL + PAD * 2;
    const gx = c => (c - minc) * CELL + PAD, gy = r => (r - minr) * CELL + PAD;
    const quadrados = cells.map(cell =>
      `<rect x="${gx(cell[0])}" y="${gy(cell[1])}" width="${CELL}" height="${CELL}" rx="4"
             fill="#e7efd9" stroke="#c9d8b3" stroke-width="1.5"/>`).join('');
    const cercadas = S.g8.cercadas;
    const linhas = arestasExteriores(cells).map(a => {
      const on = !!cercadas[a.k];
      const x1 = gx(a.x1), y1 = gy(a.y1), x2 = gx(a.x2), y2 = gy(a.y2);
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${on ? '#FA6415' : '#C3BAA3'}"
                stroke-width="${on ? 8 : 3}" stroke-linecap="round" ${on ? '' : 'stroke-dasharray="2 7"'}/>
              <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="transparent" stroke-width="26"
                stroke-linecap="round" data-accao="g8-aresta" data-k="${a.k}" style="cursor:pointer"/>`;
    }).join('');
    const feitas = Object.keys(cercadas).filter(k => cercadas[k]).length;
    const pontos = D.g8.map((_, i) =>
      `<span class="ponto ${i < S.g8.idx ? 'feito' : ''} ${i === S.g8.idx ? 'actual' : ''}"></span>`).join('');
    const nomeCap = p.nome.charAt(0).toUpperCase() + p.nome.slice(1);
    return `${topo('A Horta Cercada', nomeCap + ' · horta ' + (S.g8.idx + 1) + ' de ' + D.g8.length, true)}
      <div class="painel">
        <p class="enunciado">Põe cerca à volta de toda a horta. Toca em cada lado!</p>
        <div style="display:flex;justify-content:center">
          <svg viewBox="0 0 ${W} ${H}" class="horta-svg" style="max-width:${W}px;width:100%" aria-label="Grelha da horta">${quadrados}${linhas}</svg>
        </div>
        <p class="contador">Cerca: <b>${feitas}</b> metros ${feitas === p.perimetro ? '✅' : ''}</p>
        <button class="botao verde" data-accao="g8-verificar">A cerca está pronta!</button>
        <div style="display:flex;gap:10px;margin-top:10px">
          <button class="botao-pequeno" data-accao="g8-limpar" style="flex:1">Recomeçar</button>
          <button class="botao-pequeno" data-accao="g8-ajuda" style="flex:1">Ajuda 🌱</button>
        </div>
        <div class="pontos">${pontos}</div>
      </div>`;
  }

  function g8Aresta(k) {
    const S = MB.estado();
    if (S.g8.aResolver) return;
    MB.sfx.toque();
    MB.set(s => {
      const m = Object.assign({}, s.g8.cercadas);
      if (m[k]) delete m[k]; else m[k] = true;
      return { g8: Object.assign({}, s.g8, { cercadas: m }) };
    });
  }

  function g8Limpar() { MB.sfx.toque(); MB.set(s => ({ g8: Object.assign({}, s.g8, { cercadas: {} }) })); }

  function g8Verificar() {
    const S = MB.estado();
    const p = D.g8[S.g8.idx];
    const arestas = arestasExteriores(p.cells);
    const feitas = Object.keys(S.g8.cercadas).filter(k => S.g8.cercadas[k]).length;
    const todas = arestas.every(a => S.g8.cercadas[a.k]);
    if (todas && feitas === p.perimetro) {
      MB.celebrar('📏', 'Perímetro ' + p.perimetro + ' m!');
      MB.set(s => ({ g8: Object.assign({}, s.g8, { aResolver: true }) }));
      setTimeout(() => MB.set(avancar('g8', () => ({ idx: MB.estado().g8.idx + 1, cercadas: {}, aResolver: false }))), 1000);
    } else {
      MB.sfx.errado();
      const faltam = p.perimetro - feitas;
      MB.pedirDica('No jogo A Horta Cercada, é preciso cercar toda a volta da horta. Faltam ' +
        (faltam > 0 ? faltam + ' lado(s)' : 'seguir a volta toda') + '. Dá uma pista curta para a criança seguir a volta toda, lado a lado, sem dizer o número.');
    }
  }

  // -------------------------------------- Jogo 9 — Castelos na Areia (sequências)
  function vistaG9() {
    const S = MB.estado();
    const p = D.g9[S.g9.idx] || D.g9[0];
    const maxv = Math.max.apply(null, p.termos.concat([p.resposta]));
    const castelo = (v, rotulo, incognita) => {
      const h = Math.round(28 + (v / maxv) * 108);
      return `<div class="castelo-col">
        <div class="castelo-bar ${incognita ? 'incognita' : ''}" style="height:${h}px">${incognita ? '?' : ''}</div>
        <div class="castelo-rot">${esc(rotulo)}</div>
      </div>`;
    };
    const barras = p.termos.map(v => castelo(v, String(v), false)).join('') + castelo(p.resposta, '?', true);
    const opcoes = p.opcoes.map(v => {
      const errado = S.g9.errado === v;
      return `<button class="botao ${errado ? 'errado' : ''}" data-accao="g9-resp" data-v="${v}">${v}</button>`;
    }).join('');
    const pontos = D.g9.map((_, i) =>
      `<span class="ponto ${i < S.g9.idx ? 'feito' : ''} ${i === S.g9.idx ? 'actual' : ''}"></span>`).join('');
    return `${topo('Castelos na Areia', 'Castelo ' + (S.g9.idx + 1) + ' de ' + D.g9.length, true)}
      <div class="painel">
        <p class="enunciado">Os castelos crescem. Quantos blocos tem o próximo?</p>
        <div class="castelos">${barras}</div>
        <div class="grelha grelha-2">${opcoes}</div>
        <button class="botao-pequeno" data-accao="g9-ajuda" style="width:100%;margin-top:14px">Preciso de ajuda 🌱</button>
        <div class="pontos">${pontos}</div>
      </div>`;
  }

  function g9Responder(v) {
    const S = MB.estado();
    if (S.g9.aResolver) return;
    const p = D.g9[S.g9.idx];
    if (v === p.resposta) {
      MB.celebrar('🏰', 'Certo!');
      MB.set(s => ({ g9: Object.assign({}, s.g9, { aResolver: true, errado: null }) }));
      setTimeout(() => MB.set(avancar('g9', () => ({ idx: MB.estado().g9.idx + 1, errado: null, aResolver: false }))), 900);
    } else {
      MB.sfx.errado();
      MB.set(s => ({ g9: Object.assign({}, s.g9, { errado: v }) }));
      MB.pedirDica('No jogo Castelos na Areia, a sequência é ' + p.termos.join(', ') + ', ? — cresce ' + p.pista +
        '. A criança respondeu ' + v + ', que está errado. Dá uma pista sobre o salto entre os números, sem dizeres o resultado.');
    }
  }

  // -------------------------------------- Jogo 10 — O Gráfico da Turma (gráficos)
  function vistaG10() {
    const S = MB.estado();
    const p = D.g10[S.g10.idx] || D.g10[0];
    const maxv = Math.max.apply(null, p.dados.map(d => d[1]).concat([1]));
    const cores = ['#2038A6', '#FA6415', '#6B8F3E', '#f6b93b'];
    const barras = p.dados.map((d, i) => {
      const h = Math.round(10 + (d[1] / maxv) * 132);
      return `<div class="graf-col">
        <div class="graf-val">${d[1]}</div>
        <div class="graf-bar" style="height:${h}px;background:${cores[i % cores.length]}"></div>
        <div class="graf-rot">${esc(d[0])}</div>
      </div>`;
    }).join('');
    const opcoes = p.opcoes.map(v => {
      const errado = String(S.g10.errado) === String(v);
      return `<button class="botao ${errado ? 'errado' : ''}" data-accao="g10-resp" data-v="${esc(String(v))}">${esc(String(v))}</button>`;
    }).join('');
    const pontos = D.g10.map((_, i) =>
      `<span class="ponto ${i < S.g10.idx ? 'feito' : ''} ${i === S.g10.idx ? 'actual' : ''}"></span>`).join('');
    return `${topo('O Gráfico da Turma', 'Gráfico ' + (S.g10.idx + 1) + ' de ' + D.g10.length, true)}
      <div class="painel">
        <p class="graf-titulo">${esc(p.icone)} ${esc(p.titulo)} <span>(${esc(p.unidade)})</span></p>
        <div class="grafico">${barras}</div>
        <p class="enunciado" style="font-size:18px">${esc(p.pergunta)}</p>
        <div class="grelha grelha-2">${opcoes}</div>
        <button class="botao-pequeno" data-accao="g10-ajuda" style="width:100%;margin-top:14px">Preciso de ajuda 🌱</button>
        <div class="pontos">${pontos}</div>
      </div>`;
  }

  function g10Responder(v) {
    const S = MB.estado();
    if (S.g10.aResolver) return;
    const p = D.g10[S.g10.idx];
    if (String(v) === String(p.resposta)) {
      MB.celebrar('📊', 'Certo!');
      MB.set(s => ({ g10: Object.assign({}, s.g10, { aResolver: true, errado: null }) }));
      setTimeout(() => MB.set(avancar('g10', () => ({ idx: MB.estado().g10.idx + 1, errado: null, aResolver: false }))), 900);
    } else {
      MB.sfx.errado();
      MB.set(s => ({ g10: Object.assign({}, s.g10, { errado: v }) }));
      MB.pedirDica('No jogo O Gráfico da Turma, o gráfico mostra ' + p.titulo + '. A pergunta é: "' + p.pergunta +
        '". A criança respondeu ' + v + ', que está errado. Dá uma pista para olhar a altura das barras, sem dares a resposta.');
    }
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
    home: vistaHome, g1: vistaG1, g2: vistaG2, g3: vistaG3, g4: vistaG4, g5: vistaG5,
    g6: vistaG6, g7: vistaG7, g8: vistaG8, g9: vistaG9, g10: vistaG10
  };

  let _ecraAnterior = null;

  function desenhar() {
    const S = MB.estado();
    const vista = VISTAS[S.ecra] || vistaHome;

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
        case 'voltar': MB.ir('home'); break;
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

        // ---- Jogo 6 — Fatias Certas (frações)
        case 'g6-fatia': g6Fatia(+el.dataset.i); break;
        case 'g6-verificar': g6Verificar(); break;
        case 'g6-ajuda': {
          const p = D.g6[MB.estado().g6.idx];
          MB.pedirDica('A criança pediu ajuda no jogo Fatias Certas (pintar a fração ' + p.rotulo +
            '). Dá uma pista curta: o número de cima da fração diz quantas fatias pintar. Não digas o número.');
          break;
        }

        // ---- Jogo 7 — A Feira (dinheiro/decimais)
        case 'g7-moeda': g7Moeda(+el.dataset.i); break;
        case 'g7-pagar': g7Pagar(); break;
        case 'g7-limpar': g7Limpar(); break;
        case 'g7-ajuda': {
          const p = D.g7[MB.estado().g7.idx];
          MB.pedirDica('A criança pediu ajuda no jogo A Feira. Tem de pagar exactamente ' + euros(p.alvo) +
            ' com moedas. Dá uma pista curta para juntar moedas até ao preço, sem dizeres a combinação.');
          break;
        }

        // ---- Jogo 8 — A Horta Cercada (perímetro)
        case 'g8-aresta': g8Aresta(el.dataset.k); break;
        case 'g8-verificar': g8Verificar(); break;
        case 'g8-limpar': g8Limpar(); break;
        case 'g8-ajuda': {
          const p = D.g8[MB.estado().g8.idx];
          MB.pedirDica('A criança pediu ajuda no jogo A Horta Cercada (contar o perímetro da horta "' + p.nome +
            '"). Dá uma pista curta para seguir a volta toda da horta, lado a lado, sem dizeres o número.');
          break;
        }

        // ---- Jogo 9 — Castelos na Areia (sequências)
        case 'g9-resp': g9Responder(+el.dataset.v); break;
        case 'g9-ajuda': {
          const p = D.g9[MB.estado().g9.idx];
          MB.pedirDica('A criança pediu ajuda no jogo Castelos na Areia. A sequência é ' + p.termos.join(', ') +
            ', ? e cresce ' + p.pista + '. Dá uma pista sobre o salto entre os números, sem dizeres o resultado.');
          break;
        }

        // ---- Jogo 10 — O Gráfico da Turma (gráficos)
        case 'g10-resp': g10Responder(el.dataset.v); break;
        case 'g10-ajuda': {
          const p = D.g10[MB.estado().g10.idx];
          MB.pedirDica('A criança pediu ajuda no jogo O Gráfico da Turma. A pergunta é: "' + p.pergunta +
            '". Dá uma pista para ela olhar a altura das barras do gráfico, sem dares a resposta.');
          break;
        }
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
