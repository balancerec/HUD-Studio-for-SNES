
## V0.3.0 — Blend Modes & GIF FX

### Controles: Inspector → Efeitos visuais · PNG / GIF

- **Normal, Multiplicar, Tela (Screen), Somar, Clarear, Escurecer e Diferença:** composição no palco usando CSS `mix-blend-mode` e exportação PNG via Canvas 2D.
- **Subtrair:** subtração real RGB por pixel **na exportação PNG**; a prévia utiliza o modo `difference` como aproximação devido à ausência de `subtract` nativo no CSS.
- **Força do efeito:** controla a opacidade da camada de composição, independente da opacidade principal do sprite.
- **Remover preto:** filtro de luminância com tolerância e suavização por Alpha (não remove fundo fisicamente do GIF de origem). Ative para GIFs com fundo preto; a prévia tenta processar os quadros animados em tempo real com Canvas 2D até ~25 fps, limitando resolução de processamento para desempenho.
- **Persistência:** `blendMode`, `fxStrength`, `darkKey`, `darkThreshold`, `darkFeather` adicionados ao JSON; arquivos antigos continuam com `normal` e o filtro desligado.
- **Exportação:** captura PNG de um quadro do GIF (não exporta GIF animado). Subtrair usa pixels do fundo na imagem atual. As limitações de navegador/performance e de transparência são descritas acima.

### Testes

```powershell
py .\tests\smoke-test.py
node .\tests\blend-fx-v030.test.cjs
node .\tests\editor-v029.test.cjs
node .\tests\hit-test.test.cjs
node .\tests\dynamic-bars.test.cjs
```

**Validação visual obrigatória:** teste fumaça.gif sobre o cenário no Edge com `Tela`, `Somar`, `Remover preto`, tolerância e suavização; confira a exportação. O teste automatizado com Chromium não pôde abrir URLs locais no ambiente de preparação.

# HUD Studio for SNES

Editor visual experimental de HUDs e elementos de interface para jogos, com inspiração no fluxo de trabalho de editores de mídia como FL Studio.

> **Estado:** protótipo estático, sem compilação. O nome expressa o objetivo do projeto; a versão atual **não gera automaticamente arquivos ou código compatíveis com hardware SNES**. O editor trabalha com PNGs RGBA e canvas Full HD.

## Desenvolvimento V0.2.0 — branch `feat/editor-v0.2.0`

- Hit-test por pixel visível, com eventos centralizados no palco e respeito a rotação/espelhamento/zoom.
- Régua horizontal e vertical, guias magnéticas e alinhamento ao canvas.
- Undo/Redo com botões e atalhos (`Ctrl+Z`, `Ctrl+Y` ou `Ctrl+Shift+Z`).
- Regressão automatizada do alpha com Node.js (`node tests/hit-test.test.cjs`).

**Importante:** implementação em desenvolvimento; o teste estático/regressão não substitui validação manual no navegador Windows.


## V0.2.8 — DynamicBar Reconstruction (desenvolvimento)

Recriação em três camadas para as **quatro barras**: `empty` (fundo vazio), `fill` (miolo com máscara interna específica) e `frame` (moldura fixa). Os miolos coloridos utilizam **texturas extraídas dos PNGs da Master** (`assets/miolos-4-cores/`); suas formas foram recortadas com máscaras geradas a partir da arte existente. A textura é repetida horizontalmente, não esticada até a largura total.

- Assets: `assets/dynamic-bars/reconstructed/` (4 frames, 4 empty, 4 máscaras e 20 preenchimentos).
- Catálogo: `assets/dynamic-bars/reconstructed/manifest.json`.
- Compatibilidade: projetos V0.2.4–V0.2.7 são remapeados em memória ao importar; guarde backup do JSON original.
- Exportação PNG: usa a mesma ordem de desenho e o mesmo cálculo de recorte que a prévia.
- Teste: `py tests/dynamicbar-reconstruction-v028.test.py` (ou `python` no Linux).

