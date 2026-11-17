const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const d=require('../scripts/pc-engine-diagnostics-v038.js');
const a={snapshots:[
  {tick:1,hash:'a',fighters:[{id:0,x:256,y:0,health:166,state:'idle'}]},
  {tick:2,hash:'b',fighters:[{id:0,x:512,y:0,health:155,state:'walk'}],projectiles:[{id:9,x:768}]},
  {tick:3,hash:'c',fighters:[{id:0,x:512,y:0,health:155,state:'walk'}]}
]};
const ev=d.events(a);
assert.ok(ev.some(x=>x.tick===2&&x.kind==='health'&&x.delta===-11));
assert.ok(ev.some(x=>x.tick===2&&x.kind==='state'));
assert.ok(ev.some(x=>x.tick===2&&x.kind==='spawn'));
assert.ok(ev.some(x=>x.tick===3&&x.kind==='despawn'));
assert.deepEqual(d.events({snapshots:[]}),[]);
const b={snapshots:[a.snapshots[0],{...a.snapshots[1],hash:'DIFF',fighters:[{id:0,x:777,y:0,health:155,state:'idle'}]},a.snapshots[2]]};
const comparison=d.compare(a,b);
assert.equal(comparison.firstDivergence,2);
assert.equal(comparison.comparedTick,2);
assert.ok(comparison.entityDifferences.some(x=>x.field==='x'&&x.left===512&&x.right===777));
assert.equal(d.compare(a,a).identicalHashes,true);
assert.equal(d.compare(a,{snapshots:a.snapshots.slice(0,2)}).firstDivergence,3);
assert.throws(()=>d.compare(a,null));
assert.equal(d.storage(Array(24)).threshold,'warning');
assert.equal(d.storage(Array(28)).threshold,'critical');
assert.equal(d.storage(Array(32)).free,0);
assert.equal(d.storage(null).used,0);
const js=fs.readFileSync(path.join(root,'scripts/pc-engine-panel.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.ok(js.includes('DIAG.events(view)'));
assert.ok(js.includes('DIAG.compare(comparisonView,view)'));
assert.ok(js.includes('DIAG.storage(runs)'));
assert.ok(js.includes('renderEvents()'));
assert.ok(js.includes('renderDifference()'));
assert.ok(html.indexOf('pc-engine-diagnostics-v038.js')>html.indexOf('pc-engine-visual-v037.js'));
assert.ok(html.indexOf('pc-engine-diagnostics-v038.js')<html.indexOf('pc-engine-panel.js'));
assert.ok(!/\blocalStorage\b|\bfetch\b|\bdelete\b|\bunlink\b/.test(fs.readFileSync(path.join(root,'scripts/pc-engine-diagnostics-v038.js'),'utf8')));
console.log('PC Engine Diagnostics V0.3.8: event timeline, entity diff, limits, DOM wiring, isolation OK');
