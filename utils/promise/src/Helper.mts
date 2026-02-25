import pLimit from "p-limit";

export type RunOptions<TReturn> = {
  stopOnFailure?: boolean;
  onSuccess?: (_: TReturn) => TReturn;
  onFailure?: (_: unknown) => TReturn;
};

export type RunSeqOptions<TReturn> = RunOptions<TReturn>;

export class PromiseFailure extends Error {
  constructor({
    message = "Failed",
    cause,
  }: { message: string; cause?: Error }) {
    super(message);
    this.name = "PromiseFailure";
    if (cause) {
      this.cause = cause;
    }
  }
}

const DefaultRunSeqOptions = {
  stopOnFailure: true,
  onSuccess: (x) => x,
  onFailure: (x) => {
    throw x;
  },
};

type RunSeqHandler<TItem, TReturn> = (
  value: TItem,
  index: number,
) => Promise<TReturn>;

/**
 * 指定した配列の各要素に対して非同期関数を順番に実行する。
 * @param entries 対象となる配列
 * @param asyncFn 各要素に適用する非同期関数
 * @param options stopOnFailure: trueの場合、エラー発生時に処理を中断する
 * @returns 各非同期処理の結果を格納した配列
 */
export async function runSeq<TItem, TReturn>(
  entries: Array<TItem>,
  asyncFn: RunSeqHandler<TItem, TReturn>,
  {
    stopOnFailure = DefaultRunSeqOptions.stopOnFailure,
    onSuccess = DefaultRunSeqOptions.onSuccess,
    onFailure = DefaultRunSeqOptions.onFailure,
  }: RunSeqOptions<TReturn> = DefaultRunSeqOptions,
): Promise<Array<TReturn | PromiseFailure>> {
  return await entries.reduce(
    async (
      prev: Promise<Array<TReturn | PromiseFailure>>,
      cur: TItem,
      index: number,
    ): Promise<Array<TReturn | PromiseFailure>> => {
      return [
        ...(await prev),
        await (async () => {
          try {
            const ret = await asyncFn(cur, index);

            return onSuccess(ret);
          } catch (c1: unknown) {
            try {
              return onFailure(c1);
            } catch (c2) {
              if (stopOnFailure) {
                throw new PromiseFailure({
                  message: "Failed",
                  cause: c2 instanceof Error ? c2 : undefined,
                });
              }
              return c2 instanceof Error
                ? new PromiseFailure({ message: String(c2), cause: c2 })
                : new PromiseFailure({ message: String(c2) });
            }
          }
        })(),
      ];
    },
    Promise.resolve([]) as Promise<Array<TReturn | PromiseFailure>>,
  );
}

export type RunParallelOption<TReturn> = RunOptions<TReturn> & {
  limit?: number;
};

const DefaultRunParallelOption = {
  limit: 100,
  stopOnFailure: true,
  onSuccess: (x) => x,
  onFailure: (x) => {
    throw x;
  },
};

export type RunParallelHandler<TItem, TReturn> = (
  element: TItem,
  index: number,
  array: Array<TItem>,
) => Promise<TReturn>;

export async function runParallel<TItem, TReturn>(
  entries: Array<TItem>,
  pHandler: RunParallelHandler<TItem, TReturn>,
  {
    limit = DefaultRunParallelOption.limit,
    stopOnFailure = DefaultRunParallelOption.stopOnFailure,
    onSuccess = DefaultRunParallelOption.onSuccess,
    onFailure = DefaultRunParallelOption.onFailure,
  }: RunParallelOption<TReturn> = DefaultRunParallelOption,
): Promise<Array<TReturn | PromiseFailure>> {
  const executor = pLimit(limit);

  return await Promise.all(
    entries.map(async (elem, index, array) => {
      try {
        const ret = await executor(() => pHandler(elem, index, array));

        return onSuccess(ret);
      } catch (c1: unknown) {
        try {
          return onFailure(c1);
        } catch (c2: unknown) {
          if (stopOnFailure) {
            throw new PromiseFailure({
              message: "Failed",
              cause: c2 instanceof Error ? c2 : undefined,
            });
          }
          return c2 instanceof Error
            ? new PromiseFailure({ message: String(c2), cause: c2 })
            : new PromiseFailure({ message: String(c2) });
        }
      }
    }),
  );
}
