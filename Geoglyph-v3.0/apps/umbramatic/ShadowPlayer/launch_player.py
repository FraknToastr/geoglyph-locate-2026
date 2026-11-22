"""Optional, BAT-free local launcher for Shadow / Time.

Run with standard Python 3.8+ (e.g., `python launch_player.py`).
The browser player also works by double-clicking index.html if the MapLibre
CDN is accessible. Hosting locally enables automatic loading from ./data/.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser


def main():
    root = Path(__file__).resolve().parent
    handler = partial(SimpleHTTPRequestHandler, directory=str(root))
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    url = "http://127.0.0.1:{}/index.html".format(server.server_port)
    print("Shadow / Time local viewer: {}".format(url))
    print("Press Ctrl+C to stop.\n")
    webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
