# Fontes

Faltam aqui dois ficheiros, propositadamente (não são redistribuídos neste repo):

- `Fredoka-Variable.woff2`
- `Nunito-Variable.woff2`

Ambas são Google Fonts com licença SIL Open Font License 1.1.

## Porquê locais e não por CDN

As escolas do Alentejo nem sempre têm boa ligação, e o jogo tem de funcionar
offline depois da primeira visita. Um `<link>` para o Google Fonts quebra isso
— e envia pedidos dos tablets das crianças para servidores de terceiros.

## Como obter

Descarregar de fonts.google.com (Fredoka e Nunito), converter para woff2
variável e colocar aqui com estes nomes exactos.

Enquanto não estiverem cá, o CSS cai para a fonte de sistema. O jogo funciona
na mesma — fica só menos on-brand.
