# V0.3.0 — Composição e GIF

A tela/Screen atenua a influência do preto sem alterar os pixels fonte. Para eliminar um fundo realmente preto, ative Remover preto: alpha := alpha × clamp((max(R,G,B) - threshold)/feather, 0, 1). Esse processo também reduz sombras escuras da própria fumaça.

Modos em DOM: normal, multiply, screen, plus-lighter (somar), lighten, darken, difference. O modo Subtrair usa *difference* como **aproximação apenas na visualização**. Na exportação PNG aplica `max(0, backdrop RGB - source RGB × sourceAlpha × força)`. 

Arquivos GIF animam enquanto estiverem no palco. O filtro de preto redesenha o quadro GIF exibido em canvas aproximadamente 25 vezes por segundo. O exportador salva apenas um frame no formato PNG; o projeto JSON preserva o GIF e as propriedades de efeitos.

Os modos de blend aplicam-se ao elemento como camada compositada; níveis de pulsação e opacidade ajustam a composição. O código permanece sem dependências externas.
