import { describe, expect, it } from "vitest";
import { RecolorQueue } from "./recolorQueue";

describe("RecolorQueue", () => {
  it("limits concurrency to configured max", async () => {
    const queue = new RecolorQueue(2);
    let active = 0;
    let peak = 0;
    const jobs = Array.from({ length: 8 }, (_, i) => queue.enqueue(async () => {
      active += 1;
      peak = Math.max(peak, active);
      await new Promise((resolve) => setTimeout(resolve, 10 + (i % 3)));
      active -= 1;
      return i;
    }));
    const result = await Promise.all(jobs);
    expect(result.length).toBe(8);
    expect(peak).toBeLessThanOrEqual(2);
  });
});
