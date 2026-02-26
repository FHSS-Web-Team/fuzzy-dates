import { describe, expect, it } from 'vitest';
import { FuzzyDate } from '../fuzzyDate';
import { parseOrFail } from './helpers';

describe('Fuzzy Date.sort', () => {
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
      const previous = parseOrFail(order[i - 1]);
      const current = parseOrFail(order[i]);
      expect(FuzzyDate.sort(previous, current) < 0).toBeTruthy();
    }
  });

  it('is stable for equivalence and antisymmetric for non-equivalence', () => {
    const one = parseOrFail('1 jan 1900');
    const same = parseOrFail('1900 january 1');
    expect(FuzzyDate.sort(one, same)).toBe(0);
    expect(FuzzyDate.sort(same, one)).toBe(0);

    const later = parseOrFail('2 jan 1900');
    const ab = Math.sign(FuzzyDate.sort(one, later));
    const ba = Math.sign(FuzzyDate.sort(later, one));
    expect(ab).toBe(-1);
    expect(ba).toBe(1);
    expect(ab).toBe(-ba);
  });

  it('applies tie-breakers in collation-key order', () => {
    expect(
      FuzzyDate.sort(parseOrFail('before 1 jan 1900'), parseOrFail('1 jan 1900'))
    ).toBeLessThan(0);

    expect(
      FuzzyDate.sort(parseOrFail('january 1900'), parseOrFail('1 jan 1900'))
    ).toBeLessThan(0);

    expect(
      FuzzyDate.sort(parseOrFail('about 1 jan 1900'), parseOrFail('1 jan 1900'))
    ).toBeLessThan(0);
  });
});
