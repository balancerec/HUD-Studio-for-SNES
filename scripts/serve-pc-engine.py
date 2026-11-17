#!/usr/bin/env python3
"""Local-only HUD host + narrowly scoped same-origin reverse proxy for existing PC Engine Lab.
No ROMs, SQLite, HUD JSON or user asset files are forwarded. No dependencies outside Python stdlib.
Usage: py scripts/serve-pc-engine.py --port 8015 --upstream-port 8000
"""
import argparse
import http.client
import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit,unquote

ROOT=Path(__file__).resolve().parents[1]
MAX_REQUEST=8192
MAX_RESPONSE=24*1024*1024
ALLOWED_GET=(
    '/api/engine/status','/api/engine/scenarios','/api/engine/runs'
)
ALLOWED_POST=('/api/engine/runs','/api/engine/compare')


def permitted(path,method):
    if method=='GET':
        if path in ALLOWED_GET:return True
        parts=path.split('/')
        return len(parts)==5 and parts[:4]==['','api','engine','runs'] and len(parts[4])==32 and all(c in '0123456789abcdef' for c in parts[4])
    return method=='POST' and path in ALLOWED_POST


def allowed_static(path):
    path=urlsplit(path).path
    if '%' in path or '\\' in path or any(v in ('.','..') for v in path.split('/')):return False
    if path in ('/','/index.html','/favicon.ico'):return True
    if path=='/examples/manual-layout-profiles-v0353.json':return True
    return path.startswith(('/assets/','/scripts/')) and '..' not in path.split('/')

class Handler(SimpleHTTPRequestHandler):
    upstream_port=8000
    server_port=8015
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
    def log_message(self,fmt,*args):print('HUD local:',fmt%args)
    def safe_host(self):
        host=urlsplit('//'+self.headers.get('Host',''))
        return host.hostname in ('127.0.0.1','localhost') and host.port==self.server.server_port and not host.username and not host.password
    def same_origin(self):
        origin=self.headers.get('Origin')
        if origin is None:return True
        parsed=urlsplit(origin)
        return parsed.scheme=='http' and parsed.hostname in ('127.0.0.1','localhost') and parsed.port==self.server.server_port
    def json_error(self,code,message):
        raw=json.dumps({'detail':message}).encode()
        self.send_response(code);self.send_header('Content-Type','application/json');self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(raw)));self.end_headers();self.wfile.write(raw)
    def do_GET(self):
        if not self.safe_host():return self.json_error(403,'Host não autorizado')
        if urlsplit(self.path).path.startswith('/api/'):
            return self.proxy('GET')
        if not allowed_static(self.path):return self.send_error(404,'Recurso não publicado pelo servidor HUD')
        return super().do_GET()
    def do_POST(self):
        if not self.safe_host() or not self.same_origin() or self.headers.get('Sec-Fetch-Site','same-origin') not in ('same-origin','none'):return self.json_error(403,'Origem não autorizada')
        return self.proxy('POST')
    def proxy(self,method):
        parsed=urlsplit(self.path)
        if parsed.query or not permitted(parsed.path,method):return self.json_error(404,'Endpoint bloqueado')
        length=self.headers.get('Content-Length','0')
        try:n=int(length)
        except ValueError:return self.json_error(400,'Content-Length inválido')
        if n<0 or n>MAX_REQUEST:return self.json_error(413,'Requisição muito grande')
        if method=='POST' and self.headers.get('Content-Type','').split(';')[0].strip().lower()!='application/json':return self.json_error(415,'Somente JSON')
        payload=self.rfile.read(n) if method=='POST' else None
        if method=='POST':
            try:json.loads(payload)
            except (ValueError,UnicodeError):return self.json_error(400,'JSON inválido')
        try:
            conn=http.client.HTTPConnection('127.0.0.1',self.upstream_port,timeout=18)
            # Do not forward client-supplied Host, Origin, cookies, or credentials.
            headers={'Host':f'127.0.0.1:{self.upstream_port}','Accept':'application/json'}
            if method=='POST':headers['Content-Type']='application/json'
            conn.request(method,parsed.path,body=payload,headers=headers)
            resp=conn.getresponse()
            size=resp.getheader('Content-Length')
            if size and int(size)>MAX_RESPONSE:
                conn.close();return self.json_error(502,'Resposta da engine excedeu limite')
            raw=resp.read(MAX_RESPONSE+1)
            if len(raw)>MAX_RESPONSE:
                conn.close();return self.json_error(502,'Resposta da engine excedeu limite')
            content_type=resp.getheader('Content-Type','application/json')
            code=resp.status
            conn.close()
        except (OSError,TimeoutError,ValueError):return self.json_error(503,'Backend PC Engine indisponível em 127.0.0.1')
        self.send_response(code)
        self.send_header('Content-Type',content_type)
        self.send_header('Content-Length',str(len(raw)))
        self.send_header('Cache-Control','no-store')
        self.send_header('X-Content-Type-Options','nosniff')
        self.end_headers();self.wfile.write(raw)

def main():
    p=argparse.ArgumentParser(description='HUD Studio / PC Engine Lab local proxy')
    p.add_argument('--port',type=int,default=8015)
    p.add_argument('--upstream-port',type=int,default=8000)
    args=p.parse_args()
    if not (1024<=args.port<=65535 and 1024<=args.upstream_port<=65535 and args.port!=args.upstream_port):p.error('Portas inválidas ou iguais')
    Handler.upstream_port=args.upstream_port
    with ThreadingHTTPServer(('127.0.0.1',args.port),Handler) as httpd:
        print(f'HUD Studio: http://127.0.0.1:{args.port} — PC Engine: 127.0.0.1:{args.upstream_port}')
        httpd.serve_forever()

if __name__=='__main__':main()
