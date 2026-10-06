import test from 'node:test';
import assert from 'node:assert/strict';
import { RadarHover } from '../src/components/radarHover.ts';

function setup() {
  let now = 0, next = 0;
  const timers = new Map();
  const hover = new RadarHover({
    schedule(callback, delay) { const id = next++; timers.set(id, { at: now + delay, callback }); return id; },
    cancel(id) { timers.delete(id); },
  });
  function advance(ms) {
    now += ms;
    for (const [id, timer] of [...timers]) if (timer.at <= now) { timers.delete(id); timer.callback(); }
  }
  return { hover, advance };
}
test('initial hover is immediate; empty space retains group for 800 ms', () => {
  const { hover, advance } = setup();
  hover.enter('aws'); assert.equal(hover.active, 'aws');
  hover.leave(); advance(799); assert.equal(hover.active, 'aws');
  advance(1); assert.equal(hover.active, null);
});
test('connected-logo switch waits for 300 ms on the new logo', () => {
  const { hover, advance } = setup();
  hover.enter('aws'); hover.leave(); advance(400); hover.enter('abstract');
  advance(299); assert.equal(hover.active, 'aws');
  advance(1); assert.equal(hover.active, 'abstract');
});
test('moving back and forth cancels stale switches and keeps old group', () => {
  const { hover, advance } = setup();
  hover.enter('aws'); hover.leave(); hover.enter('abstract'); advance(200);
  hover.leave(); hover.enter('aws'); advance(400); assert.equal(hover.active, 'aws');
  hover.leave(); hover.enter('adyen'); advance(150); hover.leave(); hover.enter('abstract');
  advance(299); assert.equal(hover.active, 'aws'); advance(1); assert.equal(hover.active, 'abstract');
});
test('keyboard focus updates immediately and remains while pointer leaves', () => {
  const { hover, advance } = setup();
  hover.enter('aws'); hover.enter('abstract', true);
  assert.equal(hover.active, 'abstract');
  hover.leave(); advance(1000); assert.equal(hover.active, 'abstract');
});
test('Escape and unmount cancel pending callbacks', () => {
  const { hover, advance } = setup();
  hover.enter('aws'); hover.enter('abstract'); hover.dismiss(); advance(1000);
  assert.equal(hover.active, null);
  hover.enter('aws'); hover.enter('abstract'); hover.dispose(); advance(1000);
  assert.equal(hover.active, 'aws');
});
