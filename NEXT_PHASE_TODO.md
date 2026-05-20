# Max Rewards Next-Phase Readiness Plan

Last updated: 2026-05-19

## Current State

- `npm run test` passes with 14 API tests.
- `npm run build` passes for the API and web apps.
- Docker Postgres is running and healthy on `localhost:5433`.
- The project moved Docker Postgres from host port `5432` to `5433` because another host Postgres process was already listening on `localhost:5432`.
- Prisma migration and seed have been verified against the Docker database.

## Implementation Todo

- Clean the seeded card catalog so no visible card ships with placeholder URLs, TODO-only reward rules, or placeholder `bestFor` values.
- Keep normalized `CardRewardCategory` rows as the recommendation scoring source for this phase.
- Treat richer card fields such as `rewardRules`, `credits`, `signupBonus`, `sourceUrl`, and `lastVerified` as catalog metadata until the scoring model is redesigned.
- Harden card admin updates so partial PATCH requests preserve derived fields unless their inputs are supplied, and reward category replacement is explicit.
- Extend recommendation responses with card metadata needed by the web UI: network, reward currency, best-for tags, apply/source links, and verification date.
- Update the recommendations UI to show those metadata fields and remove the current-card comparison placeholder.
- Update README notes to match the verified manually maintained catalog direction.
- Verify migration, seed, tests, build, and a basic local smoke path before considering the app ready for the next phase.

## Acceptance Checklist

- [x] No seeded card contains `TODO`, `TODO_OFFICIAL_SOURCE_URL`, or `bestFor: ["TODO"]`.
- [x] `npm run db:generate` succeeds.
- [x] `npm run db:migrate` succeeds.
- [x] `npm run db:seed` succeeds.
- [x] `npm run test` succeeds.
- [x] `npm run build` succeeds.
- [x] Recommendations display richer card metadata in the web app.
- [x] README reflects the current catalog and estimates-only positioning.

## Notes

- Do not reset or delete the Docker volume unless explicitly approved.
- If a card cannot be verified from an issuer source, remove it from the seeded catalog rather than shipping placeholder data.
