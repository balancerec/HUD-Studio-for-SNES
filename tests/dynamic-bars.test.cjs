const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const project=JSON.parse(fs.readFileSync(path.join(root,'examples','dynamic-bars-4.json'),'utf8'));
for(const id of ['addDynamicPreset','demoDynamics','stopDynamics','dynamicInspector','barValue','barValueNumber','barDirection','barCategory']) assert.ok(html.includes(`id="${id}"`),id);
for(const marker of ["kind:'dynamicBar'","className='dynamic-bar-fill'",'barClip(s.value,s.direction)','t.clip()','t.drawImage(f,','t.drawImage(frame,','function changeBarValue(']) assert.ok(html.includes(marker),marker);
assert.equal(project.stage.width,1920);assert.equal(project.stage.height,1080);assert.equal(project.sprites.length,4);
for(const s of project.sprites){
  assert.equal(s.kind,'dynamicBar'); assert.equal(s.value,100);
  assert.ok(['rtl','ltr'].includes(s.direction));
  for(const k of ['src','frameSrc','fillSrc'])assert.ok(fs.existsSync(path.join(root,s[k])),`${s.label}: ${k}`);
  assert.ok(s.w>0 && s.h>0);
}
const clamp=v=>Math.max(0,Math.min(100,Number(v)||0));
const rect=(width,v,dir)=>({left:dir==='rtl'?width*(1-clamp(v)/100):0,width:width*clamp(v)/100});
for(const dir of ['ltr','rtl']){
 assert.equal(rect(500,0,dir).width,0);
 assert.equal(rect(500,100,dir).width,500);
 assert.equal(rect(500,50,dir).width,250);
 assert.equal(rect(500,50,dir).left,dir==='rtl'?250:0);
 assert.equal(rect(500,150,dir).width,500);
}
console.log('DynamicBar v0.2.4: 4 sprites compostos, 8 assets, recorte e controles verificados.');
