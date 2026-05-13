import { err } from '../../helpers/result.js';
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
  dayStringMonthStringYear,
} from './formats.js';

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
    dayStringMonthStringYear,
  ];

  for (const parseFormat of parsers) {
    const result = parseFormat(input);
    if (result) return result;
  }

  return err('Unknown date format.' as const);
}
