import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const LAST_VERIFIED = new Date("2026-05-19T00:00:00.000Z");

type RewardCategory =
  | "dining"
  | "groceries"
  | "gas"
  | "travel"
  | "transit"
  | "streaming"
  | "drugstores"
  | "online_shopping"
  | "rent"
  | "hotels"
  | "flights"
  | "rental_cars"
  | "entertainment"
  | "phone_plans"
  | "other";

type RewardCategorySeed = {
  category: RewardCategory;
  rewardRate: number;
  monthlyCap?: number;
  yearlyCap?: number;
  notes?: string;
};

type CardSeed = {
  id: string;
  name: string;
  issuer: string;
  network?: string;
  annualFee: number;
  rewardType: "cashback" | "travel" | "points";
  rewardCurrency: string;
  baseRate: number;
  pointValueCents?: number;
  foreignTransactionFee?: number;
  isStudentCard?: boolean;
  rewardRules: Prisma.InputJsonValue;
  categoryCaps?: Prisma.InputJsonValue;
  credits?: Prisma.InputJsonValue;
  signupBonus?: Prisma.InputJsonObject;
  signupBonusValue?: number;
  bestFor: string[];
  applyUrl?: string;
  sourceUrl?: string;
  rewardCategories: RewardCategorySeed[];
};

const other = (rewardRate: number, notes?: string): RewardCategorySeed => ({
  category: "other",
  rewardRate,
  notes
});

