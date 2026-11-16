/** Regressão HIT-001: testa a geometria/alpha real usada no editor, sem dependências. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const start = script.indexOf('function pointInSpriteLocal(');
const end = script.indexOf('function fitScale(', start);
assert.ok(start>0 && end>start, 'Funções de hit-test não localizadas');
const W=12,H=12;
const data = new Uint8ClampedArray(W*H*4);
for(let y=4;y<8;y++)for(let x=4;x<8;x++)data[(y*W+x)*4+3]=255;
let sprites=[];
const mask={ready:true,data,width:W,height:H};
const ctx={
  sprites,
  onstageCoords:(x,y)=>({x,y}),
  getAlphaCanvas:()=>mask,
  Math, console
};
vm.createContext(ctx);
vm.runInContext(script.slice(start,end),ctx);
const sprite={id:'a',src:'test.png',visible:true,opacity:100,x:100,y:200,w:120,h:120,rot:0,flipX:false,flipY:false,z:10};
ctx.sprites.push(sprite);
assert.equal(ctx.spriteHitOpaque(sprite,110,210),false,'Canto transparente não pode selecionar');
assert.equal(ctx.spriteHitOpaque(sprite,160,260),true,'Centro visível deve selecionar');
assert.equal(ctx.spriteHitOpaque(sprite,500,500),false,'Fora dos limites não pode selecionar');
ctx.sprites.push({...sprite,id:'b',z:20,opacity:0});
assert.equal(ctx.findTopmostSpriteAt(160,260).id,'a','Camada invisível não deve capturar');
ctx.sprites[1].opacity=100;
assert.equal(ctx.findTopmostSpriteAt(160,260).id,'b','Camada superior opaca tem prioridade');
ctx.sprites[1].visible=false;
assert.equal(ctx.findTopmostSpriteAt(160,260).id,'a','Camada oculta deve ser ignorada');
sprite.flipX=true;
assert.equal(ctx.spriteHitOpaque(sprite,160,260),true,'Espelhamento preserva máscara');
sprite.rot=90;
assert.equal(ctx.spriteHitOpaque(sprite,160,260),true,'Rotação preserva centro da máscara');
mask.ready=false;
assert.equal(ctx.spriteHitOpaque(sprite,160,260),false,'Imagem não carregada não captura caixa');
console.log('HIT-001: 9 verificações aprovadas (alpha, sobreposição, espelho, rotação e loading).');
