export function hasEventStarted(target: string, now = Date.now()): boolean {
  const targetTime = new Date(target).getTime();
  return Number.isFinite(targetTime) && now >= targetTime;
}
