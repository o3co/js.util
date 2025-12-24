import pLimit from "p-limit";

export type RunOptions<B> = {
  stopOnFailure: boolean;
  onSuccess: (_: B) => B;
  onFailure: (_: unknown) => B;
};

export type RunSeqOptions<B> = RunOptions<B>;

const DefaultRunSeqOptions = {
  stopOnFailure: true,
  onSuccess: (x) => x,
  onFailure: (x) => {
    throw x;
  },
};

type RunSeqHandler<A, B> = (value: A, index: number) => Promise<B>;

/**
 * 指定した配列の各要素に対して非同期関数を順番に実行する。
 * @param entries 対象となる配列
 * @param asyncFn 各要素に適用する非同期関数
 * @param options stopOnFailure: trueの場合、エラー発生時に処理を中断する
 * @returns 各非同期処理の結果を格納した配列
 */
export async function runSeq<A, B>(
  entries: Array<A>,
  asyncFn: RunSeqHandler<A, B>,
  {
    stopOnFailure = DefaultRunSeqOptions.stopOnFailure,
    onSuccess = DefaultRunSeqOptions.onSuccess,
    onFailure = DefaultRunSeqOptions.onFailure,
  }: RunSeqOptions<B> = DefaultRunSeqOptions,
): Promise<Array<B | Error>> {
  return await (entries.reduce(
    async (
      prev: Promise<Array<B | Error>>,
      cur: A,
      index: number,
    ): Promise<Array<B | Error>> => {
      return [
        ...(await prev),
        await (async () => {
          try {
            const ret = await asyncFn(cur, index);

            return onSuccess(ret);
          } catch (c1) {
            try {
              return onFailure(c1);
            } catch (c2) {
              if (stopOnFailure) {
                throw c2;
              }
              return c2 instanceof Error
                ? c2
                : new Error(String(c2), { cause: c2 });
            }
          }
        })(),
      ];
    },
    Promise.resolve([]) as Promise<Array<B | Error>>,
  ) as Promise<Array<B | Error>>);
}

type RunParallelOption<B> = RunOptions<B> & {
  limit: number;
};

const DefaultRunParallelOption = {
  limit: 100,
  stopOnFailure: true,
  onSuccess: (x) => x,
  onFailure: (x) => {
    throw x;
  },
};

type RunParallelHandler<A, B> = (
  element: A,
  index: number,
  array: Array<A>,
) => Promise<B>;

export async function runParallel<A, B>(
  entries: Array<A>,
  pHandler: RunParallelHandler<A, B>,
  {
    limit = DefaultRunParallelOption.limit,
    stopOnFailure = DefaultRunParallelOption.stopOnFailure,
    onSuccess = DefaultRunParallelOption.onSuccess,
    onFailure = DefaultRunParallelOption.onFailure,
  }: RunParallelOption<B> = DefaultRunParallelOption,
): Promise<Array<B | Error>> {
  const executor = pLimit(limit);

  return await Promise.all(
    entries.map(async (elem, index, array) => {
      try {
        const ret = await executor(() => pHandler(elem, index, array));

        return onSuccess(ret);
      } catch (c1) {
        try {
          return onFailure(c1);
        } catch (c2) {
          if (stopOnFailure) {
            throw c2;
          }
          return c2 instanceof Error
            ? c2
            : new Error(String(c2), { cause: c2 });
        }
      }
    }),
  );
}
