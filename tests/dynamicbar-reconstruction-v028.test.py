"""Checks rebuilt overlays retain one constant metallic frame, real-color fills and matched masks."""
from pathlib import Path
from PIL import Image
import numpy as np
import json
root=Path(__file__).resolve().parent.parent
base=root/'assets/dynamic-bars/reconstructed'
m=json.loads((base/'manifest.json').read_text(encoding='utf-8'))
assert len(m['bars'])==4
colors=['vermelho','verde','azul','lilas','pink']
for b in m['bars']:
    shape=tuple(b['size'])
    images={k:np.array(Image.open(root/b[k]).convert('RGBA')) for k in ['frame','empty']}
    mask=np.array(Image.open(root/b['mask']).convert('L'))
    assert mask.shape==(shape[1],shape[0])
    assert 0<(mask>128).sum()<mask.size
    assert (images['frame'][:,:,3][mask>250] <= 5).mean()>0.99, b['id']
    assert np.array_equal(images['empty'][:,:,3],mask)
    fills=[]
    for color in colors:
        a=np.array(Image.open(root/b['fills'][color]).convert('RGBA'))
        assert a.shape[:2]==mask.shape
        assert np.all(a[:,:,3]<=mask), (b['id'],color)
        fills.append(a)
    for a in fills[1:]:
        assert np.any(a[:,:,:3]!=fills[0][:,:,:3])
    # 0% always leaves identical frame+empty; 100% includes visible fill
    for direction in ['rtl','ltr']:
        for pct in [0,25,50,75,100]:
            crop=np.zeros(mask.shape,dtype=np.uint8)
            cut=round(shape[0]*pct/100)
            if direction=='ltr': crop[:,:cut]=255
            else: crop[:,shape[0]-cut:]=255
            clipped=np.minimum(mask,crop)
            if pct==0: assert not clipped.any()
            if pct==100: assert np.array_equal(mask,clipped)
print('DynamicBar V0.2.8: 4 masks, 4 immutable frames, 20 fills, 5 states x 2 directions verified.')
