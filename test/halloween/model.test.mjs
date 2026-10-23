import test from 'node:test';
import assert from 'node:assert/strict';
import { CASES, solutions, truthTable, verdict, formatTime } from '../../plugins/grywmig-halloween-alibi/game/model.mjs';
const expected = [['leon','leon'],['mila','ada'],['olek','leon']];
CASES.forEach((puzzle,index) => {
  test(`${puzzle.title}: exactly one solution among every possible culprit`, () => {
    assert.deepEqual(solutions(puzzle), [{ culprit: expected[index][0], liar: expected[index][1] }]);
    for (const culprit of puzzle.people) for (const liar of puzzle.people) assert.equal(verdict(puzzle,culprit.id,liar.id), culprit.id === expected[index][0] && liar.id === expected[index][1]);
    assert.equal(truthTable(puzzle, expected[index][0]).filter(p => !p.truth).length, 1);
  });
});
test('timer formats active play time', () => { assert.equal(formatTime(65000),'1:05'); assert.equal(formatTime(-1),'0:00'); });
