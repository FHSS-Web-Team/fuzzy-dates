export type FuzzyDateModel =
  | {
      type: 'simple';
      approximate: boolean;
      date: SimpleDate;
    }
  | {
      type: 'range';
      approximate: boolean;
      start: SimpleDate;
      end: SimpleDate;
    }
  | {
      type: 'range';
      approximate: boolean;
      start: null;
      end: SimpleDate;
    }
  | {
      type: 'range';
      approximate: boolean;
      start: SimpleDate;
      end: null;
    };

export type Precision =
  | 'Year'
  | 'Season'
  | 'Month'
  | 'Day'
  | 'Hour'
  | 'Minute'
  | 'Second';

export type SimpleDate = {
  precision: Precision;
  min: Date;
  max: Date;
};
