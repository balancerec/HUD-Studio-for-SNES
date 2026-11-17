const fs=require('node:fs');const assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const required=[
 'const keyedGifSources=new Map()',
 'new ImageDecoder({data:await response.arrayBuffer(),type:\'image/gif\'})',
 'decoder.decode({frameIndex:i,completeFramesOnly:true})',
 'frames.push(await createImageBitmap(image))',
 'source.start=performance.now()',
 'function keyedGifFrame(source,now)',
 'keyedGifSource(s)',
 'drawKeyed(ctx,keyedGifFrame(gif,ts)||img,w,h,s.darkThreshold,s.darkFeather)',
 "original.style.opacity=s.darkKey?'0':'1'",
 'trimViewportStyle(el,s)'
];
for(const expression of required)assert.ok(html.includes(expression),`Ausente: ${expression}`);
assert.ok(!html.includes("original.style.visibility=s.darkKey?'hidden':'visible'"));
console.log(`Smoke GIF Playback v0.3.5.1: ${required.length+1} verificações estruturais aprovadas`);
