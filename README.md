# Fuzzy Dates

Parse human-entered fuzzy date text into a consistent model you can use to:
- normalize display text,
- filter with inclusive UTC bounds,
- sort chronologically with deterministic keys,
- serialize to GEDCOM X formal dates.

## Installation

```bash
npm i @fhss-web-team/fuzzy-dates
```

## Quick start

```ts
import { FuzzyDate } from '@fhss-web-team/fuzzy-dates';

const parsed = FuzzyDate.parse('about Feb 1900');
if (!parsed.ok) throw new Error(parsed.error);

const date = parsed.value;
console.log(date.normalized); // "about February 1900"
console.log(date.earliest.toISOString()); // "1900-02-01T00:00:00.000Z"
console.log(date.latest.toISOString()); // "1900-02-28T23:59:59.999Z"
console.log(date.collationKeys); // [primary, timeRelation, range, approximate]
console.log(date.formal); // "A+1900-02"
```

## API

### `FuzzyDate.parse(input: string): Result<FuzzyDate, string>`
Non-throwing parse entrypoint.

- Success shape: `{ ok: true, value: FuzzyDate }`
- Error shape: `{ ok: false, error: string }`

### `FuzzyDate.sort(a: FuzzyDate, b: FuzzyDate): number`
Comparator for chronological ordering.

```ts
dates.sort(FuzzyDate.sort);
```

### `FuzzyDate.query(searchStart: Date, searchEnd: Date, dates: readonly FuzzyDate[]): FuzzyDate[]`
Filters using endpoint-in-window logic (inclusive):

```text
(searchStart <= earliest <= searchEnd) OR (searchStart <= latest <= searchEnd)
```

This is intentionally different from generic interval-overlap matching.

### Instance getters

- `normalized: string`  
  Standardized human-readable expression.
- `formal: string`  
  GEDCOM X formal date representation.
- `approximate: boolean`  
  Whether the parsed expression is marked approximate.
- `earliest: Date` / `latest: Date`  
  Inclusive UTC bounds. Open-ended ranges are represented with sentinel values:
  - `before ...` uses `earliest = new Date(-8640000000000000)`
  - `after ...` uses `latest = new Date(8640000000000000)`
- `collationKeys: readonly [number, -1 | 0 | 1, number, 0 | 1]`  
  Keys used by `FuzzyDate.sort`.

## Supported input

### Modifiers

- `about ...`, `approximately ...`, `around ...`
- `before ...`
- `after ...`
- `between ... and ...`
- `from ... to ...`

Notes:
- `between ... and ...` is treated as approximate.
- `from ... to ...` is exact unless prefixed with an approximation modifier.

### Simple date forms

Supported orderings include:
- `YYYY`
- `month YYYY` / `YYYY month` (named month, numeric month, or season)
- `day month YYYY`
- `month day YYYY`
- `YYYY month day`
- `YYYY day month`
- digit variants for month/day in those positions

Examples:
- `1900`
- `January 1900`, `1900 Jan`, `01 1900`, `1900 1`
- `1 Jan 1900`, `Jan 1 1900`, `1900 January 1`, `1900 1 Jan`
- `winter 1900`, `1900 autumn`

Input normalization steps:
- case-insensitive,
- strips ordinal suffixes (`1st`, `2nd`, `3rd`, `4th`, ...),
- treats punctuation/separators (`. , / - _`) as whitespace.

## Behavior details

- All parsing and bounds are UTC-based.
- Calendar-overflow dates are normalized by JavaScript `Date` semantics.
  - `29 feb 1900` normalizes to `1 March 1900`.
  - `31 apr 1900` normalizes to `1 May 1900`.
- Current year support is strictly four digits (`0000`-`9999` pattern in input).
- Decade shorthand like `1800s` is not currently supported.

## Development

- Tests: `npm test`
- Build: `npm run build`
- Package check: `npm pack`

## Support

This package was developed by the [BYU Center for Family History and Genealogy](https://cfhg.byu.edu/). To support our mission to provide quality online family history research and resources for the public at no cost, consider donating [here](https://donate.churchofjesuschrist.org/contribute/byu/family-home-social-sciences/center-family-history-genealogy).

## License

MIT © FHSS Web Team
