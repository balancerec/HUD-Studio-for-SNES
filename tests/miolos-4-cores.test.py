from pathlib import Path
import json,hashlib
from PIL import Image
root=Path(__file__).resolve().parents[1]
cat=json.loads((root/'assets/miolos-4-cores/catalog.json').read_text(encoding='utf8'))
assert len(cat['assets'])==12
assert set(cat['colors'])=={'verde','azul','lilas','pink'}
for item in cat['assets']:
    path=root/item['path']
    assert path.is_file(),item['id']
    assert hashlib.sha256(path.read_bytes()).hexdigest()==item['sha256'],item['id']
    with Image.open(path) as img:
        assert img.mode=='RGBA'
        assert img.size==(item['width'],item['height'])
        expected={'lava':(281,81),'moldura':(283,94),'sheet':(1536,1024)}[item['type']]
        assert img.size==expected,item['id']
page=(root/'index.html').read_text(encoding='utf8')
for entry in cat['assets']:
    assert entry['path'] in page,entry['path']
assert 'miolos-cores' in page and 'miolos-sheets' in page
print('Miolos V0.2.6: 4 cores, 8 sprites e 4 sheets RGBA; SHA256 e registro no Browser aprovados.')
