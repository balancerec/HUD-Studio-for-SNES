# Roadmap

## v0.1 — Fundação

- [x] Canvas 1920×1080 e background substituível
- [x] Biblioteca de sprites PNG
- [x] Drag & Drop, transformação, propriedades e camadas
- [x] Grid/Snap, espelhamento e exportações
- [x] Documentação e estrutura inicial Git
- [~] Resolver HIT-001 (seleção por alpha): correção + regressão Node feitas; falta validação em navegador Windows
- [ ] Persistência de backgrounds grandes fora do `localStorage`

## v0.2 — Ferramentas do editor

- [x] Régua, guias e alinhamento magnético
- [x] Pan com botão do meio e zoom Ctrl+roda (validação visual Windows pendente)
- [x] Seleção múltipla, caixa de seleção e agrupamento lógico (validação visual pendente)
- [x] Undo/Redo com histórico de estados
- [ ] Auto-crop e ajuste de bounding box pelos pixels visíveis
- [ ] Importação de PNG customizado para a biblioteca

## Futuro — Exportação retro

- [ ] Perfis de resolução SNES e safe-area
- [ ] Quantização de paletas e conversão de tiles 2bpp/4bpp
- [ ] Atlas/tilemap e metadados OAM/VRAM
- [ ] Preview em Mesen 2 ou emulador compatível

## v0.2.2 — Visual Polish

- [x] Toolbar dividida em grupos funcionais
- [x] Inspector modular com ações categorizadas
- [x] Grades consistentes de ações e espaçamento
- [x] Botão de exclusão isolado
- [x] Teste estático da estrutura visual
- [ ] Aceite visual pelo usuário no Edge/Windows

## v0.2.3 — Edição em lote e clipboard (candidate)

- [x] Duplicação de múltiplos sprites preservando grupos como grupos independentes
- [x] Espelhamento geométrico horizontal/vertical de seleção múltipla
- [x] Excluir seleção completa e mover camadas em lote
- [x] Copiar/colar sprites (`Ctrl+C` / `Ctrl+V`) mantendo posições relativas
- [x] Colar arquivo de imagem da área de transferência (`Ctrl+V`) como novo sprite
- [x] Importar imagem PNG/JPEG/WEBP/GIF como sprite editável
- [ ] Testes manuais no Edge: seleção, grupos, clipboard, imagem e exportação
- [ ] Persistência robusta de imagens grandes com IndexedDB (atualmente exportar JSON)

## v0.2.7 — Editor de Preenchimentos

- [x] Seletor de 5 paletas no Inspector: vermelho, verde, azul, lilás, pink
- [x] Troca de cor de DynamicBar sem alterar moldura nem geometria/Alpha do preenchimento
- [x] Aplicação da cor à seleção de barras compatíveis
- [x] Cor persistente em JSON e exportação PNG usando fillSrc correspondente
- [x] 16 variantes automáticas e teste de regressão RGBA
- [ ] Validação visual no Edge/Windows
- [ ] Separação final de efeitos e fragmentos de ouro dos miolos de fonte
