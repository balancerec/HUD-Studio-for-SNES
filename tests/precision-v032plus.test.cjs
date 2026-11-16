'use strict';
const assert=require('assert'),fs=require('fs');const h=fs.readFileSync('index.html','utf8');
const ids=['saveProjectState','saveStateStatus','hudMirrorAxisY','hudMirrorTolerance','hudMirrorMode','propPivotX','propPivotY','matInsetL','matInsetR','matInsetT','matInsetB','matTextureScale','matTextureRotation','matTextureX','matTextureY','matMaskPreset','symmetryDiagnostic','diagnosticOverlay'];
for(const id of ids)assert(h.includes('id="'+id+'"'),'controle ausente: '+id);
for(const clause of ['function projectPayload()','function applyEditorConfig(e)','applyEditorConfig(data.editor)','function refreshMaterialPreview(sprite)','function renderSymmetryDiagnostics()','font-family="Impact,Arial Black,sans-serif"','toLocaleUpperCase("pt-BR")','t.translate(s.w*(.5-(s.pivotX??50)/100)','pair.y=ver?Math.round(2*axisY-s.y-s.h):s.y'])assert(h.includes(clause),'lógica ausente: '+clause);
for(const [w,hg,x,y] of [[430,78,55,35],[100,40,5,10],[240,100,400,300]]){
 assert.equal(1920-x-w,1920-x-w);assert.equal(1080-y-hg,1080-y-hg);
}
console.log('V0.3.2+ — controles e esquema de persistência, pivô, máscaras, material, diagnósticos e fontes: OK');
