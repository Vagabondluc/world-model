#!/usr/bin/env node
/*
 * Development harness for OpenUI: starts a tiny HTTP server that exposes
 * a sample SSE endpoint and watches component files for changes.
 * Intended for local manual testing during development.
 */
import http from 'http';
import { readFileSync } from 'fs';
import { watch } from 'fs';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4321;

function sendSSE(res: http.ServerResponse, event: string, data: any) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/openui/stream') {
    // Simple body buffering
    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));
    req.on('end', () => {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });

      // Send a few simulated events
      sendSSE(res, 'text', { text: 'Dev harness: streaming sample text' });
      sendSSE(res, 'component', { component: { type: 'DraftCard', props: { id: 'dev-1', title: 'Dev Draft' } } });
      sendSSE(res, 'action', { type: 'createEntity', payload: { id: 'dev-1' } });
      sendSSE(res, 'done', {});

      // end
      res.end();
    });
    return;
  }

  // Health and simple UI
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<html><body><h1>OpenUI Dev Harness</h1><p>POST to <code>/api/openui/stream</code> to receive SSE events.</p></body></html>');
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`OpenUI dev harness listening on http://localhost:${PORT}`);
});

// Watch for component changes and log them (hot-reload placeholder)
const watchDir = './mythforge/src/lib/openui/components';
try {
  watch(watchDir, { recursive: true }, (eventType, filename) => {
    // eslint-disable-next-line no-console
    console.log(`[openui-dev] ${eventType} ${filename}`);
  });
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('[openui-dev] watch not available in this environment');
}
