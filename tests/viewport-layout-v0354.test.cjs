const fs=require('fs'),assert=require('assert');
const path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const ref=JSON.parse(fs.readFileSync(path.join(__dirname,'../examples/manual-layout-profiles-v0353.json'),'utf8'));
assert.match(html,/\.viewport\{[^}]*overflow:scroll/);
assert.match(html,/scrollbar-gutter:stable/);
assert.match(html,/function zoomAt\(clientX,clientY,next\)/);
assert.match(html,/view\.scrollLeft\+=after\.left\+x\*scale-clientX/);
assert.match(html,/view\.scrollTop\+=after\.top\+y\*scale-clientY/);
assert.match(html,/if\(!e\.ctrlKey\)return/);
assert.match(html,/\{passive:false\}/);
assert.match(html,/id="loadManualLayouts"/);
assert.match(html,/matches<Math\.min\(10,known\.length\)/);
assert.deepStrictEqual(Object.keys(ref.profiles).sort(),['1920x1080','1280x720','1080x1920','720x1280','512x448','256x224'].sort());
for(const [key,prof] of Object.entries(ref.profiles)){
 assert.strictEqual(`${prof.width}x${prof.height}`,key);
 assert.strictEqual(Object.keys(prof.items).length,20);
 for(const rect of Object.values(prof.items))for(const key of ['x','y','w','h'])assert.ok(Number.isFinite(rect[key]));
}
// The media-heavy, user-specific JSON is optional. CI must remain self-contained.
const fullPath=path.join(__dirname,'../examples/umk3-hud-6-layouts-manuais-v0354.json');
if(fs.existsSync(fullPath)){
 const full=JSON.parse(fs.readFileSync(fullPath,'utf8'));
 assert.strictEqual(full.sprites.length,20);
 assert.strictEqual(Object.keys(full.layoutProfiles).length,6);
 assert.ok(full.background.image?.startsWith('data:image/'));
 for(const key of Object.keys(ref.profiles))assert.ok(full.layoutProfiles[key],`Missing saved layout: ${key}`);
 console.log('Full user project: optional integration fixture verified');
}else{
 console.log('Full user project: optional integration fixture absent (portable CI mode)');
}
console.log('V0.3.5.4 viewport / Ctrl+wheel / six hand-positioned profiles: OK');
