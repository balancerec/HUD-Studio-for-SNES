# HUD Studio v0.3.7 — PC Engine Visual Debugger

## Entrega

Atualização incremental sobre o HUD Studio v0.3.6 confirmado em execução. Mantém a bridge `scripts/pc-engine-adapter.js`, o servidor `scripts/serve-pc-engine.py`, contratos `/api/engine/...` e os arquivos do backend original. Não contém ROMs, arquivos C++, ou estados reais de jogo.

- Viewport canvas **separado** do palco HUD: grade, chão, lutadores, vida e projéteis, na medida em que esses campos constem do snapshot.
- Conversão experimental de coordenadas `x,y,vx,vy` por 256 (Q8); **não é uma alegação de equivalência com coordenadas SNES ou com lógica de jogo UMK3**. Como o viewport projeta a faixa horizontal detectada, não é um renderizador de cenário calibrado.
- Timeline com primeiro/anterior/reproduzir/pausar/próximo/último frame, barra de navegação e velocidade 5/10/20/30 FPS. Reprodução é local dos snapshots e não avança o motor C++.
- Inspector de entidades, dados brutos e estados. Campos ausentes são omitidos/rotulados como desconhecidos.
- `Repetir e comparar` usa **nova execução nativa**, comparação do backend e varredura independente dos hashes dos snapshots; mostra primeira divergência detectável. Comparação de hashes não prova igualdade binária completa dos estados.
- Aviso não destrutivo de limite de 32 execuções. Storage Manager completo (arquivamento/limpeza via interface) **não foi implementado**, pois a API atual não oferece rotas seguras para a operação.

## Instalação segura

1. Extraia este ZIP em uma pasta temporária, não diretamente sobre o projeto.
2. Em PowerShell, na pasta temporária, execute:

```powershell
powershell -ExecutionPolicy Bypass -File .\INSTALL-V037.ps1 -ProjectRoot 'D:\Desenvolvimento\Sistemas\HUD Studio for SNES'
```

O script verifica a base V0.3.6 e os arquivos do pacote, cria backup em `backups/pc-engine-v036-before-v037-*`, copia somente o painel, o CSS, o visualizador, documentação e testes; edita **uma única âncora** do `index.html` para inserir `scripts/pc-engine-visual-v037.js` antes do painel. Não modifica o JSON do usuário, os assets ou o backend UMK3. Rode com o proxy HUD parado e recarregue `Ctrl+F5` após reiniciar.

## Testes

```powershell
node .\tests\pc-engine-visual-v037.test.cjs
node .\tests\pc-engine-foundation-v036.test.cjs
py .\tests\pc-engine-proxy-v036.test.py
py .\tests\pc-engine-http-v036.test.py
py .\tests\smoke-test.py
```

Testes do V0.3.7 foram realizados contra mocks e arquivos locais no ambiente de empacotamento; testes ponta a ponta com o C++ real só podem ser homologados no Windows do operador.

## Operação

Mantenha backend `127.0.0.1:8000` e proxy HUD `127.0.0.1:8015` ativos; abra `http://127.0.0.1:8015`. Clique em `Abrir PC Engine Lab`, execute `projectile`/`100`, navegue pela timeline e clique em `Repetir e comparar`. A regressão conhecida é `2799a93d0037676b` para o cenário de referência.

## Limites e riscos conhecidos

- A projeção geométrica é esquemática, sem sprites, hitboxes nativas, animações reais, câmeras ou sistema de colisão mapeados na UI.
- Entidades sem coordenadas são listadas no inspector, mas não desenhadas.
- A comparação local identifica divergência por hashes; a comparação remota continua autoritativa para seus campos próprios.
- Não há importação de dumps, edição de ROM, escrita do estado da engine, manipulação de projetos do HUD ou exclusão de execuções.
- O backup fica no diretório do projeto, fora dos caminhos expostos pelo proxy dedicado, conforme roteamento V0.3.6.
