export const DATE_NEG_INFINITY = new Date(-8640000000000000);
export const DATE_POS_INFINITY = new Date(8640000000000000);

export const FORMAT_ORDER = [
  'YYYYs',
  'YYYY',
  'SEASON_YYYY',
  'MMMM_YYYY',
  'D_MMMM_YYYY',
] as const;

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