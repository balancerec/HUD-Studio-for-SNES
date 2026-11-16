'use strict';
const fs=require('fs'), assert=require('node:assert/strict'), path=require('node:path');
const source=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');
const requiredIds=['copySelection','pasteSelection','importImage','imageFile','flipH','flipV','duplicate','delete'];
for(const id of requiredIds)assert.match(source,new RegExp(`id="${id}"`),`Controle ausente: ${id}`);
for(const fragment of ['function copySelection(){','function pasteCopiedSprites(offset=null){','function duplicateSelection(){','function deleteSelection(){','function mirrorSelection(horizontal){','function importImageBlob(blob,label=',"document.addEventListener('paste'", "e.clipboardData?.items", "groupId:s.groupId?groups.get(s.groupId):null", "setSelection(added.map(s=>s.id)", "if(ctrl&&key==='c')", "if(ctrl&&key==='v')", 'for(const item of targets)', 'function selectionBounds(items){']){
 assert.ok(source.includes(fragment),`Lógica ausente: ${fragment}`);
}
assert.ok(source.indexOf("const image=[...(e.clipboardData?.items||[])]") < source.indexOf("const data=e.clipboardData?.getData('text/plain')"),'Imagem deve ter prioridade sobre texto copiado');
assert.match(source,/Math\.min\(\.\.\.items\.map\(s=>s\.x\)\)/);
assert.match(source,/s\.x=2\*cx-\(s\.x\+s\.w\)/);
assert.match(source,/s\.y=2\*cy-\(s\.y\+s\.h\)/);
assert.match(source,/localStorage\.setItem\(KEY/);
console.log('EDITOR v0.2.3: 28 verificações de controles e fluxos passaram.');
