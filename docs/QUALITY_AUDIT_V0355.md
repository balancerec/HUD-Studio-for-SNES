# HUD Studio V0.3.5.5 — Auditoria de layouts

## O que mudou
- Botão **Auditar 6 telas**: relatório somente de leitura com cobertura de perfis, dimensões válidas, valores numéricos e objetos parcialmente fora da tela.
- Os GIFs de fumaça podem ultrapassar o palco intencionalmente e não geram avisos de recorte.
- Perfis com dimensões incoerentes, `NaN`, larguras/alturas não positivas ou cobertura inferior a 80% não são aplicados silenciosamente ao trocar de resolução; usa-se o layout adaptativo como alternativa.
- O relatório JSON pode ser exportado para inspeção. Nenhuma correção automática é executada pela auditoria.

## Limitações
- Detecção de recorte é geométrica, não analisa contornos alfa em cada frame.
- A auditoria não substitui validação visual em Edge/Chrome, nem valida cronologia de GIFs.
- Verificar a fidelidade das exportações PNG permanece uma etapa de QA manual.
