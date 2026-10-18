import { describe, expect, it } from "vitest";
import { placesText, winRate } from "../Stats";

describe("statistics helpers", () => {
  it("writes places and win rates the way the table shows them", () => {
    expect(placesText([3, 1, 0, 0, 0, 2])).toBe("1st ×3 · 2nd ×1 · 6th+ ×2");
    expect(placesText([0, 0, 0, 0, 0, 0])).toBe("–");
    expect(
      winRate({ name: "a", played: 4, wins: 1, places: [], lastPlayedAt: 0 }),
    ).toBe(25);
    expect(
      winRate({ name: "a", played: 0, wins: 0, places: [], lastPlayedAt: 0 }),
    ).toBe(0);
  });
});
