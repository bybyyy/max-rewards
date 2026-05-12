const categoryMap: Record<string, string> = {
  FOOD_AND_DRINK: "dining",
  GENERAL_MERCHANDISE: "shopping",
  GENERAL_SERVICES: "bills",
  GOVERNMENT_AND_NON_PROFIT: "bills",
  HOME_IMPROVEMENT: "shopping",
  MEDICAL: "bills",
  PERSONAL_CARE: "shopping",
  RENT_AND_UTILITIES: "bills",
  TRANSPORTATION: "travel",
  TRAVEL: "travel",
  BANK_FEES: "bills",
  ENTERTAINMENT: "entertainment",
  LOAN_PAYMENTS: "bills",
  TRANSFER_IN: "transfer",
  TRANSFER_OUT: "transfer"
};

const detailedOverrides: Record<string, string> = {
  FOOD_AND_DRINK_GROCERIES: "groceries",
  FOOD_AND_DRINK_RESTAURANT: "dining",
  FOOD_AND_DRINK_FAST_FOOD: "dining",
  TRANSPORTATION_GAS: "gas",
  TRAVEL_FLIGHTS: "travel",
  TRAVEL_HOTELS_AND_LODGING: "travel",
  ENTERTAINMENT_SPORTING_EVENTS_AMUSEMENT_PARKS_AND_MUSEUMS: "entertainment"
};

export function normalizePlaidCategory(primary?: string | null, detailed?: string | null) {
  if (detailed && detailedOverrides[detailed]) {
    return detailedOverrides[detailed];
  }

  if (primary && categoryMap[primary]) {
    return categoryMap[primary];
  }

  return "other";
}
