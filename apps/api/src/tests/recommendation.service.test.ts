import { describe, expect, it } from "vitest";
import { applyRewardCap, recommendCards } from "../services/recommendation.service.js";

const baseCard = {
  id: "flat",
  name: "Flat 2 Percent",
  issuer: "Test",
  annualFee: 0 as any,
  rewardType: "cashback",
  signupBonusValue: 0 as any,
  foreignTransactionFee: null,
  isStudentCard: false,
  hasNoAnnualFee: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  rewardCategories: [
    {
      id: "flat-default",
      creditCardId: "flat",
      category: "default",
      rewardRate: 0.02 as any,
      monthlyCap: null,
      yearlyCap: null,
      notes: null
    }
  ]
};

describe("recommendCards", () => {
  it("ranks stronger category cards first", () => {
    const groceryCard = {
      ...baseCard,
      id: "grocery",
      name: "Grocery Card",
      annualFee: 95 as any,
      rewardCategories: [
        {
          ...baseCard.rewardCategories[0],
          id: "grocery-rule",
          creditCardId: "grocery",
          category: "groceries",
          rewardRate: 0.06 as any
        },
        baseCard.rewardCategories[0]
      ]
    };

    const results = recommendCards({ groceries: 8000 }, [baseCard, groceryCard]);
    expect(results[0].cardId).toBe("grocery");
  });

  it("subtracts annual fees", () => {
    const feeCard = { ...baseCard, id: "fee", annualFee: 100 as any };
    const [result] = recommendCards({ dining: 1000 }, [feeCard]);
    expect(result.estimatedNetValue).toBe(-80);
  });
});

describe("applyRewardCap", () => {
  it("uses the lowest annualized cap", () => {
    expect(applyRewardCap(10000, 500, 7000)).toBe(6000);
  });
});
