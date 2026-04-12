import http.server
import socketserver
import os
import sys

PORT = 8081
DIRECTORY = "dist"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

if __name__ == "__main__":
    # Ensure we are in the right directory or change into it? 
    # Current CWD for the tool is likely root, so 'dist' is correct relative path.
    if not os.path.exists(DIRECTORY):
        print(f"Error: Directory '{DIRECTORY}' not found. Run 'npm run build' first.")
        sys.exit(1)

    print(f"Starting server for directory '{DIRECTORY}' at http://localhost:{PORT}")
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"Serving at http://localhost:{PORT}")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except OSError as e:
        print(f"Error starting server: {e}")
