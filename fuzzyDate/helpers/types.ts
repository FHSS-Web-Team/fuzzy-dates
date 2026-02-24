import z from 'zod';
import { FORMAT_ORDER, MODIFIER_ORDER } from './constants';
import { fuzzyDateJsonSchema } from './schemas';

export type FuzzyDateFormat = (typeof FORMAT_ORDER)[number];

export type FuzzyDateModifier = (typeof MODIFIER_ORDER)[number];

export type SimpleDate = {
  format: FuzzyDateFormat;
  min: Date;
  max: Date;
};

export type FuzzyDateModel = {
  modifier: FuzzyDateModifier;
  start: SimpleDate;
  end: SimpleDate;
};

export type FuzzyDateJson = z.infer<typeof fuzzyDateJsonSchema>;
