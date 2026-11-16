const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
function contains(s){assert.ok(script.includes(s),`Trecho ausente: ${s}`)}
[
  'function setSelection(ids,primary=null)',
  'function expandGroup(ids)',
  'function toggleSelection(id)',
  'function groupSelection()',
  'function ungroupSelection()',
  'function zoomAt(clientX,clientY,next)',
  "view.addEventListener('wheel'",
  "view.addEventListener('pointerdown'",
  "className='marquee'",
  "document.addEventListener('keydown'"
].forEach(contains);
let sprites=[
 {id:'a',groupId:'g1'},{id:'b',groupId:'g1'},
 {id:'c',groupId:null},{id:'d',groupId:'g2'}
];
const ctx={sprites,Set,Math,Array};vm.createContext(ctx);
const src=script.slice(script.indexOf('function expandGroup('),script.indexOf('function setSelection('));
vm.runInContext(src,ctx);
assert.deepEqual([...ctx.expandGroup(['a'])].sort(),['a','b']);
assert.deepEqual([...ctx.expandGroup(['c'])],['c']);
assert.deepEqual([...ctx.expandGroup(['d'])],['d']);
console.log('EDITOR v0.2.1: recursos e expansão de grupos verificados (13 verificações).');
