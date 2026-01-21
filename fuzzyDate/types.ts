type Ok<T> = { ok: true; value: T };
type Err<E = unknown> = { ok: false; error: E };
export type Result<T, E> = Ok<T> | Err<E>;

export function ok<T = undefined>(value?: T): Ok<T>;
export function ok(value?: unknown): Ok<unknown> {
  return {
    ok: true,
    value,
  };
}

export function err<E>(error: E): Err<E> {
  return {
    ok: false,
    error,
  };
}

export const DATE_NEG_INFINITY = new Date(-8640000000000000);
export const DATE_POS_INFINITY = new Date(8640000000000000);

export const FORMAT_ORDER = [
  'YYYYs',
  'YYYY',
  'SEASON_YYYY',
  'MMMM_YYYY',
  'D_MMMM_YYYY',
] as const;
export type NormalFormat = (typeof FORMAT_ORDER)[number];

export const MODIFIER_ORDER = [
  'BEFORE',
  'ABOUT',
  'NONE',
  'EARLY',
  'MID',
  'LATE',
  'FROM',
  'BETWEEN',
  'AFTER',
] as const;
export type FuzzyDateModifier = (typeof MODIFIER_ORDER)[number];

export type FuzzyDateValue = {
  format: NormalFormat;
  minDate: Date;
  maxDate: Date;
};

export type FuzzyDateModel = {
  modifier: FuzzyDateModifier;
  start: FuzzyDateValue;
  end: FuzzyDateValue;
};

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
