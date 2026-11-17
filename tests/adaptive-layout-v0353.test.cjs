'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const mod=require('../scripts/adaptive-layout.js');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const originals=[
  {id:'leftName',label:'Nome P1 · JOHNNY',smartKind:'text',x:0,y:36,w:508,h:88,fontSize:80},
  {id:'rightName',label:'Nome P2 · ERMAC',smartKind:'text',x:1412,y:36,w:508,h:88,fontSize:80},
  {id:'fLeft',label:'Moldura inclinada superior · Espelho',x:48,y:16,w:403,h:133},
  {id:'fRight',label:'Moldura inclinada superior',x:1469,y:16,w:403,h:133},
  {id:'lifeLeft',kind:'dynamicBar',label:'Vida P2 · Espelho',category:'health',x:48,y:144,w:870,h:56},
  {id:'lifeRight',kind:'dynamicBar',label:'Vida P2',category:'health',x:1002,y:144,w:870,h:56},
  {id:'runLeft',kind:'dynamicBar',label:'Corrida P2 · Espelho',category:'stamina',x:100,y:212,w:355,h:26},
  {id:'runRight',kind:'dynamicBar',label:'Corrida P2',category:'stamina',x:1465,y:212,w:355,h:26},
  {id:'fighter1',label:'O_Coletor_Idle_8frames.gif',src:'data:image/gif;base64,00',x:227,y:370,w:426,h:560},
  {id:'fighter2',label:'Umk3_ermac_stance.gif',src:'data:image/gif;base64,00',x:1376,y:400,w:368,h:512},
  {id:'smoke',label:'fumaça.gif · Espelho',src:'data:image/gif;base64,00',x:-944,y:843,w:1912,h:323,trimRect:{x:1,y:2,w:10,h:20},darkKey:true},
  {id:'center',label:'Moldura central V',x:872,y:127,w:176,h:80},
  {id:'material',label:'Miolo lava central',smartKind:'material',materialParentId:'center',x:880,y:136,w:150,h:60}
];
assert.equal(mod.side(originals[4],1920),'left','barra espelhada esquerda');
assert.equal(mod.side(originals[5],1920),'right','barra direita');
assert.equal(mod.classify(originals[10]),'smoke','fumaça deve manter GIF');
const base=mod.snapshot(originals,1920,1080);
for(const [key,[w,h]] of Object.entries(mod.MODES)){
 const a=mod.layout(originals,base,w,h);
 for(const s of originals){const q=a[s.id];assert.ok(q,`sprite faltando ${s.id} em ${key}`);assert.ok(q.w>0&&q.h>0,`dimensões invalidas ${s.id}`);for(const v of ['x','y','w','h'])assert.ok(Number.isFinite(q[v]));}
 assert.ok(a.leftName.x+a.leftName.w<a.rightName.x,`nomes sobrepostos ${key}`);
 assert.ok(a.lifeLeft.x+a.lifeLeft.w<a.lifeRight.x,`barras não simétricas ${key}`);
 assert.ok(a.fighter1.x+a.fighter1.w<=a.fighter2.x,`lutadores sobrepostos ${key}`);
 assert.ok(a.fighter1.h>h*.2,`lutador pequeno demais ${key}`);
 const aFrame=a.center,mat=a.material;
 assert.ok(mat.x>=aFrame.x-5 && mat.x+mat.w<=aFrame.x+aFrame.w+5,`material desalinhado ${key}`);
 const editable=originals.map(x=>structuredClone(x));mod.applyLayout(editable,a);
 assert.equal(editable[10].darkKey,true,'FX alterado');
 assert.deepEqual(editable[10].trimRect,{x:1,y:2,w:10,h:20},'trim alterado');
 // One format change and a return must retain precise source geometry.
 mod.applySnapshot(editable,base);
 assert.equal(editable[8].x,227);
 assert.equal(editable[8].h,560);
}
const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/collapsed-layout-v0352.json'),'utf8'));
assert.ok(mod.isCollapsed(fixture.sprites,fixture.stage.height),'projeto do usuário deveria detectar encolhimento');
const recovered=mod.layout(fixture.sprites,mod.snapshot(fixture.sprites,1280,720),1280,720);
const lf=fixture.sprites.find(s=>/Coletor/.test(s.label));
const health=fixture.sprites.find(s=>/Vida P2/.test(s.label));
assert.ok(recovered[lf.id].h>200, 'Coletor deve recuperar tamanho visível');
assert.ok(recovered[health.id].w>400, 'barra de vida deve preencher lado do HUD');
assert.ok(!mod.isCollapsed(originals,1080),'projeto original não está encolhido');
assert.ok(html.includes('id="adaptiveLayoutToggle"'));
assert.ok(html.includes('id="adaptiveLayoutApply"'));
assert.ok(html.includes('layoutProfiles'));
assert.ok(html.includes('layoutSource'));
assert.ok(html.includes('scripts/adaptive-layout.js'));
console.log('Adaptive layouts v0.3.5.3: 6 formatos, grupos, simetria, fontes, materiais, FX, round-trip e persistência OK');
