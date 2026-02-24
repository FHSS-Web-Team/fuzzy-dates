export type SimpleDate = {
  precision: Precision;
  min: Date;
  max: Date;
};

export type FuzzyDateModel = {
  approximate: boolean;
  start: SimpleDate | null;
  end: SimpleDate | null;
};

export type Precision =
  | 'Year'
  | 'Season'
  | 'Month'
  | 'Day'
  | 'Hour'
  | 'Minute'
  | 'Second';

export function isRange(model: FuzzyDateModel) {
  return (
    model.start?.min !== model.end?.min || model.start?.max !== model.end?.max
  );
}
