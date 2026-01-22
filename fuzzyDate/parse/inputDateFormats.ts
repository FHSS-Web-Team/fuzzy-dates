import { calculateMaxDate, parseDateGroups } from '.';
import { isSeason } from '../helpers/maps';
import { ok } from '../helpers/result';

const DAY = '(?<day>\\d{1,2})';
const MONTH_DIGIT = '(?<month>\\d{1,2})';
const MONTH_STRING = '(?<month>[a-z]+)';
const YEAR = '(?<year>\\d{4})';
const DECADE = '(?<decade>\\d{4}s)';

// YYYY
export const year = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${YEAR}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;

  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const format = 'YYYY';
  const minDate = result.value.date;
  const maxDate = calculateMaxDate(minDate, format);

  return ok({
    format: format,
    minDate: minDate,
    maxDate: maxDate,
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
  const format = isSeason(monthString) ? 'SEASON_YYYY' : 'MMMM_YYYY';
  const minDate = result.value.date;
  const maxDate = calculateMaxDate(minDate, format);

  return ok({
    format: format,
    minDate: minDate,
    maxDate: maxDate,
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
  const format = isSeason(monthString) ? 'SEASON_YYYY' : 'MMMM_YYYY';
  const minDate = result.value.date;
  const maxDate = calculateMaxDate(minDate, format);

  return ok({
    format: format,
    minDate: minDate,
    maxDate: maxDate,
  } as const);
};

// D(D) MMM(M) YYYY
export const dayMonthStringYear = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${DAY}\s${MONTH_STRING}\s${YEAR}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;

  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const format = 'D_MMMM_YYYY';
  const minDate = result.value.date;
  const maxDate = calculateMaxDate(minDate, format);

  return ok({
    format: format,
    minDate: minDate,
    maxDate: maxDate,
  } as const);
};

// MMM(M) D(D) YYYY
export const monthStringDayYear = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${MONTH_STRING}\s${DAY}\s${YEAR}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;

  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const format = 'D_MMMM_YYYY';
  const minDate = result.value.date;
  const maxDate = calculateMaxDate(minDate, format);

  return ok({
    format: format,
    minDate: minDate,
    maxDate: maxDate,
  } as const);
};

// YYYY MMM(M) D(D)
export const yearMonthStringDay = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${YEAR}\s${MONTH_STRING}\s${DAY}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;

  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const format = 'D_MMMM_YYYY';
  const minDate = result.value.date;
  const maxDate = calculateMaxDate(minDate, format);

  return ok({
    format: format,
    minDate: minDate,
    maxDate: maxDate,
  } as const);
};

// YYYY D(D) MMM(M)
export const yearDayMonthString = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${YEAR}\s${DAY}\s${MONTH_STRING}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;

  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const format = 'D_MMMM_YYYY';
  const minDate = result.value.date;
  const maxDate = calculateMaxDate(minDate, format);

  return ok({
    format: format,
    minDate: minDate,
    maxDate: maxDate,
  } as const);
};

// M(M) YYYY
export const monthDigitYear = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${MONTH_DIGIT}\s${YEAR}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;

  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const format = 'MMMM_YYYY';
  const minDate = result.value.date;
  const maxDate = calculateMaxDate(minDate, format);

  return ok({
    format: format,
    minDate: minDate,
    maxDate: maxDate,
  } as const);
};

// YYYY M(M)
export const yearMonthDigit = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${YEAR}\s${MONTH_DIGIT}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;

  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const format = 'MMMM_YYYY';
  const minDate = result.value.date;
  const maxDate = calculateMaxDate(minDate, format);

  return ok({
    format: format,
    minDate: minDate,
    maxDate: maxDate,
  } as const);
};

// D(D) M(M) YYYY
export const dayMonthDigitYear = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${DAY}\s${MONTH_DIGIT}\s${YEAR}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;

  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const format = 'D_MMMM_YYYY';
  const minDate = result.value.date;
  const maxDate = calculateMaxDate(minDate, format);

  return ok({
    format: format,
    minDate: minDate,
    maxDate: maxDate,
  } as const);
};

// YYYY M(M)  D(D)
export const yearMonthDigitDay = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${YEAR}\s${MONTH_DIGIT}\s${DAY}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;
  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const format = 'D_MMMM_YYYY';
  const minDate = result.value.date;
  const maxDate = calculateMaxDate(minDate, format);

  return ok({
    format: format,
    minDate: minDate,
    maxDate: maxDate,
  } as const);
};

// YYYYs
export const decade = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${DECADE}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;

  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const format = 'YYYYs';
  const minDate = result.value.date;
  const maxDate = calculateMaxDate(minDate, format);

  return ok({
    format: format,
    minDate: minDate,
    maxDate: maxDate,
  } as const);
};
