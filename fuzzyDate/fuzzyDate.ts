import { parse } from './parse/index';
import { normalize } from './normalize/normalize';
import { toGedcomX } from './gedcomX/toGedcomX';
import { FuzzyDateModel } from './helpers/types';
import { ok } from './helpers/result';
import { DATE_NEG_INFINITY, DATE_POS_INFINITY } from './helpers/constants';
import { collate } from './collation/collationKey';

/**
 * Represents an immutable, parsed fuzzy date suitable for genealogy and
 * historical data contexts.
 *
 * A `FuzzyDate` encapsulates a human-entered date expression
 * (e.g. `"before 1900"`, `"between 1 Jan 1900 and 31 Dec 1901"`,
 * `"March 1890"`) and exposes multiple *derived representations* optimized
 * for different use cases:
 *
 * - A canonical JSON model for storage and transport
 * - Query bounds for database filtering
 * - A collation key for stable chronological ordering
 * - A normalized, human-readable string form
 * - A GEDCOM X formal date representation
 *
 * ---
 *
 * ### Design principles
 *
 * - **Immutable**: Instances cannot be mutated after construction.
 * - **Explicit construction**: Instances must be created via `parse()`.
 *   Direct construction via `new` is intentionally disallowed.
 * - **Derived projections**: Query bounds and collation keys
 *   are all derived from a single internal model to guarantee consistency.
 * - **UTC semantics**: All date calculations and comparisons are performed
 *   using UTC to avoid timezone-related ambiguity.
 *
 * ---
 *
 * ### Intended usage
 *
 * - Use `parse()` for untrusted, human-entered input.
 * - Store `lowerBound`, `upperBound`, and `collationKeys` separately for
 *   efficient querying and ordering.
 */
export class FuzzyDate {
  /**
   * Canonical internal model representing the parsed fuzzy date.
   *
   * This model is considered the single source of truth; all other
   * representations are derived from it.
   */
  private _model: FuzzyDateModel;

  /**
   * Private constructor to enforce factory-based creation.
   *
   * Consumers must use {@link FuzzyDate.parse}.
   */
  private constructor(model: FuzzyDateModel) {
    this._model = model;
  }

  /**
   * GEDCOM X formal date representation of this fuzzy date.
   *
   * This value is suitable for interoperability with genealogy systems
   * that support the GEDCOM X date specification.
   *
   * @see https://github.com/FamilySearch/gedcomx/blob/master/specifications/date-format-specification.md
   *
   * @remarks
   * This representation is derived and may evolve as GEDCOM X mapping
   * rules are refined.
   */
  get formal(): string {
    return toGedcomX(this._model);
  }

  /**
   * Normalized, human-readable representation of the fuzzy date.
   *
   * This format represents the interpreted meaning of the original input
   * using a standardized vocabulary and ordering.
   *
   * Example outputs:
   * - `"before 1900"`
   * - `"March 1890"`
   * - `"between 1 Jan 1900 and 31 Dec 1901"`
   */
  get normalized(): string {
    return normalize(this._model);
  }

  /**
   * The inclusive lower bound of this fuzzy date's possible interval (UTC).
   *
   * This bound is intended for **endpoint-in-window** searching:
   * a fuzzy date matches an inclusive search range `[searchStart, searchEnd]`
   * if **either** its `earliest` **or** its `latest` falls within the
   * search range.
   *
   * ```text
   * (searchStart <= earliest <= searchEnd) OR (searchStart <= latest <= searchEnd)
   * ```
   *
   * @remarks
   * - Always interpreted as UTC.
   */
  get earliest(): Date {
    return this._model.start?.min ?? DATE_NEG_INFINITY;
  }

  /**
   * The inclusive upper bound of this fuzzy date's possible interval (UTC).
   *
   * This bound is intended for **endpoint-in-window** searching:
   * a fuzzy date matches an inclusive search range `[searchStart, searchEnd]`
   * if **either** its `earliest` **or** its `latest` falls within the
   * search range.
   *
   * ```text
   * (searchStart <= earliest <= searchEnd) OR (searchStart <= latest <= searchEnd)
   * ```
   *
   * @remarks
   * - Always interpreted as UTC.
   */
  get latest(): Date {
    return this._model.end?.max ?? DATE_POS_INFINITY;
  }

