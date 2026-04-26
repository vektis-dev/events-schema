# Changelog

All notable changes to `@vektis-io/events-schema` are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows [Semver](https://semver.org/).

## v1.0.0 — TBD

Initial release. Extracted from `vanalytics/server/src/validators/event.schema.ts` (schema-as-of-2026-04-23) per [VEK-342](https://linear.app/vektis/issue/VEK-342).

### Public API

- **Values:** `EVENT_TYPES`, `NON_BILLABLE_EVENT_TYPES`, `trackingEventSchema`, `trackEventsSchema`
- **Types:** `EventType`, `TrackingEvent`, `TrackEventsPayload`
- **Sub-export:** `@vektis-io/events-schema/fixtures` — `validFixture`, `validBatchFixture`

### Contract

- `EVENT_TYPES`: `feature.used`, `feature.engagement`, `session.active`, `feature.first_use`, `customer.identified`
- `NON_BILLABLE_EVENT_TYPES`: `customer.identified`
- `feature.*` events require `feature_id`; `customer.identified` does not.
- Properties: max 50 keys, key length ≤64 chars, string-value length ≤1024 chars, total JSON ≤8KB.
- Timestamp window: 7 days past to 1 hour future.
- Batch size: 1–100 events.

### Build artifacts

- ESM (`dist/index.js`) + CJS (`dist/index.cjs`) + types (`dist/index.d.ts`)
- Same dual format for the `./fixtures` sub-export

### Constraints

- Peer dep: `zod ^4.0.0`
- Engines: Node `>=20`
- Zero runtime dependencies
