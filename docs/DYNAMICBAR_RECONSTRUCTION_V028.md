# V0.2.8 — DynamicBar Reconstruction

## Defeito corrigido

V0.2.7 usava um arquivo rotulado como miolo que continha elementos do aro dourado. A recoloração parcial contaminava a moldura.

## Renderização

1. `*_empty.png`: fundo vazio dentro da máscara geométrica.
2. `*_<cor>.png`: preenchimento derivado da textura real da Master, limitado à máscara interna.
3. `*_frame.png`: metal dourado fora da máscara, imutável ao trocar de cor.

Ordem idêntica em HTML e Canvas. Recorte horizontal via `value` de 0 a 100 e `direction` ltr/rtl.

## Compatibilidade

Os caminhos anteriores das quatro barras são identificados pelo prefixo e redirecionados aos assets reconstruídos no carregamento. As demais imagens e os IDs dos sprites permanecem intactos.

## Revisão antes do merge

- Abrir no Edge, verificar 0, 25, 50, 75, 100% nos dois sentidos.
- Comparar 5 cores em P1/P2, inclusive as extremidades diagonais.
- Testar transparência e exportar PNG/JSON; reimportar JSON.
- Verificar possíveis emendas decorrentes de mosaico de textura na barra longa.
- Confirmar alinhamento dos pares por eixo 960 no canvas 1920×1080.

## Notas

As máscaras geradas automaticamente são provisórias, e a conferência visual é obrigatória. Nenhum arquivo de origem anterior foi sobrescrito.
