# Master Asset System V0.2.5

## Fonte única

- `assets/master-v1/MASTER_ORIGINAL_1536x1024.png`: cópia imutável da master enviada pelo usuário.
- `assets/master-v1/catalog.json`: 37 recortes, limites originais e classificação.
- `MASTER_ATLAS_PREVIEW.jpg`: prévia de navegação em quadriculado.

## Método

Recortes retangulares exatos da imagem original RGBA armazenados em `assets/master-v1/<categoria>/`, **sem regeneração, alteração de pixels nem interpolação**. As 24 variantes provisórias em `assets/master-v1/clean/` preservam RGB e suprimem alguns pixels externos via máscara Alpha automática; a versão bruta continua disponível para auditoria. A origem (`source_rect`) e as dimensões são registradas no catálogo. No Studio, a biblioteca utiliza `editor_path` (limpeza provisória quando disponível); `path` aponta ao recorte bruto imutável. O conteúdo preserva os brilhos originais, porém alguns recortes incluem artefatos vermelhos/amarelos externos visíveis na imagem-fonte, e os recortes muito próximos também podem conter fragmentos limítrofes de elementos vizinhos. Estes sprites estão marcados `reference_crop_not_cleaned` e **não** são assets finais isolados para produção. O próximo estágio é conferir manualmente máscaras Alpha por componente, usando este arquivo como ground truth.

## Integração

O seletor Biblioteca do Studio separa assets originais, DynamicBars V0.2.4 e cinco categorias Master. Arraste qualquer recorte ao palco e ajuste X/Y, espelho, Z etc. Os DynamicBars de V0.2.4 continuam disponíveis. **Estados da master são exemplos visuais e não substituem o percentual contínuo do DynamicBar.**

## Encaixe e simetria

Para simetria estrutural num canvas de largura `W`: `xP2 = W - (xP1 + largura)`. Se a peça possui orientação visual direcional, use `flipX` no P2. O catálogo armazena as caixas de origem; não são coordenadas calibradas do HUD final. A montagem original aparece no último item da Master e pode ser usada como overlay de referência.

## Aceite pendente

Validar visualmente a separação fina de frame vs fill, halos RGB+Alpha, a correspondência P1/P2 e o encaixe dos DynamicBars. Sem essa validação, não declarar extração ou recomposição exata da master.
