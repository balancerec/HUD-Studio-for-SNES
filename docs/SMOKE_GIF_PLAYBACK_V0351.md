# V0.3.5.1 — Smoke GIF Playback hotfix

## Defeito
GIFs de fumaça com `darkKey=true` deixavam de atualizar visualmente após recorte Auto Trim. Lutadores animados sem Dark Key continuavam funcionando. O `canvas.chroma-canvas` amostrava um `<img>` oculto, cuja animação pode ser suspensa pelo navegador.

## Ajuste
- Decodificação independente do GIF com `ImageDecoder` e `createImageBitmap`.
- Respeito às durações individuais dos quadros (microsegundos convertidos para milissegundos).
- Compartilhamento do conjunto de quadros quando duas camadas usam a mesma fonte GIF.
- Fallback para o GIF nativo quando `ImageDecoder` não existe ou falha; elemento fonte fica com `opacity:0` em vez de `visibility:hidden`.
- `trimRect`, Dark Key, FX, transformações e projeto JSON preservados.

## Validação no Edge
1. Abra o JSON V0.3.5 de teste, mantenha as quatro camadas de fumaça visíveis.
2. Verifique se as duas fumaças animam antes e depois de aplicar Auto Trim.
3. Verifique os lutadores, os recortes, o hit-testing e a prévia de exportação PNG.
4. Inspecione o console em caso de `ImageDecoder` indisponível. A reprodução pode depender do fallback nativo.

**Observação:** o teste incluído é estrutural. A reprodução visual no Edge não foi testada neste ambiente. A exportação PNG permanece um quadro estático.
