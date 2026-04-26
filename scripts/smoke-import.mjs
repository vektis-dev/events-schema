// ESM smoke test — verifies the built dist/index.js loads and parses a valid fixture.
// Runs against the built artifacts in ./dist (must `npm run build` first).
import { trackEventsSchema } from "../dist/index.js";
import { validBatchFixture } from "../dist/fixtures.js";

const result = trackEventsSchema.safeParse(validBatchFixture(3));
if (!result.success) {
  console.error("ESM smoke FAILED:", JSON.stringify(result.error.flatten(), null, 2));
  process.exit(1);
}
console.log("ESM smoke OK — parsed batch of 3 valid fixtures");
