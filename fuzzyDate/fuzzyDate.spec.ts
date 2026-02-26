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
      'approximately before 1st of February 1900':
        'approximately before 1 February 1900',
      'around after 1st of February 1900':
        'approximately after 1 February 1900',
      'between 1st of February 1900 and 18/03/1905':
        'between 1 February 1900 and 18 March 1905',
      'about between 1st of February 1900 and 18/03/1905':
        'between 1 February 1900 and 18 March 1905',
      'around between winter 1900 and summer 1901':
        'between winter 1900 and summer 1901',
      '  ---___////,,,,    BeTwEeN   1st  Feb  1900   and   18 03 1905   ':
        'between 1 February 1900 and 18 March 1905',
      'from 1st of February 1900 to 18/03/1905':
        'from 1 February 1900 to 18 March 1905',
      'approximately from winter 1900 to summer 1901':
        'between winter 1900 and summer 1901',
      '  ---___////,,,,    FrOm   1st  Feb  1900   to   18 03 1905   ':
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

  it('converts parsed dates to GEDCOM X formal format', () => {
    const formats = {
      '1900': '+1900',
      'January 1900': '+1900-01',
      '1 January 1900': '+1900-01-01',
      'winter 1900': '+1900-12',
      'spring 1900': '+1900-03',
      'autumn 1900': '+1900-09',
      'about January 1900': 'A+1900-01',
      'before 1900': '/+1900',
      'before January 1900': '/+1900-01',
      'after 1900': '+1900/',
      'after 1 January 1900': '+1900-01-01/',
      'approximately before 1900': 'A/+1900',
      'around after January 1900': 'A+1900-01/',
      'between 1900 and 1901': 'A+1900/+1901',
      'between spring 1900 and 1 January 1901': 'A+1900-03/+1901-01-01',
      'from 1 February 1900 to 18 March 1905': '+1900-02-01/+1905-03-18',
      'from winter 1900 to summer 1901': '+1900-12/+1901-06',
    };

    Object.entries(formats).forEach(([input, expected]) => {
      const result = FuzzyDate.parse(input);
      if (!result.ok) return assert.fail('failed to parse input');
      expect(result.value.formal).toStrictEqual(expected);
    });
  });

  it('queries using endpoint-in-window logic with earliest/latest bounds', () => {
    const dateInputs = [
      'before 1900',
      'before jan 1900',
      '1900',
      '1 jan 1900',
      'between 1899 and 1901',
      'after dec 1900',
      'before 1 jan 1900',
      'jan 1900',
      'dec 1900',
      '31 dec 1900',
      'between 1900 and 1902',
      'from 1 feb 1900 to 15 feb 1900',
    ];
    const dates = dateInputs.map((input) => {
      const result = FuzzyDate.parse(input);
      if (!result.ok) assert.fail(`failed to parse input: ${input}`);
      return result.value;
    });

    const utcStart = (year: number, month: number, day: number) =>
      new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const utcEnd = (year: number, month: number, day: number) =>
      new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    const cases = [
      {
        searchStart: utcStart(1900, 1, 1),
        searchEnd: utcEnd(1900, 1, 31),
        expected: [
          'before January 1900',
          '1900',
          '1 January 1900',
          'before 1 January 1900',
          'January 1900',
          'between 1900 and 1902',
        ],
      },
      {
        searchStart: utcStart(1899, 12, 31),
        searchEnd: utcEnd(1899, 12, 31),
        expected: [],
      },
      {
        searchStart: utcStart(1900, 12, 31),
        searchEnd: utcEnd(1900, 12, 31),
        expected: ['before 1900', '1900', 'December 1900', '31 December 1900'],
      },
      {
        searchStart: utcStart(1901, 1, 1),
        searchEnd: utcEnd(1901, 12, 31),
        expected: ['between 1899 and 1901'],
      },
      {
        searchStart: utcStart(1900, 12, 1),
        searchEnd: utcEnd(1900, 12, 31),
        expected: [
          'before 1900',
          '1900',
          'after December 1900',
          'December 1900',
          '31 December 1900',
        ],
      },
      {
        searchStart: utcStart(1900, 1, 1),
        searchEnd: utcEnd(1900, 1, 1),
        expected: [
          '1900',
          '1 January 1900',
          'before 1 January 1900',
          'January 1900',
          'between 1900 and 1902',
        ],
      },
      {
        searchStart: utcStart(1900, 1, 31),
        searchEnd: utcEnd(1900, 1, 31),
        expected: ['before January 1900', 'January 1900'],
      },
      {
        searchStart: utcStart(1900, 2, 1),
        searchEnd: utcEnd(1900, 2, 28),
        expected: ['from 1 February 1900 to 15 February 1900'],
      },
      {
        searchStart: utcStart(1899, 1, 1),
        searchEnd: utcEnd(1899, 1, 1),
        expected: ['between 1899 and 1901'],
      },
      {
        searchStart: utcStart(1901, 12, 31),
        searchEnd: utcEnd(1901, 12, 31),
        expected: ['between 1899 and 1901'],
      },
      {
        searchStart: utcStart(1902, 12, 31),
        searchEnd: utcEnd(1902, 12, 31),
        expected: ['between 1900 and 1902'],
      },
      {
        searchStart: utcStart(1900, 2, 15),
        searchEnd: utcEnd(1900, 2, 15),
        expected: ['from 1 February 1900 to 15 February 1900'],
      },
    ];

    for (const { searchStart, searchEnd, expected } of cases) {
      const result = FuzzyDate.query(searchStart, searchEnd, dates);
      expect(result.map((date) => date.normalized)).toStrictEqual(expected);
    }
  });
});
