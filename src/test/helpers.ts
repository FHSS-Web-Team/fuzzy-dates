import { assert } from 'vitest';
import { FuzzyDate } from '../fuzzyDate';

export const parseOrFail = (input: string) => {
  const result = FuzzyDate.parse(input);
  if (!result.ok) assert.fail(`failed to parse input: ${input} (${result.error})`);
  return result.value;
};

export const utcStart = (year: number, month: number, day: number) =>
  new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

export const utcEnd = (year: number, month: number, day: number) =>
  new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
