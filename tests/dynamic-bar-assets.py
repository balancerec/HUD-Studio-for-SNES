from pathlib import Path
import struct
root=Path(__file__).resolve().parents[1]
files=list((root/'assets'/'dynamic-bars').glob('*.png'))
assert len(files)==8, f'8 sprites esperados, {len(files)} encontrados'
for f in files:
 with f.open('rb') as io: head=io.read(26)
 assert head[:8]==b'\x89PNG\r\n\x1a\n', f.name
 w,h=struct.unpack('>II',head[16:24]);assert w>0 and h>0
 assert head[25]==6, f'Imagem não RGBA: {f.name}'
print('DynamicBar: 8 sprites PNG RGBA verificados.')
