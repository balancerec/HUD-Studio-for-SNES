# HUD Studio V0.3.6 — PC Engine Integration Foundation

## Escopo

Integração experimental **somente de visualização e execução de cenários**. O PC Engine Lab não substitui o canvas do HUD Studio e não passa a controlar personagens, barras, animações ou sprites. A engine segue no repositório UMK3-RE-STUDIO-Codex, executada pelo próprio backend FastAPI. Não copiamos código C++, ROMs, dumps nem SQLite para o HUD Studio.

Arquivos novos:

- `scripts/pc-engine-adapter.js`: validação de endpoints, cenários, IDs e snapshots, consumo da API documentada `ng-state-1` / `ng-lab-view-1`.
- `scripts/pc-engine-panel.js` e `.css`: painel modal isolado do estado do editor; status, execução, inspeção de snapshots, repetição e comparação.
- `scripts/serve-pc-engine.py`: servidor HTTP local limitado a arquivos necessários do HUD e proxy same-origin para **cinco rotas** do PC Engine Lab. Não permite escolher executável, arquivo ou path pelo navegador. Não expõe arquivos pessoais de `examples/`.
- `tests/pc-engine-*`: testes de contrato, proxy e fluxo HTTP mock.

## Contratos

| Solicitação | Backend real |
|---|---|
| GET `/api/engine/status` | `engine_routes.py::status` |
| GET `/api/engine/scenarios` | `engine_routes.py::scenarios` |
| GET `/api/engine/runs` | `engine_routes.py::runs` |
| POST `/api/engine/runs` | JSON `{"scenario":"projectile","frames":100}` |
| GET `/api/engine/runs/{run_id}` | Metadados, regras e snapshots |
| POST `/api/engine/compare` | JSON `{"left":"<hex32>","right":"<hex32>"}` |

Não fazemos upload, importação de trace, leitura arbitrária de arquivos ou controle nativo interativo nesta fase. CORS não é aberto: o proxy atende somente na interface loopback e encaminha requests permitidos ao backend no loopback.

## Inicialização no Windows

**Janela PowerShell 1 — Engine original**, no diretório `UMK3-RE-STUDIO-Codex` (com backend e `ng_headless.exe` compilados):

```powershell
cd "C:\Users\balancerec\Desktop\MORTAL KOMBAT 3 ULTIMATE ENGENHARIA REVERSA STUDIO\UMK3-RE-STUDIO-Codex"
py -m uvicorn backend.server:app --host 127.0.0.1 --port 8000
```

Se o backend utiliza venv ou outras dependências, execute o comando a partir do ambiente original do UMK3-RE-STUDIO. O backend do ZIP de auditoria era **incompleto** e não deve ser usado como servidor.

**Janela PowerShell 2 — HUD Studio v0.3.6**:

```powershell
cd "D:\Desenvolvimento\Sistemas\HUD Studio for SNES"
py .\scripts\serve-pc-engine.py --port 8015 --upstream-port 8000
```

Abra **http://127.0.0.1:8015**, clique em **Abrir PC Engine Lab**, depois **Verificar engine** e **Executar** com `projectile / 100`. O hash final esperado é `2799a93d0037676b`. Clique em **Repetir e comparar** para fazer outra execução C++ e verificar o atributo `identical`. Se não houver engine ou compilação, o modal mostra o erro sem bloquear a edição do HUD.

> Não execute `py -m http.server 8000` para esta integração: o host dedicado na porta 8015 fornece o encaminhamento de API. A API original também usa a porta 8000, mas em outro processo.

## Segurança e integridade

- O painel **não salva ou altera** sprites, layoutProfiles, JSON HUD, GIFs ou presets.
- A renderização dos snapshots é textual nesta fundação; não há mapeamento visual automático de Q256 nem promessa de equivalência com gameplay SNES.
- Somente `/index.html`, recursos `assets/`, `scripts/` e o JSON compacto `manual-layout-profiles-v0353.json` são servidos; por padrão os projetos pessoais do diretório `examples/` não ficam acessíveis.
- O proxy valida Host, Origin, `Sec-Fetch-Site`, método, rota, tamanho e Content-Type; retira credenciais e cookies do upstream. O servidor só se associa a `127.0.0.1`.
- Não altera nem publica a branch do UMK3-RE-STUDIO.

## Testes

```powershell
node .\tests\pc-engine-foundation-v036.test.cjs
py .\tests\pc-engine-proxy-v036.test.py
py .\tests\pc-engine-http-v036.test.py
py .\tests\smoke-test.py
node .\tests\layout-quality-v0355.test.cjs
```

Os testes HTTP usam backend simulado; **não demonstram o caminho HTTP→C++ real no Windows**. Esse teste e a revisão visual no Edge devem ocorrer na instalação local. Na fase seguinte, incluir teste ponta a ponta com backend/engine do projeto original, desenho opcional de estados em camada isolada e controles `pause→step→quit`.
