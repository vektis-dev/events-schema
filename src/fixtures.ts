import type { TrackingEvent, TrackEventsPayload } from "./index.js";

const EXAMPLE_UUID = "00000000-0000-4000-8000-000000000000";

export function validFixture(overrides: Partial<TrackingEvent> = {}): TrackingEvent {
  return {
    event_id: EXAMPLE_UUID,
    event_type: "feature.used",
    feature_id: "feat-example",
    customer_id: "cust-example",
    ...overrides,
  };
}

export function validBatchFixture(count: number = 1): TrackEventsPayload {
  return {
    events: Array.from({ length: count }, (_, i) =>
      validFixture({
        event_id: `00000000-0000-4000-8000-${i.toString(16).padStart(12, "0")}`,
      })
    ),
  };
}