const cards: CardSeed[] = [
  {
    id: "chase-freedom-unlimited",
    name: "Chase Freedom Unlimited",
    issuer: "Chase",
    network: "Visa",
    annualFee: 0,
    rewardType: "cashback",
    rewardCurrency: "UR",
    baseRate: 0.015,
    pointValueCents: 1,
    foreignTransactionFee: 3,
    rewardRules: [
      { category: "travel", rate: 0.05, booking_channel: "Chase Travel" },
      { category: "dining", rate: 0.03 },
      { category: "drugstores", rate: 0.03 },
      { category: "other", rate: 0.015 }
    ],
    signupBonus: {
      type: "cash",
      amount: 200,
      currency: "USD",
      equivalent_points: 20000,
      points_currency: "UR",
      required_spend: 500,
      timeframe_months: 3,
      estimated_value_usd: 200,
      occasional_elevated_offer_usd: 250,
      source: "Chase official page",
      notes: "Public offer as of 2026-05"
    },
    signupBonusValue: 200,
    bestFor: ["flat cashback", "dining", "drugstores", "no annual fee"],
    applyUrl: "https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited",
    sourceUrl: "https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited",
    rewardCategories: [
      { category: "travel", rewardRate: 0.05, notes: "Chase Travel only" },
      { category: "dining", rewardRate: 0.03 },
      { category: "drugstores", rewardRate: 0.03 },
      other(0.015)
    ]
  },
  {
    id: "chase-freedom-flex",
    name: "Chase Freedom Flex",
    issuer: "Chase",
    network: "Mastercard",
    annualFee: 0,
    rewardType: "cashback",
    rewardCurrency: "UR",
    baseRate: 0.01,
    pointValueCents: 1,
    foreignTransactionFee: 3,
    rewardRules: [
      { category: "rotating", rate: 0.05, cap: { amount: 1500, period: "quarter" }, activation_required: true },
      { category: "travel", rate: 0.05, booking_channel: "Chase Travel" },
      { category: "dining", rate: 0.03 },
      { category: "drugstores", rate: 0.03 },
      { category: "other", rate: 0.01 }
    ],
    categoryCaps: {
      rotating_quarterly: { spend_cap: 1500, period: "quarter", activation_required: true }
    },
    signupBonus: {
      type: "cash",
      amount: 200,
      currency: "USD",
      equivalent_points: 20000,
      points_currency: "UR",
      required_spend: 500,
      timeframe_months: 3,
      estimated_value_usd: 200,
      notes: "Public offer as of 2026-05"
    },
    signupBonusValue: 200,
    bestFor: ["rotating categories", "dining", "drugstores", "no annual fee"],
    applyUrl: "https://creditcards.chase.com/cash-back-credit-cards/freedom/flex",
    sourceUrl: "https://creditcards.chase.com/cash-back-credit-cards/freedom/flex",
    rewardCategories: [
      { category: "travel", rewardRate: 0.05, notes: "Chase Travel only" },
      { category: "dining", rewardRate: 0.03 },
      { category: "drugstores", rewardRate: 0.03 },
      other(0.01)
    ]
  },
  {
    id: "chase-sapphire-preferred",
    name: "Chase Sapphire Preferred",
    issuer: "Chase",
    network: "Visa",
    annualFee: 95,
    rewardType: "travel",
    rewardCurrency: "UR",
    baseRate: 0.01,
    pointValueCents: 1,
    foreignTransactionFee: 0,
    rewardRules: [
      { category: "travel", rate: 0.05, booking_channel: "Chase Travel" },
      { category: "dining", rate: 0.03 },
      { category: "groceries", rate: 0.03, applies_to: "online grocery" },
      { category: "streaming", rate: 0.03, applies_to: "select streaming" },
      { category: "travel", rate: 0.02, applies_to: "other travel" },
      { category: "other", rate: 0.01 }
    ],
    credits: [{ type: "hotel", amount: 50, currency: "USD", frequency: "annual", booking_channel: "Chase Travel" }],
    signupBonus: {
      type: "points",
      amount: 75000,
      currency: "UR",
      required_spend: 5000,
      timeframe_months: 3,
      estimated_value_usd: 750,
      notes: "Public offer as of 2026-05; travel value can be higher through Chase Travel."
    },
    signupBonusValue: 750,
    bestFor: ["travel", "dining", "streaming", "transferable points"],
    applyUrl: "https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred",
    sourceUrl: "https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred",
    rewardCategories: [
      { category: "travel", rewardRate: 0.02, notes: "Use 5x only for Chase Travel; 2x for other travel" },
      { category: "dining", rewardRate: 0.03 },
      { category: "groceries", rewardRate: 0.03, notes: "Online grocery only" },
      { category: "streaming", rewardRate: 0.03, notes: "Select streaming only" },
      other(0.01)
    ]
  },
  {
    id: "chase-sapphire-reserve",
    name: "Chase Sapphire Reserve",
    issuer: "Chase",
    network: "Visa",
    annualFee: 795,
    rewardType: "travel",
    rewardCurrency: "UR",
    baseRate: 0.01,
    pointValueCents: 1,
    foreignTransactionFee: 0,
    rewardRules: [
      { category: "travel", rate: 0.08, booking_channel: "Chase Travel" },
      { category: "flights", rate: 0.04, booking_channel: "direct" },
      { category: "hotels", rate: 0.04, booking_channel: "direct" },
      { category: "dining", rate: 0.03 },
      { category: "other", rate: 0.01 }
    ],
    credits: [
      { type: "travel", amount: 300, currency: "USD", frequency: "annual" },
      { type: "lounge", description: "Lounge benefits" }
    ],
    signupBonus: {
      type: "points",
      currency: "UR",
      required_spend: 6000,
      timeframe_months: 3,
      historical_amount_min: 125000,
      historical_amount_max: 150000,
      notes: "Current public amount should be verified dynamically; historically 125k-150k+ UR points."
    },
    signupBonusValue: 0,
    bestFor: ["premium travel", "travel credits", "lounge access", "dining"],
    applyUrl: "https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve",
    sourceUrl: "https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve",
    rewardCategories: [
      { category: "travel", rewardRate: 0.03, notes: "8x Chase Travel; 4x direct flights/hotels; 3x dining" },
      { category: "flights", rewardRate: 0.04, notes: "Booked direct" },
      { category: "hotels", rewardRate: 0.04, notes: "Booked direct" },
      { category: "dining", rewardRate: 0.03 },
      other(0.01)
    ]
  },
  {
    id: "amex-gold",
    name: "American Express Gold Card",
    issuer: "American Express",
    network: "American Express",
    annualFee: 325,
    rewardType: "travel",
    rewardCurrency: "MR",
    baseRate: 0.01,
    pointValueCents: 1,
    foreignTransactionFee: 0,
    rewardRules: [
      { category: "dining", rate: 0.04, yearly_cap: 50000 },
      { category: "groceries", rate: 0.04, yearly_cap: 25000, applies_to: "U.S. supermarkets" },
      { category: "flights", rate: 0.03, booking_channel: "direct or Amex Travel" },
      { category: "other", rate: 0.01 }
    ],
    categoryCaps: {
      dining: { yearly_cap: 50000 },
      groceries: { yearly_cap: 25000, applies_to: "U.S. supermarkets" }
    },
    credits: [
      { type: "dining", description: "Dining credits", frequency: "monthly" },
      { type: "uber", description: "Uber Cash credits", frequency: "monthly" },
      { type: "resy", description: "Resy credits" },
      { type: "dunkin", description: "Dunkin credits" }
    ],
    signupBonus: {
      type: "points",
      currency: "MR",
      amount_max: 100000,
      required_spend_min: 6000,
      required_spend_max: 8000,
      timeframe_months: 6,
      notes: "Personalized offer; varies by applicant."
    },
    signupBonusValue: 0,
    bestFor: ["restaurants", "U.S. supermarkets", "Amex credits", "transferable points"],
    applyUrl: "https://www.americanexpress.com/us/credit-cards/card/gold-card/",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/card/gold-card/",
    rewardCategories: [
      { category: "dining", rewardRate: 0.04, yearlyCap: 50000 },
      { category: "groceries", rewardRate: 0.04, yearlyCap: 25000, notes: "U.S. supermarkets only" },
      { category: "flights", rewardRate: 0.03, notes: "Booked directly or through Amex Travel" },
      other(0.01)
    ]
  },
  {
    id: "amex-green",
    name: "American Express Green Card",
    issuer: "American Express",
    network: "American Express",
    annualFee: 150,
    rewardType: "travel",
    rewardCurrency: "MR",
    baseRate: 0.01,
    pointValueCents: 1,
    foreignTransactionFee: 0,
    rewardRules: [
      { category: "travel", rate: 0.03 },
      { category: "transit", rate: 0.03 },
      { category: "dining", rate: 0.03 },
      { category: "other", rate: 0.01 }
    ],
    signupBonus: {
      type: "points",
      currency: "MR",
      amount_min: 40000,
      amount_max: 60000,
      notes: "Offer varies by applicant; confirm issuer terms before refreshing demo data."
    },
    signupBonusValue: 0,
    bestFor: ["travel", "transit", "restaurants"],
    applyUrl: "https://www.americanexpress.com/us/credit-cards/card/green/",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/card/green/",
    rewardCategories: [
      { category: "travel", rewardRate: 0.03 },
      { category: "transit", rewardRate: 0.03 },
      { category: "dining", rewardRate: 0.03 },
      other(0.01)
    ]
  },
  {
    id: "capital-one-savor",
    name: "Capital One Savor",
    issuer: "Capital One",
    network: "Mastercard",
    annualFee: 0,
    rewardType: "cashback",
    rewardCurrency: "cash",
    baseRate: 0.01,
    pointValueCents: 1,
    foreignTransactionFee: 0,
    rewardRules: [
      { category: "dining", rate: 0.03 },
      { category: "groceries", rate: 0.03 },
      { category: "entertainment", rate: 0.03 },
      { category: "streaming", rate: 0.03 },
      { category: "other", rate: 0.01 }
    ],
    signupBonus: {
      type: "cash",
      amount: 200,
      currency: "USD",
      required_spend: 500,
      timeframe_months: 3,
      estimated_value_usd: 200
    },
    signupBonusValue: 200,
    bestFor: ["dining", "groceries", "entertainment", "streaming"],
    applyUrl: "https://www.capitalone.com/credit-cards/savor/",
    sourceUrl: "https://www.capitalone.com/credit-cards/savor/",
    rewardCategories: [
      { category: "dining", rewardRate: 0.03 },
      { category: "groceries", rewardRate: 0.03 },
      { category: "entertainment", rewardRate: 0.03 },
      { category: "streaming", rewardRate: 0.03 },
      other(0.01)
    ]
  },
  {
    id: "capital-one-quicksilver",
    name: "Capital One Quicksilver",
    issuer: "Capital One",
    network: "Mastercard",
    annualFee: 0,
    rewardType: "cashback",
    rewardCurrency: "cash",
    baseRate: 0.015,
    pointValueCents: 1,
    foreignTransactionFee: 3,
    rewardRules: [
      { category: "hotels", rate: 0.05, booking_channel: "Capital One Travel" },
      { category: "rental_cars", rate: 0.05, booking_channel: "Capital One Travel" },
      { category: "travel", rate: 0.05, applies_to: "vacation rentals and activities through Capital One Travel" },
      { category: "other", rate: 0.015 }
    ],
    signupBonus: {
      type: "cash",
      amount: 200,
      currency: "USD",
      required_spend: 500,
      timeframe_months: 3,
      estimated_value_usd: 200
    },
    signupBonusValue: 200,
    bestFor: ["flat cashback", "no annual fee"],
    applyUrl: "https://www.capitalone.com/credit-cards/quicksilver/",
    sourceUrl: "https://www.capitalone.com/credit-cards/quicksilver/",
    rewardCategories: [
      { category: "hotels", rewardRate: 0.05, notes: "Capital One Travel only" },
      { category: "rental_cars", rewardRate: 0.05, notes: "Capital One Travel only" },
      { category: "travel", rewardRate: 0.05, notes: "Capital One Travel vacation rentals/activities only" },
      other(0.015)
    ]
  },
  {
    id: "capital-one-venture",
    name: "Capital One Venture",
    issuer: "Capital One",
    network: "Visa",
    annualFee: 95,
    rewardType: "travel",
    rewardCurrency: "Capital One miles",
    baseRate: 0.02,
    pointValueCents: 1,
    foreignTransactionFee: 0,
    rewardRules: [
      { category: "hotels", rate: 0.05, booking_channel: "Capital One Travel" },
      { category: "rental_cars", rate: 0.05, booking_channel: "Capital One Travel" },
      { category: "travel", rate: 0.05, applies_to: "vacation rentals through Capital One Travel" },
      { category: "other", rate: 0.02 }
    ],
    signupBonus: {
      type: "points",
      amount: 75000,
      currency: "Capital One miles",
      required_spend: 4000,
      timeframe_months: 3,
      notes: "Public travel-card offer; confirm issuer terms before refreshing demo data."
    },
    signupBonusValue: 750,
    bestFor: ["flat travel miles", "hotels", "rental cars"],
    applyUrl: "https://www.capitalone.com/credit-cards/venture/",
    sourceUrl: "https://www.capitalone.com/credit-cards/venture/",
    rewardCategories: [
      { category: "hotels", rewardRate: 0.05, notes: "Capital One Travel only" },
      { category: "rental_cars", rewardRate: 0.05, notes: "Capital One Travel only" },
      other(0.02)
    ]
  },
  {
    id: "capital-one-venture-x",
    name: "Capital One Venture X",
    issuer: "Capital One",
    network: "Visa",
    annualFee: 395,
    rewardType: "travel",
    rewardCurrency: "Capital One miles",
    baseRate: 0.02,
    pointValueCents: 1,
    foreignTransactionFee: 0,
    rewardRules: [
      { category: "hotels", rate: 0.10, booking_channel: "Capital One Travel" },
      { category: "rental_cars", rate: 0.10, booking_channel: "Capital One Travel" },
      { category: "flights", rate: 0.05, booking_channel: "Capital One Travel" },
      { category: "other", rate: 0.02 }
    ],
    credits: [
      { type: "travel", amount: 300, currency: "USD", frequency: "annual", booking_channel: "Capital One Travel" },
      { type: "anniversary_miles", amount: 10000, currency: "Capital One miles", frequency: "annual" }
    ],
    signupBonus: {
      type: "points",
      amount: 75000,
      currency: "Capital One miles",
      required_spend: 4000,
      timeframe_months: 3,
      notes: "Public travel-card offer; confirm issuer terms before refreshing demo data."
    },
    signupBonusValue: 750,
    bestFor: ["premium travel", "travel credits", "flat travel miles"],
    applyUrl: "https://www.capitalone.com/credit-cards/venture-x/",
    sourceUrl: "https://www.capitalone.com/credit-cards/venture-x/",
    rewardCategories: [
      { category: "hotels", rewardRate: 0.1, notes: "Capital One Travel only" },
      { category: "rental_cars", rewardRate: 0.1, notes: "Capital One Travel only" },
      { category: "flights", rewardRate: 0.05, notes: "Capital One Travel only" },
      other(0.02)
    ]
  },
  {
    id: "wells-fargo-active-cash",
    name: "Wells Fargo Active Cash",
    issuer: "Wells Fargo",
    network: "Visa",
    annualFee: 0,
    rewardType: "cashback",
    rewardCurrency: "cash",
    baseRate: 0.02,
    pointValueCents: 1,
    foreignTransactionFee: 3,
    rewardRules: [{ category: "other", rate: 0.02 }],
    signupBonus: {
      type: "cash",
      amount: 200,
      currency: "USD",
      required_spend: 500,
      timeframe_months: 3,
      estimated_value_usd: 200
    },
    signupBonusValue: 200,
    bestFor: ["flat cashback", "no annual fee"],
    applyUrl: "https://creditcards.wellsfargo.com/active-cash-credit-card/",
    sourceUrl: "https://creditcards.wellsfargo.com/active-cash-credit-card/",
    rewardCategories: [other(0.02)]
  },
  {
    id: "wells-fargo-autograph",
    name: "Wells Fargo Autograph",
    issuer: "Wells Fargo",
    network: "Visa",
    annualFee: 0,
    rewardType: "points",
    rewardCurrency: "Wells Fargo Rewards",
    baseRate: 0.01,
    pointValueCents: 1,
    foreignTransactionFee: 0,
    rewardRules: [
      { category: "dining", rate: 0.03 },
      { category: "travel", rate: 0.03 },
      { category: "gas", rate: 0.03 },
      { category: "transit", rate: 0.03 },
      { category: "streaming", rate: 0.03 },
      { category: "phone_plans", rate: 0.03 },
      { category: "other", rate: 0.01 }
    ],
    signupBonus: {
      type: "points",
      amount: 20000,
      currency: "Wells Fargo Rewards",
      required_spend: 1000,
      timeframe_months: 3,
      estimated_value_usd: 200
    },
    signupBonusValue: 200,
    bestFor: ["restaurants", "travel", "gas", "transit", "phone plans"],
    applyUrl: "https://creditcards.wellsfargo.com/autograph-visa-credit-card/",
    sourceUrl: "https://creditcards.wellsfargo.com/autograph-visa-credit-card/",
    rewardCategories: [
      { category: "dining", rewardRate: 0.03 },
      { category: "travel", rewardRate: 0.03 },
      { category: "gas", rewardRate: 0.03 },
      { category: "transit", rewardRate: 0.03 },
      { category: "streaming", rewardRate: 0.03 },
      { category: "phone_plans", rewardRate: 0.03 },
      other(0.01)
    ]
  },
  {
    id: "citi-custom-cash",
    name: "Citi Custom Cash",
    issuer: "Citi",
    network: "Mastercard",
    annualFee: 0,
    rewardType: "cashback",
    rewardCurrency: "ThankYou Points",
    baseRate: 0.01,
    pointValueCents: 1,
    foreignTransactionFee: 3,
    rewardRules: [
      { category: "top_eligible_category", rate: 0.05, monthly_cap: 500 },
      { category: "other", rate: 0.01 }
    ],
    categoryCaps: { top_eligible_category: { spend_cap: 500, period: "billing_cycle" } },
    signupBonus: {
      type: "cash",
      amount: 200,
      currency: "USD",
      required_spend: 1500,
      timeframe_months: 6,
      estimated_value_usd: 200
    },
    signupBonusValue: 200,
    bestFor: ["single top category", "no annual fee"],
    applyUrl: "https://www.citi.com/credit-cards/citi-custom-cash-credit-card",
    sourceUrl: "https://www.citi.com/credit-cards/citi-custom-cash-credit-card",
    rewardCategories: [
      { category: "dining", rewardRate: 0.05, monthlyCap: 500, notes: "MVP approximation; actual 5% applies only to top eligible category each billing cycle" },
      { category: "groceries", rewardRate: 0.05, monthlyCap: 500, notes: "MVP approximation; actual 5% applies only to top eligible category each billing cycle" },
      { category: "gas", rewardRate: 0.05, monthlyCap: 500, notes: "MVP approximation; actual 5% applies only to top eligible category each billing cycle" },
      { category: "travel", rewardRate: 0.05, monthlyCap: 500, notes: "MVP approximation; actual 5% applies only to top eligible category each billing cycle" },
      other(0.01)
    ]
  },
  {
    id: "bank-of-america-customized-cash-rewards",
    name: "Bank of America Customized Cash Rewards",
    issuer: "Bank of America",
    network: "Visa",
    annualFee: 0,
    rewardType: "cashback",
    rewardCurrency: "cash",
    baseRate: 0.01,
    pointValueCents: 1,
    foreignTransactionFee: 3,
    rewardRules: [
      { category: "choice_category", rate: 0.03 },
      { category: "groceries", rate: 0.02 },
      { category: "other", rate: 0.01 }
    ],
    categoryCaps: { choice_and_grocery_combined: { spend_cap: 2500, period: "quarter" } },
    signupBonus: {
      type: "cash",
      amount: 200,
      currency: "USD",
      required_spend: 1000,
      timeframe_days: 90,
      estimated_value_usd: 200,
      notes: "Online cash rewards bonus."
    },
    signupBonusValue: 200,
    bestFor: ["choice category", "groceries", "no annual fee"],
    applyUrl: "https://www.bankofamerica.com/credit-cards/products/cash-back-credit-card/",
    sourceUrl: "https://www.bankofamerica.com/credit-cards/products/cash-back-credit-card/",
    rewardCategories: [
      { category: "online_shopping", rewardRate: 0.03, yearlyCap: 10000, notes: "Choice category approximation; actual cap is $2,500 per quarter combined with groceries/wholesale clubs" },
      { category: "groceries", rewardRate: 0.02, yearlyCap: 10000, notes: "Combined quarterly cap approximation" },
      other(0.01)
    ]
  },
  {
    id: "us-bank-cash-plus",
    name: "U.S. Bank Cash+",
    issuer: "U.S. Bank",
    network: "Visa",
    annualFee: 0,
    rewardType: "cashback",
    rewardCurrency: "cash",
    baseRate: 0.01,
    pointValueCents: 1,
    foreignTransactionFee: 3,
    rewardRules: [
      { category: "selected_categories", rate: 0.05, count: 2 },
      { category: "everyday_category", rate: 0.02, count: 1 },
      { category: "other", rate: 0.01 }
    ],
    signupBonus: {
      type: "cash",
      amount: 200,
      currency: "USD",
      required_spend: 1000,
      timeframe_days: 120,
      estimated_value_usd: 200
    },
    signupBonusValue: 200,
    bestFor: ["selected categories", "utilities", "no annual fee"],
    applyUrl: "https://www.usbank.com/credit-cards/cash-plus-visa-signature-credit-card.html",
    sourceUrl: "https://www.usbank.com/credit-cards/cash-plus-visa-signature-credit-card.html",
    rewardCategories: [
      { category: "streaming", rewardRate: 0.05, notes: "MVP approximation for selected 5% categories" },
      { category: "phone_plans", rewardRate: 0.05, notes: "MVP approximation for selected 5% categories" },
      { category: "gas", rewardRate: 0.02, notes: "MVP approximation for everyday 2% category" },
      { category: "groceries", rewardRate: 0.02, notes: "MVP approximation for everyday 2% category" },
      other(0.01)
    ]
  },
  {
    id: "bilt-blue-card",
    name: "Bilt Blue Card",
    issuer: "Bilt",
    network: "Mastercard",
    annualFee: 0,
    rewardType: "points",
    rewardCurrency: "Bilt Rewards",
    baseRate: 0.01,
    pointValueCents: 1,
    foreignTransactionFee: 0,
    rewardRules: [
      { category: "rent", rate: 0.01, notes: "Housing/rent rewards via Bilt rules" },
      { category: "other", rate: 0.01 }
    ],
    signupBonus: {
      type: "cash",
      amount: 100,
      currency: "Bilt cash",
      estimated_value_usd: 100
    },
    signupBonusValue: 100,
    bestFor: ["rent", "no annual fee", "no foreign transaction fee"],
    applyUrl: "https://www.biltrewards.com/card",
    sourceUrl: "https://www.biltrewards.com/card",
    rewardCategories: [
      { category: "rent", rewardRate: 0.01, notes: "Subject to Bilt rent rules" },
      other(0.01)
    ]
  },
  {
    id: "bilt-obsidian-card",
    name: "Bilt Obsidian Card",
    issuer: "Bilt",
    network: "Mastercard",
    annualFee: 95,
    rewardType: "points",
    rewardCurrency: "Bilt Rewards",
    baseRate: 0.01,
    pointValueCents: 1,
    foreignTransactionFee: 0,
    rewardRules: [
      { category: "dining", rate: 0.03, choice_required: true },
      { category: "groceries", rate: 0.03, choice_required: true, yearly_cap: 25000 },
      { category: "travel", rate: 0.02 },
      { category: "other", rate: 0.01 }
    ],
    categoryCaps: { groceries: { yearly_cap: 25000, choice_required: true } },
    credits: [{ type: "hotel", amount: 100, currency: "USD", frequency: "annual", booking_channel: "Bilt Travel" }],
    signupBonus: {
      type: "cash",
      amount: 200,
      currency: "Bilt cash",
      estimated_value_usd: 200
    },
    signupBonusValue: 200,
    bestFor: ["rent", "dining or groceries", "travel", "no foreign transaction fee"],
    applyUrl: "https://www.biltrewards.com/card",
    sourceUrl: "https://www.biltrewards.com/card",
    rewardCategories: [
      { category: "dining", rewardRate: 0.03, notes: "Choice category" },
      { category: "groceries", rewardRate: 0.03, yearlyCap: 25000, notes: "Choice category; grocery cap applies" },
      { category: "travel", rewardRate: 0.02 },
      other(0.01)
    ]
  }
];

