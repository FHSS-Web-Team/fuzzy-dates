export const MONTH_SEASON_MAP = {
  spring: 3,
  summer: 6,
  fall: 9,
  autumn: 9,
  winter: 12,
} as const;

export function isSeason(
  input: string
): input is keyof typeof MONTH_SEASON_MAP {
  return Object.keys(MONTH_SEASON_MAP).includes(input);
}

export const SEASON_MONTH_MAP = {
  1: 'winter',
  2: 'winter',
  3: 'spring',
  4: 'spring',
  5: 'spring',
  6: 'summer',
  7: 'summer',
  8: 'summer',
  9: 'fall',
  10: 'fall',
  11: 'fall',
  12: 'winter',
} as const;

export function isSeasonMonth(
  input: number
): input is keyof typeof SEASON_MONTH_MAP {
  return input >= 1 && input <= 12;
}

export const MONTH_NAME_MAP = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
} as const;

export function isMonth(input: string): input is keyof typeof MONTH_NAME_MAP {
  return Object.keys(MONTH_NAME_MAP).includes(input);
}
