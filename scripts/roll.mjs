#!/usr/bin/env node
/**
 * Dice for 탐사대 룰북 sessions, so an AI game master rolls real random numbers
 * instead of picking them. Uses crypto.randomInt.
 *
 *   node scripts/roll.mjs 2d6+1          # 판정: two dice plus a stat
 *   node scripts/roll.mjs 2d6+2 유리      # 유리: roll three, keep the two highest
 *   node scripts/roll.mjs 2d6-1 불리      # 불리: roll three, keep the two lowest
 *   node scripts/roll.mjs 1d6            # 하늘 굴림, 표 굴림
 *   node scripts/roll.mjs 신탁 +1         # 신탁: 2d6 + 그럴 법한 정도(-2..+2)
 */
import { randomInt } from "node:crypto";
import process from "node:process";

const args = process.argv.slice(2);
const die = () => randomInt(1, 7);
const sign = n => (n < 0 ? " - " + -n : " + " + n);

export function verdict(total) {
  return total >= 10 ? "10 이상: 성공" : total >= 7 ? "7~9: 성공하지만 대가" : "6 이하: 실패, 경험 1";
}
export function oracle(total) {
  return total <= 4 ? "아니오, 게다가 더 나쁘게" : total <= 6 ? "아니오" : total === 7 ? "예, 하지만 조건이나 문제가 붙는다"
    : total <= 9 ? "예" : "예, 게다가 더 좋게";
}
export function roll(spec, mode = "", rng = die) {
  const m = /^(\d)d6([+-]\d+)?$/.exec(spec);
  if (!m) throw new Error("모르는 굴림: " + spec + " (예: 2d6+1, 1d6, 신탁 +1)");
  const count = +m[1], bonus = +(m[2] ?? 0);
  if (count < 1 || count > 3) throw new Error("주사위는 1~3개");
  if (mode && count !== 2) throw new Error("유리·불리는 2d6에만 쓴다");
  const dice = Array.from({ length: mode ? 3 : count }, rng);
  const kept = mode ? [...dice].sort((a, b) => (mode === "유리" ? b - a : a - b)).slice(0, 2) : dice;
  const total = kept.reduce((a, b) => a + b, 0) + bonus;
  return { dice, kept, bonus, total };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    if (args[0] === "신탁") {
      const like = +(args[1] ?? 0);
      if (!Number.isInteger(like) || like < -2 || like > 2) throw new Error("신탁의 그럴 법한 정도는 -2..+2");
      const r = roll("2d6" + (like < 0 ? like : "+" + like));
      console.log(`🎲 신탁 (${like >= 0 ? "+" + like : like}): ${r.dice.join(" + ")}${like ? sign(like) : ""} = ${r.total} → ${oracle(r.total)}`);
    } else {
      const spec = args[0] ?? "2d6", mode = args[1] ?? "";
      if (mode && mode !== "유리" && mode !== "불리") throw new Error("유리 또는 불리만 쓴다");
      const r = roll(spec, mode);
      const shown = mode ? r.dice.join("·") + " → " + r.kept.join(" + ") : r.dice.join(" + ");
      const natural = r.kept.reduce((a, b) => a + b, 0);
      const extra = natural === 12 ? " (두 눈 12: 기대보다 좋은 일 하나 더)" : natural === 2 ? " (두 눈 2: 예상 못 한 문제 하나 더)" : "";
      const tail = spec.startsWith("2d6") ? " → " + verdict(r.total) + extra : "";
      console.log(`🎲 ${spec}${mode ? " " + mode : ""}: ${shown}${r.bonus ? sign(r.bonus) : ""} = ${r.total}${tail}`);
    }
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
