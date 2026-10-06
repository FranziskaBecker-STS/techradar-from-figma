import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { currentRadarLogos } from '../src/components/currentRadarLogos.ts';
import { radarLogos, radarConnections } from '../src/components/radarLogos.ts';
import { technologyArticles } from '../src/data.ts';

const reference=JSON.parse(fs.readFileSync(new URL('../design-reference/current-techradar-logos.json',import.meta.url),'utf8'));
const sprite=fs.readFileSync(new URL('../public/assets/current-techradar-logos.svg',import.meta.url),'utf8');
const symbols=new Map([...sprite.matchAll(/<symbol\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/symbol>/g)].map(match=>[match[1],match[2]]));

test('all 25 local symbols retain the source path geometry',()=>{
  assert.equal(currentRadarLogos.length,25);
  assert.equal(symbols.size,25);
  for(const logo of currentRadarLogos) {
    assert(symbols.has(logo.symbol),`${logo.name}: original symbol is present`);
    const paths=[...symbols.get(logo.symbol).matchAll(/<path\b[^>]*\bd="([^"]*)"/g)].map(match=>match[1]);
    const source=reference.sourceMetadata.find(item=>item.symbol===logo.symbol);
    assert.equal(paths.length,source.pathCount);
    assert.equal(createHash('sha256').update(paths.join('\n')).digest('hex'),source.pathDataSha256);
  }
});
test('new logos remain inside their category quadrant and source ring',()=>{
  const center={x:331.12,y:346.12};
  const bounds={Adopt:[0,158.285],Trial:[158.285,232.689],Assess:[232.689,280.043],Hold:[280.043,327.314]};
  for(const logo of currentRadarLogos) {
    const x=logo.x+15,y=logo.y+15;
    const radius=Math.hypot(x-center.x,y-center.y);
    const [inside,outside]=bounds[logo.ring];
    assert(radius-15>=inside-.02&&radius+15<=outside+.02,`${logo.name}: 30 px symbol fits in ${logo.ring}`);
    assert(x-20>=0&&x+20<=661&&y-20>=0&&y+20<=677);
    const right=['Languages & Frameworks','Platforms'].includes(logo.category);
    const bottom=['Tools','Platforms'].includes(logo.category);
    assert(right?x-20>=center.x:x+20<=center.x,`${logo.name}: category horizontal side`);
    assert(bottom?y-20>=center.y:y+20<=center.y,`${logo.name}: category vertical side`);
  }
});
test('new 40 px interaction targets do not overlap other radar targets',()=>{
  for(const logo of currentRadarLogos) for(const other of radarLogos) {
    if(logo.id===other.id) continue;
    assert(Math.abs(logo.x-other.x)>=40.98||Math.abs(logo.y-other.y)>=40.98,`${logo.name} overlaps ${other.name}`);
  }
});
test('every related highlight refers to a rendered logo and to an observed related topic',()=>{
  assert.equal(new Set(radarLogos.map(logo=>logo.id)).size,33);
  const normalize=name=>name.toLocaleLowerCase('de').replace(/[^a-z0-9]/g,'');
  for(const logo of currentRadarLogos) {
    assert(radarConnections[logo.id].length>0,`${logo.name}: visible related topic`);
    for(const targetId of radarConnections[logo.id]) {
      assert.notEqual(targetId,logo.id);
      const target=radarLogos.find(item=>item.id===targetId);
      assert(target,`${logo.name}: target is rendered`);
      const relatedTarget=currentRadarLogos.find(item=>item.id===targetId);
      assert(logo.relatedNames.some(name=>normalize(name)===normalize(target.name)) ||
        relatedTarget?.relatedNames.some(name=>normalize(name)===normalize(logo.name)));
    }
  }
  assert(radarConnections.opentofu.includes('devops'));
  assert(radarConnections.figma.includes('typescript'));
  assert(radarConnections['github-copilot'].includes('chatgpt'));
  assert.deepEqual(radarConnections.aws,['abstract','ansible','kafka']);
});
test('all six available articles have a radar logo with their confirmed category and ring',()=>{
  for(const article of technologyArticles) {
    const logo=currentRadarLogos.find(item=>item.id===article.id);
    assert(logo,`${article.name}: navigable logo`);
    assert.equal(logo.category,article.category);
    assert.equal(logo.ring,article.ring);
  }
});
