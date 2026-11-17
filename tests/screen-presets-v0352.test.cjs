'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const modes = ['1920x1080','512x448','256x224','1080x1920','720x1280','1280x720'];
for (const mode of modes){
  assert.match(html,new RegExp(`<option value="${mode}">`),`Falta opção ${mode}`);
  assert.ok(html.includes(`'${mode}':[`),`Falta configuração ${mode}`);
}
for(const marker of ['const SCREEN_MODES','function applyStageDimensions(width,height)','function convertStageMode(width,height)','Math.min(width/oldW,height/oldH)','loadStageFromData(data)','stage:{width:W,height:H}','canvas.width=W; canvas.height=H','fitScale()','availableH / H','renderUserGuides()','renderSymmetryDiagnostics()']){
  assert.ok(html.includes(marker),`Falta integração: ${marker}`);
}
assert.ok(!html.includes("Math.min(1080,Math.round(s.h))"),'Altura de render ainda limitada a 1080');
console.log(`Presets de tela v0.3.5.2: ${modes.length} formatos e 11 integrações verificadas.`);
