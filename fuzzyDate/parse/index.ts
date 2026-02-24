import { about, after, before, between, from, none } from './modifiers';
import { FuzzyDateFormat, SimpleDate } from '../helpers/types';
import { err, ok } from '../helpers/result';
import {
  isMonth,
  isSeason,
  MONTH_NAME_MAP,
  MONTH_SEASON_MAP,
} from '../helpers/maps';

// Main Parse Function
export function parse(input: string) {
  const cleanedInput = input
    .toLowerCase() // lowercases
    .replace(/(\d+)\s*(st|nd|rd|th|of)\b(\s*of)?/gi, '$1') // removes ordinal suffixes and 'of'
    .replace(/[.,/\-_]+/g, ' ') // replaces separators with spaces
    .replace(/\s+/g, ' ') // collapses multiple spaces to a single space
    .trim(); // Removes trailing and leading spaces

  if (cleanedInput.startsWith('before ')) return before(cleanedInput);
  if (cleanedInput.startsWith('after ')) return after(cleanedInput);
  if (cleanedInput.startsWith('between ')) return between(cleanedInput);
  if (cleanedInput.startsWith('from ')) return from(cleanedInput);
  // FIXME: should these be formats so that they can be combined with other modifiers?
  // notice that the above modifers all use two dates (start and end)
  // below they are closer to how we handle seasons.
  if (cleanedInput.startsWith('about ')) return about(cleanedInput);
  // family search does +-2 (probably precision) for about
  return none(cleanedInput);
}

// Helpers
export function getTimes(date: SimpleDate) {
  const start = date.min.getTime();
  const end = date.max.getTime() + 1; //FIXME: Reconsider - Adds a milisecond for accurate date calculations
  const half = (end - start) / 2;
  return { start, end, half };
}

export function calculateMaxDate(start: Date, format: FuzzyDateFormat) {
  const endDate = new Date(start);

  if (format === 'MMMM_YYYY') {
    endDate.setUTCMonth(endDate.getUTCMonth() + 1);
    endDate.setMilliseconds(-1);
  }
  if (format === 'SEASON_YYYY') {
    endDate.setUTCMonth(endDate.getUTCMonth() + 3);
    endDate.setMilliseconds(-1);
  }
  if (format === 'YYYY') {
    endDate.setUTCFullYear(endDate.getUTCFullYear() + 1);
    endDate.setUTCMilliseconds(-1);
  }
  if (format === 'YYYYs') {
    endDate.setUTCFullYear(endDate.getUTCFullYear() + 10);
    endDate.setUTCMilliseconds(-1);
  }
  if (format === 'D_MMMM_YYYY') {
    endDate.setUTCDate(endDate.getUTCDate() + 1);
    endDate.setUTCMilliseconds(-1);
  }

  return endDate;
}

export function parseDateGroups(groups: {
  day?: string;
  month?: string;
  year?: string;
  decade?: string;
}) {
  if (!groups.year && !groups.decade) return err('Year is required.' as const);
  const year = groups.decade
    ? Number(groups.decade.replace(/(\d+)s$/, '$1')) // 'YYYYs' -> 'YYYY'
    : Number(groups.year);

  let month = 0; //default to January
  if (groups.month) {
    const result = resolveMonth(groups.month.toLowerCase());
    if (!result.ok) return result;
    month = result.value.monthNumber;
  }

  let day = 1; //default to 1st day
  if (groups.day) {
    const dayToken = /^(?:0?[1-9]|[12][0-9]|3[01])$/.exec(groups.day)?.[0];
    if (!dayToken) return err('Unknown date format.' as const);
    day = Number(dayToken);
  }

  return ok({ date: new Date(Date.UTC(year, month, day)) });
}

function resolveMonth(rawMonth: string) {
  const monthToken = /^(?:0?[1-9]|1[0-2])$/.exec(rawMonth)?.[0]; //Matches 01-09 or 1-9 or 10-12
  if (monthToken) return ok({ monthNumber: Number(monthToken) - 1 }); //months are zero-based
  if (isMonth(rawMonth))
    return ok({ monthNumber: MONTH_NAME_MAP[rawMonth] - 1 });
  if (isSeason(rawMonth))
    return ok({ monthNumber: MONTH_SEASON_MAP[rawMonth] - 1 });

  return err('Unknown month.' as const);
}
