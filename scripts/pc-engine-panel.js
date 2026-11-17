/* HUD Studio V0.3.7 — isolated visual debugger over the existing V0.3.6 API. */
(function(){
  'use strict';
  const API=window.HUDPCAdapter,VIS=window.HUDPCVisual,DIAG=window.HUDPCDiagnostics;
  const launch=document.getElementById('pcEngineOpen');if(!API||!VIS||!DIAG||!launch)return;
  const badge=document.getElementById('pcEngineConnectionBadge'),client=API.makeClient();
  let view=null,currentRun=null,comparisonView=null,busy=false,playing=false,timer=null,selected=0;
  const dialog=document.createElement('dialog');dialog.id='pcEngineDialog';
  dialog.innerHTML=`
    <div class="engine-head"><h2>PC Engine Lab · Visual Debugger V0.3.7</h2><button type="button" data-act="close">Fechar</button></div>
    <div class="engine-content">
      <p class="engine-note">Visualização experimental do PC Engine C++ independente. Não altera o projeto HUD nem demonstra equivalência com UMK3/SNES.</p>
      <section class="engine-card"><h3>Conexão local</h3><div class="engine-controls"><button type="button" data-act="connect">Verificar engine</button><span id="pcEngineStatus">Não conectado</span></div><p class="engine-note">Backend 127.0.0.1:8000 · Proxy HUD 127.0.0.1:8015. Interface permanece funcional offline.</p></section>
      <section class="engine-card"><h3>Execução nativa C++</h3><div class="engine-controls"><label>Cenário <select id="pcEngineScenario">${API.SCENARIOS.map(s=>`<option value="${s}" ${s==='projectile'?'selected':''}>${s}</option>`).join('')}</select></label><label>Frames <input id="pcEngineFrames" type="number" min="1" max="1800" value="100" style="width:90px"></label><button type="button" data-act="run">Executar</button><button type="button" data-act="repeat">Repetir e comparar</button></div><p class="engine-note">Referência projectile/100: FNV-1a64 <code>2799a93d0037676b</code>.</p><div class="engine-summary" id="pcEngineRunSummary">Nenhuma execução carregada</div></section>
      <section class="engine-card"><h3>Viewport · projeção 2D experimental</h3><div class="engine-viewport-wrap"><canvas id="pcEngineViewport" width="820" height="290" aria-label="Visualização do estado da engine"></canvas></div><div class="engine-controls engine-timeline"><button type="button" data-act="first" title="Primeiro frame">⏮</button><button type="button" data-act="prev" title="Frame anterior">◀</button><button type="button" data-act="play" id="pcEnginePlay">▶ Reproduzir</button><button type="button" data-act="next" title="Próximo frame">▶</button><button type="button" data-act="last" title="Último frame">⏭</button><input aria-label="Selecionar tick" id="pcEngineTick" type="range" min="1" max="1" value="1" disabled><span id="pcEngineTickText">—</span><label>FPS <select id="pcEngineFPS"><option>5</option><option selected>10</option><option>20</option><option>30</option></select></label></div></section>
      <div class="engine-columns"><section class="engine-card"><h3>Inspector de entidades</h3><label>Entidade <select id="pcEngineEntity"></select></label><pre id="pcEngineEntityDetails">Selecione uma execução</pre><details><summary>Snapshot JSON bruto</summary><pre id="pcEngineSnapshot">Nenhum snapshot</pre></details></section><section class="engine-card"><h3>Comparação / diagnóstico</h3><div class="engine-controls"><button type="button" data-act="refresh">Listar execuções</button><button type="button" data-act="diff">Reavaliar diferença local</button></div><pre id="pcEngineRuns">Sem dados</pre><pre id="pcEngineComparison">Compare duas execuções independentes.</pre></section></div>
      <div class="engine-columns engine-diagnostics"><section class="engine-card"><h3>Eventos por frame · V0.3.8</h3><div class="engine-controls"><label>Filtro <select id="pcEngineEventFilter"><option value="all">Todos</option><option value="health">Vida</option><option value="state">Estados</option><option value="spawn">Spawns</option><option value="despawn">Desaparecimentos</option></select></label><span id="pcEngineEventCount">Nenhuma execução</span></div><div id="pcEngineEvents" class="engine-event-list" role="list"></div></section><section class="engine-card"><h3>Diferenças e armazenamento</h3><pre id="pcEngineEntityDiff">Compare duas execuções.</pre><p id="pcEngineStorage" class="engine-note">Histórico ainda não consultado.</p><p class="engine-note">Indicador baseado somente na lista HTTP. Não arquiva, exclui ou altera a engine.</p></section></div>
      <p class="engine-note">Armazenamento: a API V0.3.6 não permite arquivar. Quando atingir 32 execuções, arquive pelo fluxo externo validado. Nenhuma exclusão é feita pelo painel.</p>
      <p id="pcEngineFeedback" class="engine-note" role="status" aria-live="polite"></p>
    </div>`;
  document.body.appendChild(dialog);
  const find=id=>dialog.querySelector('#'+id);
  const feedback=(message,error=false)=>{const el=find('pcEngineFeedback');el.textContent=String(message);el.className='engine-note '+(error?'engine-error':'engine-success');};
  const getTick=()=>Number(find('pcEngineTick').value)||1;
  function stop(){playing=false;if(timer!==null){clearInterval(timer);timer=null;}find('pcEnginePlay').textContent='▶ Reproduzir';}
  function draw(){
    if(!view)return;
    const tick=getTick(),snap=view.snapshots[tick-1];if(!snap)return;
    find('pcEngineTickText').textContent=`${tick}/${view.snapshots.length}`;
    find('pcEngineSnapshot').textContent=JSON.stringify(snap,null,2);
    const entities=VIS.entities(snap),picker=find('pcEngineEntity');
    const prevIndex=Math.min(selected,Math.max(0,entities.length-1));selected=prevIndex;
    picker.replaceChildren();
    for(let i=0;i<entities.length;i++){
      const option=document.createElement('option');option.value=String(i);option.textContent=`${entities[i].kind} ${entities[i].id}`;picker.appendChild(option);
    }
    picker.value=String(selected);picker.disabled=!entities.length;
    find('pcEngineEntityDetails').textContent=entities.length?VIS.formatEntity(entities[selected]):'Nenhuma entidade disponível neste frame';
    VIS.paint(find('pcEngineViewport'),snap,selected);
  }
  function seek(tick){if(!view)return;find('pcEngineTick').value=String(Math.max(1,Math.min(view.snapshots.length,tick)));draw();}
  function play(){
    if(!view)return;
    if(playing){stop();return;}
    if(getTick()>=view.snapshots.length)seek(1);
    playing=true;find('pcEnginePlay').textContent='⏸ Pausar';
    const fps=Number(find('pcEngineFPS').value)||10;
    timer=setInterval(()=>{if(!view||!dialog.open){stop();return;}if(getTick()>=view.snapshots.length){stop();return;}seek(getTick()+1);},1000/fps);
  }
  function renderEvents(){
    const area=find('pcEngineEvents'),filter=find('pcEngineEventFilter').value;
    area.replaceChildren();if(!view){find('pcEngineEventCount').textContent='Nenhuma execução';return;}
    const all=DIAG.events(view),items=all.filter(event=>filter==='all'||event.kind===filter);
    find('pcEngineEventCount').textContent=`${items.length} exibidos / ${all.length} detectados (máx. 250)`;
    if(!items.length){area.textContent='Nenhum evento para o filtro.';return;}
    for(const event of items){const button=document.createElement('button');button.type='button';button.className='engine-event';button.textContent=`#${event.tick} · ${event.label}`;button.title='Ir ao frame '+event.tick;button.addEventListener('click',()=>{stop();seek(event.tick);});area.appendChild(button);}
  }
  function renderDifference(){
    if(!comparisonView||!view){find('pcEngineEntityDiff').textContent='Compare duas execuções.';return;}
    const d=DIAG.compare(comparisonView,view);
    find('pcEngineEntityDiff').textContent=`Hashes: ${d.identicalHashes?'iguais':'divergentes'}\nPrimeira divergência: ${d.firstDivergence??'nenhuma'}\nTick analisado: ${d.comparedTick}\nMudanças de entidade: ${d.entityDifferences.length}\n`+d.entityDifferences.slice(0,20).map(x=>`${x.entity}.${x.field}: ${JSON.stringify(x.left)} → ${JSON.stringify(x.right)}`).join('\n');
  }
  async function connect(){const status=await client.status();if(typeof status.available!=='boolean'||status.trace_schema!=='ng-state-1'||status.view_schema!=='ng-lab-view-1')throw new Error('Contrato da engine incompatível');badge.textContent=status.available?'Engine disponível':'Engine indisponível';find('pcEngineStatus').textContent=status.available?'ng_headless disponível':'Backend acessível, engine indisponível';feedback(status.classification||'Conexão local estabelecida.');return status;}
  async function loadRun(runId){
    stop();const data=API.validateView(await client.load(runId));view=data;currentRun=runId;comparisonView=null;selected=0;
    find('pcEngineTick').max=String(data.snapshots.length);find('pcEngineTick').value='1';find('pcEngineTick').disabled=false;draw();renderEvents();renderDifference();
    const result=API.checkProjectile(data),meta=data.run||{};
    find('pcEngineRunSummary').textContent=`ID: ${runId}\nCenário: ${meta.scenario||'—'} | Frames: ${result.frames}\nHash final: ${result.finalHash}${meta.scenario==='projectile'&&result.frames===100?'\nHash de regressão: '+(result.match?'CONFERE':'DIVERGENTE'):''}\nOrigem: ${meta.origin||'—'}`;
  }
  async function listRuns(){const data=await client.list();const runs=Array.isArray(data.runs)?data.runs:[];const capacity=DIAG.storage(runs);find('pcEngineStorage').textContent=`Histórico: ${capacity.used}/${capacity.max} · ${capacity.free} vagas · ${capacity.threshold}. ${capacity.note}`;find('pcEngineRuns').textContent=`${runs.length} execuções listadas (limite local: 32)\n`+ (runs.slice(0,8).map(x=>`${x.id||'?'}  ${x.scenario||'?'}  ${x.status||'?'}`).join('\n')||'Nenhuma execução');}
  async function run(){const s=find('pcEngineScenario').value,n=Number(find('pcEngineFrames').value);const result=await client.run(s,n);if(!result||!API.id(result.id))throw new Error('Execução retornou ID inválido');await loadRun(result.id);await listRuns();find('pcEngineComparison').textContent='Execute “Repetir e comparar” para comparar dois runs.';feedback('Execução C++ concluída. Viewport e timeline atualizados.');}
  async function repeat(){
    if(!currentRun||!view?.run)throw new Error('Execute um cenário antes de repetir');
    const prior=currentRun,first=view,meta=view.run;
    const result=await client.run(API.scenario(meta.scenario),API.frames(meta.frames));if(!result?.id)throw new Error('Execução sem ID');
    await loadRun(result.id);comparisonView=first;renderDifference();
    const remote=API.summarizeComparison(await client.compare(prior,result.id));
    const local=VIS.compareViews(first,view);
    find('pcEngineComparison').textContent=JSON.stringify({servidor:remote,snapshots:local},null,2);
    await listRuns();
    if(local.firstDivergence!==null)seek(Math.min(local.firstDivergence,view.snapshots.length));renderDifference();
    const match=remote.identical&&local.identical;
    feedback(match?'Comparação remota e por snapshots idênticas.':'Divergência encontrada ou comparação inconclusiva.',!match);
  }
  function diff(){if(!comparisonView||!view)throw new Error('Compare duas execuções antes de reavaliar');const local=VIS.compareViews(comparisonView,view);find('pcEngineComparison').textContent=JSON.stringify({snapshots:local},null,2);if(local.firstDivergence!==null)seek(Math.min(local.firstDivergence,view.snapshots.length));renderDifference();}
  const actions={connect,run,repeat,refresh:listRuns,diff,prev:()=>seek(getTick()-1),next:()=>seek(getTick()+1),first:()=>seek(1),last:()=>seek(view?.snapshots.length||1),play,close:()=>{stop();dialog.close();}};
  dialog.addEventListener('click',async e=>{const btn=e.target.closest('button[data-act]');if(!btn||busy)return;const action=actions[btn.dataset.act];if(!action)return;if(['prev','next','first','last','play','close'].includes(btn.dataset.act)){action();return;}busy=true;try{await action();}catch(error){badge.textContent='Verificar conexão';feedback(error.message||'Falha de comunicação',true);}finally{busy=false;}});
  find('pcEngineTick').addEventListener('input',()=>{stop();draw();});
  find('pcEngineEntity').addEventListener('change',e=>{selected=Number(e.target.value)||0;draw();});
  find('pcEngineEventFilter').addEventListener('change',renderEvents);
  find('pcEngineFPS').addEventListener('change',()=>{if(playing){stop();play();}});
  dialog.addEventListener('close',stop);
  launch.addEventListener('click',()=>{dialog.showModal();connect().catch(error=>{badge.textContent='Offline';feedback('Engine indisponível: '+error.message,true);});});
})();
