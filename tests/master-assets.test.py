"""Validates Master Asset catalog extraction, RGBA PNGs, and mask containment."""
from pathlib import Path
import json,hashlib
from PIL import Image,ImageChops
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'assets/master-v1/catalog.json').read_text(encoding='utf8'))
src=root/'assets/master-v1/MASTER_ORIGINAL_1536x1024.png'
assert hashlib.sha256(src.read_bytes()).hexdigest()==manifest['sha256']
master=Image.open(src).convert('RGBA')
assert master.size==tuple(manifest['source_size'])==(1536,1024)
ids=set();cleaned=0
for a in manifest['assets']:
 assert a['id'] not in ids, a['id'];ids.add(a['id'])
 x0,y0,x1,y1=a['source_rect'];assert 0<=x0<x1<=master.width and 0<=y0<y1<=master.height
 exact=master.crop((x0,y0,x1,y1))
 raw=Image.open(root/a['path']).convert('RGBA')
 assert raw.size==exact.size and ImageChops.difference(exact,raw).getbbox() is None, a['id']
 image=Image.open(root/a['editor_path']).convert('RGBA')
 assert image.size==raw.size
 # Cleaned images can remove alpha only; no arbitrary redesign or recoloring.
 if a['editor_path']!=a['path']:
  cleaned+=1
  assert ImageChops.difference(raw.convert('RGB'),image.convert('RGB')).getbbox() is None,a['id']
  assert all(b<=r for b,r in zip(image.getchannel('A').getdata(),raw.getchannel('A').getdata())),a['id']
print(f'Master V1: {len(ids)} recortes RGBA validados; {cleaned} variantes de máscaras provisórias; SHA256 íntegro.')
