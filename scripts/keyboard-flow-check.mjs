import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';
import { categories, quadrantPageExamples, rings } from '../src/data.ts';

// Component HTML checks only; actual Tab navigation and focus geometry require the browser checks.
const server = await createServer({ server: { middlewareMode: true, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' });
after(() => server.close());
const { TechnologyGroups } = await server.ssrLoadModule('/src/components/Common.tsx');
const render = category => renderToStaticMarkup(createElement(MemoryRouter, null,
  createElement(TechnologyGroups, { items: quadrantPageExamples[category] })));

test('all entries on each quadrant page are reachable links or explicitly unavailable focus targets', () => {
  for (const category of categories) {
    const html = render(category);
    const cards = [...html.matchAll(/<(a|div)\b([^>]*class="technology-card[^>]*?)>([\s\S]*?)<\/(?:a|div)>/g)];
    const items = rings.flatMap(ring => quadrantPageExamples[category].filter(item => item.ring === ring));
    assert.equal(cards.length, items.length);
    cards.forEach(([_, tag, attributes], index) => {
      if (items[index].detail) {
        assert.equal(tag, 'a');
        assert(attributes.includes(`href="${items[index].detail}"`));
        assert(!attributes.includes('aria-disabled'));
        assert(!attributes.includes('tabindex="-1"'));
      } else {
        assert.equal(tag, 'div');
        assert(attributes.includes('role="link"'));
        assert(attributes.includes('tabindex="0"'));
        assert(attributes.includes('aria-disabled="true"'));
        assert(attributes.includes('title="Detailseite noch nicht verfügbar"'));
        assert(!attributes.includes('href='));
      }
    });
  }
});
test('Automated Security Testing remains the first keyboard target in Techniques content', () => {
  const html = render('Techniques');
  const first = html.match(/<div class="technology-card unavailable"[^>]*>([\s\S]*?)<\/div>/);
  assert(first);
  assert(first[1].includes('Automated Security Testing'));
  assert(html.indexOf('Automated Security Testing') < html.indexOf('DevOps</span>'));
});
