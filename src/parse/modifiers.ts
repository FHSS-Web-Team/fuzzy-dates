import { err, ok } from '../helpers/result.js';
import { parseSimpleDate } from './simpleDate/parse.js';

export function none(rawInput: string) {
  const result = parseSimpleDate(rawInput);
  if (!result.ok) return result;
  const date = result.value;

  return ok({
    start: date,
    end: date,
  } as const);
}

export function before(rawInput: string) {
  const input = rawInput.slice('before '.length);
  const result = parseSimpleDate(input);
  if (!result.ok) return result;

  return ok({
    start: null,
    end: result.value,
  } as const);
}

export function after(rawInput: string) {
  const input = rawInput.slice('after '.length);
  const result = parseSimpleDate(input);
  if (!result.ok) return result;

  return ok({
    start: result.value,
    end: null,
  } as const);
}

export function between(rawInput: string) {
  const dates = rawInput.slice('between '.length).split(' and ');
  if (dates.length !== 2) return err('Invalid "BETWEEN" modifier.' as const);

  const endResult = parseSimpleDate(dates[1]);
  if (!endResult.ok) return endResult;

  let startResult;

  // FOR: "Between DD and DD MONTH YYYY"
  const dayDigit = /^(?:[1-9]|[12][0-9]|3[01])$/;
  if (dayDigit.test(dates[0])) {
    const endDateMax = endResult.value.max;
    const month = endDateMax
      .toLocaleString('en-US', { month: 'long' })
      .toLowerCase();
    const year = endDateMax.getFullYear().toString();

    startResult = parseSimpleDate(`${dates[0]} ${month} ${year}`);
    if (!startResult.ok) return startResult;
  } else {
    startResult = parseSimpleDate(dates[0]);
    if (!startResult.ok) return startResult;
  }

  return ok({
    start: startResult.value,
    end: endResult.value,
  } as const);
}

export function from(rawInput: string) {
  const dates = rawInput.slice('from '.length).split(' to ');
  if (dates.length !== 2) return err('Invalid "FROM" modifier.' as const);

  const startResult = parseSimpleDate(dates[0]);
  if (!startResult.ok) return startResult;

  const endResult = parseSimpleDate(dates[1]);
  if (!endResult.ok) return endResult;

  return ok({
    start: startResult.value,
    end: endResult.value,
  } as const);
}
