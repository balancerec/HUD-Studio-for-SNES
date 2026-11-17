"""Live local HTTP smoke with a mock Engine API (not a native C++ integration test)."""
import importlib.util
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import unittest
from urllib.request import Request, urlopen
from urllib.error import HTTPError

SRC=Path(__file__).resolve().parents[1]/'scripts'/'serve-pc-engine.py'
spec=importlib.util.spec_from_file_location('hud_local_proxy',SRC)
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)

class Upstream(BaseHTTPRequestHandler):
    def log_message(self,*args):pass
    def do_GET(self):
        raw=json.dumps({'available':True,'trace_schema':'ng-state-1','view_schema':'ng-lab-view-1'}).encode()
        self.send_response(200);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(raw)));self.end_headers();self.wfile.write(raw)
    def do_POST(self):
        raw=json.dumps({'id':'a'*32}).encode()
        self.send_response(201);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(raw)));self.end_headers();self.wfile.write(raw)

class EndToEndTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.backend=ThreadingHTTPServer(('127.0.0.1',0),Upstream)
        module.Handler.upstream_port=cls.backend.server_port
        cls.hud=ThreadingHTTPServer(('127.0.0.1',0),module.Handler)
        for srv in (cls.backend,cls.hud):
            threading.Thread(target=srv.serve_forever,daemon=True).start()
        cls.base=f'http://127.0.0.1:{cls.hud.server_port}'
    @classmethod
    def tearDownClass(cls):
        for srv in (cls.hud,cls.backend):srv.shutdown();srv.server_close()
    def req(self,path,method='GET',data=None,headers=None):
        request=Request(self.base+path,method=method,data=data,headers=headers or {})
        try:
            with urlopen(request,timeout=4) as r:return r.status,r.read(),dict(r.headers)
        except HTTPError as err:return err.code,err.read(),dict(err.headers)
    def test_engine_status(self):
        code,raw,headers=self.req('/api/engine/status')
        self.assertEqual(code,200)
        self.assertTrue(json.loads(raw)['available'])
        self.assertEqual(headers.get('Cache-Control'),'no-store')
    def test_run_proxy(self):
        code,raw,_=self.req('/api/engine/runs','POST',b'{"scenario":"projectile","frames":100}',{'Content-Type':'application/json'})
        self.assertEqual(code,201)
        self.assertEqual(json.loads(raw)['id'],'a'*32)
    def test_private_paths_blocked(self):
        for path in ('/.git/config','/examples/umk3-hud-project-v033-corrigido.json','/api/projects','/api/engine/import','/scripts/%2e%2e/README.md'):
            code,_,_=self.req(path)
            self.assertIn(code,(403,404),path)
    def test_bad_origin(self):
        code,_,_=self.req('/api/engine/runs','POST',b'{}',{'Content-Type':'application/json','Origin':'http://attacker.example'})
        self.assertEqual(code,403)
    def test_html(self):
        code,raw,_=self.req('/index.html')
        self.assertEqual(code,200)
        self.assertIn(b'pcEngineOpen',raw)

if __name__=='__main__':unittest.main()
