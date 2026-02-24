import { isSeason } from './maps';
import { ok } from '../../helpers/result';
import { calculateMaxDate, parseDateGroups } from './helpers';

const DAY = '(?<day>\\d{1,2})';
const MONTH_DIGIT = '(?<month>\\d{1,2})';
const MONTH_STRING = '(?<month>[a-z]+)';
const YEAR = '(?<year>\\d{4})';

// YYYY
export const year = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${YEAR}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;

  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const precision = 'Year';
  const min = result.value.date;
  const max = calculateMaxDate(min, precision);

  return ok({
    precision,
    min,
    max,
  } as const);
};

// MMM(M) YYYY || SEASON YYYY
export const monthStringYear = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${MONTH_STRING}\s${YEAR}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;

  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const monthString = match.groups['month'].toLowerCase();
  const precision = isSeason(monthString) ? 'Season' : 'Month';
  const min = result.value.date;
  const max = calculateMaxDate(min, precision);

  return ok({
    precision,
    min,
    max,
  } as const);
};

// YYYY MMM(M) || YYYY SEASON
export const yearMonthString = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${YEAR}\s${MONTH_STRING}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;

  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const monthString = match.groups['month'].toLowerCase();
  const precision = isSeason(monthString) ? 'Season' : 'Month';
  const min = result.value.date;
  const max = calculateMaxDate(min, precision);

  return ok({
    precision,
    min,
    max,
  } as const);
};

// D(D) MMM(M) YYYY
export const dayMonthStringYear = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${DAY}\s${MONTH_STRING}\s${YEAR}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;

  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const precision = 'Day';
  const min = result.value.date;
  const max = calculateMaxDate(min, precision);

  return ok({
    precision,
    min,
    max,
  } as const);
};

// MMM(M) D(D) YYYY
export const monthStringDayYear = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${MONTH_STRING}\s${DAY}\s${YEAR}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;

  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const precision = 'Day';
  const min = result.value.date;
  const max = calculateMaxDate(min, precision);

  return ok({
    precision,
    min,
    max,
  } as const);
};

// YYYY MMM(M) D(D)
export const yearMonthStringDay = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${YEAR}\s${MONTH_STRING}\s${DAY}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;

  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const precision = 'Day';
  const min = result.value.date;
  const max = calculateMaxDate(min, precision);

  return ok({
    precision,
    min,
    max,
  } as const);
};

// YYYY D(D) MMM(M)
export const yearDayMonthString = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${YEAR}\s${DAY}\s${MONTH_STRING}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;

  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const precision = 'Day';
  const min = result.value.date;
  const max = calculateMaxDate(min, precision);

  return ok({
    precision,
    min,
    max,
  } as const);
};

// M(M) YYYY
export const monthDigitYear = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${MONTH_DIGIT}\s${YEAR}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;

  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const precision = 'Month';
  const min = result.value.date;
  const max = calculateMaxDate(min, precision);

  return ok({
    precision,
    min,
    max,
  } as const);
};

// YYYY M(M)
export const yearMonthDigit = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${YEAR}\s${MONTH_DIGIT}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;

  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const precision = 'Month';
  const min = result.value.date;
  const max = calculateMaxDate(min, precision);

  return ok({
    precision,
    min,
    max,
  } as const);
};

// D(D) M(M) YYYY
export const dayMonthDigitYear = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${DAY}\s${MONTH_DIGIT}\s${YEAR}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;

  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const precision = 'Day';
  const min = result.value.date;
  const max = calculateMaxDate(min, precision);

  return ok({
    precision,
    min,
    max,
  } as const);
};

// YYYY M(M)  D(D)
export const yearMonthDigitDay = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${YEAR}\s${MONTH_DIGIT}\s${DAY}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;
  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const precision = 'Day';
  const min = result.value.date;
  const max = calculateMaxDate(min, precision);

  return ok({
    precision,
    min,
    max,
  } as const);
};
