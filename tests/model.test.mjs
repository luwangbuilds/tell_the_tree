import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blankGarden, addWorry, releaseWorry, chooseAction, setFlowerReady, harvestFlowers, deleteHarvest, decodeGarden, breathingPhase } from '../public/model.js';

test('worries become actions with their original worry preserved', () => {
  const original = blankGarden();
  const a = addWorry(original, '  A private worry  ');
  assert.equal(a.leaves[0].text, 'A private worry');
  assert.equal(original.leaves.length, 0);
  const b = chooseAction(a, a.leaves[0].id, 'Write one sentence');
  assert.equal(b.leaves.length, 0);
  assert.equal(b.flowers[0].action, 'Write one sentence');
  assert.equal(b.flowers[0].worry, 'A private worry');
  const ready = setFlowerReady(b, b.flowers[0].id, true);
  assert.ok(ready.flowers[0].readyAt);
  assert.equal(setFlowerReady(ready, ready.flowers[0].id, false).flowers[0].readyAt, undefined);
  assert.throws(() => chooseAction(b, a.leaves[0].id, 'Again'));
});
test('legacy intentions remain readable and malformed worry text is rejected', () => {
  let g = addWorry(blankGarden(), 'Original worry');
  g = chooseAction(g, g.leaves[0].id, 'Small step');
  g = setFlowerReady(g, g.flowers[0].id, true);
  g = harvestFlowers(g, [g.flowers[0].id]);
  assert.equal(decodeGarden(JSON.stringify(g)).harvests[0].actions[0].worry, 'Original worry');
  delete g.harvests[0].actions[0].worry;
  assert.deepEqual(decodeGarden(JSON.stringify(g)), g);
  for (const value of [null, '', 42, 'x'.repeat(1001)]) {
    g.harvests[0].actions[0].worry = value;
    assert.throws(() => decodeGarden(JSON.stringify(g)));
  }
});
test('releasing removes only the selected worry', () => {
  const a = addWorry(addWorry(blankGarden(), 'Keep this'), 'Let this go');
  const b = releaseWorry(a, a.leaves[1].id);
  assert.deepEqual(b.leaves.map(l => l.text), ['Keep this']);
  assert.throws(() => releaseWorry(b, a.leaves[1].id));
});
test('harvest takes only selected flowers, preserves the others and cannot repeat', () => {
  let g = blankGarden();
  assert.throws(() => harvestFlowers(g));
  for (let i = 0; i < 7; i++) {
    g = addWorry(g, `Worry ${i}`);
    g = chooseAction(g, g.leaves[0].id, `Action ${i}`);
  }
  g = addWorry(g, 'Still here');
  const selected = [g.flowers[1].id, g.flowers[4].id];
  for (const flowerId of selected) g = setFlowerReady(g, flowerId, true);
  const result = harvestFlowers(g, selected);
  assert.deepEqual(result.flowers, g.flowers.filter(f => !selected.includes(f.id)));
  assert.equal(result.harvests.length, 1);
  assert.deepEqual(result.harvests[0].actions, [g.flowers[1], g.flowers[4]]);
  assert.equal(result.leaves[0].text, 'Still here');
  assert.throws(() => harvestFlowers(result, selected));
  assert.equal(g.flowers.length, 7);
  assert.deepEqual(decodeGarden(JSON.stringify(result)), result);
});
test('one flower can become a diamond and reload alongside legacy five-flower diamonds', () => {
  let g = blankGarden();
  for (let i = 0; i < 5; i++) {
    g = addWorry(g, `Worry ${i}`);
    g = chooseAction(g, g.leaves[0].id, `Action ${i}`);
  }
  for (const flower of g.flowers) g = setFlowerReady(g, flower.id, true);
  g = harvestFlowers(g, g.flowers.map(f => f.id));
  g = addWorry(g, 'A new worry');
  g = chooseAction(g, g.leaves[0].id, 'A single small step');
  g = setFlowerReady(g, g.flowers[0].id, true);
  const result = harvestFlowers(g, [g.flowers[0].id]);
  assert.equal(result.flowers.length, 0);
  assert.deepEqual(result.harvests.map(h => h.actions.length), [1, 5]);
  assert.deepEqual(decodeGarden(JSON.stringify(result)), result);
  result.harvests[0].actions = [];
  assert.throws(() => decodeGarden(JSON.stringify(result)));
});
test('empty, duplicate, and stale selections cannot harvest any flowers', () => {
  let g = addWorry(blankGarden(), 'A worry');
  g = chooseAction(g, g.leaves[0].id, 'Take a walk');
  const flowerId = g.flowers[0].id;
  assert.throws(() => harvestFlowers(g, [flowerId]));
  g = setFlowerReady(g, flowerId, true);
  for (const selection of [undefined, [], [flowerId, flowerId], ['missing'], [flowerId, 'missing']]) {
    assert.throws(() => harvestFlowers(g, selection));
    assert.equal(g.flowers.length, 1);
    assert.equal(g.harvests.length, 0);
  }
});
test('a diamond can be deleted without changing other garden records', () => {
  let garden = blankGarden();
  for (let i = 0; i < 5; i++) {
    garden = addWorry(garden, `Worry ${i}`);
    garden = chooseAction(garden, garden.leaves[0].id, `Action ${i}`);
  }
  for (const flower of garden.flowers) garden = setFlowerReady(garden, flower.id, true);
  garden = harvestFlowers(garden, garden.flowers.map(f => f.id));
  const diamondId = garden.harvests[0].id;
  const result = deleteHarvest(garden, diamondId);
  assert.equal(result.harvests.length, 0);
  assert.throws(() => deleteHarvest(result, diamondId));
});
test('empty and oversized input is rejected', () => {
  for (const text of ['', '   ', 'x'.repeat(1001), null]) assert.throws(() => addWorry(blankGarden(), text));
  const g = addWorry(blankGarden(), 'Worry');
  assert.throws(() => chooseAction(g, g.leaves[0].id, '  '));
});
test('corrupt saved data is rejected instead of silently reset', () => {
  for (const raw of ['bad json', '{}', '{"version":2}', '{"version":1,"leaves":[{}],"flowers":[],"harvests":[]}']) assert.throws(() => decodeGarden(raw));
});
test('4-7-8 boundaries and repeated cycles', () => {
  assert.equal(breathingPhase(0).remaining, 4);
  assert.equal(breathingPhase(3.99).remaining, 1);
  assert.equal(breathingPhase(4).key, 'hold');
  assert.equal(breathingPhase(4).remaining, 7);
  assert.equal(breathingPhase(11).key, 'exhale');
  assert.equal(breathingPhase(11).remaining, 8);
  assert.equal(breathingPhase(19).key, 'inhale');
  assert.equal(breathingPhase(38).remaining, 4);
});
