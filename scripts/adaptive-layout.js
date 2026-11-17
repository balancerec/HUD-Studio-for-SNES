/* HUD Studio v0.3.5.3 — adaptive scene layout (no external dependencies). */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.HUDAdaptiveLayout=api;
})(typeof globalThis!=='undefined'?globalThis:null,function(){
'use strict';
const MODES={'1920x1080':[1920,1080],'512x448':[512,448],'256x224':[256,224],'1080x1920':[1080,1920],'720x1280':[720,1280],'1280x720':[1280,720]};
const TRANSFORM_KEYS=['x','y','w','h','fontSize','timerFontSize'];
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function modeKey(w,h){return `${w}x${h}`;}
function classify(s){
  const label=String(s.label||'').toLowerCase(),src=String(s.src||'').toLowerCase();
  if(s.smartKind==='material')return 'material';
  if(s.smartKind==='timer'||/timer.*central|cron[oô]metro/.test(label))return 'timer';
  if(s.smartKind==='text'||/nome p[12]/.test(label))return 'name';
  if(/fumaça|fumaca|smoke|fog|neblina/.test(label))return 'smoke';
  if(/logo|ultimate mortal kombat/.test(label))return 'logo';
  if(s.kind==='dynamicBar')return s.category==='stamina'||/corrida/.test(label)?'stamina':'health';
  if(/moldura central v|central_v|painel central/.test(label))return 'center';
  if(/moldura inclinada|nameplate|nome p[12]/.test(label))return 'nameframe';
  if(/barra|moldura vida|moldura corrida/.test(label))return /corrida/.test(label)?'stamina':'health';
  if(/\.gif(?:\?|$)/.test(src)||/coletor|ermac|scorpion|sub.zero|cyrax|stance|idle|lutador|fighter/.test(label))return 'fighter';
  return 'other';
}
function side(s,srcW){
  const lbl=String(s.label||'').toLowerCase();
  const center=+s.x+(+s.w||0)/2;
  if(Math.abs(center-srcW/2)>srcW*.005)return center<srcW/2?'left':'right';
  if(/p1\b|esquerd/.test(lbl))return 'left';
  if(/p2\b|direit/.test(lbl))return 'right';
  return center<srcW/2?'left':'right';
}
function snapshot(sprites,w,h){
  return {width:w,height:h,items:Object.fromEntries(sprites.map(s=>[s.id,Object.fromEntries(TRANSFORM_KEYS.filter(k=>Number.isFinite(+s[k])).map(k=>[k,+s[k]]))]))};
}
function applySnapshot(sprites,profile){
  if(!profile||!profile.items)return false;
  for(const s of sprites){const v=profile.items[s.id];if(!v)continue;for(const k of TRANSFORM_KEYS)if(Number.isFinite(v[k]))s[k]=v[k];}
  return true;
}
function isCollapsed(sprites,h){const v=sprites.filter(s=>classify(s)==='fighter').map(s=>(+s.h||0)/h).filter(Number.isFinite).sort((a,b)=>a-b);return v.length>0&&v[Math.floor(v.length/2)]<.15;}
function layout(sprites,source,tw,th){
  const sw=source.width,sh=source.height;
  const landscape=tw/th>=1.25, retro=tw<=512,portrait=!landscape;
  const uniform=Math.min(tw/sw,th/sh), sx=tw/sw, sy=th/sh;
  const base=source.items||{};
  // Older 0.3.5.2 contain-only conversions can shrink whole scenes by 10x.
  // Recover relative positions/sizes for unclassified assets, but recompute
  // primary HUD and fighters from semantic slots rather than accumulated scale.
  const fighters=sprites.filter(s=>classify(s)==='fighter').map(s=>base[s.id]?.h/sh).filter(Number.isFinite).sort((a,b)=>a-b);
  const measured=fighters.length?fighters[Math.floor(fighters.length/2)]:.48;
  const recovery=measured<.15?clamp(.48/Math.max(.01,measured),1,16):1;
  const result={};
  const centerX=tw/2;
  const fighterBottom=th*(portrait?.85:.91);
  const top=portrait?th*.035:th*.028;
  const hudH=portrait?th*.16:(retro?th*.20:th*.21);
  const leftNameX=tw*.025,rightNameX=tw*.725;
  const nameW=tw*.25;
  const frameLookup={};
  for(const s of sprites){
    const b=base[s.id]||s;
    const cls=classify(s),lr=side({...s,...b},sw);
    let x=b.x*sx,y=b.y*sy,w=b.w*sx,h=b.h*sy;
    const ratio=b.h/Math.max(1,b.w);
    const slot=(fx,fy,fw)=>{x=fx;y=fy;w=fw;h=fw*ratio;};
    if(cls==='nameframe')slot(lr==='left'?leftNameX:rightNameX,top, nameW);
    else if(cls==='name'){
      const textW=tw*.265;
      slot(lr==='left'?tw*.018:tw*.717,top+(portrait?th*.007:th*.005),textW);
      h=Math.min(h,portrait?th*.052:th*.07);
    }
    else if(cls==='center')slot(centerX-tw*.06,top+hudH*.40,tw*.12);
    else if(cls==='timer')slot(centerX-tw*.075,top+hudH*.38,tw*.15);
    else if(cls==='health')slot(lr==='left'?tw*.035:tw*.52,top+hudH*.48,tw*.445);
    else if(cls==='stamina')slot(lr==='left'?tw*.055:tw*.755,top+hudH*.81,tw*.19);
    else if(cls==='logo')slot(centerX-tw*.09,top,tw*.18);
    else if(cls==='fighter'){
      const targetH=portrait?th*.30:(retro?th*.52:th*.52);
      const maxW=portrait?tw*.42:tw*.29;
      const scaledH=Math.min(targetH,maxW*ratio);
      h=scaledH;w=h/ratio;
      x=lr==='left'?tw*.08:tw*.92-w;
      y=fighterBottom-h;
    }
    else if(cls==='smoke'){
      // Smoke remains native GIF and may overlap / extend beyond canvas;
      // retain broad translucent atmosphere and preserve effects/trim.
      const oldCenter=+b.x+(+b.w)/2;
      const startBottom=(+b.y+(+b.h))>=sh*.7;
      const broad=ratio<.55;
      w=broad?tw*.99:tw*.28;
      h=w*ratio;
      x=broad?(oldCenter<sw/2?-tw*.50:tw*.50):(oldCenter<sw/2?tw*.09:tw*.63);
      y=broad?th*.67:th*.26;
    }
    else if(cls==='material'){
      // Will be repositioned against parent after primary scene objects.
      x=b.x*sx;y=b.y*sy;w=b.w*sx;h=b.h*sy;
    }
    else{
      // Decorative assets keep nearest relative position, preserving proportions.
      const fac=Math.min(sx,sy)*recovery;w=b.w*fac;h=b.h*fac;
      x=tw/2+(b.x+b.w/2-sw/2)*sx*recovery-w/2;
      y=th/2+(b.y+b.h/2-sh/2)*sy*recovery-h/2;
    }
    if(cls!=='smoke'){
      x=clamp(x,-w*.25,tw-w*.75);
      y=clamp(y,-h*.25,th-h*.75);
    }
    let fontSize=Number.isFinite(+b.fontSize)?Math.max(5,b.fontSize*(w/Math.max(1,b.w))):undefined;
    if(cls==='name'&&fontSize!==undefined)fontSize=clamp(fontSize,retro?8:18,portrait?tw*.055:th*.09);
    result[s.id]={x,y,w,h,...(fontSize===undefined?{}:{fontSize})};
    if(cls==='center'||cls==='nameframe')frameLookup[s.id]={old:b,next:result[s.id]};
  }
  // Parent-relative fill alignment is necessary: a material must not drift away
  // from its named frame during aspect-ratio changes.
  for(const s of sprites){
    if(classify(s)!=='material'||!s.materialParentId)continue;
    const frame=frameLookup[s.materialParentId],own=base[s.id]||s;
    if(!frame)continue;
    const p=frame.old,n=frame.next;
    const fw=Math.max(1,p.w),fh=Math.max(1,p.h);
    result[s.id]={...result[s.id],x:n.x+(own.x-p.x)/fw*n.w,y:n.y+(own.y-p.y)/fh*n.h,w:own.w/fw*n.w,h:own.h/fh*n.h};
  }
  return result;
}
function applyLayout(sprites,values){
  for(const s of sprites){const v=values[s.id];if(!v)continue;for(const k of TRANSFORM_KEYS)if(Number.isFinite(v[k]))s[k]=+v[k].toFixed(4);}
}
return {MODES,TRANSFORM_KEYS,classify,side,snapshot,applySnapshot,layout,applyLayout,modeKey,isCollapsed};
});
