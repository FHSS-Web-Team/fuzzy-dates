import {
  NormalFormat,
  FuzzyDateModel,
  SEASON_MONTH_MAP,
  FuzzyDateModifier,
  isSeasonMonth,
} from '../types';

// Main function
export function normalize(model: FuzzyDateModel) {
  const startDate = normalizeDate(model.start.minDate, model.start.format);
  const endDate = normalizeDate(model.end.minDate, model.end.format);

  const normalModifierMap: Record<FuzzyDateModifier, string> = {
    NONE: startDate,
    BEFORE: `before ${endDate}`,
    AFTER: `after ${startDate}`,
    EARLY: `early ${startDate}`,
    MID: `mid ${startDate}`,
    LATE: `late ${startDate}`,
    FROM: `from ${startDate} to ${endDate}`,
    BETWEEN: `between ${startDate} and ${endDate}`,
    ABOUT: `about ${startDate}`,
  };

  return normalModifierMap[model.modifier];
}

// Helpers
function normalizeDate(date: Date, format: NormalFormat) {
  const options: Intl.DateTimeFormatOptions = { timeZone: 'UTC' };
  switch (format) {
    case 'YYYY':
      options.year = 'numeric';
      break;

    case 'MMMM_YYYY':
      options.month = 'long';
      options.year = 'numeric';
      break;

    case 'D_MMMM_YYYY':
      options.day = 'numeric';
      options.month = 'long';
      options.year = 'numeric';
      break;

    case 'SEASON_YYYY': {
      const month = date.getUTCMonth() + 1;
      if (!isSeasonMonth(month)) return ''; // month always returns 1 - 12 so this should never happen
      return `${SEASON_MONTH_MAP[month]} ${date.getUTCFullYear()}`;
    }
    case 'YYYYs': {
      const year = date.getUTCFullYear();
      return `${year}s`;
    }
  }

  return date.toLocaleDateString('en-GB', options);
}
