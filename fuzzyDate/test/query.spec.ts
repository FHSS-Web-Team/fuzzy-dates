import { describe, expect, it } from 'vitest';
import { FuzzyDate } from '../fuzzyDate';
import { DATE_NEG_INFINITY, DATE_POS_INFINITY } from '../helpers/constants';
import { parseOrFail, utcEnd, utcStart } from './helpers';

describe('Fuzzy Date.query', () => {
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
    const dates = dateInputs.map((input) => parseOrFail(input));

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

  it('is inclusive at exact earliest/latest millisecond boundaries', () => {
    const day = parseOrFail('1 jan 1900');
    expect(FuzzyDate.query(day.earliest, day.earliest, [day]).map((d) => d.normalized)).toStrictEqual([
      '1 January 1900',
    ]);
    expect(FuzzyDate.query(day.latest, day.latest, [day]).map((d) => d.normalized)).toStrictEqual([
      '1 January 1900',
    ]);
  });

  it('returns an empty result when search window is reversed', () => {
    const dates = [parseOrFail('1900'), parseOrFail('before 1900')];
    const searchStart = utcStart(1901, 1, 1);
    const searchEnd = utcEnd(1900, 1, 1);
    expect(FuzzyDate.query(searchStart, searchEnd, dates)).toStrictEqual([]);
  });

  it('honors open-ended bounds via negative/positive infinity endpoints', () => {
    const before = parseOrFail('before 1900');
    const after = parseOrFail('after 1900');

    expect(
      FuzzyDate.query(DATE_NEG_INFINITY, utcEnd(1800, 1, 1), [before]).map((d) => d.normalized)
    ).toStrictEqual(['before 1900']);

    expect(
      FuzzyDate.query(utcStart(1950, 1, 1), DATE_POS_INFINITY, [after]).map((d) => d.normalized)
    ).toStrictEqual(['after 1900']);
  });
});
