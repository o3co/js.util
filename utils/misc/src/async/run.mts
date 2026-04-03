import pLimit from "p-limit";

export type RunResult<T> =
  | { status: "fulfilled"; value: T }
  | { status: "rejected"; reason: unknown };

export type RunHandler<TItem, TReturn> = (
  item: TItem,
  index: number,
) => Promise<TReturn>;

export type RunOptions = {
  /** true (default): reject on first error. false: collect all results. */
  stopOnFailure?: boolean;
};

export type RunParallelOptions = RunOptions & {
  /** Concurrency limit. Default: 10 */
  concurrency?: number;
};

/**
 * 配列の各要素に対して非同期関数を順番に実行する。
 *
 * stopOnFailure: true (default) — 最初のエラーで即座に throw し、残りのタスクは実行しない。
 *
 * stopOnFailure: false — 全件実行し結果配列に rejected を含める。
 */
export async function runSeq<TItem, TReturn>(
  entries: Array<TItem>,
  handler: RunHandler<TItem, TReturn>,
  options: RunOptions = {},
): Promise<Array<RunResult<TReturn>>> {
  const { stopOnFailure = true } = options;
  const results: Array<RunResult<TReturn>> = [];

  for (let i = 0; i < entries.length; i++) {
    try {
      const value = await handler(entries[i], i);
      results.push({ status: "fulfilled", value });
    } catch (reason: unknown) {
      if (stopOnFailure) {
        throw reason;
      }
      results.push({ status: "rejected", reason });
    }
  }

  return results;
}

/**
 * 配列の各要素に対して非同期関数を並列実行する。
 * concurrency で同時実行数を制限する。
 *
 * stopOnFailure: true (default) — 最初のエラーで Promise を reject する。
 * ただし既にキューされた並行タスクはキャンセルされない（Promise.all と同じ挙動）。
 *
 * stopOnFailure: false — 全件実行し結果配列に rejected を含める。
 */
export async function runParallel<TItem, TReturn>(
  entries: Array<TItem>,
  handler: RunHandler<TItem, TReturn>,
  options: RunParallelOptions = {},
): Promise<Array<RunResult<TReturn>>> {
  const { stopOnFailure = true, concurrency = 10 } = options;
  const limit = pLimit(concurrency);

  const wrappedTasks = entries.map((item, index) =>
    limit(async (): Promise<RunResult<TReturn>> => {
      try {
        const value = await handler(item, index);
        return { status: "fulfilled", value };
      } catch (reason: unknown) {
        if (stopOnFailure) {
          throw reason;
        }
        return { status: "rejected", reason };
      }
    }),
  );

  return Promise.all(wrappedTasks);
}
