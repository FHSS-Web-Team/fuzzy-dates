import { err } from '../../helpers/result';
import {
  dayMonthDigitYear,
  dayMonthStringYear,
  monthDigitYear,
  monthStringDayYear,
  monthStringYear,
  year,
  yearMonthDigitDay,
  yearDayMonthString,
  yearMonthDigit,
  yearMonthString,
  yearMonthStringDay,
} from './formats';

export function parseSimpleDate(input: string) {
  const parsers = [
    year,
    monthStringYear,
    yearMonthString,
    dayMonthStringYear,
    monthStringDayYear,
    yearMonthStringDay,
    yearDayMonthString,
    monthDigitYear,
    yearMonthDigit,
    dayMonthDigitYear,
    yearMonthDigitDay,
  ];

  for (const parseFormat of parsers) {
    const result = parseFormat(input);
    if (result) return result;
  }

  return err('Unknown date format.' as const);
}
