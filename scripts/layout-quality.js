/* HUD Studio v0.3.5.5 — read-only layout quality report, UMD/Node. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.HUDLayoutQuality=api;
})(typeof globalThis!=='undefined'?globalThis:null,function(){
 'use strict';
 const MODES={'1920x1080':[1920,1080],'512x448':[512,448],'256x224':[256,224],'1080x1920':[1080,1920],'720x1280':[720,1280],'1280x720':[1280,720]};
 const KEYS=['x','y','w','h'];
 const finite=v=>typeof v==='number'&&Number.isFinite(v);
 const nearly=(a,b)=>Math.abs(a-b)<1e-5;
 function validateProfile(profile,key,ids){
  const errors=[],warnings=[];
  const dims=MODES[key];
  if(!dims)return {ok:false,errors:['Formato desconhecido: '+key],warnings,coverage:0};
  if(!profile||typeof profile!=='object'||!profile.items||typeof profile.items!=='object'||Array.isArray(profile.items))return {ok:false,errors:['Perfil ausente ou sem itens'],warnings,coverage:0};
  if(!nearly(profile.width,dims[0])||!nearly(profile.height,dims[1]))errors.push('Dimensões do perfil diferentes de '+key);
  const requested=new Set(ids||[]);let found=0;
  for(const id of requested){
    const rect=profile.items[id];
    if(!rect){warnings.push('Item ausente: '+id);continue;}
    found++;
    for(const k of KEYS)if(!finite(rect[k]))errors.push(id+': '+k+' não é um número finito');
    if(finite(rect.w)&&rect.w<=0)errors.push(id+': largura não positiva');
    if(finite(rect.h)&&rect.h<=0)errors.push(id+': altura não positiva');
  }
  for(const id of Object.keys(profile.items))if(!requested.has(id))warnings.push('Item órfão: '+id);
  const coverage=requested.size?found/requested.size:1;
  if(requested.size&&coverage<0.8)errors.push('Cobertura insuficiente: '+Math.round(coverage*100)+'%');
  return {ok:errors.length===0,errors,warnings,coverage};
 }
 function auditProfiles(profiles,sprites,options={}){
  const ids=(sprites||[]).map(s=>s.id);const report={version:'0.3.5.5',generatedAt:null,summary:{valid:0,missing:0,invalid:0,clipped:0,issues:0},modes:{}};
  for(const [key,dims] of Object.entries(MODES)){
   const profile=profiles?.[key];
   if(!profile){report.summary.missing++;report.modes[key]={status:'missing',errors:[],warnings:['Não existe layout salvo'],clipped:[]};continue;}
   const v=validateProfile(profile,key,ids);
   const clipped=[];
   const width=dims[0],height=dims[1];
   for(const s of sprites||[]){
    const rect=profile.items?.[s.id];if(!rect||!KEYS.every(k=>finite(rect[k]))||rect.w<=0||rect.h<=0)continue;
    // Decorative smoke is intentionally allowed to extend beyond viewport.
    const name=String(s.label||'').toLowerCase();
    if(/fumaça|fumaca|smoke|fog|neblina/.test(name))continue;
    // Partial offscreen results are a warning, not an automatic reposition.
    const x0=Math.max(0,rect.x),y0=Math.max(0,rect.y);
    const x1=Math.min(width,rect.x+rect.w),y1=Math.min(height,rect.y+rect.h);
    const visible=Math.max(0,x1-x0)*Math.max(0,y1-y0)/Math.max(1,rect.w*rect.h);
    if(visible<0.90)clipped.push({id:s.id,label:s.label||s.id,visiblePct:Math.round(visible*100)});
   }
   if(v.ok)report.summary.valid++;else report.summary.invalid++;
   report.summary.clipped+=clipped.length;
   report.summary.issues+=v.errors.length+v.warnings.length+clipped.length;
   report.modes[key]={status:v.ok?'valid':'invalid',...v,clipped};
  }
  return report;
 }
 return {MODES,validateProfile,auditProfiles};
});
