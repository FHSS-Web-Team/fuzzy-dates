import { isMonth, MONTH_NAME_MAP } from './maps';
import { err, ok } from '../../helpers/result';
import { Precision } from '../../helpers/types';

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

  return err('Unknown month.' as const);
}
