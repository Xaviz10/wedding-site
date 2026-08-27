import { runWithConcurrency } from "./uploadBatch";

describe("bounded upload batches", () => {
  it("processes every item without exceeding the concurrency limit", async () => {
    let active = 0;
    let maximumActive = 0;
    const completed: number[] = [];

    await runWithConcurrency([1, 2, 3, 4, 5], 2, async (item) => {
      active += 1;
      maximumActive = Math.max(maximumActive, active);
      await new Promise<void>((resolve) => setTimeout(resolve, 5));
      completed.push(item);
      active -= 1;
    });

    expect(completed.sort()).toEqual([1, 2, 3, 4, 5]);
    expect(maximumActive).toBe(2);
  });
});
