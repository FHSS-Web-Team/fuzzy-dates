import { ok } from '../helpers/result';
import { after, before, between, from, none } from './modifiers';

// Main Parse Function
export function parse(input: string) {
  const cleanedInput = input
    .toLowerCase() // lowercases
    .replace(/(\d+)\s*(st|nd|rd|th|of)\b(\s*of)?/gi, '$1') // removes ordinal suffixes and 'of'
    .replace(/[.,/\-_]+/g, ' ') // replaces separators with spaces
    .replace(/\s+/g, ' ') // collapses multiple spaces to a single space
    .trim(); // Removes trailing and leading spaces

  let approximate =
    cleanedInput.startsWith('about ') ||
    cleanedInput.startsWith('approximately ') ||
    cleanedInput.startsWith('around ');

  const removeApproximate = approximate
    ? cleanedInput.slice(cleanedInput.indexOf(' ') + 1)
    : cleanedInput;

  let range;
  if (removeApproximate.startsWith('before ')) {
    range = before(removeApproximate);
  } else if (removeApproximate.startsWith('after ')) {
    range = after(removeApproximate);
  } else if (removeApproximate.startsWith('between ')) {
    range = between(removeApproximate);
    approximate = true;
  } else if (removeApproximate.startsWith('from ')) {
    range = from(removeApproximate);
  } else {
    range = none(removeApproximate);
  }

  if (!range.ok) return range;

  return ok({
    approximate,
    start: range.value.start,
    end: range.value.end,
  });
}
