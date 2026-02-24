import { DATE_NEG_INFINITY, DATE_POS_INFINITY } from '../helpers/constants';
import { err, ok } from '../helpers/result';
import { stringToSimpleDate } from './stringToDate';

export const none = (cleanedInput: string) => {
  const result = stringToSimpleDate(cleanedInput);
  if (!result.ok) return result;
  const date = result.value;

  return ok({
    modifier: 'NONE',
    start: {
      format: date.format,
      min: date.min,
      max: date.max,
    },
    end: {
      format: date.format,
      min: date.min,
      max: date.max,
    },
  } as const);
};

export const before = (cleanedInput: string) => {
  const result = stringToSimpleDate(cleanedInput.slice('before '.length));
  if (!result.ok) return result;
  const date = result.value;

  return ok({
    modifier: 'BEFORE',
    start: {
      format: date.format,
      min: DATE_NEG_INFINITY,
      max: DATE_NEG_INFINITY,
    },
    end: {
      format: date.format,
      min: date.min,
      max: date.max,
    },
  } as const);
};

export const after = (cleanedInput: string) => {
  const result = stringToSimpleDate(cleanedInput.slice('after '.length));
  if (!result.ok) return result;
  const date = result.value;

  return ok({
    modifier: 'AFTER',
    start: {
      format: date.format,
      min: date.min,
      max: date.max,
    },
    end: {
      format: date.format,
      min: DATE_POS_INFINITY,
      max: DATE_POS_INFINITY,
    },
  } as const);
};

export const about = (cleanedInput: string) => {
  const result = stringToSimpleDate(cleanedInput.slice('about '.length));
  if (!result.ok) return result;
  const date = result.value;

  return ok({
    modifier: 'ABOUT',
    start: {
      format: date.format,
      min: date.min,
      max: date.max,
    },
    end: {
      format: date.format,
      min: date.min,
      max: date.max,
    },
  } as const);
};

export const between = (cleanedInput: string) => {
  const dates = cleanedInput.slice('between '.length).split(' and ');
  if (dates.length !== 2) return err('Invalid "BETWEEN" modifier.' as const);

  const startResult = stringToSimpleDate(dates[0]);
  const endDateResult = stringToSimpleDate(dates[1]);
  if (!startResult.ok) return startResult;
  if (!endDateResult.ok) return endDateResult;
  const start = startResult.value;
  const end = endDateResult.value;

  return ok({
    modifier: 'BETWEEN',
    start: {
      format: start.format,
      min: start.min,
      max: start.max,
    },
    end: { format: end.format, min: end.min, max: end.max },
  } as const);
};

export const from = (cleanedInput: string) => {
  const dates = cleanedInput.slice('from '.length).split(' to ');
  if (dates.length !== 2) return err('Invalid "FROM" modifier.' as const);

  const startResult = stringToSimpleDate(dates[0]);
  const endDateResult = stringToSimpleDate(dates[1]);
  if (!startResult.ok) return startResult;
  if (!endDateResult.ok) return endDateResult;
  const start = startResult.value;
  const end = endDateResult.value;

  return ok({
    modifier: 'FROM',
    start: {
      format: start.format,
      min: start.min,
      max: start.max,
    },
    end: { format: end.format, min: end.min, max: end.max },
  } as const);
};
