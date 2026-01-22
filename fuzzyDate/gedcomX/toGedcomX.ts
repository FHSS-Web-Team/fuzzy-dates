import { FuzzyDateModel, FuzzyDate, FuzzyDateValue } from '../helpers/types';

export function toGedcomX(model: FuzzyDateModel) {
  const startDate = toSimpleDate(model.start);
  const endDate = toSimpleDate(model.end);
  const gedcomModifierMap: Record<FuzzyDate, string> = {
    NONE: startDate,
    BEFORE: `/${endDate}`,
    AFTER: `${startDate}/`,
    EARLY: `${startDate}/${endDate}`,
    MID: `${startDate}/${endDate}`,
    LATE: `${startDate}/${endDate}`,
    FROM: `${startDate}/${endDate}`,
    BETWEEN: `${startDate}/${endDate}`,
    ABOUT: `A${startDate}`,
  };

  return gedcomModifierMap[model.modifier];
}

function toSimpleDate(dateValue: FuzzyDateValue) {
  const year = dateValue.minDate.getUTCFullYear();
  const month = dateValue.minDate.getUTCMonth() + 1;
  const day = dateValue.minDate.getUTCDate();
  const sign = year >= 0 ? '+' : '-';
  const yearAbs = Math.abs(year);

  const yyyy = String(yearAbs).padStart(4, '0');
  if (dateValue.format === 'YYYY' || dateValue.format === 'YYYYs')
    return `${sign}${yyyy}`;

  const mm = String(month).padStart(2, '0');
  if (dateValue.format === 'MMMM_YYYY' || dateValue.format === 'SEASON_YYYY')
    return `${sign}${yyyy}-${mm}`;

  const dd = String(day).padStart(2, '0');
  return `${sign}${yyyy}-${mm}-${dd}`;
}
