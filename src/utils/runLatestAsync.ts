const callIdMap: Record<string, number> = {};

export async function runLatestAsync<R>(
  keyParts: string[],
  asyncFn: () => Promise<R>
) {
  const normalizedKeyParts = [...keyParts].sort();
  const mapKey = JSON.stringify(normalizedKeyParts);

  const lastCallId = (callIdMap[mapKey] || 0) + 1;
  callIdMap[mapKey] = lastCallId;

  const result = await asyncFn();

  if (callIdMap[mapKey] === lastCallId) {
    return result;
  }
  return;
}
