/* HUD Studio v0.3.8: pure diagnostics, bounded and independent of HUD assets. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.HUDPCDiagnostics=api;})(typeof window!=='undefined'?window:null,function(){
'use strict';
const MAX_EVENTS=250, MAX_ENTITIES=64;
const finite=v=>typeof v==='number'&&Number.isFinite(v);
function snapshotEntities(s){
  const result=new Map();if(!s||typeof s!=='object')return result;
  for(const [kind,key] of [['fighter','fighters'],['projectile','projectiles'],['entity','entities']]){
    const items=Array.isArray(s[key])?s[key].slice(0,MAX_ENTITIES):[];
    items.forEach((e,i)=>{if(!e||typeof e!=='object')return;const id=(typeof e.id==='string'||finite(e.id))?String(e.id):String(i);result.set(kind+':'+id.slice(0,32),e);});
  }
  return result;
}
function events(view){
  if(!Array.isArray(view?.snapshots))return [];
  const result=[];let previous=null;
  for(const s of view.snapshots){
    if(!Number.isSafeInteger(s?.tick))continue;
    const current=snapshotEntities(s);
    if(previous){
      for(const [key,e] of current){
        const p=previous.get(key);
        if(!p){result.push({tick:s.tick,kind:'spawn',entity:key,label:`${key} entrou`});continue;}
        if(finite(e.health)&&finite(p.health)&&e.health!==p.health){result.push({tick:s.tick,kind:'health',entity:key,label:`${key} vida ${p.health} → ${e.health}`,delta:e.health-p.health});}
        if(e.state!==undefined&&p.state!==undefined&&e.state!==p.state){result.push({tick:s.tick,kind:'state',entity:key,label:`${key} estado ${String(p.state).slice(0,32)} → ${String(e.state).slice(0,32)}`});}
      }
      for(const key of previous.keys())if(!current.has(key))result.push({tick:s.tick,kind:'despawn',entity:key,label:`${key} saiu`});
    }
    previous=current;
    if(result.length>=MAX_EVENTS)break;
  }
  return result.slice(0,MAX_EVENTS);
}
function differences(a,b){
  const left=snapshotEntities(a),right=snapshotEntities(b),changes=[];
  const keys=[...new Set([...left.keys(),...right.keys()])].sort().slice(0,MAX_ENTITIES);
  for(const key of keys){
    const ea=left.get(key),eb=right.get(key);
    if(!ea||!eb){changes.push({entity:key,field:'presence',left:!!ea,right:!!eb});continue;}
    for(const field of ['x','y','vx','vy','health','max_health','state','facing','age']){
      const va=ea[field]??null,vb=eb[field]??null;
      if((typeof va==='string'||finite(va)||va===null)&&(typeof vb==='string'||finite(vb)||vb===null)&&va!==vb)
        changes.push({entity:key,field,left:va,right:vb});
    }
  }
  return changes.slice(0,150);
}
function compare(a,b){
  if(!Array.isArray(a?.snapshots)||!Array.isArray(b?.snapshots))throw new Error('Views inválidas');
  const n=Math.min(a.snapshots.length,b.snapshots.length);let first=null;
  for(let i=0;i<n;i++)if(a.snapshots[i]?.hash!==b.snapshots[i]?.hash){first=i+1;break;}
  if(first===null&&a.snapshots.length!==b.snapshots.length)first=n+1;
  const idx=first===null?n-1:Math.min(first-1,n-1);
  return {identicalHashes:first===null,firstDivergence:first,entityDifferences:idx>=0?differences(a.snapshots[idx],b.snapshots[idx]):[],comparedTick:idx+1};
}
function storage(runs){
  const valid=Array.isArray(runs)?runs:[];return {used:valid.length,max:32,free:Math.max(0,32-valid.length),threshold:valid.length>=28?'critical':valid.length>=24?'warning':'ok',note:'Contagem de registros retornados pela API; não mede bytes de disco ou sessões interativas.'};
}
return Object.freeze({events,differences,compare,storage,snapshotEntities});
});