**Limitações:** as máscaras derivam de classificação de cor e precisam de inspeção final de bordas no Edge. A textura real é aplicada dentro da máscara, mas a adaptação à altura e repetição horizontal podem produzir emendas. Não foi possível validar a interface em Chromium neste ambiente.

## Funcionalidades atuais

- Canvas **1920 × 1080**, zoom e background substituível (PNG/JPEG/WebP).
- Biblioteca local de sprites PNG e arrastar da biblioteca para o canvas.
- Movimentação, redimensionamento e rotação por mouse; painel de propriedades X/Y, largura/altura, rotação, opacidade e Z.
- Espelhamento horizontal/vertical, duplicação, bloqueio, visibilidade e ordenação das camadas.
- Grade visual configurável (8/16/32/64 px) e opção de snap.
- Importar/exportar projeto JSON e exportar composição PNG, com ou sem background.
- Undo básico e atalhos de teclado.

### Limitação conhecida

**HIT-001 em validação:** substituímos a captura das caixas por seleção centralizada por máscara alpha, mas a correção ainda requer aceite visual do usuário no navegador Windows. Consulte [docs/KNOWN_ISSUES.md](docs/KNOWN_ISSUES.md).

## Execução

**Opção A: servidor HTTP local (recomendado).** No PowerShell, dentro da pasta do projeto:

```powershell
py -m http.server 8000
```

Abra <http://localhost:8000> no navegador. Não requer `npm install`, backend ou banco de dados. Se você não tiver Python, use outro servidor HTTP estático.

**Opção B:** abrir `index.html` diretamente; algumas funções de canvas e exportação podem ser restringidas pelo navegador no protocolo `file://`.

## Estrutura

```text
HUD-Studio-for-SNES/
├── index.html                    # Aplicação HTML/CSS/JS
├── assets/                       # Sprites PNG e HUD de referência
├── docs/
│   ├── ARCHITECTURE.md
│   ├── KNOWN_ISSUES.md
│   └── ROADMAP.md
├── scripts/
│   └── publicar-github.ps1       # Script Git seguro para Windows
├── tests/
│   └── smoke-test.py             # Testes estáticos do pacote
├── .github/workflows/validate.yml
├── .gitignore
├── .gitattributes
└── README.md
```

## Testes

```powershell
py tests/smoke-test.py
node tests/hit-test.test.cjs
```

O teste verifica a estrutura, referências aos PNGs e integridade básica dos assets. Quando `node` está disponível, também verifica a sintaxe do JavaScript embutido.

## Publicação GitHub

Repositório: https://github.com/balancerec/HUD-Studio-for-SNES

