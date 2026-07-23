# Deploy — Mundo Buinho

Destino decidido pelo Carlos: **`blocks.buinho.education`**, ao lado da Faísca.

⚠️ A Faísca é um site estático. O Mundo Buinho **precisa de backend** (as chamadas
ao Mistral não podem levar a chave no cliente). Logo, o serviço tem de ser um
**Web Service**, não um Static Site — serve os estáticos *e* a API no mesmo sítio.

---

## Opção A — Render (recomendada)

Um só serviço, auto-deploy no push.

1. **New → Web Service**, ligar ao repo `Buinho-Creative-Hub/mundo-buinho`
2. Region **Frankfurt**
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `gunicorn app:app --bind 0.0.0.0:$PORT`
5. **Environment**:
   - `MISTRAL_API_KEY` = a chave (Bitwarden)
   - `MISTRAL_MODEL_TEXT` = `mistral-small-latest`
   - `MISTRAL_MODEL_VISION` = confirmar no catálogo actual (ver nota abaixo)
6. Custom domain → `blocks.buinho.education` (ou subdomínio próprio)

Validar em `/api/saude` — deve dizer `chave_montada: true`.

## Opção B — Webtuga (cPanel/Passenger)

Ler primeiro `workflows/deploy-webtuga-CHECKLIST.md` no `buinho-os`.

Armadilhas já conhecidas, por ordem de quem já mordeu:
- Python default do cPanel é 2.7 → escolher 3.10+ no Setup Python App
- Se o docroot tiver um WordPress, o bloco `# BEGIN WordPress` do `.htaccess`
  vem **antes** do bloco Passenger e rouba tudo → remover esse bloco
- `pip install` corre em silêncio; validar o import real, não a mensagem
- Restart não pega às vezes → usar **REINICIAR**, não só Gravar
- Zip **sem pasta wrapper**: a raiz do zip = a raiz do destino
- `config_local.py` com a chave é criado **à mão no servidor** (está no .gitignore)

---

## ⚠️ Antes de publicar — por fazer

1. **Validar as doses do Jogo 1** com o Magalhães contra
   `strategy/biofabricacao-receitas.md`. Gate de qualidade: gerar ≠ entregar.
2. **Confirmar o nome do modelo de visão** no catálogo actual do Mistral.
   Muda de mês para mês — por isso é variável de ambiente, não está no código.
   Se a qualidade dos comentários aos desenhos não convencer, plano B da spec:
   manter as dicas em Mistral e usar outro modelo só para a visão.
3. **Tecto de gasto** na conta Mistral (o rate limit por IP já está no código:
   40 pedidos/minuto, `RATE_MAX` em `app.py`).
4. **Fontes**: colocar `Fredoka-Variable.woff2` e `Nunito-Variable.woff2` em
   `static/fonts/` (ver `LEIA-ME.md` lá dentro). Sem elas cai para fonte de
   sistema — funciona, fica menos on-brand.
5. **Testar em tablet real**, portrait e landscape. O arrasto e o canvas foram
   escritos para toque mas só foram testados em DOM simulado.

## Privacidade — antes de qualquer uso em sala

O Jogo 5 envia desenhos de crianças para a API do Mistral. Hoje é teste
doméstico. Antes de entrar numa turma: consentimento dos encarregados de
educação e decisão explícita sobre fronteira de dados. O endpoint já está
preparado para não guardar nem registar imagens.
