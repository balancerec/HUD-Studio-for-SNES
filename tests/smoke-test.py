#!/usr/bin/env python3
"""Static sanity checks; no third-party dependencies."""
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import struct

ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / 'index.html').read_text(encoding='utf-8')
refs = set(re.findall(r'assets/[A-Za-z0-9_.-]+\.png', html))
assert refs, 'Sem referências a PNG.'
for ref in sorted(refs):
    path = ROOT / ref
    assert path.is_file(), f'Asset ausente: {ref}'
    with path.open('rb') as f:
        header = f.read(24)
    assert header.startswith(b'\x89PNG\r\n\x1a\n'), f'PNG inválido: {ref}'
    width, height = struct.unpack('>II', header[16:24])
    assert width > 0 and height > 0, f'Dimensões inválidas: {ref}'

assert 'let W=1920, H=1080' in html, 'Preset inicial Full HD não encontrado.'
for preset in ('1920x1080', '512x448', '256x224', '1080x1920', '720x1280', '1280x720'):
    assert f'<option value="{preset}">' in html, f'Preset ausente: {preset}'
script = re.search(r'<script>([\s\S]*?)</script>', html)
assert script, 'JavaScript embutido não encontrado.'
node = shutil.which('node')
if node:
    with tempfile.TemporaryDirectory() as td:
        file = Path(td) / 'editor.js'
        file.write_text(script.group(1), encoding='utf-8')
        subprocess.run([node, '--check', str(file)], check=True)
    print('JavaScript: sintaxe OK')
else:
    print('Node não instalado: verificação JS ignorada')
print(f'OK: {len(refs)} PNGs referenciados; canvas dinâmico com 6 presets (PC/SNES/Mobile); estrutura consistente.')
