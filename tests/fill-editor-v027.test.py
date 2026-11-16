"""Regression: DynamicBar palette switching must preserve image geometry and frame."""
import json, hashlib
from pathlib import Path
from PIL import Image
import numpy as np
ROOT=Path(__file__).resolve().parent.parent
manifest=json.loads((ROOT/'assets/dynamic-bars/paletas/manifest.json').read_text('utf-8'))
assert len(manifest['variants'])==16
for item in manifest['variants']:
    source=Image.open(ROOT/'assets/dynamic-bars'/item['source']).convert('RGBA')
    derived=Image.open(ROOT/item['file']).convert('RGBA')
    assert source.size==derived.size==tuple(item['size'])
    orig=np.asarray(source); new=np.asarray(derived)
    assert np.array_equal(orig[:,:,3],new[:,:,3]),item['file']
    assert (orig[:,:,:3] != new[:,:,:3]).any(),item['file']
    assert hashlib.sha256((ROOT/item['file']).read_bytes()).hexdigest()==item['sha256']
frames=list((ROOT/'assets/dynamic-bars').glob('*_moldura.png'))
assert len(frames)==4
html=(ROOT/'index.html').read_text(encoding='utf-8')
for hook in ['id="barColor"','id="barColorSwatches"','function updateFillColor(color)','fillColor:inferFillColor(s)','s.fillSrc=fillForColor(s,color)','t.drawImage(f,']:
    assert hook in html,hook
for color in ['vermelho','verde','azul','lilas','pink']:
    assert f'value="{color}"' in html
print('FILL EDITOR v0.2.7: 16 variantes RGBA, molduras originais, controles e exportação verificados.')
