# V0.2.7 — Editor de Preenchimentos

## Fontes e preservação

- Os **12 PNGs originais** das quatro cores permanecem em `assets/miolos-4-cores/` sem alteração.
- Os **4 pares originais** de DynamicBar permanecem em `assets/dynamic-bars/`.
- Foram geradas 16 variantes do preenchimento: 4 geometrias × 4 cores (verde, azul, lilás e pink). O **vermelho usa o PNG original**.
- As cores são derivadas da paleta declarada no catálogo dos arquivos do usuário. As variantes aplicam cor à textura vermelha já encaixada nas barras; **não são um transplante pixel a pixel** dos miolos 281×81, que têm geometrias diferentes e fragmentos de moldura. Esta escolha mantém o encaixe, a textura e o Alpha sem distorção.
- Somente pixels com predominância vermelha são recoloridos; os pixels dourados/neutros e o canal Alpha ficam inalterados. Os arquivos de moldura permanecem intactos.

## Interface

1. Adicione Vida P1/P2 ou Corrida P1/P2 na categoria `DynamicBar`, ou selecione uma barra DynamicBar existente.
2. Em **Inspector → DynamicBar**, use **Paleta do miolo** ou os 5 botões de cor.
3. Altere o **Valor** (0 a 100%) e o **Escoamento** (ltr/rtl). O preenchimento continua recortado, não comprimido pela porcentagem.
4. Use **Exportar JSON** para salvar `fillColor` e `fillSrc`, ou **Exportar PNG** para renderizar o valor atual.
5. A edição de cor também pode ser aplicada à seleção múltipla de barras DynamicBar compatíveis.

## Limites conhecidos

- A troca de cor só está disponível para os quatro presets DynamicBar registrados em `coloredFillPaths`. Não é um editor genérico de qualquer formato de moldura.
- O PNG original do preenchimento vermelho ainda contém pixels de borda dourada provenientes da separação anterior. Para esta versão, esses pixels são preservados sem recoloração; a extração definitiva de moldura/miolo continua pendente.
- A animação do valor usa o recorte linear já existente. Prévia externa e exportação usam os arquivos RGBA correspondentes; teste no Edge recomendado.
