# Auto Trim Pro — V0.3.5

## Novos recursos
- Comparador **Original / Área útil** no Inspector (GIFs permanecem animados, se suportados pelo navegador).
- Quatro margens manuais em **pixels da imagem original** (esquerda/direita/superior/inferior). Ajustar números modifica apenas a prévia. Clique **Aplicar bordas** para confirmar; **Prévia = corte atual** para descartar proposta.
- Estatísticas de área removida em pixels quadrados e percentual.
- Corte não destrutivo: usa `trimRect` da V0.3.4 e mantém a origem original para restaurar margens.
- Auto Trim GIF continua usando a **união de todos os quadros**; não usa o primeiro quadro como substituto silencioso.
- Histórico de desfazer/refazer, JSON, seleção e PNG utilizam os mecanismos originais.

## Procedimento de teste visual no Edge
1. Importe PNG de personagem com transparência, selecione e confira o comparador.
2. Ajuste manualmente duas bordas; confira `Área removida` sem alterar o sprite até clicar **Aplicar bordas**.
3. Aplique e verifique que o personagem não pula de lugar; pressione Ctrl+Z, refaça, restaure margens.
4. Em GIF, confirme que cada quadro permanece dentro da área útil e que a animação continua.
5. Teste um sprite espelhado/rotacionado; compare a prévia com PNG exportado.

**Limite:** os testes automatizados de geometria não substituem a verificação visual no Edge; imagens GIF com fundo preto opaco exigem Dark Key configurado corretamente.
