import { describe, it, expect } from "vitest";
import { trackingEventSchema, trackEventsSchema } from "./index.js";
import { randomUUID } from "node:crypto";

function validEvent(overrides: Record<string, unknown> = {}) {
  return {
    event_id: randomUUID(),
    event_type: "feature.used" as const,
    feature_id: "feat-123",
    customer_id: "cust-456",
    ...overrides,
  };
}

describe("trackingEventSchema", () => {
  it("accepts a valid feature event", () => {
    const result = trackingEventSchema.safeParse(validEvent());
    expect(result.success).toBe(true);
  });

  it("accepts a customer.identified event without feature_id", () => {
    const result = trackingEventSchema.safeParse(
      validEvent({ event_type: "customer.identified", feature_id: undefined })
    );
    expect(result.success).toBe(true);
  });

  it("rejects feature.* event without feature_id", () => {
    const result = trackingEventSchema.safeParse(
      validEvent({ feature_id: undefined })
    );
    expect(result.success).toBe(false);
  });

  it("rejects invalid event_type", () => {
    const result = trackingEventSchema.safeParse(
      validEvent({ event_type: "invalid.type" })
    );
    expect(result.success).toBe(false);
  });

  it("rejects non-uuid event_id", () => {
    const result = trackingEventSchema.safeParse(
      validEvent({ event_id: "not-a-uuid" })
    );
    expect(result.success).toBe(false);
  });

  it("accepts valid timestamp", () => {
    const result = trackingEventSchema.safeParse(
      validEvent({ timestamp: new Date().toISOString() })
    );
    expect(result.success).toBe(true);
  });

  it("rejects timestamp more than 7 days in the past", () => {
    const old = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();
    const result = trackingEventSchema.safeParse(
      validEvent({ timestamp: old })
    );
    expect(result.success).toBe(false);
  });

  it("rejects timestamp more than 1 hour in the future", () => {
    const future = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    const result = trackingEventSchema.safeParse(
      validEvent({ timestamp: future })
    );
    expect(result.success).toBe(false);
  });

  it("accepts properties with valid keys and values", () => {
    const result = trackingEventSchema.safeParse(
      validEvent({ properties: { plan: "pro", count: 5, active: true } })
    );
    expect(result.success).toBe(true);
  });

  it("rejects properties with key longer than 64 chars", () => {
    const longKey = "a".repeat(65);
    const result = trackingEventSchema.safeParse(
      validEvent({ properties: { [longKey]: "value" } })
    );
    expect(result.success).toBe(false);
  });

  it("rejects properties with string value longer than 1024 chars", () => {
    const result = trackingEventSchema.safeParse(
      validEvent({ properties: { key: "x".repeat(1025) } })
    );
    expect(result.success).toBe(false);
  });

  it("rejects properties with more than 50 keys", () => {
    const props: Record<string, string> = {};
    for (let i = 0; i < 51; i++) {
      props[`key_${i}`] = "val";
    }
    const result = trackingEventSchema.safeParse(
      validEvent({ properties: props })
    );
    expect(result.success).toBe(false);
  });

  it("rejects properties exceeding 8KB", () => {
    const props: Record<string, string> = {};
    for (let i = 0; i < 10; i++) {
      props[`k${i}`] = "x".repeat(1000);
    }
    const result = trackingEventSchema.safeParse(
      validEvent({ properties: props })
    );
    expect(result.success).toBe(false);
  });
});

describe("trackEventsSchema", () => {
  it("accepts a batch of 1-100 events", () => {
    const result = trackEventsSchema.safeParse({
      events: [validEvent(), validEvent()],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty events array", () => {
    const result = trackEventsSchema.safeParse({ events: [] });
    expect(result.success).toBe(false);
  });

  it("rejects more than 100 events", () => {
    const events = Array.from({ length: 101 }, () => validEvent());
    const result = trackEventsSchema.safeParse({ events });
    expect(result.success).toBe(false);
  });

  it("rejects entire batch if one event is invalid", () => {
    const result = trackEventsSchema.safeParse({
      events: [validEvent(), validEvent({ event_id: "bad" })],
    });
    expect(result.success).toBe(false);
  });
});
