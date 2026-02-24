export const DATE_NEG_INFINITY = new Date(-8640000000000000);
export const DATE_POS_INFINITY = new Date(8640000000000000);

export const FORMAT_ORDER = [
  'YYYYs',
  'YYYY',
  'SEASON_YYYY',
  'MMMM_YYYY',
  'D_MMMM_YYYY',
] as const;

// FIXME: change this to precision instead of format
// Centrury?, Decade?, Year, Season, Month, Day, Hour, Minute, Second

// General rule approximate is before exact counterpart?
export const MODIFIER_ORDER = [
  'BEFORE',
  'ABOUT',
  'NONE',
  'BETWEEN',
  'FROM',
  'AFTER',
] as const;

// FIXME: Does it make more sense to have no ordering here (use a datetime instead of string to sort)
// and use gedcom x language or simple, range (open and closed), approximate simple, approximate range
// notice approximate now is a flag and we just have simple and ranges
// the unusual one is between which can be though of approximately closed range

// FIXME: sorting based on two dates
// the first would be the earliest date sorted asc (except for before which would be the latest),
// the tie breaker would be the latest date sorted desc (except for before which would be the earliest)
// this generally puts earlier dates first and then sorts broader ranges first
// this would be simple enough to make an index for these two columns given we denormalize earliest and latest
// to handle the approximate flag maybe we sort approximate desc after earliest
// earliest ASC - approximate DESC - latest DESC
// maybe still use a collationKey to make this easier to remember when time to sort

// When we handle after we need to choose the start.max for the earliest value
// e.g. after jan 2000 -> earliest 2000-01-01T23:59:59.999
// then it will appear after jan 2000 but before feb 2000

// with the limited set of options
// (simple, closed, left open, right open) + approximate
// it may be easier to hand pick the values for each
// these can be the four types and then handle them individually
// this also makes it super easy to convert to and from gedcom x

// we may expand beyond what gedcom can handle
// for example we want to handle seasons as a precision
// so we probably need to keep storing our special model
// then converting to everything else
