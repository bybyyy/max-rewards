-- Add richer card-catalog metadata while preserving the existing
-- normalized CardRewardCategory rows used by the MVP recommendation scorer.
ALTER TABLE "CreditCard"
ADD COLUMN "network" TEXT,
ADD COLUMN "rewardCurrency" TEXT NOT NULL DEFAULT 'cash',
ADD COLUMN "baseRate" DECIMAL(6,4) NOT NULL DEFAULT 0.0100,
ADD COLUMN "pointValueCents" DECIMAL(8,4),
ADD COLUMN "rewardRules" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN "categoryCaps" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN "credits" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN "signupBonus" JSONB,
ADD COLUMN "bestFor" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "applyUrl" TEXT,
ADD COLUMN "sourceUrl" TEXT,
ADD COLUMN "lastVerified" DATE;

CREATE INDEX "CreditCard_issuer_idx" ON "CreditCard"("issuer");
CREATE INDEX "CreditCard_rewardType_idx" ON "CreditCard"("rewardType");
