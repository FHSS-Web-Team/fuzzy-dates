import { after, before, between, from, none } from './modifiers';
import { Precision, SimpleDate } from '../helpers/types';
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

  const approximate =
    cleanedInput.startsWith('about ') ||
    cleanedInput.startsWith('approximately ') ||
    cleanedInput.startsWith('around ');

  const removeApproximate = cleanedInput.slice(0, cleanedInput.indexOf(' '));

  if (removeApproximate.startsWith('before '))
    return before(removeApproximate, approximate);
  if (removeApproximate.startsWith('after '))
    return after(removeApproximate, approximate);
  if (removeApproximate.startsWith('between '))
    return between(removeApproximate);
  if (removeApproximate.startsWith('from '))
    return from(removeApproximate, approximate);

  return none(removeApproximate, approximate);
}

// Helpers
export function getTimes(date: SimpleDate) {
  const start = date.min.getTime();
  const end = date.max.getTime() + 1; //FIXME: Reconsider - Adds a milisecond for accurate date calculations
  const half = (end - start) / 2;
  return { start, end, half };
}

export function calculateMaxDate(start: Date, precision: Precision) {
  const endDate = new Date(start);

  if (precision === 'Year') {
    endDate.setUTCFullYear(endDate.getUTCFullYear() + 1);
  } else if (precision === 'Season') {
    endDate.setUTCMonth(endDate.getUTCMonth() + 3);
  } else if (precision === 'Month') {
    endDate.setUTCMonth(endDate.getUTCMonth() + 1);
  } else if (precision === 'Day') {
    endDate.setUTCDate(endDate.getUTCDate() + 1);
  } else if (precision === 'Hour') {
    endDate.setUTCHours(endDate.getUTCHours() + 1);
  } else if (precision === 'Minute') {
    endDate.setUTCMinutes(endDate.getUTCMinutes() + 1);
  } else {
    endDate.setUTCSeconds(endDate.getUTCSeconds() + 1);
  }

  endDate.setUTCMilliseconds(-1);
  return endDate;
}

export function parseDateGroups(groups: {
  day?: string;
  month?: string;
  year?: string;
}) {
  if (!groups.year) return err('Year is required.' as const);
  const year = parseInt(groups.year);

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
