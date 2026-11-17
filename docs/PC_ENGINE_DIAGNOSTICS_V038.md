# HUD Studio V0.3.8 — Timeline Diagnostics & Storage Safety

## Escopo
Incremental sobre V0.3.7. Não altera PC Engine C++, FastAPI, ROM, assets ou JSON pessoal.

- Linha de eventos inferidos a partir de diferenças entre snapshots: vida, transição de estado, entrada e saída de entidades. Máximo 250 eventos; eventos não são trilha autoritativa do motor.
- Filtro por categoria e clique no evento para navegar diretamente até o tick.
- Comparação de entidades quando o hash de dois snapshots diverge (ou no último tick quando iguais); são comparados campos reconhecidos e presença.
- Indicador de ocupação pela contagem de **runs retornados pela API** (aviso >=24, crítico >=28). Não calcula bytes no disco, nem lista sessões interativas ou diretórios que a API omita. Não realiza arquivamento, nem exclusão.
- Toda saída da engine é inserida via `textContent`; não é interpretada como HTML.

## Instalação
Extraia ZIP fora do repositório. Rode PowerShell, sem alterar a política permanente:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:\CAMINHO\EXTRAIDO\INSTALL-V038.ps1" -ProjectRoot "D:\Desenvolvimento\Sistemas\HUD Studio for SNES"
```

O instalador exige V0.3.7 e cria cópia de `index.html`, `scripts/pc-engine-panel.js` e `.css` em `backups/pc-engine-v037-before-v038-*`. Ele substitui **somente** os dois arquivos do painel e CSS, injeta uma referência em `index.html`, instala módulo e testes. Se houver personalizações no painel V0.3.7, revise o backup/diferença antes de aplicar.

## Testes

```powershell
node .\tests\pc-engine-diagnostics-v038.test.cjs
node .\tests\pc-engine-visual-v037.test.cjs
node .\tests\pc-engine-foundation-v036.test.cjs
py .\tests\smoke-test.py
```

## Limites
A comparação por hash detecta a primeira divergência observável de snapshots. Hashes idênticos não garantem igualdade completa de todos os campos. Eventos são derivados dos campos conhecidos, e não eventos nativos de colisão. Não existe controle de retenção via API atual; arquivamento requer suporte explícito do backend e validação separada. Testes locais não substituem homologação no Windows real.
