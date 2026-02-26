import { FuzzyDateModel, isRange } from '../helpers/types';

export function collate(
  model: FuzzyDateModel
): readonly [number, -1 | 0 | 1, number, 0 | 1] {
  if (isRange(model)) {
    // left open
    if (model.start === null && model.end !== null) {
      return [
        model.end.min.getTime(),
        -1,
        -1 * (model.end.max.getTime() - model.end.min.getTime()),
        model.approximate ? 0 : 1,
      ];
    }

    // right open
    if (model.end === null && model.start !== null) {
      return [
        model.start.max.getTime(),
        1,
        -1 * (model.start.max.getTime() - model.start.min.getTime()),
        model.approximate ? 0 : 1,
      ];
    }

    // closed
    if (model.start !== null && model.end !== null) {
      return [
        model.start.min.getTime(),
        0,
        -1 * (model.end.max.getTime() - model.start.min.getTime()),
        model.approximate ? 0 : 1,
      ];
    }
  } else {
    // simple
    if (model.start !== null && model.end !== null) {
      return [
        model.start.min.getTime(),
        0,
        -1 * (model.end.max.getTime() - model.start.min.getTime()),
        model.approximate ? 0 : 1,
      ];
    }
  }

  return [Number.MAX_SAFE_INTEGER, 1, Number.MAX_SAFE_INTEGER, 1];
}
