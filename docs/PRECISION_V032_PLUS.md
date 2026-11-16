# HUD Studio for SNES — V0.3.2+ Precision Editing

Evolução incremental sobre a V0.3.2. Trabalho na branch `feat/studio-v0.3.2`; **não inclui commit ou push**.

## Estado do projeto

O aplicativo continua realizando salvamento local automático (`localStorage`) quando a capacidade permitir. O novo botão **Salvar estado (.json)** (atalho `Ctrl+S`) exporta o documento portátil contendo `background`, sprites e imagens embutidas, guias auxiliares, propriedades de efeitos, referências de pares, pivôs, máscaras, parâmetros de materiais e configuração da ferramenta de espelhamento. **Importar JSON** recupera esses campos. O PNG continua sendo um resultado rasterizado, não um arquivo de projeto reeditável.

## Tipografia

Os textos criados no Smart HUD são transformados em caixa alta e usam `Impact`, com `Arial Black` como fallback. Valores originais de texto são mantidos no JSON, e a renderização é em maiúsculas.

## Mirror Quantize 2.0

Eixos padrão X=960 e Y=540 para canvas 1920x1080. Modos horizontal (P1/P2), vertical e duplo. Tolerância de encaixe em pixels, grade de quantização e pares vinculados com acompanhamento durante transformações. Um overlay de diagnóstico permite avaliar erros de posição de pares (verde dentro da tolerância; vermelho fora). O diagnóstico não participa da exportação PNG.

Fórmulas para sprites sem rotação: `x' = 2*axisX - x - largura`; `y' = 2*axisY - y - altura`.

## Transformações

Campos X/Y/largura/altura/rotação e pivôs X/Y (% da caixa). O pivô é utilizado tanto na prévia CSS quanto na exportação Canvas, preservando consistência de transformação. Centralização exata do sprite no canvas por botão.

## Máscaras e texturas

Para materiais gerados, inspector com corte esquerdo/direito/superior/inferior (%) e máscaras hexagonal, central V ou retangular. Escala, rotação e deslocamento X/Y da textura. A nova imagem de preenchimento é gerada isoladamente, com recorte aplicado no seu canvas, sem alterar o PNG da moldura.

## Verificação

- `node tests/precision-v032plus.test.cjs`
- `node tests/precision-v032.test.cjs`
- `node tests/editor-v029.test.cjs`
- `python tests/smoke-test.py`
- Inspecionar no Edge: salvar/carregar JSON; inserir moldura e material; modificar os 4 limites de máscara; rotação e zoom da textura; duplicar espelhado no modo duplo; movimentar e verificar atualização do par; alternar diagnóstico; exportar PNG e comparar com a prévia.

### Limitações

- Validação interativa em browser real ainda depende de inspeção no Edge (navegação do Chromium de testes bloqueada neste ambiente).
- Máscaras são parametrizadas por cortes percentuais e presets geométricos, **não** possuem nós de Bézier arrastáveis nesta entrega.
- O reflexo continua capturado em um único quadro do PNG; não há exportação de GIF animado.
- O estado local depende do limite de armazenamento do navegador; para imagens grandes use sempre **Salvar estado (.json)**.
