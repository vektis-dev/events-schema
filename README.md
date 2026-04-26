# @vektis-io/events-schema

Shared Zod event-validation schemas for the [`@vektis-io/tracker`](https://www.npmjs.com/package/@vektis-io/tracker) browser SDK and the VEKTIS analytics ingestion server. Single source of truth for the tracking event contract — eliminates silent drift between SDK and server.

## Install

```bash
npm install @vektis-io/events-schema zod
```

`zod ^4.0.0` is a peer dependency. The package has zero runtime dependencies.

## Usage

### Server-side validation

```typescript
import { trackEventsSchema } from "@vektis-io/events-schema";

const payload = await req.json();
const result = trackEventsSchema.safeParse(payload);
if (!result.success) {
  return Response.json({ error: result.error.flatten() }, { status: 400 });
}
// result.data is fully typed as TrackEventsPayload
```

### Contract test (consumer-side)

For SDK packages that generate event payloads, install events-schema as a `devDependency` and validate generated fixtures in CI:

```typescript
import { trackEventsSchema } from "@vektis-io/events-schema";
import { generatedPayload } from "./my-sdk";

const result = trackEventsSchema.safeParse(generatedPayload);
expect(result.success).toBe(true);
```

This is the drift-protection mechanism: if the server bumps the schema in a way the SDK can't satisfy, CI fails before release.

### Optional fixtures sub-export

```typescript
import { validFixture, validBatchFixture } from "@vektis-io/events-schema/fixtures";
```

Useful for downstream contract tests that need a known-valid payload.

## Public API

| Export | Purpose |
| --- | --- |
| `EVENT_TYPES` | `readonly` array of valid `event_type` values |
| `NON_BILLABLE_EVENT_TYPES` | Subset that doesn't count toward billable usage |
| `trackingEventSchema` | Zod schema for a single event |
| `trackEventsSchema` | Zod schema for a batch (1–100 events) |
| `EventType` | Union type of valid event types |
| `TrackingEvent` | Inferred type of `trackingEventSchema` |
| `TrackEventsPayload` | Inferred type of `trackEventsSchema` |

Nothing else is exported. Internal vanalytics-only schemas (e.g., `listEventsQuerySchema`) intentionally stay in vanalytics.

## Release coordination

Schema changes have a strict release order to avoid drift between server and SDK:

1. **Bump and publish `@vektis-io/events-schema`** with the schema change.
2. **Bump the dependency in vanalytics**, deploy. The server now accepts the new shape.
3. **Bump the dependency in [`@vektis-io/tracker`](https://www.npmjs.com/package/@vektis-io/tracker) (devDep)**, release a new SDK version that emits the new shape.

Reversing this order produces server 400s for legitimate SDK calls. The contract test in tracker-js CI catches dep drift before publish.

## Local development across consumers

When iterating on a schema change before publishing, link the local checkout into a consumer:

### Option A — `npm link` (fastest, symlink-based)

```bash
cd events-schema && npm run build && npm link
cd ../vanalytics/server && npm link @vektis-io/events-schema
```

### Option B — `file:` dependency (explicit, no global state)

In the consumer's `package.json`:

```json
"@vektis-io/events-schema": "file:../events-schema"
```

### Option C — `yalc` (publish-like simulation, recommended for cross-repo CI testing)

```bash
cd events-schema && npm run build && npx yalc publish
cd ../vanalytics/server && npx yalc add @vektis-io/events-schema
```

Always remove the link / `yalc remove` / restore the version range before opening the consumer PR.

## Semver policy

- **Patch (1.0.x)** — bug fixes, error message tweaks, no shape change.
- **Minor (1.x.0)** — additive only: new optional field, new enum value, looser validation. Existing valid payloads stay valid.
- **Major (x.0.0)** — any breaking change to the contract: removed field, narrowed type, required field added, stricter validation. Also bumped when `zod` bumps major (peer-dep range moves).

The `zod` peer-dep range is `^4.0.0`. A future `zod@5` will require a major bump here.

## About `@vektis-io`

[VEKTIS](https://vektis.io) helps software teams measure which engineering work actually delivers customer impact. `@vektis-io/events-schema` is the contract layer of the Impact Tracking data path. See also: [`@vektis-io/tracker`](https://www.npmjs.com/package/@vektis-io/tracker) — the browser SDK.

## License

MIT. See [LICENSE](./LICENSE).
