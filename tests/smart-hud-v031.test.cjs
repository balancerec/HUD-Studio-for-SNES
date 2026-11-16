const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const ids=['smartHudTools','addP1Name','addP2Name','mkGame','mkCharacter','hudName','hudTextColor','hudFontSize','applyHudText','hudMaterial','applyHudMaterial','hudTimerDuration','hudTimerColor','addHudTimer','hudTimerPlay','hudTimerReset','hudMirrorAxis','hudMirrorGrid','hudMirrorLink','hudMirrorDuplicate','hudMirrorAlign','fxTintEnabled','fxTintColor','fxTintAmount','fxBrightness','fxContrast','fxSaturation'];
for(const id of ids){assert.match(html,new RegExp(`id="${id}"`),`missing UI ${id}`);}
for(const needle of ['function smartSvgImage','function materialSource','function timerVisual','function mirrorQuant','function refreshMKNames','MK_ROSTERS','mirrorLinked','timerRemaining','tintEnabled','tintColor','source-in','function addFighterText'])assert.ok(html.includes(needle),`missing ${needle}`);
assert.match(html,/mirrorPair:s\.id/);
assert.match(html,/ctx\.filter|t\.filter/);
for(const f of ['obsidiana_placa.png','lava_longa.png','lava_placa.png'])assert.ok(fs.existsSync(path.join(__dirname,'../assets/master-v1/clean/miolos',f)),f);
for(const c of ['verde','azul','lilas','pink'])assert.ok(fs.existsSync(path.join(__dirname,`../assets/miolos-4-cores/miolo_lava_${c}.png`)),c);
const unique=new Set(ids);assert.equal(unique.size,ids.length);
console.log(`Smart HUD v0.3.1: ${ids.length} controles e recursos de nome, material, cronômetro, simetria e FX validados (estático).`);
