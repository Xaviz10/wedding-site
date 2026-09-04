const MAX_PARALLEL_IMAGE_UPLOADS = 2;

export function uploadConcurrencyFor(files: readonly Pick<File, "type">[]): number {
  // Serial video uploads avoid Safari opening multiple large Photos-backed
  // blobs at once. Photos still upload two at a time on capable browsers.
  return files.some((file) => file.type.startsWith("video/")) ? 1 : MAX_PARALLEL_IMAGE_UPLOADS;
}

export async function runWithConcurrency<T>(
  items: readonly T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<void>,
): Promise<void> {
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error("concurrency must be a positive integer");
  }

  let nextIndex = 0;
  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    async () => {
      while (nextIndex < items.length) {
        const itemIndex = nextIndex;
        nextIndex += 1;
        await worker(items[itemIndex] as T, itemIndex);
      }
    },
  );

  await Promise.all(workers);
}
