/* v0.3.7: pure, defensive mapping of experimental engine snapshots. No HUD state access. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.HUDPCVisual=api;
})(typeof window!=='undefined'?window:null,function(){
  'use strict';
  const MAX_ENTITIES=64;
  const numeric=v=>typeof v==='number'&&Number.isFinite(v)?v:null;
  function q256(v){const n=numeric(v);return n===null?null:n/256;}
  function entities(snapshot){
    if(!snapshot||typeof snapshot!=='object')return [];
    const all=[];
    const sources=[['Lutador',snapshot.fighters],['Projétil',snapshot.projectiles],['Entidade',snapshot.entities]];
    for(const [kind,items] of sources){
      if(!Array.isArray(items))continue;
      for(const [index,item] of items.slice(0,MAX_ENTITIES-all.length).entries()){
        if(!item||typeof item!=='object')continue;
        all.push({kind,index,id:String(item.id??index).slice(0,32),x:q256(item.x),y:q256(item.y),
          rawX:numeric(item.x),rawY:numeric(item.y),vx:q256(item.vx),vy:q256(item.vy),
          health:numeric(item.health),maxHealth:numeric(item.max_health),state:String(item.state??'—').slice(0,64),
          facing:numeric(item.facing),age:numeric(item.age),definition:String(item.definition??'').slice(0,64)});
      }
    }
    return all;
  }
  function fingerprint(s){return s&&typeof s.hash==='string'?s.hash:null;}
  function compareViews(a,b){
    if(!a||!b||!Array.isArray(a.snapshots)||!Array.isArray(b.snapshots))throw new Error('Views inválidas');
    const limit=Math.min(a.snapshots.length,b.snapshots.length);
    let firstDivergence=null;
    for(let i=0;i<limit;i++){
      if(fingerprint(a.snapshots[i])!==fingerprint(b.snapshots[i])){firstDivergence=i+1;break;}
    }
    if(firstDivergence===null&&a.snapshots.length!==b.snapshots.length)firstDivergence=limit+1;
    return {identical:firstDivergence===null,firstDivergence,framesA:a.snapshots.length,framesB:b.snapshots.length,
      finalHashA:fingerprint(a.snapshots.at(-1)),finalHashB:fingerprint(b.snapshots.at(-1))};
  }
  function formatEntity(e){
    const fmt=v=>v===null?'—':Number(v.toFixed(2)).toLocaleString('pt-BR');
    return `${e.kind} ${e.id}\nPosição Q8: (${fmt(e.x)}, ${fmt(e.y)})\nPosição bruta: (${fmt(e.rawX)}, ${fmt(e.rawY)})\nVelocidade: (${fmt(e.vx)}, ${fmt(e.vy)})\nVida: ${fmt(e.health)} / ${fmt(e.maxHealth)}\nEstado: ${e.state}\nFacing: ${fmt(e.facing)} | Idade: ${fmt(e.age)}`;
  }
  function paint(canvas,snapshot,selection=0){
    if(!canvas||!snapshot)return;
    const ctx=canvas.getContext('2d');if(!ctx)return;
    const W=canvas.width,H=canvas.height;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#10141b';ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#293440';ctx.lineWidth=1;
    for(let x=0;x<=W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<=H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    const floor=H-34;ctx.strokeStyle='#b48a54';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(15,floor);ctx.lineTo(W-15,floor);ctx.stroke();
    const found=entities(snapshot);const withX=found.filter(e=>e.x!==null);
    const left=withX.length?Math.min(0,...withX.map(e=>e.x))-30:-100;
    const right=withX.length?Math.max(420,...withX.map(e=>e.x))+30:420;
    const span=Math.max(1,right-left);
    const sx=x=>25+(x-left)/span*(W-50);
    found.forEach((e,i)=>{
      if(e.x===null)return;
      const x=sx(e.x), y=e.y===null?floor:Math.max(28,Math.min(floor, floor-e.y*.5));
      const fighter=e.kind==='Lutador';
      ctx.fillStyle=fighter?(i===0?'#57b9d6':'#e08b62'):'#f7d96f';
      ctx.strokeStyle=selection===i?'#fff5cf':'#202a33';ctx.lineWidth=selection===i?3:1;
      if(fighter){ctx.fillRect(x-10,y-36,20,36);ctx.strokeRect(x-10,y-36,20,36);}else{
        ctx.beginPath();ctx.arc(x,y-12,7,0,Math.PI*2);ctx.fill();ctx.stroke();
      }
      ctx.fillStyle='#e8edf5';ctx.font='12px Consolas, monospace';ctx.textAlign='center';
      ctx.fillText(`${e.kind} ${e.id}`,x,Math.max(13,y-44));
      if(fighter&&e.health!==null){ctx.fillStyle='#283c3a';ctx.fillRect(x-24,y-54,48,4);ctx.fillStyle='#79d3ab';
        ctx.fillRect(x-24,y-54,48*Math.max(0,Math.min(1,e.health/Math.max(e.maxHealth??e.health,1))),4);}
    });
    ctx.textAlign='left';ctx.fillStyle='#9da9b8';ctx.font='11px Consolas, monospace';
    ctx.fillText(`Tick ${snapshot.tick??'—'} | entidades ${found.length} | Q8 / 256 (projeção experimental)`,12,H-10);
    if(!found.length){ctx.textAlign='center';ctx.fillText('Nenhuma entidade compatível neste snapshot',W/2,H/2);}
  }
  return Object.freeze({entities,q256,compareViews,formatEntity,paint});
});
