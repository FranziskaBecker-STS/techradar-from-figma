import test from 'node:test';
import assert from 'node:assert/strict';
import { moveOption, findOptionByPrefix } from '../src/components/technologySelectKeyboard.ts';
import { rings, technologies, topics } from '../src/data.ts';

const names = rings.flatMap(ring => technologies.filter(item => item.category === 'Techniques' && item.ring === ring).map(item => item.name));

test('arrow navigation crosses ring boundaries and wraps in both directions', () => {
  assert.equal(names[moveOption(7, 'ArrowDown', names.length)], 'API-Gateway');
  assert.equal(names[moveOption(15, 'ArrowUp', names.length)], 'Shift Left');
  assert.equal(moveOption(names.length - 1, 'ArrowDown', names.length), 0);
  assert.equal(moveOption(0, 'ArrowUp', names.length), names.length - 1);
});
test('Home and End reach the complete list, and empty/unset lists remain safe', () => {
  assert.equal(names[moveOption(2, 'Home', names.length)], 'Automated Security Testing');
  assert.equal(names[moveOption(2, 'End', names.length)], 'RAG');
  assert.equal(moveOption(0, 'End', 0), -1);
  assert.equal(moveOption(-1, 'ArrowUp', names.length), names.length - 1);
  assert.equal(moveOption(-1, 'ArrowDown', names.length), 0);
});
test('typeahead keeps a word match while additional characters are entered', () => {
  const first = findOptionByPrefix(names, 0, 'd');
  assert.equal(names[first], 'DevOps');
  assert.equal(findOptionByPrefix(names, first, 'dev'), first);
  assert.equal(names[findOptionByPrefix(names, first, 'devs')], 'DevSecOps');
  assert.equal(names[findOptionByPrefix(names, first, 'Lambda Step')], 'Lambda Step Functions');
});
test('repeated letters cycle between matching names across rings', () => {
  const devops = names.indexOf('DevOps');
  const devsecops = names.indexOf('DevSecOps');
  assert.equal(findOptionByPrefix(names, devops, 'dd'), devsecops);
  assert.equal(findOptionByPrefix(names, devsecops, 'ddd'), devops);
});
test('unmatched input preserves the active option; accents and casing are ignored', () => {
  assert.equal(findOptionByPrefix(names, 2, 'zz-no-match'), 2);
  assert.equal(findOptionByPrefix(names, 2, ''), 2);
  assert.equal(findOptionByPrefix(['Äpfel', 'Éclair'], 0, 'e'), 1);
  assert.equal(findOptionByPrefix(names, 0, 'DEVOPS'), names.indexOf('DevOps'));
});

test('topic typeahead cycles through the four C entries', () => {
  let index = topics.indexOf('Backend');
  const matches = ['Cloud', 'Commerce', 'CRM', 'CX Platforms', 'Cloud'];
  for (const [step, expected] of matches.entries()) {
    index = findOptionByPrefix(topics, index, 'c'.repeat(step + 1));
    assert.equal(topics[index], expected);
  }
});
test('topic prefixes support spaces and ampersands; Home and End include Alle and the last topic', () => {
  const index = topics.indexOf('DevOps & Security');
  assert.equal(findOptionByPrefix(topics, index, 'devops & s'), index);
  assert.equal(topics[findOptionByPrefix(topics, 0, 'frontend & ux')], 'Frontend & UX & Design');
  assert.equal(topics[moveOption(index, 'Home', topics.length)], 'Alle');
  assert.equal(topics[moveOption(index, 'End', topics.length)], 'Hosting & Operation');
});
