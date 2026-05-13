import { DAY_NAME_MAP, isDay, isMonth, MONTH_NAME_MAP } from './maps.js';
import { err, ok } from '../../helpers/result.js';
import { Precision } from '../../helpers/types.js';

export function calculateMaxDate(start: Date, precision: Precision) {
  const endDate = new Date(start);

  if (precision === 'Year') {
    endDate.setUTCFullYear(endDate.getUTCFullYear() + 1);
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
    const result = resolveMonth(groups.month);
    if (!result.ok) return result;
    month = result.value.monthNumber;
  }

  let day = 1; //default to 1st day
  if (groups.day) {
    const result = resolveDay(groups.day);
    if (!result.ok) return result;
    day = result.value.dayNumber;
  }

  return ok({ date: new Date(Date.UTC(year, month, day)) });
}

function resolveDay(rawDay: string) {
  const dayToken = /^(?:0?[1-9]|[12][0-9]|3[01])$/.exec(rawDay)?.[0]; //Matches 01-09 or 1-9 or 10-29 or 30-31
  if (dayToken) return ok({ dayNumber: Number(dayToken) });

  if (isDay(rawDay)) {
    return ok({ dayNumber: DAY_NAME_MAP[rawDay] });
  } else {
    return err('Unknown day.' as const);
  }
}

function resolveMonth(rawMonth: string) {
  const monthToken = /^(?:0?[1-9]|1[0-2])$/.exec(rawMonth)?.[0]; //Matches 01-09 or 1-9 or 10-12
  if (monthToken) return ok({ monthNumber: Number(monthToken) - 1 }); //months are zero-based

  if (isMonth(rawMonth)) {
    return ok({ monthNumber: MONTH_NAME_MAP[rawMonth] - 1 });
  } else {
    return err('Unknown month.' as const);
  }
}
