import { assert, describe, expect, it } from 'vitest';
import { FuzzyDate } from '../fuzzyDate';

describe('Fuzzy Date formal (GEDCOM X)', () => {
  it('converts parsed dates to GEDCOM X formal format', () => {
    const formats = {
      '1900': '+1900',
      'January 1900': '+1900-01',
      '1 January 1900': '+1900-01-01',
      'about January 1900': 'A+1900-01',
      'before 1900': '/+1900',
      'before January 1900': '/+1900-01',
      'after 1900': '+1900/',
      'after 1 January 1900': '+1900-01-01/',
      'approximately before 1900': 'A/+1900',
      'around after January 1900': 'A+1900-01/',
      'between 1900 and 1901': 'A+1900/+1901',
      'from 1900 to 1901': '+1900/+1901',
      'from 1 February 1900 to 18 March 1905': '+1900-02-01/+1905-03-18',
    };

    for (const [input, expected] of Object.entries(formats)) {
      const result = FuzzyDate.parse(input);
      if (!result.ok) return assert.fail('failed to parse input');
      expect(result.value.formal).toStrictEqual(expected);
    }
  });
});