  /**
   * A lexicographically sortable tuple representing this fuzzy date.
   *
   * Sort **ascending** by each element in order to achieve correct chronological ordering.
   *
   * Tuple structure:
   *
   * 1. `primary` (number)
   *    - Epoch milliseconds used as the primary chronological anchor.
   *    - For closed ranges and simple dates: the start minimum.
   *    - For left-open ranges: the end minimum.
   *    - For right-open ranges: the start maximum.
   *
   * 2. `timeRelation` (-1 | 0 | 1)
   *    - Distinguishes range type.
   *    - `-1` → left-open range  (… end)
   *    - `0`  → closed range or simple date
   *    - `1`  → right-open range (start …)
   *
   * 3. `range` (number)
   *    - Total span of the range in milliseconds.
   *    - For simple dates, this represents the precision window.
   *    - Wider ranges sort before smaller ones.
   *
   * 4. `approximate` (0 | 1)
   *    - `0` → approximate
   *    - `1` → exact
   *    - Approximate values sort first.
   *
   * Example (SQL):
   *
   * ```sql
   * ORDER BY primary ASC,
   *          timeRelation ASC,
   *          range ASC,
   *          approximate ASC
   * ```
   */
  get collationKeys(): readonly [number, -1 | 0 | 1, number, 0 | 1] {
    return collate(this._model);
  }

  /**
   * Gets whether the date is marked as approximate.
   *
   * @returns True if the underlying model marks the date as approximate; otherwise false.
   */
  get approximate(): boolean {
    return this._model.approximate;
  }

  /**
   * Parses a human-readable date string into a `FuzzyDate`.
   *
   * This method should be used for all untrusted or user-provided input.
   *
   * @param input Human-readable date expression.
   * @returns A result object containing either a `FuzzyDate` or parse issues.
   *
   * @remarks
   * - Parsing is non-throwing; errors are returned as structured issues.
   * - Successful results are guaranteed to produce a valid canonical model.
   */
  static parse(input: string) {
    const result = parse(input);
    if (!result.ok) return result;
    const date = new FuzzyDate(result.value);
    return ok(date);
  }

  /**
   * Comparator for sorting {@link FuzzyDate} instances chronologically.
   *
   * This method performs a lexicographic ascending comparison using each
   * instance’s {@link FuzzyDate.collationKeys} tuple.
   *
   * Sort precedence (ascending):
   * 1. Primary epoch anchor (milliseconds)
   * 2. Time relation (-1 | 0 | 1)
   * 3. Range span (milliseconds)
   * 4. Approximate flag (0 = approximate, 1 = exact)
   *
   * Designed for use with `Array.prototype.sort`.
   *
   * @param a - The first {@link FuzzyDate} to compare.
   * @param b - The second {@link FuzzyDate} to compare.
   * @returns
   * - A negative number if `a` should sort before `b`
   * - A positive number if `a` should sort after `b`
   * - `0` if they are considered equivalent for sorting
   *
   * @example
   * ```ts
   * dates.sort(FuzzyDate.sort);
   * ```
   */
  static sort(a: FuzzyDate, b: FuzzyDate) {
    return (
      a.collationKeys[0] - b.collationKeys[0] ||
      a.collationKeys[1] - b.collationKeys[1] ||
      a.collationKeys[2] - b.collationKeys[2] ||
      a.collationKeys[3] - b.collationKeys[3]
    );
  }

  /**
   * Filters dates using endpoint-in-window semantics.
   *
   * A date matches when either endpoint (`earliest` or `latest`) is inside
   * the inclusive UTC window `[searchStart, searchEnd]`.
   *
   * @param searchStart Inclusive window start (UTC).
   * @param searchEnd Inclusive window end (UTC).
   * @param dates Collection of fuzzy dates to evaluate.
   * @returns Sublist of dates that match the query.
   */
  static query(
    searchStart: Date,
    searchEnd: Date,
    dates: readonly FuzzyDate[]
  ): FuzzyDate[] {
    return dates.filter(
      (date) =>
        (searchStart <= date.earliest && date.earliest <= searchEnd) ||
        (searchStart <= date.latest && date.latest <= searchEnd)
    );
  }
}
