/* Mundo Buinho — service worker
   Buinho FabLab, Messejana · CC-BY-SA 4.0

   Objectivo: depois da primeira visita, os jogos funcionam SEM REDE.
   As escolas do Alentejo nem sempre têm boa ligação (spec §4).

   Estratégia (mudada em v9 para acabar com o "aparece sempre a versão antiga"):
   - HTML/CSS/JS -> REDE PRIMEIRO; se houver rede, mostra sempre a versão mais
     recente e actualiza a cache. Só usa a cache quando está OFFLINE.
   - fontes/ícones/manifest -> cache primeiro (raramente mudam, carregam rápido).
   - /api/* -> nunca em cache (respostas da mascote frescas; cliente tem fallback). */

const CACHE = 'mundo-buinho-v9';   // v9: rede-primeiro no shell da app (fim do problema da cache) 24 Jul 2026

const ESTATICOS = [
  './',
  './index.html',
  './static/css/mundo.css',
  './static/js/dados.js',
  './static/js/dados-mat.js',
  './static/js/nucleo.js',
  './static/js/jogos.js',
  './static/manifest.json',
  './static/icones/icone-192.png',
  './static/icones/icone-512.png'
];

self.addEventListener('install', ev => {
  ev.waitUntil(
    caches.open(CACHE)
      // addAll falha inteiro se UM ficheiro faltar; guardamos um a um para ser tolerante
      .then(c => Promise.allSettled(ESTATICOS.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', ev => {
  ev.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Guarda uma cópia boa na cache (para funcionar offline na próxima).
function guardar(req, resp) {
  if (resp && resp.status === 200 && resp.type === 'basic') {
    const copia = resp.clone();
    caches.open(CACHE).then(c => c.put(req, copia));
  }
  return resp;
}

self.addEventListener('fetch', ev => {
  const url = new URL(ev.request.url);

  // API: sempre rede. Se falhar, deixamos o erro subir — o cliente trata com fallback.
  if (url.pathname.startsWith('/api/')) return;

  // Só tratamos GET do próprio domínio
  if (ev.request.method !== 'GET' || url.origin !== self.location.origin) return;

  // O "shell" da app (navegação + JS/CSS) muda a cada actualização -> REDE PRIMEIRO,
  // com a cache só como rede de segurança offline. Assim nunca fica preso ao antigo.
  const ehShell = ev.request.mode === 'navigate' ||
    /\.(?:js|css)(?:\?|$)/.test(url.pathname);

  if (ehShell) {
    ev.respondWith(
      fetch(ev.request)
        .then(r => guardar(ev.request, r))
        .catch(() => caches.match(ev.request).then(c => c || caches.match('./index.html')))
    );
    return;
  }

  // Fontes, ícones, manifest: cache primeiro (raramente mudam, mais rápido).
  ev.respondWith(
    caches.match(ev.request).then(resp => resp ||
      fetch(ev.request).then(r => guardar(ev.request, r)).catch(() => resp))
  );
});