Para publicar a pasta local pela primeira vez, use [scripts/publicar-github.ps1](scripts/publicar-github.ps1) a partir da raiz. O script **não substitui commits existentes nem faz force push** e exige a opção `-Push` para enviar ao remoto.

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\publicar-github.ps1
# verifique o relatório; depois publique:
powershell -ExecutionPolicy Bypass -File .\scripts\publicar-github.ps1 -Push
```

Os PNGs incluídos são recursos de referência da interface do projeto e podem conter elementos associados a Mortal Kombat. Verifique os direitos de uso/distribuição antes de licenciar ou redistribuir comercialmente esses assets. **Nenhuma licença de código aberto foi aplicada automaticamente.**

## Incremento v0.2.1 — Seleção e navegação

- **Shift + clique:** adicionar/remover sprites da seleção (inclui membros de grupos).
- **Arrastar no vazio:** seleção por retângulo.
- **Ctrl + G:** agrupar itens selecionados; **Ctrl + Shift + G:** desagrupar.
- **Arrastar sprite selecionado:** mover seleção ou grupo junto.
- **Botão do meio + arrastar:** deslocar a visualização (pan).
- **Ctrl + roda do mouse:** zoom, mantendo aproximadamente o ponto do cursor.
- **Setas:** mover sprites selecionados; **Shift + setas:** incrementos de 10 px.
- **Del:** excluir a seleção.

Todos os projetos antigos mantêm compatibilidade com `groupId` opcional (nulo quando ausente). Os PNGs permanecem intactos. Os recursos de seleção em caixa e agrupamento ainda devem ser conferidos visualmente em Chromium/Edge no Windows.

```powershell
py .\tests\smoke-test.py
node .\tests\hit-test.test.cjs
node .\tests\editor-v021.test.cjs
```

## Incremento v0.2.2 — Visual Polish (pré-commit)

- Barra superior em quatro grupos: **Visualização**, **Seleção**, **Histórico** e **Saída & zoom**.
- Inspector com cartões separados: **Transformação**, **Espelho & visibilidade**, **Alinhamento**, **Organização & camadas** e **Remoção**.
- Botões de alinhamento em grade 3 × 2, espaçamento e altura uniformes, exclusão em seção isolada.
- Layout responsivo da toolbar para não comprimir os controles em resoluções menores.
- IDs de controles e handlers do editor mantidos (sem alterações planejadas na lógica de edição).

Validação adicional: `node tests/ui-v022.test.cjs`. Recomenda-se conferir no Edge em 1920 × 1080 e também com janelas menores antes de fazer commit.

### Ferramentas v0.2.3 — Edição de grupos

- `Shift + clique`: seleção múltipla; `Ctrl + G`: agrupar; `Ctrl + Shift + G`: desagrupar.
- `Ctrl + D` ou **Duplicar seleção**: duplica todos os itens selecionados. Grupos novos recebem IDs independentes.
- **Espelhar H / V**: reflete o conjunto ao redor do centro da seleção, preservando as posições relativas espelhadas.
- `Delete`: exclui todos os itens selecionados; **Copiar** / `Ctrl + C`: copia sprites; `Ctrl + V`: cola cópias deslocadas.
- `Ctrl + V` com imagem na área de transferência: insere imagem como sprite editável. **Importar imagem**: escolhe arquivo PNG, JPEG ou WEBP (GIF aceito como sprite estático no canvas).
- Para projetos com imagens coladas, exporte o projeto JSON antes de fechar a aba: o limite de armazenamento local do navegador pode ser excedido.


## DynamicBar v0.2.4 (prévia)

Painel de barras dinâmicas com camadas separadas de moldura e preenchimento. No Browser, arraste uma barra de Vida/Corrida, ou clique em **Adicionar 4 barras dinâmicas** para o par P1/P2. Selecione a barra e ajuste seu valor (0–100%), categoria e direção no Inspector. **Simular combate** pré-visualiza mudanças, e **Parar** restaura o valor anterior. Export PNG inclui o quadro renderizado; JSON inclui as propriedades. Consulte `docs/DYNAMIC_BARS.md`.

### Instalação no Windows

Trabalhe na branch `feat/editor-v0.2.0`. Faça backup de eventuais alterações não commitadas antes de extrair o pacote ZIP **na raiz do projeto** (`D:\Desenvolvimento\Sistemas\HUD Studio for SNES`). Verifique os testes antes de commit/push.

Para iniciar somente com as quatro barras, use **Importar JSON → examples/dynamic-bars-4.json**. Para acrescentar as quatro barras ao projeto existente, clique em **Adicionar 4 barras dinâmicas**. Se seu HUD já tiver barras estáticas, apague-as caso prefira não sobrepor os elementos.

## V0.2.5 — Master Asset System (desenvolvimento)

A master **Metal e Lava** (`assets/master-v1/MASTER_ORIGINAL_1536x1024.png`) foi adicionada como fonte de referência, com 37 recortes RGBA e catálogo pesquisável por categorias. Use o seletor **Biblioteca** para filtrar Molduras, Miolos, Estados, Extras e Referência. Os recortes são fiéis às regiões da master, mas ainda aguardam limpeza dos halos; veja `docs/MASTER_ASSET_SYSTEM_V025.md`.


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

### V0.2.7 — Editor de Preenchimentos
Selecione uma DynamicBar de vida/corrida e troque a paleta do preenchimento entre vermelho, verde, azul, lilás e pink no **Inspector**. A moldura, dimensões e Alpha permanecem fixos. Valores entre 0–100% continuam disponíveis, e PNG/JSON incluem a cor atual.

Detalhes técnicos e limitações: [docs/FILL_EDITOR_V027.md](docs/FILL_EDITOR_V027.md).

## Editor V0.2.9 — Transformações e FX

- Quatro alças de redimensionamento, com **Shift + arrastar** para redimensionar a partir do centro.
- Inspector corrigido para não extrapolar o painel lateral.
- Pulsação ajustável por sprite (0,2–4 Hz, 0–20% de intensidade).
- Parallax opcional de background com ajuste de intensidade.
- Imagens GIF animadas aceitas como sprites e como fundo.
- Configurações persistidas no JSON; PNG exporta somente um quadro estático.

Documentação: [docs/EDITOR_V029.md](docs/EDITOR_V029.md).

## V0.3.1 — Smart HUD Authoring (experimental)

Painel **Smart HUD** (sempre visível no Inspector): adicionar nomes P1/P2, selecionar personagem por jogo, inserir materiais sob molduras, cronômetro central 1/2/3 min, Mirror Quantize e colorização de fumaça (tint/brilho/contraste/saturação). Veja `docs/SMART_HUD_V031.md`.

Os encaixes de material usam máscaras poligonais aproximadas e precisam de validação visual para cada moldura. O timer é uma prévia de editor, não um contador conectado ao motor do jogo. GIFs seguem animados no navegador, mas exportar PNG captura um quadro. O modo Subtrair permanece uma aproximação visual na prévia.

Validar: `node tests/smart-hud-v031.test.cjs` e `py tests/smoke-test.py`.

## V0.3.2 — Precision Editing

Réguas X/Y deslocadas para fora do canvas, guias auxiliares criadas por arrastar e com snap magnético; hierarquia corrigida de camadas (topo/fundo/um nível); reflexo luminoso animado percorrendo a borda opaca das molduras, com cor, velocidade e intensidade. Configurações e guias persistem no JSON. Consulte `docs/PRECISION_V032.md`.

## V0.3.2+ — Salvamento, tipografia e precisão

- **Salvar estado (.json)** ou `Ctrl+S`: backup portátil do projeto, incluindo sprites, guias, efeitos, materiais e configurações de espelhamento.
- **Fonte em caixa alta:** Smart HUD renderiza textos em Impact/Arial Black.
- **Mirror Quantize 2.0:** X=960/Y=540, horizontal/vertical/duplo, tolerância configurável, vínculo entre pares e diagnóstico visual.
- **Pivôs e alinhamento:** pivô percentual por objeto, centralização exata, prévia e exportação com o mesmo pivô.
- **Máscaras e materiais:** cortes percentuais nas quatro bordas, presets V/hexagonal/retangular, escala, rotação, deslocamento de textura.
- **Validação:** veja `docs/PRECISION_V032_PLUS.md`. Testes no Chromium não puderam ser concluídos neste ambiente; valide no Edge.


## V0.3.3 — FX Fidelity / Legacy Project Recovery

- Corrige projetos antigos com GIF de **fumaça** de fundo preto: migração dirigida somente a sprites cujo rótulo contém `fumaça`, `smoke`, `fog` ou `neblina` e `.gif` (dark key limiar 25, feather 65, blend screen). **GIFs dos lutadores não são alterados**. A propriedade `fxPipelineVersion: 3` impede migração repetida depois de um salvamento. Pode ajustar dark key, feather, blend, tint no Inspector.
- Nome de lutador: preserva texto legível mesmo quando o sprite é espelhado no eixo X ou Y. Projetos antigos com `flipX` em texto são corrigidos na importação. Rótulo atualizado a partir do conteúdo e lado da tela.
- Cronômetro: a escolha de 1/2/3 minutos sincroniza imediatamente os segundos restantes e a prévia; quando reabre o JSON, o Inspector exibe a duração salva. Projetos antigos com cronômetro concluído em 00:00 permanecem concluídos até o usuário mudar a duração ou clicar em Reiniciar.
- Materiais: `materialParentId` vincula novos miolos às molduras. Projetos antigos têm os preenchimentos centrais reorganizados imediatamente abaixo da moldura correspondente.
- Exportação: pipeline `key preto → alpha → tint preservando alpha → blending → PNG`; mantida captura estática do quadro corrente dos GIFs.
- Persistência: o JSON agora é `version: 5`; mantém `guides`, `editor` e parâmetros de FX por sprite.

**Atenção**: ao importar um arquivo antigo, o tratamento de fumaça é deliberadamente migrado, não é uma reprodução bit a bit da configuração antiga. Salve o JSON corrigido separadamente.

**Limitação**: teste automatizado interativo no Chromium indisponível neste ambiente (`ERR_BLOCKED_BY_ADMINISTRATOR`). Faça a comparação no Edge com o GIF animando e após exportação PNG.

## V0.3.4 — Auto Trim (PNG / GIF)

- Inspector → **✂ Auto Trim · PNG / GIF**: **Cortar vazios** encontra o limite de pixels visíveis, descontando margens e mantendo o objeto na posição do palco. **Restaurar margens** reverte o recorte sem substituir o arquivo de origem.
- A seleção múltipla permite aplicar o recorte a vários sprites PNG/GIF; barras dinâmicas, textos e materiais são protegidos.
- GIF: usa `ImageDecoder` do Edge/Chrome para calcular a **união de todos os quadros**. O movimento permanece animado na prévia. Se o navegador não suportar o decodificador, o corte é recusado para impedir perda de braços/pernas em outros quadros.
- Limiar alfa, margem de segurança e opção de avaliar a remoção do fundo preto (quando Dark Key está ativo) são configuráveis.
- O recorte é **não destrutivo**, serializado como `trimRect` no projeto JSON (esquema v6). Prévia, hit-test e exportação de PNG usam a região de origem correspondente.
- Nota: para GIF preto-opaco, ative *Dark Key* no sprite antes do Auto Trim. GIFs de personagens com fundo escuro que tenham pixels visíveis muito escuros podem exigir ajuste do limiar para evitar cortar detalhes.
- Validação interativa no navegador precisa ser realizada no Edge do usuário; o Chromium do ambiente de build bloqueou acesso a `localhost` (ERR_BLOCKED_BY_ADMINISTRATOR).


## V0.3.5 — Auto Trim Pro

Comparador antes/depois, margens editáveis nas quatro bordas e economia de área exibida no Inspector. O GIF preserva a animação e o corte permanece não destrutivo. Veja `docs/AUTO_TRIM_PRO_V035.md`.


## Hotfix v0.3.5.1 — GIF de fumaça após Auto Trim
Amostragem independente dos quadros de GIF com Dark Key; documentação em `docs/SMOKE_GIF_PLAYBACK_V0351.md`.

## V0.3.5.2 — Presets de tela: PC, SNES e Mobile

O seletor **Canvas → Formato de vídeo → Tela** oferece:

| Preset | Resolução interna | Orientação |
|---|---:|---|
| PC widescreen | 1920 × 1080 | horizontal |
| SNES Hi-Res | 512 × 448 | horizontal (pixel aspect ratio a conferir no dispositivo) |
| SNES clássico | 256 × 224 | horizontal (resolução NTSC habitual) |
| Mobile retrato | 1080 × 1920 | vertical |
| Mobile retrato leve | 720 × 1280 | vertical |
| Mobile paisagem | 1280 × 720 | horizontal |

A troca de preset usa transformação uniforme com **contain**, centraliza o conteúdo remanescente e NÃO estica personagens. Posições, dimensões e tamanhos tipográficos são adaptados, mantendo o recorte de PNG/GIF no sistema de coordenadas do arquivo original. As réguas, guias, eixos do espelho, canvas de diagnóstico, exportação e salvamento JSON seguem o preset selecionado. O zoom automático considera largura e altura disponíveis para mostrar o canvas vertical.

**Importante:** trocar de 16:9 para vertical com *contain* deixa espaços vazios acima e abaixo; isso é intencional para evitar deformação/corte. Recomponha os elementos para criar uma interface mobile específica. A exportação PNG salva nas dimensões físicas selecionadas; **não** converte o HUD em tiles, sprites, paletas, OAM ou ROM de SNES. As resoluções SNES não implicam automaticamente renderização de aspecto 4:3/CRT, nem certificação de limites de hardware.

Teste: `node tests/screen-presets-v0352.test.cjs`. Faça backup do projeto em JSON antes de experimentar várias proporções de tela.

## V0.3.5.3 — Adaptive Layouts (PC / SNES / Mobile)

A conversão agora reposiciona cada componente por função, em vez de reduzir o HUD inteiro por um único fator. Ative **Adaptar HUD** no seletor de tela e use **Reorganizar itens** em projetos antigos já encolhidos. Modos suportados: PC 1920x1080; SNES 512x448 e 256x224; mobile 1080x1920, 720x1280 e 1280x720.

Ajustes de cada formato são preservados individualmente no JSON v8 (`layoutProfiles`) e o layout de referência é mantido (`layoutSource`). `scripts/adaptive-layout.js` é testado com `node tests/adaptive-layout-v0353.test.cjs`. GIFs, Auto Trim, dark key e materiais continuam não destrutivos. Consulte `docs/ADAPTIVE_LAYOUTS_V0353.md`.


## V0.3.5.4 — Viewport e layouts manuais

Barras de rolagem visíveis, Ctrl+roda com âncora no cursor e seis presets manuais recuperáveis. Consulte `docs/VIEWPORT_ZOOM_LAYOUTS_V0354.md`.


### V0.3.5.5 — Auditoria de layouts
Botão **Auditar 6 telas** detecta perfis ausentes ou inválidos e elementos fora do palco, sem alterar a composição. Relatório JSON opcional. Consulte `docs/QUALITY_AUDIT_V0355.md`.

## V0.3.6 — PC Engine Integration Foundation (experimental)

Painel **Abrir PC Engine Lab** integrado à toolbar e isolado do HUD, com `GET status`, execução de cenários nativos via backend local, snapshots e repetição/comparação. Inicie o FastAPI original em 127.0.0.1:8000 e o servidor HUD same-origin via `py scripts/serve-pc-engine.py --port 8015 --upstream-port 8000`. Não exporta nem altera sprites ou projetos. Documentação em `docs/PC_ENGINE_FOUNDATION_V036.md`.

## PC Engine Lab — integração e plano jogável (2026-11-17)

- [Estado da integração, histórico de armazenamento, baseline e distinção Git/local](docs/PC_ENGINE_STATUS_E_INTEGRACAO_20261117.md)
- [Roadmap de animação, combate e Playtest Arena (V0.4.2–V0.7.0)](docs/ANIMATION_COMBAT_PLAYTEST_ROADMAP.md)

**Nota:** hotfixes V0.4.0/V0.4.1 e serviços de armazenamento foram validados no ambiente local informado pelo operador, mas não devem ser presumidos como código já publicado nesta branch. A engine C++ é um protótipo independente, sem equivalência de gameplay com a ROM UMK3 comprovada.
