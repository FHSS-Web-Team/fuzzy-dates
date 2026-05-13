import { err, ok } from '../../helpers/result.js';
import { calculateMaxDate, parseDateGroups } from './helpers.js';

const DAY_DIGIT = '(?<day>\\d{1,2})';
const DAY_SINGLE_STRING = '(?<day>[a-z]+)';
const DAY_DOUBLE_STRING = '(?<day>[a-z]+\\s[a-z]+)';
const MONTH_DIGIT = '(?<month>\\d{1,2})';
const MONTH_STRING = '(?<month>[a-z]+)';
const YEAR_DIGIT = '(?<year>\\d{4})';

// YYYY
export const year = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${YEAR_DIGIT}$`);
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

// MMM(M) YYYY
export const monthStringYear = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${MONTH_STRING}\s${YEAR_DIGIT}$`);
  const match = pattern.exec(rawDate);
  if (!match?.groups) return null;

  const result = parseDateGroups(match.groups);
  if (!result.ok) return result;

  const monthString = match.groups['month'].toLowerCase();
  const precision = 'Month';
  const min = result.value.date;
  const max = calculateMaxDate(min, precision);

  return ok({
    precision,
    min,
    max,
  } as const);
};

// YYYY MMM(M)
export const yearMonthString = (rawDate: string) => {
  const pattern = new RegExp(String.raw`^${YEAR_DIGIT}\s${MONTH_STRING}$`);
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

// D(D) MMM(M) YYYY
export const dayMonthStringYear = (rawDate: string) => {
  const pattern = new RegExp(
    String.raw`^${DAY_DIGIT}\s${MONTH_STRING}\s${YEAR_DIGIT}$`
  );
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
  const pattern = new RegExp(
    String.raw`^${MONTH_STRING}\s${DAY_DIGIT}\s${YEAR_DIGIT}$`
  );
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
  const pattern = new RegExp(
    String.raw`^${YEAR_DIGIT}\s${MONTH_STRING}\s${DAY_DIGIT}$`
  );
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
  const pattern = new RegExp(
    String.raw`^${YEAR_DIGIT}\s${DAY_DIGIT}\s${MONTH_STRING}$`
  );
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
  const pattern = new RegExp(String.raw`^${MONTH_DIGIT}\s${YEAR_DIGIT}$`);
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
  const pattern = new RegExp(String.raw`^${YEAR_DIGIT}\s${MONTH_DIGIT}$`);
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
  const pattern = new RegExp(
    String.raw`^${DAY_DIGIT}\s${MONTH_DIGIT}\s${YEAR_DIGIT}$`
  );
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
  const pattern = new RegExp(
    String.raw`^${YEAR_DIGIT}\s${MONTH_DIGIT}\s${DAY_DIGIT}$`
  );
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

// DDD(D) MMM(M) YYYY or MMM(M) DDD(D) YYYY
export const dayStringMonthStringYear = (rawDate: string) => {
  const rawDateArray = rawDate.split(' ');

  let patterns = [
    new RegExp(
      String.raw`${DAY_SINGLE_STRING}\s${MONTH_STRING}\s${YEAR_DIGIT}`
    ),
  ];
  if (rawDateArray.length === 4) {
    patterns = [
      new RegExp(
        String.raw`${DAY_DOUBLE_STRING}\s${MONTH_STRING}\s${YEAR_DIGIT}`
      ),

      new RegExp(
        String.raw`${MONTH_STRING}\s${DAY_DOUBLE_STRING}\s${YEAR_DIGIT}`
      ),
    ];
  }

  for (const [index, pattern] of patterns.entries()) {
    const match = pattern.exec(rawDate);

    if (!match?.groups) continue;

    const result = parseDateGroups(match.groups);
    if (!result.ok && index === patterns.length - 1) return err(result.error);
    if (!result.ok) continue;

    if (result.ok) {
      const precision = 'Day';
      const min = result.value.date;
      const max = calculateMaxDate(min, precision);

      return ok({
        precision,
        min,
        max,
      } as const);
    }
  }

  return null;
};
