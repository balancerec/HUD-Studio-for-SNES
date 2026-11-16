const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8');
for(const id of ['fxBlend','fxStrength','fxDarkKey','fxThreshold','fxFeather'])
  assert(html.includes(`id="${id}"`),id);
for(const mode of ['normal','multiply','screen','add','subtract','lighten','darken','difference'])
  assert(html.includes(`value="${mode}"`),mode);
for(const hook of ['keyDarkPixels','refreshKeyedInstances','renderFxSprite','compositeSubtract','globalCompositeOperation','fxStrength:', 'darkThreshold:', 'darkFeather:'])
  assert(html.includes(hook),hook);
const keyFunc=/function keyDarkPixels\(pixels,threshold,feather\)\{[\s\S]*?\n\}/.exec(html)[0];
const key=vm.runInNewContext(`${keyFunc};keyDarkPixels`);
let im={data:new Uint8ClampedArray([0,0,0,255, 25,25,25,255, 50,50,50,255, 255,255,255,255])};
key(im,25,50);
assert.equal(im.data[3],0,'black removed');
assert.equal(im.data[7],0,'pixels below threshold removed');
assert.equal(im.data[11],128,'soft feather retains partial alpha');
assert.equal(im.data[15],255,'white preserved');
// Black key preserves colored smoke, not only neutral gray.
let colored={data:new Uint8ClampedArray([30,5,10,255])};key(colored,20,20);
assert.equal(colored.data[3],128);
console.log('FX V0.3.0: blend modes, dark-key luminance, alpha feather, export hooks OK');
