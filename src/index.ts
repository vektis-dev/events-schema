import { z } from "zod/v4";

export const EVENT_TYPES = [
  "feature.used",
  "feature.engagement",
  "session.active",
  "feature.first_use",
  "customer.identified",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const NON_BILLABLE_EVENT_TYPES: EventType[] = ["customer.identified"];

export const trackingEventSchema = z
  .object({
    event_id: z.string().uuid(),
    event_type: z.enum(EVENT_TYPES),
    feature_id: z.string().min(1).max(255).optional(),
    customer_id: z.string().min(1).max(255),
    user_id: z.string().max(255).optional(),
    action: z.string().max(255).optional(),
    properties: z
      .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          return Object.keys(val).every((k) => k.length <= 64);
        },
        { message: "Property keys must be 64 characters or fewer" }
      )
      .refine(
        (val) => {
          if (!val) return true;
          return Object.values(val).every(
            (v) => typeof v !== "string" || v.length <= 1024
          );
        },
        { message: "String property values must be 1024 characters or fewer" }
      )
      .refine((val) => !val || Object.keys(val).length <= 50, {
        message: "Maximum 50 property keys allowed",
      })
      .refine((val) => !val || JSON.stringify(val).length <= 8192, {
        message: "Properties must not exceed 8KB",
      }),
    timestamp: z.string().datetime({ offset: true }).optional(),
  })
  .refine((data) => !data.event_type.startsWith("feature.") || data.feature_id, {
    message: "feature_id required for feature.* events",
  })
  .refine(
    (data) => {
      if (!data.timestamp) return true;
      const ts = new Date(data.timestamp).getTime();
      const now = Date.now();
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
      const oneHourAhead = now + 60 * 60 * 1000;
      return ts >= sevenDaysAgo && ts <= oneHourAhead;
    },
    { message: "Timestamp must be within 7 days past to 1 hour future" }
  );

export const trackEventsSchema = z.object({
  events: z.array(trackingEventSchema).min(1).max(100),
});

export type TrackingEvent = z.infer<typeof trackingEventSchema>;
export type TrackEventsPayload = z.infer<typeof trackEventsSchema>;
