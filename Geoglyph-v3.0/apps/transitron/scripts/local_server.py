"""Serve the dashboard and relay Adelaide Metro's realtime protobuf feeds."""

import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import unquote, urlsplit
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
FEED_BASE = "https://gtfs.adelaidemetro.com.au/v1/realtime"
FEEDS = {"vehicle_positions", "trip_updates", "service_alerts"}
STATIC_FOLDERS = {"assets", "css", "js", "GTFS data"}


class DashboardHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        self.serve_dashboard()

    def do_HEAD(self):
        self.serve_dashboard(head_only=True)

    def end_headers(self):
        if not unquote(urlsplit(self.path).path).startswith("/api/"):
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def serve_dashboard(self, head_only=False):
        request_path = unquote(urlsplit(self.path).path)
        prefix = "/api/gtfs/"
        if request_path.startswith(prefix):
            endpoint = request_path[len(prefix):]
            if endpoint in FEEDS:
                self.relay_feed(endpoint, head_only)
            else:
                self.send_error(404, "Unknown GTFS feed")
            return

        parts = request_path.removeprefix("/").split("/")
        if request_path == "/":
            self.path = "/index.html"
        elif request_path != "/index.html" and (
            len(parts) != 2 or parts[0] not in STATIC_FOLDERS or parts[1].startswith(".")
        ):
            self.send_error(404)
            return

        target = Path(self.translate_path(self.path)).resolve()
        if not target.is_relative_to(ROOT) or not target.is_file():
            self.send_error(404)
        elif head_only:
            super().do_HEAD()
        else:
            super().do_GET()

    def relay_feed(self, endpoint, head_only):
        upstream = Request(f"{FEED_BASE}/{endpoint}", headers={"Cache-Control": "no-cache"})
        try:
            with urlopen(upstream, timeout=5) as response:
                data = response.read()
        except HTTPError as error:
            self.log_error("Adelaide Metro %s returned HTTP %s", endpoint, error.code)
            self.send_error(502, f"Adelaide Metro returned HTTP {error.code}")
            return
        except (URLError, OSError) as error:
            self.log_error("Adelaide Metro %s request failed: %s", endpoint, error)
            self.send_error(502, "Could not retrieve the Adelaide Metro feed")
            return

        self.send_response(200)
        self.send_header("Content-Type", "application/x-protobuf")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if not head_only:
            self.wfile.write(data)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8080)
    args = parser.parse_args()
    try:
        with ThreadingHTTPServer(("127.0.0.1", args.port), DashboardHandler) as server:
            print(f"Adelaide Metro Dashboard at http://127.0.0.1:{server.server_port}", flush=True)
            server.serve_forever()
    except KeyboardInterrupt:
        pass
    except OSError as error:
        parser.exit(1, f"Could not start local dashboard server: {error}\n")


if __name__ == "__main__":
    main()
