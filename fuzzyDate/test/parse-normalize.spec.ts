import { describe, expect, it } from 'vitest';
import { FuzzyDate } from '../fuzzyDate';
import { parseOrFail } from './helpers';

describe('Fuzzy Date parse/normalize', () => {
  it('errs if it parses an invalid date', () => {
    expect(FuzzyDate.parse('a')).toStrictEqual({
      ok: false,
      error: 'Unknown date format.',
    });

    expect(FuzzyDate.parse('between 1900')).toStrictEqual({
      ok: false,
      error: 'Invalid "BETWEEN" modifier.',
    });

    expect(FuzzyDate.parse('from 1900')).toStrictEqual({
      ok: false,
      error: 'Invalid "FROM" modifier.',
    });

    expect(FuzzyDate.parse('jam 1900')).toStrictEqual({
      ok: false,
      error: 'Unknown month.',
    });
  });

  it('parses simple date input', () => {
    const formats = {
      '1800': '1800',
      'Winter 1800': 'winter 1800',
      '1800 Winter': 'winter 1800',
      'Jan 1800': 'January 1800',
      'January 1800': 'January 1800',
      '1800 Jan': 'January 1800',
      '1800 January': 'January 1800',
      '1 Jan 1800': '1 January 1800',
      '1 1800': 'January 1800',
      '01 1800': 'January 1800',
      '1800 1': 'January 1800',
      '1800 01': 'January 1800',
      '1 January 1800': '1 January 1800',
      '01 Jan 1800': '1 January 1800',
      '01 January 1800': '1 January 1800',
      'Jan 1 1800': '1 January 1800',
      'January 1 1800': '1 January 1800',
      'Jan 01 1800': '1 January 1800',
      'January 01 1800': '1 January 1800',
      '1800 Jan 1': '1 January 1800',
      '1800 January 1': '1 January 1800',
      '1800 Jan 01': '1 January 1800',
      '1800 January 01': '1 January 1800',
      '1800 1 Jan': '1 January 1800',
      '1800 1 January': '1 January 1800',
      '1800 01 Jan': '1 January 1800',
      '1800 01 January': '1 January 1800',
      '1 1 1800': '1 January 1800',
      '01 1 1800': '1 January 1800',
      '1 01 1800': '1 January 1800',
      '1800 1 1': '1 January 1800',
      '1800 01 1': '1 January 1800',
      '1800 1 01': '1 January 1800',
      '    1st    of    February    1900    ': '1 February 1900',
      'feb 1st, 1900': '1 February 1900',
      'February 1st, 1900': '1 February 1900',
      '  ---___////,,,,    sEpTeMbEr 30  th ,,,   ---// 1984': '30 September 1984',
    };

    for (const [input, expected] of Object.entries(formats)) {
      const result = FuzzyDate.parse(input);
      expect(result.ok ? result.value.normalized : result.error).toStrictEqual(expected);
    }
  });

  it('parses range inputs', () => {
    const formats = {
      'before 1st of February 1900': 'before 1 February 1900',
      'after 1st of February 1900': 'after 1 February 1900',
      'about 1st of February 1900': 'about 1 February 1900',
      'approximately before 1st of February 1900': 'approximately before 1 February 1900',
      'around after 1st of February 1900': 'approximately after 1 February 1900',
      'between 1st of February 1900 and 18/03/1905': 'between 1 February 1900 and 18 March 1905',
      'about between 1st of February 1900 and 18/03/1905':
        'between 1 February 1900 and 18 March 1905',
      'around between winter 1900 and summer 1901': 'between winter 1900 and summer 1901',
      '  ---___////,,,,    BeTwEeN   1st  Feb  1900   and   18 03 1905   ':
        'between 1 February 1900 and 18 March 1905',
      'from 1st of February 1900 to 18/03/1905': 'from 1 February 1900 to 18 March 1905',
      'approximately from winter 1900 to summer 1901': 'between winter 1900 and summer 1901',
      '  ---___////,,,,    FrOm   1st  Feb  1900   to   18 03 1905   ':
        'from 1 February 1900 to 18 March 1905',
    };

    for (const [input, expected] of Object.entries(formats)) {
      const result = FuzzyDate.parse(input);
      expect(result.ok ? result.value.normalized : result.error).toStrictEqual(expected);
    }
  });

  it('handles leap-year and calendar-edge dates deterministically', () => {
    expect(parseOrFail('29 feb 2000').normalized).toBe('29 February 2000');
    expect(parseOrFail('29 feb 1900').normalized).toBe('1 March 1900');
    expect(parseOrFail('31 apr 1900').normalized).toBe('1 May 1900');
  });
});
