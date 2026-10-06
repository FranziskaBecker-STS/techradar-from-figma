import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { categoryPaths, devopsParagraphs, quadrantPageExamples, relatedTopics, technologies, technologyArticles } from '../src/data.ts';

test('all six articles have unique routes and matching catalog entries', () => {
  assert.equal(technologyArticles.length, 6);
  assert.equal(new Set(technologyArticles.map(article => article.detail)).size, 6);
  for(const article of technologyArticles) {
    assert.equal(article.detail, `${categoryPaths[article.category]}/${article.id}`);
    const catalog=technologies.filter(item => item.id===article.id);
    assert.equal(catalog.length,1);
    assert.equal(catalog[0].detail,article.detail);
    assert.equal(catalog[0].category,article.category);
    assert(article.headline&&article.teaser&&article.paragraphs.length);
  }
});
test('each article is reachable once from its quadrant and mobile catalog', () => {
  for(const article of technologyArticles) {
    assert.equal(quadrantPageExamples[article.category].filter(item => item.detail===article.detail).length,1);
    assert.equal(technologies.filter(item => item.category===article.category&&item.id===article.id).length,1);
  }
});
test('related topics only link to available pages and retain cross-article links', () => {
  const routes=new Set(technologyArticles.map(article => article.detail));
  for(const article of technologyArticles) {
    const related=relatedTopics(article);
    assert.deepEqual(related.map(item=>item.name),article.relatedNames);
    for(const item of related) if(item.detail) assert(routes.has(item.detail));
  }
  assert.equal(relatedTopics(technologyArticles.find(item=>item.id==='figma')).find(item=>item.name==='TypeScript').detail,'/languages-frameworks/typescript');
  for(const id of ['opentofu','gitlab']) {
    assert.equal(relatedTopics(technologyArticles.find(item=>item.id===id)).find(item=>item.name==='DevOps').detail,'/techniques/devops');
  }
});
test('the five supplied article sources and emphases are present', () => {
  const screenshotArticles=technologyArticles.filter(article=>article.sourceScreenshot);
  assert.equal(screenshotArticles.length,5);
  assert.deepEqual(screenshotArticles.map(article=>article.relatedNames.length),[12,9,6,10,9]);
  for(const article of screenshotArticles) {
    const source=new URL(`../design-reference/${article.sourceScreenshot}`,import.meta.url);
    assert(fs.statSync(source).size>0);
    for(const paragraph of article.paragraphs) {
      assert(paragraph.text.length>100);
      for(const word of paragraph.strong||[]) assert(paragraph.text.includes(word));
    }
  }
});
test('existing DevOps content and the five React search examples are preserved', () => {
  const devops=technologyArticles.find(item=>item.id==='devops');
  assert.deepEqual(devops.paragraphs.map(paragraph=>paragraph.text),devopsParagraphs);
  assert.equal(devops.relatedNames.length,7);
  assert.equal(technologies.filter(item=>[item.name,...item.tags].join(' ').toLocaleLowerCase('de').includes('react')).length,5);
  assert.equal(quadrantPageExamples.Techniques.length,18);
});
