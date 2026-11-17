'use strict';
const fs = require('node:fs');
const assert = require('node:assert/strict');
const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');
const ids = [...html.split('<script>')[0].matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size, ids.length, 'IDs HTML devem ser únicos');
for (const id of [
  'snap','gridSize','grid','referenceToggle','rulers','magnet','groupBtn','ungroupBtn','selectionCount',
  'undoBtn','redoBtn','includeBg','zoom','flipH','flipV','alignLeft','alignCenter','alignRight',
  'alignTop','alignMiddle','alignBottom','duplicate','bringFront','sendBack','delete',
  'bgColor','bgFit','bgOpacity','loadBg','clearBg'
]) assert.ok(ids.includes(id), `Controle ausente: ${id}`);
for (const group of ['Visualização','Seleção','Histórico','Saída &amp; zoom','Transformação',
  'Espelho &amp; visibilidade','Alinhamento','Organização &amp; camadas','Remoção']) {
  assert.ok(html.includes(group), `Grupo ausente: ${group}`);
}
assert.ok((html.match(/class="tool-group"/g)||[]).length>=4);
assert.ok((html.match(/class="inspector-group(?: inspector-danger| fx-tools)?"/g)||[]).length>=5);
assert.ok(html.includes('class="action-grid columns-3"'));
assert.ok(html.includes('class="danger wide-action"'));
console.log('UI V0.2.2: grupos, controles, IDs e botões de ação aprovados.');
