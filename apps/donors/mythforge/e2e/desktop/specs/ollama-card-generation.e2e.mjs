import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';

const screenshotPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'artifacts',
  'desktop-startup.png',
);

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function startMockOllamaServer() {
  const server = createServer(async (req, res) => {
    if (!req.url) {
      res.statusCode = 404;
      res.end();
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/tags')) {
      const body = JSON.stringify({
        models: [
          {
            name: 'mistral:7b',
            size: 738197504,
            modified_at: '2026-03-31T00:00:00Z',
          },
        ],
      });
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(body);
      return;
    }

    if (req.method === 'POST' && req.url.startsWith('/api/generate')) {
      const body = await readBody(req);
      if (!body.includes('"mistral:7b"')) {
        throw new Error(`Unexpected generate payload: ${body}`);
      }

      const first = JSON.stringify({ response: 'Lore intro. ', done: false }) + '\n';
      const second = JSON.stringify({
        response: '[DRAFT_ENTITY]{"title":"Iris","category":"NPC","summary":"A quiet archivist.","markdown":"## Iris\\nSilent watcher.","attributes":{"hp":10,"ac":12},"tags":["npc","lorekeeper"]}[/DRAFT_ENTITY]',
        done: true,
      }) + '\n';

      res.writeHead(200, { 'content-type': 'application/x-ndjson' });
      res.write(first);
      setTimeout(() => {
        res.end(second);
      }, 750);
      return;
    }

    res.statusCode = 404;
    res.end();
  });

  server.listen(0);
  await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Unable to determine Ollama mock server port.');
  }

  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    stop: () => new Promise((resolve) => server.close(() => resolve())),
  };
}

async function captureLaunchDiagnostics(label) {
  const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'artifacts');
  await mkdir(dir, { recursive: true });

  const stamp = label.replace(/[^a-z0-9-_]+/gi, '-').toLowerCase();
  const screenshotFile = path.resolve(dir, `${stamp}.png`);
  const sourceFile = path.resolve(dir, `${stamp}.html`);

  const currentUrl = await browser.getUrl().catch(() => '<unavailable>');
  const title = await browser.getTitle().catch(() => '<unavailable>');
  const source = await browser.getPageSource().catch(() => '<unavailable>');

  console.error(`[E2E] ${label}`);
  console.error(`[E2E] url=${currentUrl}`);
  console.error(`[E2E] title=${title}`);

  if (typeof source === 'string' && source !== '<unavailable>') {
    await writeFile(sourceFile, source, 'utf8');
    console.error(`[E2E] page source written to ${sourceFile}`);
  }

  try {
    await browser.saveScreenshot(screenshotFile);
    console.error(`[E2E] screenshot written to ${screenshotFile}`);
  } catch (error) {
    console.error('[E2E] screenshot capture failed:', error);
  }
}

async function waitForVisibleOrFail(selector, label, timeout = 15000) {
  try {
    await browser.$(selector).waitForDisplayed({ timeout });
  } catch (error) {
    await captureLaunchDiagnostics(`launch-failed-${label}`);
    throw error;
  }
}

async function openAppOrFail(url) {
  try {
    await browser.url(url);
  } catch (error) {
    await captureLaunchDiagnostics('launch-failed-navigation');
    throw error;
  }
}

describe('MythForge desktop Ollama E2E', () => {
  let ollama;

  before(async () => {
    ollama = await startMockOllamaServer();
  });

  after(async () => {
    await ollama.stop();
  });

  it('opens the app, configures Ollama, and saves a generated draft card', async () => {
    await openAppOrFail('http://127.0.0.1:3000/?e2e=1');
    await waitForVisibleOrFail('[data-testid="e2e-test-banner"]', 'test-banner');
    await waitForVisibleOrFail('[data-testid="ai-copilot"]', 'app-shell', 20000);
    await mkdir(path.dirname(screenshotPath), { recursive: true });
    await browser.saveScreenshot(screenshotPath);

    await browser.$('[data-testid="nav-file"]').click();
    const newWorld = await browser.$('[data-testid="menu-new-world"]');
    await newWorld.waitForDisplayed({ timeout: 10000 });
    await newWorld.click();

    await browser.$('[data-testid="nav-edit"]').click();
    const ollamaSettingsItem = await browser.$('[data-testid="menu-ollama-settings"]');
    await ollamaSettingsItem.waitForDisplayed({ timeout: 10000 });
    await ollamaSettingsItem.click();

    const dialog = await browser.$('[data-testid="preferences-dialog"]');
    await dialog.waitForDisplayed({ timeout: 10000 });

    const baseUrlInput = await browser.$('[data-testid="ollama-base-url"]');
    await baseUrlInput.waitForDisplayed({ timeout: 10000 });
    await baseUrlInput.setValue('');
    await baseUrlInput.setValue(ollama.baseUrl);

    await browser.$('[data-testid="ollama-save"]').click();
    await browser.$('[data-testid="ollama-refresh"]').click();

    await browser.$('[data-testid="ollama-model-mistral:7b"]').waitForDisplayed({ timeout: 20000 });
    await browser.keys('Escape');
    await dialog.waitForDisplayed({ reverse: true, timeout: 10000 });

    const aiInput = await browser.$('[data-testid="ai-input"]');
    await aiInput.waitForDisplayed({ timeout: 10000 });
    await aiInput.setValue('Create a new archivist NPC.');
    await browser.$('[data-testid="ai-send"]').click();

    const draftCard = await browser.$('[data-testid="draft-card"]');
    await draftCard.waitForDisplayed({ timeout: 30000 });
    await browser.$('[data-testid="draft-card-save"]').click();

    await browser.$('[data-testid="entity-card-Iris"]').waitForDisplayed({ timeout: 30000 });
    const entityCard = await browser.$('[data-testid="entity-card-Iris"]');
    const entityText = await entityCard.getText();
    expect(entityText).toContain('Iris');
    expect(entityText).toContain('A quiet archivist.');
  });
});
