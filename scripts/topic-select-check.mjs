import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { topics } from '../src/data.ts';

// Render the component as HTML only; this does not open a browser or verify layout/events.
const server = await createServer({ server: { middlewareMode: true, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' });
after(() => server.close());
const { TopicSelect } = await server.ssrLoadModule('/src/components/TopicSelect.tsx');
const render = value => renderToStaticMarkup(createElement(TopicSelect, { value, onChange() {} }));
const escape = text => text.replaceAll('&', '&amp;');

test('the topic filter exposes a labeled, collapsed combobox and all ten options', () => {
  const html = render('Alle');
  assert(!html.includes('<select'));
  assert.match(html, /<button[^>]*type="button"[^>]*role="combobox"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /<label[^>]*for="topic">Thema<\/label>/);
  const listId = html.match(/aria-controls="([^"]+)"/)[1];
  assert(html.includes(`id="${listId}" hidden=""`));
  assert.equal((html.match(/role="option"/g) || []).length, topics.length);
  assert.equal((html.match(/aria-selected="true"/g) || []).length, 1);
  assert(html.includes('aria-selected="true" data-active="true">Alle</div>'));
});
test('URL-backed topic values select the correct row, including long topic names', () => {
  for (const value of ['Cloud', 'Frontend & UX & Design', 'Hosting & Operation']) {
    const html = render(value);
    assert(html.includes(`title="${escape(value)}">${escape(value)}</span>`));
    assert(html.includes(`aria-selected="true" data-active="true">${escape(value)}</div>`));
    assert.equal((html.match(/aria-selected="true"/g) || []).length, 1);
  }
});
test('both original dropdown arrows retain their Figma dimensions', async () => {
  for (const name of ['topic-arrow-down.svg', 'topic-arrow-up.svg']) {
    const svg = await fs.readFile(new URL(`../public/assets/${name}`, import.meta.url), 'utf8');
    assert.match(svg, /<svg[^>]*width="12.28"[^>]*height="7.20073"/);
    assert.match(svg, /viewBox="0 0 12.28 7.20073"/);
  }
  assert(render('Alle').includes('src="/assets/topic-arrow-down.svg"'));
});
