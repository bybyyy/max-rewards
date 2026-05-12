import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const cards = [
  {
    name: "Everyday Cash Plus",
    issuer: "Sample Bank",
    annualFee: 0,
    rewardType: "cashback",
    signupBonusValue: 200,
    rewards: [
      ["groceries", 0.03],
      ["gas", 0.03],
      ["default", 0.01]
    ]
  },
  {
    name: "Dining Rewards Premier",
    issuer: "Sample Bank",
    annualFee: 95,
    rewardType: "cashback",
    signupBonusValue: 300,
    rewards: [
      ["dining", 0.04],
      ["entertainment", 0.03],
      ["default", 0.01]
    ]
  },
  {
    name: "Travel Flex",
    issuer: "Portfolio Credit",
    annualFee: 95,
    rewardType: "travel",
    signupBonusValue: 600,
    foreignTransactionFee: 0,
    rewards: [
      ["travel", 0.05],
      ["dining", 0.03],
      ["default", 0.01]
    ]
  },
  {
    name: "Student Starter Cash",
    issuer: "Campus Card Co",
    annualFee: 0,
    rewardType: "cashback",
    signupBonusValue: 50,
    isStudentCard: true,
    rewards: [
      ["dining", 0.02],
      ["gas", 0.02],
      ["default", 0.01]
    ]
  },
  {
    name: "Grocery Max",
    issuer: "Example Financial",
    annualFee: 95,
    rewardType: "cashback",
    signupBonusValue: 250,
    rewards: [
      ["groceries", 0.06, undefined, 6000],
      ["streaming", 0.06],
      ["gas", 0.03],
      ["default", 0.01]
    ]
  },
  {
    name: "Flat 2 Percent Card",
    issuer: "Direct Rewards",
    annualFee: 0,
    rewardType: "cashback",
    signupBonusValue: 150,
    rewards: [["default", 0.02]]
  },
  {
    name: "Shopping Optimizer",
    issuer: "Retail Bank",
    annualFee: 0,
    rewardType: "cashback",
    signupBonusValue: 100,
    rewards: [
      ["shopping", 0.03],
      ["groceries", 0.02],
      ["default", 0.01]
    ]
  },
  {
    name: "Bills And Utilities Cash",
    issuer: "Home Finance",
    annualFee: 0,
    rewardType: "cashback",
    signupBonusValue: 100,
    rewards: [
      ["bills", 0.03],
      ["gas", 0.02],
      ["default", 0.01]
    ]
  }
];

async function main() {
  for (const card of cards) {
    await prisma.creditCard.upsert({
      where: { id: card.name.toLowerCase().replaceAll(" ", "-") },
      update: {},
      create: {
        id: card.name.toLowerCase().replaceAll(" ", "-"),
        name: card.name,
        issuer: card.issuer,
        annualFee: card.annualFee,
        rewardType: card.rewardType,
        signupBonusValue: card.signupBonusValue,
        foreignTransactionFee: card.foreignTransactionFee,
        isStudentCard: card.isStudentCard ?? false,
        hasNoAnnualFee: card.annualFee === 0,
        rewardCategories: {
          create: card.rewards.map(([category, rewardRate, monthlyCap, yearlyCap]) => ({
            category: String(category),
            rewardRate: Number(rewardRate),
            monthlyCap: monthlyCap ? Number(monthlyCap) : undefined,
            yearlyCap: yearlyCap ? Number(yearlyCap) : undefined
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
