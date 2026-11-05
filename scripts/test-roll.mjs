#!/usr/bin/env node
// Dice test: the roller keeps the right dice and reads results like the rulebook.
import assert from "node:assert/strict";
import { oracle, roll, verdict } from "./roll.mjs";

const fixed = (...values) => { let i = 0; return () => values[i++]; };
assert.deepEqual(roll("2d6+1", "", fixed(3, 5)), { dice: [3, 5], kept: [3, 5], bonus: 1, total: 9 });
assert.equal(roll("2d6+2", "유리", fixed(3, 1, 2)).total, 7, "유리 keeps the two highest (3, 2)");
assert.equal(roll("2d6", "불리", fixed(6, 1, 4)).total, 5, "불리 keeps the two lowest (1, 4)");
assert.equal(roll("1d6", "", fixed(4)).total, 4);
assert.throws(() => roll("3d8"));
assert.throws(() => roll("1d6", "유리"));
assert.equal(verdict(10), "10 이상: 성공");
assert.equal(verdict(7), "7~9: 성공하지만 대가");
assert.equal(verdict(6), "6 이하: 실패, 경험 1");
assert.equal(oracle(4), "아니오, 게다가 더 나쁘게");
assert.equal(oracle(7), "예, 하지만 조건이나 문제가 붙는다");
assert.equal(oracle(10), "예, 게다가 더 좋게");
for (let i = 0; i < 500; i++) {
  const r = roll("2d6");
  assert.ok(r.dice.every(d => d >= 1 && d <= 6), "dice stay within 1..6");
}
console.log("OK: dice roll in range, keep the right dice for 유리/불리 and read like the rulebook");
