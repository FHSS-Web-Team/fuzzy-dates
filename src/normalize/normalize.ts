import { isSeasonMonth, SEASON_MONTH_MAP } from '../parse/simpleDate/maps';
import { FuzzyDateModel, isRange, SimpleDate } from '../helpers/types';

export function normalize(model: FuzzyDateModel) {
  const startDate = normalizeSimple(model.start);
  const endDate = normalizeSimple(model.end);

  if (isRange(model)) {
    if (startDate === null) {
      return `${model.approximate ? 'approximately ' : ''}before ${endDate}`;
    }

    if (endDate === null) {
      return `${model.approximate ? 'approximately ' : ''}after ${startDate}`;
    }

    if (model.approximate) {
      return `between ${startDate} and ${endDate}`;
    } else {
      return `from ${startDate} to ${endDate}`;
    }
  } else {
    return `${model.approximate ? 'about ' : ''}${startDate}`;
  }
}

function normalizeSimple(input: SimpleDate | null) {
  if (input === null) return null;

  const precision = input.precision;
  const date = input.min;

  const options: Intl.DateTimeFormatOptions = { timeZone: 'UTC' };
  switch (precision) {
    case 'Year':
      options.year = 'numeric';
      break;

    case 'Season': {
      const month = date.getUTCMonth() + 1;
      if (!isSeasonMonth(month)) return '';
      return `${SEASON_MONTH_MAP[month]} ${date.getUTCFullYear()}`;
    }

    case 'Month':
      options.month = 'long';
      options.year = 'numeric';
      break;

    case 'Day':
      options.day = 'numeric';
      options.month = 'long';
      options.year = 'numeric';
      break;
  }

  return date.toLocaleDateString('en-GB', options);
}
