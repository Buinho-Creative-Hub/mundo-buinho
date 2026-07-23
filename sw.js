/* Mundo Buinho — service worker
   Buinho FabLab, Messejana · CC-BY-SA 4.0

   Objectivo: depois da primeira visita, os jogos funcionam SEM REDE.
   As escolas do Alentejo nem sempre têm boa ligação (spec §4).

   Estratégia:
   - estáticos (HTML/CSS/JS/fontes/ícones) -> cache primeiro, rede como reserva
   - /api/*  -> NUNCA em cache (respostas da mascote são sempre frescas;
                se a rede falhar, o cliente já tem os seus próprios fallbacks) */

const CACHE = 'mundo-buinho-v3';

const ESTATICOS = [
  './',
  './index.html',
  './static/css/mundo.css',
  './static/js/dados.js',
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

self.addEventListener('fetch', ev => {
  const url = new URL(ev.request.url);

  // API: sempre rede. Se falhar, deixamos o erro subir — o cliente trata com fallback.
  if (url.pathname.startsWith('/api/')) return;

  // Só tratamos GET do próprio domínio
  if (ev.request.method !== 'GET' || url.origin !== self.location.origin) return;

  ev.respondWith(
    caches.match(ev.request).then(resp => {
      if (resp) return resp;
      return fetch(ev.request).then(r => {
        // guardar cópia para a próxima vez (só respostas boas)
        if (r && r.status === 200 && r.type === 'basic') {
          const copia = r.clone();
          caches.open(CACHE).then(c => c.put(ev.request, copia));
        }
        return r;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
