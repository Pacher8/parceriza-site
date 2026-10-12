# Parceriza — site institucional

Site estático publicado por GitHub Pages em https://parceriza.com.br/.
Preservar `CNAME` e `.nojekyll`.

## Estrutura
- `index.html`: página institucional, soluções, parceiros, turma, solicitações e privacidade.
- `styles.css`: paleta azul-petróleo/turquesa, responsividade e acessibilidade.
- `app.js`: navegação, abas e preparação de solicitações por e-mail.
- `assets/parceriza-logo.png` e `assets/parceriza-turma.png`: artes originais aprovadas, preservadas sem edição. Recortes de apresentação são feitos apenas em CSS.

## Escopo atual
As solicitações NÃO criam conta ou registro em banco. O visitante prepara uma mensagem e precisa enviá-la pelo próprio aplicativo de e-mail. Há alternativa de cópia manual. Nenhum envio automático, analytics, cookies de rastreamento ou persistência local dos campos foi adicionado.

Contato de destino inicial: gustavo.pacher@preddita.com (contato do mantenedor no repositório). Está definido em `app.js` e nos links de contato de `index.html`.

Tributar.IA é a solução com acesso externo. Rede de advogados e catálogo de parceiros estão identificados como em formação. Nenhuma parceria, estatística comercial ou disponibilidade de outros produtos foi inventada.

## Referência editorial
Portfólio dos personagens, consultado em 12/10/2026:
https://chatgpt.com/space/page_d4dfcbe8c2248191b74d39dac0cd4143

Iza é o nome definido. Os outros nove nomes são propostas e ainda não têm associação definitiva aos rostos. Por isso a página usa a turma original e suas áreas temáticas sem fixar novos nomes individuais. A página identifica explicitamente os personagens como virtuais.

## Prévia
Servir esta pasta por qualquer servidor HTTP estático. Exemplo:
`python -m http.server 4173 --bind 127.0.0.1`

## Próxima evolução
Integrar um endpoint autenticado para cadastro real, definir responsáveis por atendimento e política de retenção, configurar validação profissional, fechar nomes/retratos individuais, cadastrar parceiros efetivamente aprovados e vincular o Instagram oficial confirmado.

## Validação desta versão
Conferência visual em Chromium, desktop e celular. Verificações funcionais aprovadas: imagens carregadas, âncoras existentes, abas por clique e teclado, preparação dos dois tipos de solicitação, OAB no corpo da mensagem, entrada tratada como texto, limpeza de mensagens desatualizadas, rejeição de nomes em branco, menu móvel e ausência de rolagem horizontal em 375, 390, 768 e 1440 pixels. Nenhum e-mail foi enviado nos testes.

## Publicação
Esta revisão preserva o domínio e a hospedagem existentes. Publicar os arquivos na raiz da branch configurada no GitHub Pages. Após o envio, conferir o resultado do deployment e o domínio parceriza.com.br.
