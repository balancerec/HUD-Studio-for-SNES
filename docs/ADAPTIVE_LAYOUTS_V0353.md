# V0.3.5.3 — Adaptive Layouts

## Por quê

A V0.3.5.2 usava um único fator `min(width/oldWidth,height/oldHeight)` sobre **todos** os itens.
Ao alternar repetidamente, os elementos se acumulavam no centro da tela e acabavam dezenas de vezes menores. A análise de cinco projetos fornecidos pelo usuário no RAR confirmou esse comportamento (por exemplo, o Coletor 28x37 px na tela 1280x720).

## Novo mecanismo

- Seletor de **Adaptar HUD** ativado por padrão e botão **Reorganizar itens**.
- Os itens são categorizados semanticamente em *nome*, *moldura de nome*, *vida*, *corrida*, *painel central*, *timer*, *logotipo*, *lutador*, *fumaça*, *material* e *outros*.
- Reposicionamento relativo ao formato da tela. Nomes, barras, painel V e personagens usam zonas próprias; preenchimentos seguem o frame pai.
- O segundo plano do cenário usa `cover` e não é encolhido com os sprites.
- Cada formato possui um perfil de edição próprio, persistido em `layoutProfiles` no JSON (`version:8`), e uma referência `layoutSource` imutável. Retornar a um formato editado restaura as posições daquele formato.
- O cálculo não modifica `src`, duração dos GIFs, `trimRect`, `darkKey`, FX, visibilidade, grupos nem o valor das barras dinâmicas.
- O detector de layout colapsado impede salvar perfis miniaturizados herdados das versões anteriores. Pressionar **Reorganizar itens** reconstrói uma composição útil na tela atual.
- `Ctrl+Z` reverte a reorganização da tela atual, e os comandos de salvar/exportar mantêm a nova configuração.

## Resoluções

| Formato | Pixels | Centro |
| --- | --- | --- |
| PC | 1920x1080 | 960, 540 |
| SNES Hi-Res | 512x448 | 256, 224 |
| SNES clássico | 256x224 | 128, 112 |
| Mobile retrato Full HD | 1080x1920 | 540, 960 |
| Mobile retrato leve | 720x1280 | 360, 640 |
| Mobile paisagem | 1280x720 | 640, 360 |

## Como validar

1. Abra o JSON de um projeto 1920x1080 da versão anterior e selecione **Mobile paisagem**.
2. Verifique que os lutadores ocupem parte significativa da cena, barras no topo e timer no centro.
3. Alterne para SNES 512x448, depois para mobile retrato e volte ao PC.
4. Mova uma barra no PC, alterne para mobile e volte: o ajuste anterior do PC deve ser recuperado.
5. Aplique Auto Trim a um GIF, confirme que a animação continua (inclusive a fumaça), exporte PNG e JSON.
6. Em um projeto antigo já miniaturizado, clique **Reorganizar itens**. Isso usa o enquadramento semântico; os ajustes finos ainda podem ser feitos manualmente.

A resolução do canvas é um preset de *edição e exportação*, não uma garantia de compatibilidade direta de cores, VBlank, DMA e modos de vídeo com o hardware SNES.
