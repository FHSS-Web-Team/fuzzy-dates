import { assert, describe, expect, it } from 'vitest';
import { FuzzyDate } from './fuzzyDate';

describe('Fuzzy Date', () => {
  it('errs if it parses an invalid date', () => {
    const unknownDate = FuzzyDate.parse('a');
    expect(unknownDate).toStrictEqual({
      ok: false,
      error: 'Unknown date format.',
    });

    const invalidBetween = FuzzyDate.parse('between 1900');
    expect(invalidBetween).toStrictEqual({
      ok: false,
      error: 'Invalid "BETWEEN" modifier.',
    });

    const invalidFrom = FuzzyDate.parse('from 1900');
    expect(invalidFrom).toStrictEqual({
      ok: false,
      error: 'Invalid "FROM" modifier.',
    });

    const invalidMonth = FuzzyDate.parse('jam 1900');
    expect(invalidMonth).toStrictEqual({
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
      '  ---___////,,,,    sEpTeMbEr 30  th ,,,   ---// 1984':
        '30 September 1984',
    };

    for (const [key, value] of Object.entries(formats)) {
      const result = FuzzyDate.parse(key);
      let normal;
      if (result.ok) {
        normal = result.value.normalized;
      } else {
        normal = result.error;
      }
      expect(normal).toStrictEqual(value);
    }
  });

  it('parses range inputs', () => {
    const parse = {
      'before 1st of February 1900': 'before 1 February 1900',
      'after 1st of February 1900': 'after 1 February 1900',
      'about 1st of February 1900': 'about 1 February 1900',
      'between 1st of February 1900 and 18/03/1905':
        'between 1 February 1900 and 18 March 1905',
      'from 1st of February 1900 to 18/03/1905':
        'from 1 February 1900 to 18 March 1905',
    };

    Object.entries(parse).forEach(([input, expected]) => {
      const result = FuzzyDate.parse(input);
      let normal;
      if (result.ok) {
        normal = result.value.normalized;
      } else {
        normal = result.error;
      }
      expect(normal).toStrictEqual(expected);
    });
  });

  it('orders dates in chronological order', () => {
    const order = [
      '1999',
      'before 2000',
      'before jan 2000',
      'before 1 jan 2000',
      'between 2000 and 2001',
      'from 2000 to 2001',
      'between 2000 and jan 2001',
      'from 2000 to jan 2001',
      'between 2000 and 1 jan 2001',
      'from 2000 to 1 jan 2001',
      'about 2000',
      '2000',
      'about jan 2000',
      'jan 2000',
      'about jan 1 2000',
      '1 jan 2000',
      'after 1 jan 2000',
      '2 jan 2000',
      'after jan 2000',
      '31 dec 2000',
      'after 2000',
      '',
    ];

    for (let i = 1; i < order.length - 1; i++) {
      const previous = FuzzyDate.parse(order[i - 1]);
      const current = FuzzyDate.parse(order[i]);
      if (!previous.ok || !current.ok)
        return assert.fail('failed to parse input');

      expect(FuzzyDate.sort(previous.value, current.value) < 0).toBeTruthy();
    }
  });
});
