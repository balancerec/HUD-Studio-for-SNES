import importlib.util
from pathlib import Path
import unittest

SOURCE=Path(__file__).resolve().parents[1]/'scripts'/'serve-pc-engine.py'
spec=importlib.util.spec_from_file_location('pc_engine_proxy',SOURCE)
module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class ProxyTests(unittest.TestCase):
    def test_get_allowed(self):
        self.assertTrue(module.permitted('/api/engine/status','GET'))
        self.assertTrue(module.permitted('/api/engine/runs/'+'a'*32,'GET'))
    def test_post_allowed(self):
        self.assertTrue(module.permitted('/api/engine/runs','POST'))
        self.assertTrue(module.permitted('/api/engine/compare','POST'))
    def test_block_dangerous_paths(self):
        for x in ('/api/engine/import','/api/engine/assets/projects','/api/engine/runs/../../etc','/api/projects','/api/interactive/sessions'):
            self.assertFalse(module.permitted(x,'GET'))
            self.assertFalse(module.permitted(x,'POST'))
    def test_static_path_allowlist(self):
        self.assertTrue(module.allowed_static('/index.html'))
        self.assertTrue(module.allowed_static('/scripts/pc-engine-panel.js'))
        self.assertTrue(module.allowed_static('/assets/thing.png'))
        for x in ('/examples/umk3-hud-project-v033-corrigido.json','/.git/config','/docs/AUDIT.md','/scripts/../README.md'):
            self.assertFalse(module.allowed_static(x))

if __name__=='__main__':unittest.main()
