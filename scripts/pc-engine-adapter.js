/* HUD Studio v0.3.6 — PC Engine Lab read-only browser boundary.
 * Endpoints are served ONLY through scripts/serve-pc-engine.py same-origin proxy.
 * The original HUD project and its sprites are never sent to the engine.
 */
(function(root,factory){
  const api=factory();
  if(typeof module==='object' && module.exports)module.exports=api;
  if(root)root.HUDPCAdapter=api;
})(typeof window!=='undefined'?window:null,function(){
  'use strict';
  const ID=/^[0-9a-f]{32}$/;
  const SCENARIOS=['demo','neutral','jump','normal-miss','normal-hit','guard','trade','projectile','projectile-reverse'];
  const EXPECTED='2799a93d0037676b';
  const MAX_FRAMES=1800;
  function id(value){if(typeof value!=='string'||!ID.test(value))throw new Error('ID de execução inválido');return value;}
  function frames(value){if(!Number.isInteger(value)||value<1||value>MAX_FRAMES)throw new Error('Frames fora de 1–1800');return value;}
  function scenario(value){if(!SCENARIOS.includes(value))throw new Error('Cenário não autorizado');return value;}
  function endpoint(path){if(typeof path!=='string'||!/^\/api\/engine\/(?:status|scenarios|runs(?:\/[0-9a-f]{32})?|compare)$/.test(path))throw new Error('Endpoint não autorizado');return path;}
  function makeClient(fetchFn){
    const getFetch=()=>fetchFn||(typeof fetch==='function'?fetch.bind(globalThis):null);
    async function request(path,body){
      const f=getFetch();if(!f)throw new Error('Fetch indisponível');
      endpoint(path);
      const opts={method:body===undefined?'GET':'POST',credentials:'same-origin',cache:'no-store',headers:{'Accept':'application/json'}};
      if(body!==undefined){opts.headers['Content-Type']='application/json';opts.body=JSON.stringify(body);}
      const response=await f(path,opts);
      const type=response.headers?.get?.('content-type')||'';
      if(!type.toLowerCase().includes('application/json'))throw new Error('Resposta não-JSON: verifique o servidor de integração');
      const data=await response.json();
      if(!response.ok){const message=typeof data?.detail==='string'?data.detail:(data?.detail?.message||data?.error||response.statusText);throw new Error(`Engine ${response.status}: ${String(message).slice(0,250)}`);}
      return data;
    }
    return {
      status:()=>request('/api/engine/status'),
      scenarios:()=>request('/api/engine/scenarios'),
      list:()=>request('/api/engine/runs'),
      run:(s,n)=>request('/api/engine/runs',{scenario:scenario(s),frames:frames(n)}),
      load:(runId)=>request('/api/engine/runs/'+id(runId)),
      compare:(left,right)=>{left=id(left);right=id(right);if(left===right)throw new Error('Execuções devem ser distintas');return request('/api/engine/compare',{left,right});}
    };
  }
  function validateView(view){
    if(!view||typeof view!=='object'||!Array.isArray(view.snapshots)||!view.snapshots.length||view.snapshots.length>MAX_FRAMES)throw new Error('Snapshots ausentes ou inválidos');
    if(view.schema!==undefined && view.schema!=='ng-lab-view-1')throw new Error('Versão da projeção incompatível');
    for(let i=0;i<view.snapshots.length;i++){
      const x=view.snapshots[i];if(!x||!Number.isSafeInteger(x.tick)||x.tick!==i+1||typeof x.hash!=='string')throw new Error('Sequência de snapshots incompatível');
    }
    return view;
  }
  function checkProjectile(view){
    validateView(view);
    const last=view.snapshots[view.snapshots.length-1];
    return {frames:view.snapshots.length,finalHash:last.hash,expected:EXPECTED,
      match:view.snapshots.length===100&&String(last.hash).toLowerCase()===EXPECTED};
  }
  function summarizeComparison(data){
    if(!data||typeof data!=='object')throw new Error('Comparação inválida');
    return {identical:data.identical===true,firstDivergence:data.first_divergence??data.first_divergent_tick??null,
      sameEngineBinary:data.same_engine_binary===true,independentNativeRuns:data.independent_native_runs===true};
  }
  return Object.freeze({SCENARIOS,EXPECTED,MAX_FRAMES,id,frames,scenario,endpoint,makeClient,validateView,checkProjectile,summarizeComparison});
});
