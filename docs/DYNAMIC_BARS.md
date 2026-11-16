# DynamicBar — HUD Studio for SNES (v0.2.4)

Oito PNGs originais são integrados a `assets/dynamic-bars/`: quatro molduras e quatro preenchimentos.

## Funcionamento

- Um único objeto lógico `kind: "dynamicBar"` contém `frameSrc`, `fillSrc`, `value` (0–100), `direction` (`ltr` ou `rtl`) e `category` (`health` ou `stamina`).
- A moldura é fixa. A camada de preenchimento permanece em seu tamanho original; `clip-path` (navegador) e `ctx.clip()` (exportação PNG) revelam a porcentagem.
- A interface demonstra valores variáveis; a simulação não é motor de combate nem conexão SNES. Para o jogo real, ligar `value` às variáveis do motor.
- `JSON` persiste definição e níveis; a exportação PNG captura apenas o quadro atual.
- O preset adiciona 4 barras (vida P1/P2 e corrida P1/P2). Sprites anteriores continuam preservados, e podem ser removidos se desejar.
- A imagem original da moldura foi separada por segmentação e pode conter pequenas diferenças nos contornos; inspecionar visualmente antes de release.
- O formato HTML/CSS não é diretamente executável no SNES; exportação de tiles/paleta requer etapa específica posterior.

## Testes

```
py tests/smoke-test.py
node tests/hit-test.test.cjs
node tests/editor-v021.test.cjs
node tests/ui-v022.test.cjs
node tests/editor-v023.test.cjs
node tests/dynamic-bars.test.cjs
```

### Limitações conhecidas

- O slider usa `input` e salva cada mudança em `localStorage` (sem nova entrada de Undo por cada pixel arrastado).
- Não existe importação da textura da barra dinâmica por clipboard; use os ativos incluídos.
- É necessário validar a aparência e os controles no Edge/Chromium local.
