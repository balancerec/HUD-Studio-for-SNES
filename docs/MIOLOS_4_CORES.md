# HUD Studio for SNES — V0.2.6 | Miolos 4 Cores

Atualização incremental sobre a V0.2.5 — Master Asset System.

## Conteúdo inspecionado

Arquivo recebido: `miolos_HUD_4_cores(1).zip`.

- Verde, Azul, Lilás e Pink: **4 paletas de cores**.
- Para cada cor: `miolo_lava_*` (281 × 81 px), `miolo_moldura_*` (283 × 94 px), `HUD_miolos_*` (1536 × 1024 px).
- Prévia adicional `preview_miolos_4_cores.png` (700 × 560 px).
- **12 PNGs fonte + 1 prévia**. O catálogo preserva SHA256 e métricas Alpha para cada sprite.
- Arquivos originais copiados sem qualquer edição.

## Integração

No Browser do Studio, escolha **Miolos · 4 cores (8 sprites)** para acessar os miolos de lava e as variantes com moldura, ou **Miolos · Sheets (4 refs)** para as imagens completas. Arraste ao palco, transforme, espelhe, duplique e exporte normalmente. Mantivemos as 4 barras DynamicBar e os 37 assets da Master V1.

### Aviso de produção

Os recortes não são máscaras definitivas: `miolo_lava_*` contém resíduos isolados nas extremidades e `miolo_moldura_*` já contém borda dourada e resíduos de outras peças. **Não** interpretar `miolo_moldura_*` como moldura vazia; **não** aplicar automaticamente esses miolos em barras de vida/corrida de aspecto muito diferente, para evitar deformar a textura. A integração é como assets editáveis do Studio, com preparação de máscara/encaixe na etapa seguinte.

Para preparar um DynamicBar oficial desses miolos, ainda é necessário estabelecer geometria de recorte, origem e bordas sem fragmentos, assim como o modo de repetição/revelação do preenchimento.

## Testes

```powershell
py .\tests\smoke-test.py
py .\tests\master-assets.test.py
py .\tests\miolos-4-cores.test.py
node .\tests\hit-test.test.cjs
node .\tests\dynamic-bars.test.cjs
```

Não foram realizados testes interativos no Edge do usuário. Ainda não foi feito commit nem push no GitHub.
