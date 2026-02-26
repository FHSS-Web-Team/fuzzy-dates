# Fuzzy Dates

Parse imprecise, human-entered date strings into a structured, consistent model that you can normalize, search, sort, and serialize.

Explore the docs

## Features

- Handles modifiers like `before`, `after`, `about`, `between`, `from`.
- Normalizes many input shapes (`1st of February 1900`, `Feb 1 1900`, `winter 1890`, `1800s`).
- Produces inclusive lower/upper bounds for range filtering and a collation keys for stable chronological sorting.
- Outputs a GEDCOM X formal dates for genealogy interoperability.
- ESM + TypeScript ready (`.d.ts` shipped with the package).

## Installation

```bash
npm i @fhss-web-team/fuzzy-dates
```

## Quick start

```ts
import { FuzzyDate } from '@fhss-web-team/fuzzy-dates';

const parsed = FuzzyDate.parse('about Feb 1900');
if (!parsed.ok) throw parsed.error;

const date = parsed.value;
console.log(date.normalized); // "about 1 February 1900"
console.log(date.earliest); // 1899-02-01T00:00:00.000Z (Date)
console.log(date.latest); // 1901-01-31T23:59:59.999Z (Date)
console.log(date.collationKeys); // deterministic keys for sorting
```

## API snapshot

- `FuzzyDate.parse(input: string): Result<FuzzyDate, string>` — non-throwing parse; errors come back as `{ ok: false, error }`.
- `FuzzyDate.fromJSON(model: FuzzyDateModel)` — rebuild from the canonical JSON model.
- `FuzzyDate` instance properties:
  - `normalized` — normalized human-readable string.
  - `earliest` / `latest` — inclusive Date bounds (or `null` for unbounded).
  - `collationKeys` — tuple of integer keys used for sorting.
  - `formal` — GEDCOM X formal date representation.

## Development

- Tests: `npm test` (Vitest)
- Build: `npm run build` (TypeScript -> `dist/`)
- Pack locally (publish dry-run): `npm pack` then install the generated `.tgz` in a temp project to verify exports and typings.

## Support

This package was developed by the [BYU's Center for Family History and Genealogy](https://cfhg.byu.edu/). To support
our mission to provide quality online family history research and resources for the public at no cost, consider donating [HERE](https://donate.churchofjesuschrist.org/contribute/byu/family-home-social-sciences/center-family-history-genealogy)

## License

MIT © FHSS Web Team
