export type OptionKey = 'ArrowDown' | 'ArrowUp' | 'Home' | 'End';

export function moveOption(index: number, key: OptionKey, count: number) {
  if (!count) return -1;
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  if (index < 0 || index >= count) return key === 'ArrowDown' ? 0 : count - 1;
  return (index + (key === 'ArrowDown' ? 1 : -1) + count) % count;
}

export function findOptionByPrefix(names: string[], index: number, query: string) {
  const normalize = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('de');
  const normalized = normalize(query);
  if (!normalized) return index;
  // Repeating one letter cycles through matching options instead of searching
  // for a word beginning with several copies of that letter.
  const prefix = [...normalized].every(letter => letter === normalized[0]) ? normalized[0] : normalized;
  const start = prefix.length === 1 ? index + 1 : index;
  for (let offset = 0; offset < names.length; offset++) {
    const candidate = (start + offset + names.length) % names.length;
    if (normalize(names[candidate]).startsWith(prefix)) return candidate;
  }
  return index;
}
