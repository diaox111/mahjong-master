import http.server, socketserver, threading, urllib.request, time

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=r'K:/hermes/.hermes/projects/mahjong-site', **kw)
    def log_message(self, *a): pass

PORT = 8765
httpd = socketserver.TCPServer(('', PORT), Handler)
t = threading.Thread(target=httpd.serve_forever, daemon=True)
t.start()
time.sleep(1)

try:
    r = urllib.request.urlopen('http://localhost:8765/', timeout=3)
    body = r.read().decode()
    print('HTTP:', r.status)
    print('Page size:', len(body), 'bytes')
    print('Has title:', 'Mahjong Solitaire' in body)
    print('Has CTA:', 'Start Playing' in body)
    print('Has features:', 'Why MahjongMaster' in body)
    print('Has AdSense placeholder:', 'AdSense' in body)
    r2 = urllib.request.urlopen('http://localhost:8765/css/style.css', timeout=3)
    print('CSS status:', r2.status, 'size:', len(r2.read()), 'bytes')
    r3 = urllib.request.urlopen('http://localhost:8765/js/game.js', timeout=3)
    print('game.js status:', r3.status, 'size:', len(r3.read()), 'bytes')
    r4 = urllib.request.urlopen('http://localhost:8765/js/main.js', timeout=3)
    print('main.js status:', r4.status, 'size:', len(r4.read()), 'bytes')
except Exception as e:
    print('ERROR:', e)
httpd.shutdown()
