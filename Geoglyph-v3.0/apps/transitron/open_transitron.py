#!/usr/bin/env python3
"""Start Transitron's local dashboard server and open it in a browser."""

import argparse
import sys
import threading
import webbrowser
from http.server import ThreadingHTTPServer
from pathlib import Path


SCRIPTS_DIR = Path(__file__).resolve().parent / "scripts"
sys.path.insert(0, str(SCRIPTS_DIR))
from local_server import DashboardHandler  # noqa: E402


DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8090


def open_browser(url: str) -> None:
    webbrowser.open(url, new=2)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default=DEFAULT_HOST, help="Interface to bind (default: %(default)s)")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help="Port to bind (default: %(default)s)")
    parser.add_argument(
        "--no-browser",
        action="store_true",
        help="Start the server without opening a browser",
    )
    args = parser.parse_args()

    try:
        with ThreadingHTTPServer((args.host, args.port), DashboardHandler) as server:
            address = server.server_address
            url = f"http://{address[0]}:{address[1]}"
            print(f"Transitron at {url}", flush=True)
            if not args.no_browser:
                browser = threading.Timer(0.2, open_browser, args=(url,))
                browser.daemon = True
                browser.start()
            server.serve_forever()
    except KeyboardInterrupt:
        pass
    except OSError as error:
        parser.exit(1, f"Could not start Transitron: {error}\n")


if __name__ == "__main__":
    main()
