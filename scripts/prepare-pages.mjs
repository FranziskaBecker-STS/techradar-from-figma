import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { quadrantPages, technologyArticles } from '../src/data.ts';

export const pageRoutes = [
  '/', ...Object.keys(quadrantPages).map(key => `/${key}`),
  ...technologyArticles.map(article => article.detail), '/techradar',
];

const output = new URL('../dist/', import.meta.url);
const entry = new URL('index.html', output);
const html = await readFile(entry, 'utf8');
if (!html.includes('/techradar-from-figma/assets/')) {
  throw new Error('Build with the github-pages mode before preparing the Pages artifact.');
}
for (const route of pageRoutes.filter(path => path !== '/')) {
  if (!/^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(route)) throw new Error(`Unexpected page route: ${route}`);
  const directory = new URL(`${route.slice(1)}/`, output);
  await mkdir(directory, { recursive: true });
  await copyFile(entry, new URL('index.html', directory));
}
await copyFile(entry, new URL('404.html', output));
await writeFile(new URL('.nojekyll', output), '');
console.log(`Prepared ${pageRoutes.length} existing routes for GitHub Pages in ${fileURLToPath(output)}.`);
