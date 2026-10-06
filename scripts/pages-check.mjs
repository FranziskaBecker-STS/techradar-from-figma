import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';
import { quadrantPages, technologyArticles } from '../src/data.ts';

const base = '/techradar-from-figma/';
const routes = ['/', ...Object.keys(quadrantPages).map(key => `/${key}`), ...technologyArticles.map(article => article.detail), '/techradar'];
const server = await createServer({ mode: 'github-pages', server: { middlewareMode: true, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' });
after(() => server.close());
const { default: App } = await server.ssrLoadModule('/src/App.tsx');

test('all existing pages resolve images, SVG symbols and links under the repository path', async () => {
  for (const route of routes) {
    const html = renderToStaticMarkup(createElement(MemoryRouter, { basename: base, initialEntries: [`${base}${route.slice(1)}`] }, createElement(App)));
    assert(html.includes('Techradar'));
    const assets = [...html.matchAll(/<(?:img|use)\b[^>]*(?:src|href)="([^"]+)"/g)].map(match => match[1]);
    assert(assets.length > 0, `No rendered assets on ${route}`);
    for (const asset of assets) {
      assert(asset.startsWith(`${base}assets/`), `Incorrect public asset on ${route}: ${asset}`);
      assert((await stat(new URL(`../public/${asset.slice(base.length).split('#')[0]}`, import.meta.url))).isFile());
    }
    for (const match of html.matchAll(/<a\b[^>]*href="(\/[^"\n]*)"/g)) {
      assert(match[1].startsWith(base), `Link leaves the app base on ${route}: ${match[1]}`);
    }
    for (const match of html.matchAll(/mask-image:([^;]+)/g)) {
      assert(!match[1].includes('&quot;/assets/'), `Unprefixed SVG mask on ${route}`);
    }
  }
});

test('the Pages artifact contains entry documents for every direct route and the original assets', async () => {
  const entry = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  const bundleLinks = [...entry.matchAll(/(?:src|href)="([^"\n]+\.(?:js|css))"/g)].map(match => match[1]);
  assert.equal(bundleLinks.length, 2);
  for (const asset of bundleLinks) {
    assert(asset.startsWith(`${base}assets/`));
    assert((await stat(new URL(`../dist/${asset.slice(base.length)}`, import.meta.url))).isFile());
  }
  for (const route of routes) {
    const path = route === '/' ? 'index.html' : `${route.slice(1)}/index.html`;
    assert.equal(await readFile(new URL(`../dist/${path}`, import.meta.url), 'utf8'), entry);
  }
  assert.equal(await readFile(new URL('../dist/404.html', import.meta.url), 'utf8'), entry);
  assert((await stat(new URL('../dist/.nojekyll', import.meta.url))).isFile());
  for (const asset of ['7b448.svg', 'b4102.svg', 'c929c.svg', 'current-techradar-logos.svg']) {
    assert.equal(await readFile(new URL(`../dist/assets/${asset}`, import.meta.url), 'utf8'), await readFile(new URL(`../public/assets/${asset}`, import.meta.url), 'utf8'));
  }
});
