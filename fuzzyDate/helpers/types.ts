import z from 'zod';
import { FORMAT_ORDER, MODIFIER_ORDER } from './constants';
import { fuzzyDateJsonSchema } from './schemas';

export type FuzzyDateFormat = (typeof FORMAT_ORDER)[number];

export type FuzzyDate = (typeof MODIFIER_ORDER)[number];

export type FuzzyDateValue = {
  format: FuzzyDateFormat;
  minDate: Date;
  maxDate: Date;
};

export type FuzzyDateModel = {
  modifier: FuzzyDate;
  start: FuzzyDateValue;
  end: FuzzyDateValue;
};

export type FuzzyDateJson = z.infer<typeof fuzzyDateJsonSchema>;
