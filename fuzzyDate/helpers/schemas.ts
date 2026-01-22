import z from 'zod';
import { FORMAT_ORDER, MODIFIER_ORDER } from './constants';

const fuzzyDateValueSchema = z.object({
  format: z.enum(FORMAT_ORDER),
  minDate: z.iso.datetime(),
  maxDate: z.iso.datetime(),
});

export const fuzzyDateJsonSchema = z.object({
  modifier: z.enum(MODIFIER_ORDER),
  start: fuzzyDateValueSchema,
  end: fuzzyDateValueSchema,
});
