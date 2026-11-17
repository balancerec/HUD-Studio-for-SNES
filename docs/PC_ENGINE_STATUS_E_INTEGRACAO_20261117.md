# PC Engine Lab no HUD Studio — Estado e integração (17/11/2026)

> Documento de estado. Diferencia **código no GitHub**, **instalações locais informadas pelo operador**, **evoluções entregues em hotfix** e **planos futuros**. Não equivale a uma auditoria do ambiente Windows nem comprova equivalência com UMK3.

## Escopos e fontes de verdade

- **HUD Studio**: editor de cena, biblioteca e composição de HUD, projetos JSON, prévia de sprites; repositório `balancerec/HUD-Studio-for-SNES`.
- **PC Engine Lab**: motor experimental C++ e serviços FastAPI mantidos no ambiente local do **UMK3 RE Studio**, com fluxos headless e interativos.
- **Bridge do HUD**: `scripts/serve-pc-engine.py` (proxy local, porta 8015) → backend FastAPI (127.0.0.1:8000), consumido por `pc-engine-adapter.js`. Não enviar conteúdo do projeto HUD à engine por padrão.
- **Pesquisa SNES / UMK3**: independente do protótipo PC; nunca chamar os estados C++ de extração fiel da ROM sem evidências.

## Matriz de disponibilidade

| Recurso | Situação / origem | Evidência |
|---|---|---|
| Fundação V0.3.6, visual V0.3.7, diagnóstico V0.3.8 | **Versionado na branch base** `feat/studio-v0.3.6-pc-engine` | scripts e testes do repositório |
| Visual Debugger V0.4.0 (comparação A/B) | **Hotfix instalado e confirmado visualmente pelo operador**; esta branch documental não publica o hotfix | captura do painel de 17/11/2026 |
| Collision & Hitbox Inspector V0.4.1 | **Hotfix instalado, interface verificada**; snapshots observados sem volumes válidos | captura do painel de 17/11/2026 |
| Storage Manager V1/V1.1 e retenção V1.2 | **Ambiente Windows informado como funcional**; código da API local não necessariamente presente na branch GitHub | inventários e validações do operador |
| Baseline V1.3 | **Executada localmente**; 6/6 execuções, 300 pares de snapshots, 0 divergências | relatório do operador `baseline-v13.json` |
| Native Collision Bridge V0.4.2 | **Planejado**, ainda não homologado | ver roadmap |
| Sprite & Animation Studio V0.5.0 | **Planejado** | ver especificação |
| Combat Runtime V0.6.0 / Playtest Arena V0.7.0 | **Planejado** | ver especificação |

## Baseline de regressão local V1.3

Em 17/11/2026 o operador registrou seis execuções nativas independentes, duas por cenário, com 100 frames por execução e resultado de comparação idêntico em cada par:

| Cenário | Hash final FNV-1a64 | Comparação |
|---|---|---|
| neutral | `cd5af60db80f4d6f` | PASS |
| normal-hit | `61ed1dc7c646d7de` | PASS |
| projectile | `2799a93d0037676b` | PASS |

SHA-256 do binário informado: `1a55e73aed876f1108ef643c51525764a4f7f675b49b4f16a119ddde872faf65`. Registros locais: `Desktop/PC-Engine-Lab-Backups/baseline-v13.json`. A comparação entre cenários *diferentes* deve divergir; isso não é regressão.

## Arquivamento e limites

- Máximo informado no ambiente local: 32 diretórios ativos por engine, com limite adicional de volume de bytes.
- Foram preservados 81 registros após a limpeza integral informada: 48 headless + 33 interativos; 57 ativos migrados para histórico e os 24 históricos anteriores mantidos.
- Backups de quatro coleções tiveram verificação SHA-256 segundo o log do operador; ambos os históricos ativos ficaram em 0/32 imediatamente após a limpeza.
- Retenção V1.2: avisos a partir de 24/32, crítico em 30/32, sugestão assistida; arquivamentos exigem confirmação explícita.
- Nunca promover exclusão automática nem mover sessões em uso. Não versionar runs, backups, ROMs ou dumps privados no Git.

## Operação local (instalações correspondentes presentes)

Terminal backend:
```powershell
cd "C:\Users\balancerec\Desktop\MORTAL KOMBAT 3 ULTIMATE ENGENHARIA REVERSA STUDIO\UMK3-RE-STUDIO-Codex"
py -m uvicorn backend.server:app --host 127.0.0.1 --port 8000
```

Terminal HUD:
```powershell
cd "D:\Desenvolvimento\Sistemas\HUD Studio for SNES"
py .\scripts\serve-pc-engine.py --port 8015 --upstream-port 8000
```

Verificar `http://127.0.0.1:8000/api/engine/status` e `http://127.0.0.1:8015`. Evitar publicar essas portas externamente. Consultar rotas V1.1/V1.2 somente quando o respectivo hotfix estiver efetivamente instalado.

## Política de versões e homologação

**Publicado no Git** ≠ **instalado no Windows** ≠ **testado por mocks** ≠ **homologado em C++ real**. Não marcar etapa como concluída com base apenas na existência de um painel. Antes de publicar código das V0.4.x, comparar os arquivos locais com o branch, rodar testes existentes e revisar diffs de `index.html`, JS e CSS.

## Documentos relacionados

- [Arquitetura existente](ARCHITECTURE.md)
- [PC Engine Foundation V0.3.6](PC_ENGINE_FOUNDATION_V036.md)
- [Visual Debugger V0.3.7](PC_ENGINE_VISUAL_DEBUGGER_V037.md)
- [Diagnostics V0.3.8](PC_ENGINE_DIAGNOSTICS_V038.md)
- [Pipeline de animação e playtest](ANIMATION_COMBAT_PLAYTEST_ROADMAP.md)
