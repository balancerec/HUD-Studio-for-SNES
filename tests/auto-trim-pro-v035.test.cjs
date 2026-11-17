const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
for(const id of ['trimBefore','trimAfter','trimSavings','trimManualL','trimManualR','trimManualT','trimManualB','trimManualApply','trimPreviewReset']){
  assert.ok(html.includes(`id="${id}"`),`missing UI control: ${id}`);
}
for(const name of ['drawTrimComparison','trimRectFromMargins','trimMarginsFromRect','trimAreaStats','trimReadPreviewRect','mapCropToCurrent']){
  assert.ok(html.includes(`function ${name}(`),`missing algorithm: ${name}`);
}
assert.match(html,/ImageDecoder\(\{data:bytes,type:'image\/gif'\}\)/,'GIF must inspect every frame');
assert.match(html,/const count=decoder\.tracks\.selectedTrack\?\.frameCount\|\|1/,'must union all frames');
assert.match(html,/snapshot\(\);mapCropToCurrent\(s,rect\)/,'manual cut must preserve undo');
assert.match(html,/mapCropToCurrent\(p\.s,p\.rect\)/,'automatic cut retained');
assert.match(html,/trimRect:validateTrimRect\(s\.trimRect\)/,'trim persists in JSON');
function extract(name,next){
  const start=html.indexOf('function '+name+'('); assert.ok(start>=0,name);
  const end=html.indexOf(next,start);assert.ok(end>start,`no boundary ${name}`);
  return html.slice(start,end);
}
const source=[
  extract('trimRectFromMargins','function trimMarginsFromRect'),
  extract('trimMarginsFromRect','function trimAreaStats'),
  extract('trimAreaStats','function trimNaturalDimensions'),
  extract('mapCropToCurrent',"$('trimAlpha').addEventListener") // includes other functions but declarations only after controlled prefix
];
const ctx=vm.createContext({Math,Number,console});
vm.runInContext(source[0]+source[1]+source[2],ctx);
const toRect=(w,h,m)=>vm.runInContext(`trimRectFromMargins(${w},${h},${JSON.stringify(m)})`,ctx);
const rect=toRect(480,270,[21,29,10,20]);
assert.deepEqual(JSON.parse(JSON.stringify(rect)),{left:21,top:10,width:430,height:240,sourceW:480,sourceH:270});
const edges=vm.runInContext('trimMarginsFromRect('+JSON.stringify(rect)+')',ctx);
assert.deepEqual(Array.from(edges),[21,29,10,20]);
const metrics=vm.runInContext('trimAreaStats('+JSON.stringify(rect)+')',ctx);
assert.equal(metrics.removed,480*270-430*240);
assert.ok(metrics.percent>20 && metrics.percent<21);
for(const invalid of [[-1,0,0,0],[480,0,0,0],[200,280,0,0],[0,0,135,135],[0,0,0,270],[0.5,0,0,0],['invalid',0,0,0]]){
  assert.equal(toRect(480,270,invalid),null,`invalid margins: ${invalid}`);
}
assert.equal(toRect(480,270,[0,0,0,0]).width,480);
console.log('Auto Trim Pro V0.3.5: 9 UI controls, 6 algorithms, GIF all-frame checks, 12 geometry checks OK');
