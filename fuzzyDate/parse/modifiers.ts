import { err, ok } from '../helpers/result';
import { parseSimpleDate } from './stringToDate';

export function none(input: string, approximate: boolean) {
  const result = parseSimpleDate(input);
  if (!result.ok) return result;
  const date = result.value;

  return ok({
    type: 'simple',
    approximate,
    date,
  } as const);
}

export function before(input: string, approximate: boolean) {
  const result = parseSimpleDate(input);
  if (!result.ok) return result;

  return ok({
    type: 'range',
    approximate,
    start: null,
    end: result.value,
  } as const);
}

export function after(input: string, approximate: boolean) {
  const result = parseSimpleDate(input);
  if (!result.ok) return result;

  return ok({
    type: 'range',
    approximate,
    start: result.value,
    end: null,
  } as const);
}

export function between(input: string) {
  const dates = input.slice('between '.length).split(' and ');
  if (dates.length !== 2) return err('Invalid "BETWEEN" modifier.' as const);

  const startResult = parseSimpleDate(dates[0]);
  if (!startResult.ok) return startResult;

  const endResult = parseSimpleDate(dates[1]);
  if (!endResult.ok) return endResult;

  return ok({
    type: 'range',
    approximate: true,
    start: startResult.value,
    end: endResult.value,
  } as const);
}

export function from(input: string, approximate: boolean) {
  const dates = input.slice('from '.length).split(' to ');
  if (dates.length !== 2) return err('Invalid "FROM" modifier.' as const);

  const startResult = parseSimpleDate(dates[0]);
  if (!startResult.ok) return startResult;

  const endResult = parseSimpleDate(dates[1]);
  if (!endResult.ok) return endResult;

  return ok({
    type: 'range',
    approximate,
    start: startResult.value,
    end: endResult.value,
  } as const);
}
