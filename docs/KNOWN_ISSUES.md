# Problemas conhecidos

## HIT-001 — Cliques sobre pixels transparentes

**Status:** correção implementada na branch V0.2.0, **aguardando validação visual no navegador do usuário**. Reportado em 16/11/2026.

**Esperado:** somente pixels visíveis do sprite selecionam ou iniciam o arraste.

**Observado:** na versão atual, algumas regiões transparentes dentro da caixa do PNG ainda podem ativar seleção/arraste.

**Hipóteses a verificar:** eventos DOM capturados pela caixa externa; ordem da checagem de alpha; sobreposição de sprites; premultiplicação do canal alpha; inicialização do cache de imagens; espelhamento/rotação e coordenadas sob zoom.

**Plano de validação:** adicionar PNG de teste com transparente ao redor; teste de hit em quatro pontos; sobreposição com sprite inferior; zoom 35/50/100%; flip horizontal/vertical; rotação 90°; seleção enquanto o asset ainda carrega.

**Decisão:** não corrigir incidentalmente na preparação para GitHub. Abrir tarefa própria, com teste de regressão.

## TEST-001 — Testes visuais

A interface ainda não foi validada por testes automatizados em navegador na preparação desta versão. O smoke test só verifica estrutura, assets e sintaxe.

## V0.2 — Limitações do primeiro incremento

- As guias magnéticas atuam sobre o retângulo geométrico do sprite, não o bounding box opaco.
- O histórico Undo/Redo, agrupamento lógico, seleção em caixa e zoom por Ctrl+roda foram implementados; precisam de validação visual no Windows.
- A seleção em caixa considera a interseção com o retângulo geométrico, não apenas pixels alpha.
- O grupo é lógico: cada sprite mantém sua posição, escala e camada individuais, e o movimento de grupo é conjunto; redimensionamento e rotação de grupo não estão disponíveis.
- Não foi possível completar teste automatizado de navegador neste ambiente (Chromium bloqueou acesso por política do ambiente). Testes Node de hit-test passam.

## v0.2.3 — Pendências de validação

- A imagem colada é embutida como data URI no projeto JSON. Isso pode ultrapassar a cota de `localStorage` em arquivos grandes; exporte o projeto JSON para não perder mudanças e futuramente migre a biblioteca para IndexedDB.
- A seleção precisa por alpha de PNGs e a colagem de imagens precisam ser testadas manualmente no navegador do Windows antes de realizar merge na `main`.
- Imagens animadas GIF são tratadas como um sprite estático durante a exportação pelo canvas.
