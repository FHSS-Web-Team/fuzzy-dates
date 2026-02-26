import { FuzzyDateModel, isRange, SimpleDate } from '../helpers/types';

export function toGedcomX(model: FuzzyDateModel) {
  const startDate = toSimpleDate(model.start);
  const endDate = toSimpleDate(model.end);

  if (isRange(model)) {
    return `${model.approximate ? 'A' : ''}${startDate ?? ''}/${endDate ?? ''}`;
  } else {
    return `${model.approximate ? 'A' : ''}${startDate}`;
  }
}

function toSimpleDate(dateValue: SimpleDate | null) {
  if (dateValue === null) return null;

  const year = dateValue.min.getUTCFullYear();
  const month = dateValue.min.getUTCMonth() + 1;
  const day = dateValue.min.getUTCDate();
  const sign = year >= 0 ? '+' : '-';
  const yearAbs = Math.abs(year);

  const yyyy = String(yearAbs).padStart(4, '0');
  if (dateValue.precision === 'Year') return `${sign}${yyyy}`;

  const mm = String(month).padStart(2, '0');
  if (dateValue.precision === 'Month') return `${sign}${yyyy}-${mm}`;

  const dd = String(day).padStart(2, '0');
  return `${sign}${yyyy}-${mm}-${dd}`;
}
