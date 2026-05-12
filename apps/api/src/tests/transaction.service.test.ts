import { describe, expect, it } from "vitest";
import { normalizePlaidCategory } from "../utils/categoryMapping.js";
import { toMonthKey } from "../utils/dates.js";

describe("category mapping", () => {
  it("maps detailed grocery transactions", () => {
    expect(normalizePlaidCategory("FOOD_AND_DRINK", "FOOD_AND_DRINK_GROCERIES")).toBe("groceries");
  });

  it("falls back to other", () => {
    expect(normalizePlaidCategory("UNKNOWN", "UNKNOWN_DETAIL")).toBe("other");
  });
});

describe("date helpers", () => {
  it("formats month keys", () => {
    expect(toMonthKey(new Date("2026-05-11T12:00:00Z"))).toBe("2026-05");
  });
});
