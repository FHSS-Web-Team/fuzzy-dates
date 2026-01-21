import { getTimes } from '.';
import { ok, err, DATE_NEG_INFINITY, DATE_POS_INFINITY } from '../types';
import { stringToDate } from './stringToDate';

export const none = (cleanedInput: string) => {
  const result = stringToDate(cleanedInput);
  if (!result.ok) return result;
  const date = result.value;

  return ok({
    modifier: 'NONE',
    start: {
      format: date.format,
      minDate: date.minDate,
      maxDate: date.maxDate,
    },
    end: {
      format: date.format,
      minDate: date.minDate,
      maxDate: date.maxDate,
    },
  } as const);
};

export const before = (cleanedInput: string) => {
  const result = stringToDate(cleanedInput.slice('before '.length));
  if (!result.ok) return result;
  const date = result.value;

  return ok({
    modifier: 'BEFORE',
    start: {
      format: date.format,
      minDate: DATE_NEG_INFINITY,
      maxDate: date.minDate,
    },
    end: {
      format: date.format,
      minDate: date.minDate,
      maxDate: date.maxDate,
    },
  } as const);
};

export const after = (cleanedInput: string) => {
  const result = stringToDate(cleanedInput.slice('after '.length));
  if (!result.ok) return result;
  const date = result.value;

  return ok({
    modifier: 'AFTER',
    start: {
      format: date.format,
      minDate: date.minDate,
      maxDate: date.maxDate,
    },
    end: {
      format: date.format,
      minDate: date.maxDate,
      maxDate: DATE_POS_INFINITY,
    },
  } as const);
};

export const about = (cleanedInput: string) => {
  const result = stringToDate(cleanedInput.slice('about '.length));
  if (!result.ok) return result;
  const date = result.value;

  return ok({
    modifier: 'ABOUT',
    start: {
      format: date.format,
      minDate: date.minDate,
      maxDate: date.maxDate,
    },
    end: {
      format: date.format,
      minDate: date.minDate,
      maxDate: date.maxDate,
    },
  } as const);
};

export const between = (cleanedInput: string) => {
  const dates = cleanedInput.slice('between '.length).split(' and ');
  if (dates.length !== 2) return err('Invalid "BETWEEN" modifier.' as const);

  const startResult = stringToDate(dates[0]);
  const endDateResult = stringToDate(dates[1]);
  if (!startResult.ok) return startResult;
  if (!endDateResult.ok) return endDateResult;
  const start = startResult.value;
  const end = endDateResult.value;

  return ok({
    modifier: 'BETWEEN',
    start: {
      format: start.format,
      minDate: start.minDate,
      maxDate: start.maxDate,
    },
    end: { format: end.format, minDate: end.minDate, maxDate: end.maxDate },
  } as const);
};

export const from = (cleanedInput: string) => {
  const dates = cleanedInput.slice('from '.length).split(' to ');
  if (dates.length !== 2) return err('Invalid "FROM" modifier.' as const);

  const startResult = stringToDate(dates[0]);
  const endDateResult = stringToDate(dates[1]);
  if (!startResult.ok) return startResult;
  if (!endDateResult.ok) return endDateResult;
  const start = startResult.value;
  const end = endDateResult.value;

  return ok({
    modifier: 'FROM',
    start: {
      format: start.format,
      minDate: start.minDate,
      maxDate: start.maxDate,
    },
    end: { format: end.format, minDate: end.minDate, maxDate: end.maxDate },
  } as const);
};

export const early = (cleanedInput: string) => {
  const result = stringToDate(cleanedInput.slice('early '.length));
  if (!result.ok) return result;
  const date = result.value;
  const { start, half } = getTimes(date);

  return ok({
    modifier: 'EARLY',
    start: {
      format: date.format,
      minDate: new Date(start),
      maxDate: new Date(start + half),
    },
    end: {
      format: date.format,
      minDate: new Date(start),
      maxDate: new Date(start + half),
    },
  } as const);
};

export const mid = (cleanedInput: string) => {
  const result = stringToDate(cleanedInput.slice('mid '.length));
  if (!result.ok) return result;
  const date = result.value;
  console.log(date);
  const { start, half } = getTimes(date);

  return ok({
    modifier: 'MID',
    start: {
      format: date.format,
      minDate: new Date(start + half / 2),
      maxDate: new Date(start + half),
    },
    end: {
      format: date.format,
      minDate: new Date(start + half / 2),
      maxDate: new Date(start + half),
    },
  } as const);
};

export const late = (cleanedInput: string) => {
  const result = stringToDate(cleanedInput.slice('late '.length));
  if (!result.ok) return result;
  const date = result.value;
  const { start, half } = getTimes(date);

  return ok({
    modifier: 'LATE',
    start: {
      format: date.format,
      minDate: new Date(start + half),
      maxDate: date.maxDate,
    },
    end: {
      format: date.format,
      minDate: new Date(start + half),
      maxDate: date.maxDate,
    },
  } as const);
};
