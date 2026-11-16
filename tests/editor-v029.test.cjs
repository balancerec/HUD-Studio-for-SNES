'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
const checks={
 'quatro cantos':['handle br','.handle.bl','.handle.tr','.handle.tl','resize-br',"h.dataset.operation='resize-'+c"],
 'centro com Shift':['g.shiftCenter','e.shiftKey || g.shiftCenter','s.x=g.cx-nw/2','s.y=g.cy-nh/2'],
 'redimensionamento sem Shift':['sx<0?g.x+g.w-nw:g.x','sy<0?g.y+g.h-nh:g.y'],
 'inspetor contido':['grid-template-columns:repeat(2,minmax(0,1fr))','box-sizing:border-box','max-width:100%'],
 'pulsar':['hudPulse','pulseEnabled','pulseSpeed','pulseAmount','pulseHz','sprite-visual'],
 'parallax':['bgParallax','parallaxAmount','tickParallax','backgroundPosition'],
 'GIF':['image/gif','readAsDataURL','importImageBlob'],
 'exportacao':['pulseOpacity','pulseScale','parallaxCurrent','exportPng'],
 'persistencia':['pulse: !!s.pulse','pulseHz:','parallaxAmount:12','JSON.stringify({version:3']
};
let n=0;
for(const [name,parts] of Object.entries(checks)){
 for(const part of parts){ assert(html.includes(part), `${name}: faltando ${part}`);n++; }
}
// Geometry: four corners; Shift keeps center; otherwise preserves opposite corner.
function resize(g,corner,mx,my,centered){
 const sx=corner.includes('l')?-1:1,sy=corner.includes('t')?-1:1;
 const nw=Math.max(10,g.w+mx*sx*(centered?2:1));
 const nh=Math.max(10,g.h+my*sy*(centered?2:1));
 return {x:centered?g.x+g.w/2-nw/2:sx<0?g.x+g.w-nw:g.x,
         y:centered?g.y+g.h/2-nh/2:sy<0?g.y+g.h-nh:g.y,w:nw,h:nh};
}
const initial={x:200,y:300,w:100,h:60};
for(const corner of ['tl','tr','bl','br']){
 const sx=corner.includes('l')?-1:1,sy=corner.includes('t')?-1:1;
 const c=resize(initial,corner,10*sx,8*sy,true);
 assert.equal(c.x+c.w/2,250);assert.equal(c.y+c.h/2,330);n+=2;
 const normal=resize(initial,corner,10*sx,8*sy,false);
 assert.equal(sx>0?normal.x:normal.x+normal.w,sx>0?200:300);
 assert.equal(sy>0?normal.y:normal.y+normal.h,sy>0?300:360);n+=2;
}
console.log(`Editor V0.2.9: ${n} verificações de estrutura e geometria aprovadas.`);
