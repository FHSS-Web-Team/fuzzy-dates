import { FORMAT_ORDER, FuzzyDateModel, MODIFIER_ORDER } from '../types';

export function collate(model: FuzzyDateModel): string {
  const date1 = model.start.minDate.toISOString();
  const modifier = MODIFIER_ORDER.indexOf(model.modifier)
    .toString()
    .padStart(2, '0');
  const format1 = FORMAT_ORDER.indexOf(model.start.format)
    .toString()
    .padStart(2, '0');
  const date2 = model.end.minDate.toISOString();
  const format2 = FORMAT_ORDER.indexOf(model.end.format)
    .toString()
    .padStart(2, '0');

  return `${date1}|${modifier}|${format1}|${date2}|${format2}`;
}