async function main() {
  await prisma.cardRewardCategory.deleteMany();
  await prisma.creditCard.deleteMany();

  for (const card of cards) {
    await prisma.creditCard.create({
      data: {
        id: card.id,
        name: card.name,
        issuer: card.issuer,
        network: card.network,
        annualFee: card.annualFee,
        rewardType: card.rewardType,
        rewardCurrency: card.rewardCurrency,
        baseRate: card.baseRate,
        pointValueCents: card.pointValueCents,
        rewardRules: card.rewardRules,
        categoryCaps: card.categoryCaps ?? {},
        credits: card.credits ?? [],
        signupBonus: card.signupBonus,
        signupBonusValue: card.signupBonusValue,
        foreignTransactionFee: card.foreignTransactionFee,
        isStudentCard: card.isStudentCard ?? false,
        hasNoAnnualFee: card.annualFee === 0,
        bestFor: card.bestFor,
        applyUrl: card.applyUrl,
        sourceUrl: card.sourceUrl,
        lastVerified: LAST_VERIFIED,
        rewardCategories: {
          create: card.rewardCategories.map((reward) => ({
            category: reward.category,
            rewardRate: reward.rewardRate,
            monthlyCap: reward.monthlyCap,
            yearlyCap: reward.yearlyCap,
            notes: reward.notes
          }))
        }
      }
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
