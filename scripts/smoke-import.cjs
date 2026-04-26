// CJS smoke test — verifies the built dist/index.cjs loads via require() and parses a valid fixture.
// Runs against the built artifacts in ./dist (must `npm run build` first).
const { trackEventsSchema } = require("../dist/index.cjs");
const { validBatchFixture } = require("../dist/fixtures.cjs");

const result = trackEventsSchema.safeParse(validBatchFixture(3));
if (!result.success) {
  console.error("CJS smoke FAILED:", JSON.stringify(result.error.flatten(), null, 2));
  process.exit(1);
}
console.log("CJS smoke OK — parsed batch of 3 valid fixtures");
