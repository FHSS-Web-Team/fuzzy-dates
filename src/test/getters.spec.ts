import { describe, expect, it } from 'vitest';
import { DATE_NEG_INFINITY, DATE_POS_INFINITY } from '../helpers/constants';
import { parseOrFail } from './helpers';

describe('Fuzzy Date getters', () => {
  it('exposes earliest/latest bounds for open and closed intervals', () => {
    const before = parseOrFail('before 1900');
    expect(before.earliest.getTime()).toBe(DATE_NEG_INFINITY.getTime());
    expect(before.latest.toISOString()).toBe('1900-12-31T23:59:59.999Z');

    const after = parseOrFail('after 1900');
    expect(after.earliest.toISOString()).toBe('1900-01-01T00:00:00.000Z');
    expect(after.latest.getTime()).toBe(DATE_POS_INFINITY.getTime());

    const exact = parseOrFail('1 jan 1900');
    expect(exact.earliest.toISOString()).toBe('1900-01-01T00:00:00.000Z');
    expect(exact.latest.toISOString()).toBe('1900-01-01T23:59:59.999Z');
  });

  it('exposes approximate and collation tuple semantics', () => {
    expect(parseOrFail('about jan 1900').approximate).toBeTruthy();
    expect(parseOrFail('jan 1900').approximate).toBeFalsy();
    expect(parseOrFail('between 1900 and 1901').approximate).toBeTruthy();

    expect(parseOrFail('before 1900').collationKeys[1]).toBe(-1);
    expect(parseOrFail('1900').collationKeys[1]).toBe(0);
    expect(parseOrFail('after 1900').collationKeys[1]).toBe(1);

    expect(parseOrFail('about 1 jan 1900').collationKeys[3]).toBe(0);
    expect(parseOrFail('1 jan 1900').collationKeys[3]).toBe(1);

    expect(parseOrFail('1900').collationKeys[2]).toBeLessThan(
      parseOrFail('January 1900').collationKeys[2]
    );
  });
});
