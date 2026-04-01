import { describe, expect, it } from "vitest";
import { runSeq, runParallel, type RunResult } from "./run.mjs";

describe("runSeq", () => {
  it("should execute handlers sequentially and return fulfilled results", async () => {
    const results = await runSeq(
      [1, 2, 3],
      async (item) => item * 2,
      { stopOnFailure: false },
    );
    expect(results).toEqual([
      { status: "fulfilled", value: 2 },
      { status: "fulfilled", value: 4 },
      { status: "fulfilled", value: 6 },
    ]);
  });

  it("should execute in order", async () => {
    const order: number[] = [];
    await runSeq(
      [1, 2, 3],
      async (item) => {
        order.push(item);
        return item;
      },
      { stopOnFailure: false },
    );
    expect(order).toEqual([1, 2, 3]);
  });

  it("should reject immediately when stopOnFailure is true (default)", async () => {
    await expect(
      runSeq([1, 2, 3], async (item) => {
        if (item === 2) throw new Error("fail");
        return item;
      }),
    ).rejects.toThrow("fail");
  });

  it("should collect errors when stopOnFailure is false", async () => {
    const results = await runSeq(
      [1, 2, 3],
      async (item) => {
        if (item === 2) throw new Error("fail");
        return item;
      },
      { stopOnFailure: false },
    );
    expect(results[0]).toEqual({ status: "fulfilled", value: 1 });
    expect(results[1]).toEqual({ status: "rejected", reason: expect.any(Error) });
    expect(results[2]).toEqual({ status: "fulfilled", value: 3 });
  });

  it("should return empty array for empty input", async () => {
    const results = await runSeq([], async (item) => item, { stopOnFailure: false });
    expect(results).toEqual([]);
  });

  it("should pass correct index to handler", async () => {
    const indices: number[] = [];
    await runSeq(
      ["a", "b", "c"],
      async (_, index) => {
        indices.push(index);
        return index;
      },
      { stopOnFailure: false },
    );
    expect(indices).toEqual([0, 1, 2]);
  });
});

describe("runParallel", () => {
  it("should execute handlers in parallel and return fulfilled results", async () => {
    const results = await runParallel(
      [1, 2, 3],
      async (item) => item * 2,
      { stopOnFailure: false },
    );
    expect(results).toEqual([
      { status: "fulfilled", value: 2 },
      { status: "fulfilled", value: 4 },
      { status: "fulfilled", value: 6 },
    ]);
  });

  it("should reject immediately when stopOnFailure is true (default)", async () => {
    await expect(
      runParallel([1, 2, 3], async (item) => {
        if (item === 2) throw new Error("fail");
        return item;
      }),
    ).rejects.toThrow("fail");
  });

  it("should collect errors when stopOnFailure is false", async () => {
    const results = await runParallel(
      [1, 2, 3],
      async (item) => {
        if (item === 2) throw new Error("fail");
        return item;
      },
      { stopOnFailure: false, concurrency: 1 },
    );
    expect(results[0]).toEqual({ status: "fulfilled", value: 1 });
    expect(results[1]).toEqual({ status: "rejected", reason: expect.any(Error) });
    expect(results[2]).toEqual({ status: "fulfilled", value: 3 });
  });

  it("should respect concurrency limit", async () => {
    let running = 0;
    let maxRunning = 0;

    await runParallel(
      [1, 2, 3, 4, 5],
      async (item) => {
        running++;
        maxRunning = Math.max(maxRunning, running);
        await new Promise((resolve) => setTimeout(resolve, 10));
        running--;
        return item;
      },
      { concurrency: 2, stopOnFailure: false },
    );

    expect(maxRunning).toBeLessThanOrEqual(2);
  });

  it("should preserve result order", async () => {
    const results = await runParallel(
      [3, 1, 2],
      async (item) => {
        await new Promise((resolve) => setTimeout(resolve, item * 10));
        return item;
      },
      { stopOnFailure: false },
    );
    expect(results.map((r) => r.status === "fulfilled" && r.value)).toEqual([3, 1, 2]);
  });

  it("should return empty array for empty input", async () => {
    const results = await runParallel([], async (item) => item, { stopOnFailure: false });
    expect(results).toEqual([]);
  });

  it("should pass correct index to handler", async () => {
    const indices: number[] = [];
    await runParallel(
      ["a", "b", "c"],
      async (_, index) => {
        indices.push(index);
        return index;
      },
      { concurrency: 1, stopOnFailure: false },
    );
    expect(indices).toEqual([0, 1, 2]);
  });
});
