export const MONTH_SEASON_MAP = {
  spring: 3,
  summer: 6,
  fall: 9,
  autumn: 9,
  winter: 12,
} as const;

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
