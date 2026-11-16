# Arquitetura — HUD Studio for SNES

## Escopo atual

Aplicação *single-page* sem dependências externas, implementada em `index.html` (CSS e JavaScript no mesmo arquivo). Os sprites ficam em `assets/`. Toda a edição acontece no navegador.

## Modelo de projeto

A exportação JSON inclui `version`, `stage`, `background` e `sprites`.

- `stage`: 1920×1080.
- `background`: cor, imagem Data URL (quando importada), ajuste `cover/contain/stretch`, opacidade.
- `sprites[]`: `id`, `src`, `label`, `x`, `y`, `w`, `h`, `z`, `rot`, `opacity`, `flipX`, `flipY`, `visible`, `locked`.
- `src`: referência relativa a arquivo em `assets/`. Não aponte para dados privados ou arbitrários em um projeto público.

## Renderização

- O palco é composto de elementos HTML posicionados absolutamente e dimensionado conforme o zoom.
- A exportação rasteriza a composição em `canvas` PNG.
- A seleção por alpha usa canvas auxiliar e amostragem da transparência do PNG, mas ainda está em avaliação.
- O layout é persistido por `localStorage` do navegador; não existe sincronização em nuvem.

## Limites

- **Não** há pipeline 2bpp/4bpp, paletas CGRAM, OAM, VRAM, tilemaps, nem exportação `.sfc` nesta versão.
- Imagens Full HD são apropriadas para prototipação de interface, não para inserção direta em ROM SNES.
- Documentar futuros formatos de exportação separadamente, com limites técnicos e validação em emulador.
