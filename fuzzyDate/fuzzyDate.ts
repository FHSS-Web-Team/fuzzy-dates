import { parse } from './parse/index';
import { normalize } from './normalize/normalize';
import { collate } from './collate/collate';
import { toGedcomX } from './gedcomX/toGedcomX';
import {
  DATE_NEG_INFINITY,
  DATE_POS_INFINITY,
  FuzzyDateModel,
  ok,
} from './types';

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
 * - **Explicit construction**: Instances must be created via `parse()` or
 *   `fromJSON()`. Direct construction via `new` is intentionally disallowed.
 * - **Derived projections**: Query bounds, collation keys, and serializations
 *   are all derived from a single internal model to guarantee consistency.
 * - **UTC semantics**: All date calculations and comparisons are performed
 *   using UTC to avoid timezone-related ambiguity.
 *
 * ---
 *
 * ### Intended usage
 *
 * - Use `parse()` for untrusted, human-entered input.
 * - Use `fromJSON()` when hydrating from a trusted serialized model
 *   (e.g. database JSON).
 * - Store the JSON model as the canonical representation.
 * - Store `lowerBound`, `upperBound`, and `collationKey` separately for
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
   * Consumers must use {@link FuzzyDate.parse} or {@link FuzzyDate.fromJSON}.
   */
  private constructor(model: FuzzyDateModel) {
    this._model = model;
  }

  /**
   * The original human-readable input string used to construct this fuzzy date.
   *
   * This value is preserved verbatim and is not normalized or modified.
   */
  get original() {
    return this._model.original;
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
  get formal() {
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
  get normalized() {
    return normalize(this._model);
  }

  /**
   * The inclusive lower bound of this fuzzy date's possible interval (UTC).
   *
   * This bound is intended for **endpoint-in-window** searching:
   * a fuzzy date matches an inclusive search range `[searchStart, searchEnd]`
   * if **either** its `lowerBound` **or** its `upperBound` falls within the
   * search range.
   *
   * Formally (inclusive):
   *
   * ```text
   * (searchStart <= lowerBound <= searchEnd) OR (searchStart <= upperBound <= searchEnd)
   * ```
   *
   * ## Unbounded intervals
   *
   * Open-ended intervals are represented with `null`:
   * - `lowerBound === null` means unbounded in the past (−∞)
   * - `upperBound === null` means unbounded in the future (+∞)
   *
   * When using the predicate above, treat a `null` bound as not satisfying
   * the endpoint check (i.e., it is not “within” any finite window).
   *
   * @remarks
   * - Derived from the canonical model.
   * - Always interpreted as UTC.
   */
  get lowerBound() {
    return this._model.start.minDate === DATE_NEG_INFINITY
      ? null
      : this._model.start.minDate;
  }

  /**
   * The inclusive upper bound of this fuzzy date's possible interval (UTC).
   *
   * This bound is intended for **endpoint-in-window** searching:
   * a fuzzy date matches an inclusive search range `[searchStart, searchEnd]`
   * if **either** its `lowerBound` **or** its `upperBound` falls within the
   * search range.
   *
   * Formally (inclusive):
   *
   * ```text
   * (searchStart <= lowerBound <= searchEnd) OR (searchStart <= upperBound <= searchEnd)
   * ```
   *
   * ## Unbounded intervals
   *
   * Open-ended intervals are represented with `null`:
   * - `lowerBound === null` means unbounded in the past (−∞)
   * - `upperBound === null` means unbounded in the future (+∞)
   *
   * When using the predicate above, treat a `null` bound as not satisfying
   * the endpoint check (i.e., it is not “within” any finite window).
   *
   * @remarks
   * - Derived from the canonical model.
   * - Always interpreted as UTC.
   */
  get upperBound() {
    return this._model.start.maxDate === DATE_POS_INFINITY
      ? null
      : this._model.start.maxDate;
  }

  /**
   * Collation key used for chronological ordering.
   *
   * The collation key is a derived string whose lexicographic ordering
   * is guaranteed to match the semantic chronological ordering of fuzzy dates.
   *
   * ```text
   * a occurs before b  ⇔  a.collationKey < b.collationKey
   * ```
   *
   * This property is intended for:
   * - database indexing
   * - `ORDER BY` clauses
   * - stable sorting without parsing
   *
   * @remarks
   * - Not human-readable
   * - Not intended for round-tripping
   * - Derived entirely from the canonical model
   */
  get collationKey() {
    return collate(this._model);
  }

  /**
   * Serializes this fuzzy date to its canonical JSON representation.
   *
   * The returned object is suitable for long-term storage,
   * transport, and later reconstruction via {@link fromJSON}.
   */
  toJSON() {
    return this._model;
  }

  /**
   * Reconstructs a `FuzzyDate` from a previously serialized canonical model.
   *
   * @param json A trusted `FuzzyDateModel`, typically loaded from storage.
   */
  static fromJSON(json: FuzzyDateModel) {
    return new FuzzyDate(json);
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
}
