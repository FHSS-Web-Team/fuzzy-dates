import { err } from '../types';
import {
  dayMonthDigitYear,
  dayMonthStringYear,
  decade,
  monthDigitYear,
  monthStringDayYear,
  monthStringYear,
  year,
  yearMonthDigitDay,
  yearDayMonthString,
  yearMonthDigit,
  yearMonthString,
  yearMonthStringDay,
} from './inputDateFormats';

export function stringToDate(dateInput: string) {
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
    decade,
  ];

  for (const parseFormat of parsers) {
    const result = parseFormat(dateInput);
    if (result) return result;
  }

  return err('Unknown date format.' as const);
}
