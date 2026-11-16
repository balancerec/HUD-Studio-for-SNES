const fs=require('fs'),assert=require('assert');
const html=fs.readFileSync(require('path').join(__dirname,'../index.html'),'utf8');
const checks=[
 ['Régua fora do stage', /<div id="rulerX"[\s\S]*?<div class="stage" id="stage">/.test(html) && !/<div class="stage" id="stage">[\s\S]{0,400}id="rulerX"/.test(html)],
 ['Guias persistentes em JSON', /guides:userGuides/.test(html)&&/userGuides=sanitizeGuides\(data.guides\)/.test(html)],
 ['Réguas escalonadas com zoom', /x\*scale/.test(html)&&/y\*scale/.test(html)],
 ['Criar guia arrastando régua', /'rulerX'\)\.addEventListener\('pointerdown'/.test(html)&&/'rulerY'\)\.addEventListener\('pointerdown'/.test(html)],
 ['Remover guia por duplo clique', /userGuides'\)\.addEventListener\('dblclick'/.test(html)],
 ['Snap nas guias', /userGuides\.filter\(g=>g.axis==='x'\)/.test(html)&&/userGuides\.filter\(g=>g.axis==='y'\)/.test(html)],
 ['Z-order normalizado', /function normalizeLayerOrder/.test(html)&&/sort\(\(a,b\)=>a.z-b.z\)\.forEach\(s => stage.append/.test(html)],
 ['Controles subir/descer e topo/fundo', ['stepForward','stepBackward','bringFront','sendBack'].every(k=>html.includes(`id="${k}"`))],
 ['Efeito reflexo configurável', ['reflexEnabled','reflexColor','reflexSpeed','reflexStrength'].every(k=>html.includes(`id="${k}"`))],
 ['Reflexo percorre alpha da moldura', /function getReflexOutline/.test(html)&&/data\[\(py\*w\+px\)\*4\+3\]>70/.test(html)],
 ['Reflexo incluído no PNG', /if\(s.reflexEnabled\)drawReflexLocal\(t,s/.test(html)],
];
for(const [name,passed] of checks){assert(passed,name);console.log('OK',name)}
console.log(`Precision V0.3.2: ${checks.length} verificações aprovadas`);
