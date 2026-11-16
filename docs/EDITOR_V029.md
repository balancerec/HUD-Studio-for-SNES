# HUD Studio for SNES — Editor v0.2.9

## Escopo

Atualização incremental sobre V0.2.8 DynamicBar Reconstruction; não altera os 4 frames, máscaras, 20 fills, a master nem os scripts da biblioteca.

- **Transformação:** 4 alças nos cantos. Arrastar redimensiona mantendo a quina oposta fixa. Segurar **Shift** desde o clique ou durante o arrasto mantém o centro do sprite parado. Largura e altura podem ser modificadas independentemente. As alças são acessíveis apenas ao selecionar o item e respeitam o bloqueio da camada.
- **Inspector:** restrições de largura (`min-width:0`, `max-width:100%`, `box-sizing:border-box`) e grid responsivo impedem campos numéricos de ultrapassar os cartões laterais.
- **Pulsação:** controle por sprite, com habilitação, velocidade 0,2–4 Hz e intensidade 0–20%. É aplicado ao conteúdo visual, sem movimentar as alças de transformação. Salvo no JSON, preservado em copiar/colar e duplicação. Aceita sprites PNG e GIF.
- **Parallax:** fundo pode responder ao ponteiro, com intensidade de 0–60 pixels e suavização temporal. Não altera as coordenadas dos sprites. Configuração exportada em JSON.
- **GIF:** importação por arquivo, ou colagem a partir da área de transferência quando o navegador fornecer MIME `image/gif`. A reprodução ocorre no palco pelo elemento `img` do navegador. GIFs grandes embutidos como data URI podem exceder a quota de localStorage: exportar JSON.
- **Exportação:** o PNG é estático, captura um momento dos efeitos. NÃO exporta animação GIF ou vídeo. As configurações dos efeitos são mantidas no JSON. As animações dos GIFs são preservadas no arquivo de projeto, mas exportar PNG converte a cena para uma imagem estática.

## Validação

```powershell
py .\tests\smoke-test.py
py .\tests\dynamicbar-reconstruction-v028.test.py
node .\tests\editor-v029.test.cjs
node .\tests\hit-test.test.cjs
node .\tests\editor-v023.test.cjs
node .\tests\dynamic-bars.test.cjs
```

Os testes de código são automatizados, mas a validação visual dos efeitos GIF, pulsação e parallax deve ser feita no Edge.

## Notas

- Shift ao redimensionar não mantém automaticamente a proporção; conserva o centro conforme solicitado.
- Para preservar a proporção, ajuste os dois eixos manualmente com a mesma razão.
- O parallax de backgrounds do tipo `contain` pode mostrar bordas do fundo quando deslocado; os pixels de fundo base são preservados.
- Nenhum commit/push para GitHub foi realizado na criação deste pacote.
