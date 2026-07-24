const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2 });
  await page.goto('http://localhost:8099/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // mapa (home) — enquadrar o topo
  await page.screenshot({ path: '/tmp/shots/00-mapa.png', clip: { x: 0, y: 0, width: 820, height: 1180 } });

  const ecras = [
    ['g6', 'Fatias Certas (frações)'],
    ['g7', 'A Feira (dinheiro)'],
    ['g8', 'A Horta Cercada (perímetro)'],
    ['g9', 'Castelos na Areia (sequências)'],
    ['g10', 'O Gráfico da Turma (gráficos)']
  ];
  for (const [ecra, nome] of ecras) {
    await page.evaluate(e => window.MB.ir(e), ecra);
    await page.waitForTimeout(350);
    await page.screenshot({ path: `/tmp/shots/${ecra}.png`, clip: { x: 0, y: 0, width: 820, height: 1000 } });
    console.log('shot:', ecra, '—', nome);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
