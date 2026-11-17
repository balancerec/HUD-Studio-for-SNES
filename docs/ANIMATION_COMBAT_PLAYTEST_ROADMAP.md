# HUD Studio → Sprite & Animation Studio → Playtest Arena

**Tipo:** especificação de produto e plano de implementação — **não descreve recursos já concluídos**.
**Revisão:** 2026-11-17. **Alvo:** protótipo de luta local 2D para PC, sem alegação de equivalência à ROM UMK3.

## Objetivo de aceite da primeira versão jogável

Duas entidades controláveis em um cenário de projeto HUD, com `idle`, caminhada, salto, ataque, defesa, reação a dano, barra de vida, timer, pausa e reinício. Controle por teclado remapeável; segundo controle e gamepad em fase posterior, após testes de foco, simultaneidade e latência.

## Fronteiras arquiteturais

```text
HUD Studio (autor de composição) ──exporta manifesto de arena──┐
Sprite & Animation Studio ───────exporta atlas/animations─────┤
                                                          ↓
Input Adapter → Combat Runtime determinístico (ticks fixos) → snapshots/eventos
                                                          ↓
Playtest Renderer (canvas separado do editor) → overlay HUD vinculado a estado
                                                          ↓
Replay / Debug A/B / Regression Suite (read-only)
```

- Modo **Editar** nunca executa lógica de combate; modo **Jogar** nunca reescreve silenciosamente as coordenadas e objetos do projeto HUD.
- A arena usa projeção e câmera explícitas, não a escala horizontal adaptativa do viewport experimental.
- A engine é a fonte da verdade para vida, estados, colisões e eventos. O renderizador só interpreta snapshots.
- Um loop de renderização variável não pode alterar a simulação; entradas devem ser convertidas em comandos indexados por tick.
- O formato dos arquivos deve ser versionado e validado; paths relativos restringidos ao diretório de assets. Limitar tamanho e quantidade de imagens carregadas.

## Etapas e gates

### V0.4.2 — Native Collision Bridge (P0)

1. Auditar estruturas reais C++ e frames do protocolo `ng-state-1` / `ng-lab-view-1`.
2. Adicionar contrato geométrico explícito em coordenadas de mundo, orientação e unidades; preservar campos anteriores.
3. Expor volumes de ataque / vulnerabilidade **apenas quando produzidos pela engine**.
4. Validar interseções e eventos nativos separadamente de cálculos ilustrativos no frontend.
5. Demonstrar que os hashes de estado da baseline continuam iguais se a instrumentação não mudar gameplay; se houver mudança deliberada, versionar a nova baseline e explicar a diferença.

**Gate:** A/B de mesmo cenário igual; caixas posicionadas corretamente em pelo menos dois frames verificados; sem volumes inventados.

### V0.5.0 — Sprite & Animation Studio (P1)

Editor de frames com PNG transparente e spritesheet, atlas, origem e anchor do pé, direção/facing, duração por quadro, looping e preview; eventos `startup/active/recovery` e metadados opcionais da timeline. Separar animação visual da lógica de dano.

Sequências mínimas: `idle`, `walk_forward`, `walk_backward`, `jump`, `crouch`, `punch_high`, `punch_low`, `kick_high`, `kick_low`, `block`, `hit_reaction`, `knockdown`, `victory`. Golpes especiais serão adicionados após a primeira iteração.

**Gate:** animações reproduzíveis sem drift de pés, exportação/importação consistente e playback no viewport.

### V0.6.0 — Combat Runtime (P1)

Duas entidades, controle de inputs em ticks, máquina de estados, restrições de movimento, física simples, contato, invulnerabilidade/defesa quando modeladas, dano e timeout. Deve oferecer replay determinístico e testes para transições inválidas. Evitar confundir entrada local de 60 Hz com simulação de gameplay da ROM.

**Gate:** duas execuções com mesma seed e sequência de inputs produzem estados idênticos; teste de ataque, defesa, dano e nocaute; sem regressão V1.3.

### V0.7.0 — Playtest Arena (P1)

Integrar cenário e HUD já montados, sprites animados, HUD atualizado por snapshots, áudio opcional, menu de controles, pausa/reinício, visualização de colisão por flag de depuração. Não acoplar renderer experimental ao canvas de edição.

**Gate:** duas pessoas jogam no mesmo PC, com HUD e animações sincronizados e sem corromper o JSON do projeto.

## Exemplos de formatos propostos (não contratos implementados)

```json
{
  "schema": "hud-playtest-arena-v1",
  "stage": {"width": 1280, "height": 720},
  "background": "assets/arena.png",
  "fighters": [
    {"slot":"p1","animationSet":"fighters/p1/animations.json","spawn":{"x":320,"y":620}},
    {"slot":"p2","animationSet":"fighters/p2/animations.json","spawn":{"x":960,"y":620}}
  ],
  "hud": {"projectRef":"examples/arena-project.json"}
}
```

```json
{
  "schema": "hud-animation-set-v1",
  "origin": {"x": 0, "y": 0},
  "animations": {
    "idle": {"loop":true,"frames":[{"asset":"idle/001.png","durationTicks":6,"pivot":{"x":40,"y":118}}]}
  }
}
```

Os arquivos acima são *rascunhos* sujeitos à revisão da API de assets, das licenças e da coordenada de chão.

## Riscos e decisões abertas

- O projeto HUD usa imagens próprias e referências visuais; garantir direitos de uso dos sprites e trilhas antes de distribuir pacotes.
- Projetos antigos podem conter Data URLs grandes; preservar importação/exportação legado e testar limites.
- Definir mapeamento de botões, gamepad, input buffer e neutralização de input ao perder foco.
- Definir origem, direção do eixo Y, unidades world_q8, hitbox relativa/absoluta e clipping/câmera.
- Não publicar ROMs, dumps ou sprites extraídos de jogos comerciais sem permissões pertinentes.
