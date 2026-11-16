# V0.3.2 — Precision Editing: réguas, guias, pilha e reflexo

## Réguas externas

As réguas horizontal (X) e vertical (Y) estão fora do palco de 1920 × 1080, reservando 26 pixels de interface fora da área exportável. Os números ajustam a posição ao zoom. O centro de referência continua **X=960, Y=540**.

## Guias arrastáveis

- Arraste **da régua superior** para criar uma guia **horizontal** (Y).
- Arraste **da régua esquerda** para criar uma guia **vertical** (X).
- Arraste uma guia existente para reposicioná-la.
- Dê duplo clique para excluir uma guia ou use **Limpar guias**.
- Quando **Snap magnético** está ativo, as bordas e o centro dos sprites encaixam nas guias em um limite de 7 px.
- As guias são persistidas no localStorage e no JSON. São apenas ferramentas editoriais: não aparecem no PNG.
- Ctrl+Z/Ctrl+Y participa do histórico de guias.

## Hierarquia de camadas

Em `Inspector > Organização & camadas`, **Trazer ao topo**, **Enviar ao fundo**, **Subir 1 camada** e **Descer 1 camada** reordenam um ou mais sprites. Na lista de camadas, ▲ e ▼ movem cada item individualmente. O código normaliza `z` para uma sequência única e aplica a mesma ordem ao DOM, ao hit-testing e à exportação PNG.

## Reflexo de contorno

No Inspector > Efeitos visuais, ative **Reflexo percorrendo a moldura** e configure cor, velocidade (0,2–4×) e intensidade (0–100%). O efeito usa raios de amostragem do canal alpha do sprite ou da moldura da barra dinâmica, gerando uma trilha luminosa animada; não colore o miolo. PNG captura o quadro atual, JSON preserva os parâmetros. Não gera GIF animado. Para formas muito côncavas ou fragmentadas, a aproximação angular pode precisar de máscaras profissionais em uma futura versão.

## Validação

- `node tests/precision-v032.test.cjs`
- `py tests/smoke-test.py`
- `node tests/editor-v029.test.cjs`
- `node tests/smart-hud-v031.test.cjs`

A validação visual com navegador real deve ocorrer no Windows; a execução automatizada de Chromium no ambiente de empacotamento foi bloqueada.
