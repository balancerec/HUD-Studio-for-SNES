# V0.3.5.4 — Viewport navigation + six manual layouts

## Origem das configurações

Os seis JSONs no RAR fornecido foram lidos e consolidados pelo **ID estável dos 20 sprites**: PC 1920×1080, mobile paisagem 1280×720, mobile retrato 1080×1920 e 720×1280, SNES 512×448 e 256×224. As propriedades dos sprites (assets, efeitos, animações, trim) permanecem no JSON completo de referência.

- `examples/manual-layout-profiles-v0353.json`: apenas coordenadas e medidas dos 6 perfis, para usar o botão **Carregar 6 layouts manuais** quando os IDs dos sprites coincidirem.
- `examples/umk3-hud-6-layouts-manuais-v0354.json`: exemplo completo consolidado que pode ser importado diretamente no editor.
- Ao carregar perfis pela interface, o layout atual é salvo antes da importação; trocar a resolução recupera os valores manuais.

### Atenção

Os posicionamentos de texto dos dois presets SNES foram preservados *exatamente* como fornecidos, mas se estendem para fora do canvas (valores X negativos e larguras maiores que a tela). Recomenda-se ajuste manual dos nomes para compatibilidade com a tela SNES real; não corrigimos silenciosamente os dados do usuário.

## Navegação

- Barras horizontal e vertical explicitamente visíveis; a régua permanece fora da composição.
- `Ctrl + roda`: zoom sobre o ponto sob o cursor, medindo o palco antes/depois da alteração.
- Roda sem Ctrl: rolagem nativa. Shift+roda: rolagem horizontal conforme o navegador.
- Botão do meio + arrastar: pan preservado.
- As barras só alteram o viewport, não a resolução de PNG/JSON.

## Testes

`node tests/viewport-layout-v0354.test.cjs`

Depois da instalação no Windows/Edge, conferir Ctrl+roda nos quatro cantos, perto da borda com scroll ativo, zoom após mudar para SNES e retrato, e recuperação dos seis perfis.
