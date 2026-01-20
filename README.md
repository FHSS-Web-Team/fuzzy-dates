# CFHG Fuzzy Dates

Parse imprecise, human-entered date strings into a structured, consistent model that you can normalize, search, sort, and serialize.

## Features
- Handles modifiers like `before`, `after`, `about`, `between`, `from`, `early`, `mid`, `late`.
- Normalizes many input shapes (`1st of February 1900`, `Feb 1 1900`, `winter 1890`, `1800s`).
- Produces inclusive lower/upper bounds for range filtering and a collation key for stable chronological sorting.
- Outputs a canonical JSON model plus GEDCOM X formal dates for genealogy interoperability.
- ESM + TypeScript ready (`.d.ts` shipped with the package).

## Installation
```bash
npm install cfhg-fuzzy-dates
```

## Quick start
```ts
import { FuzzyDate } from 'cfhg-fuzzy-dates';

const parsed = FuzzyDate.parse('about Feb 1900');
if (!parsed.ok) throw parsed.error;

const date = parsed.value;
console.log(date.normalized);   // "about 1 February 1900"
console.log(date.lowerBound);   // 1899-02-01T00:00:00.000Z (Date)
console.log(date.upperBound);   // 1901-01-31T23:59:59.999Z (Date)
console.log(date.collationKey); // deterministic string for sorting

// Serialize for storage and hydrate later
const json = date.toJSON();
const hydrated = FuzzyDate.fromJSON(json);
```

## API snapshot
- `FuzzyDate.parse(input: string): Result<FuzzyDate, string>` — non-throwing parse; errors come back as `{ ok: false, error }`.
- `FuzzyDate.fromJSON(model: FuzzyDateModel)` — rebuild from the canonical JSON model.
- `FuzzyDate` instance properties:
  - `original` — original input string.
  - `normalized` — normalized human-readable string.
  - `lowerBound` / `upperBound` — inclusive Date bounds (or `null` for unbounded).
  - `collationKey` — sortable string aligned to chronological order.
  - `formal` — GEDCOM X formal date representation.
  - `toJSON()` — returns the canonical model.

## Development
- Tests: `npm test` (Vitest)
- Build: `npm run build` (TypeScript -> `dist/`)
- Pack locally (publish dry-run): `npm pack` then install the generated `.tgz` in a temp project to verify exports and typings.

## License
MIT © FHSS Web Team
