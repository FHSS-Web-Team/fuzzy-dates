export const MONTH_SEASON_MAP = {
  spring: 3,
  summer: 6,
  fall: 9,
  autumn: 9,
  winter: 12,
} as const;

export const MONTH_NAME_MAP = {
  jan: 1,
  january: 1,
  feb: 2,
  feby: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  octr: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
} as const;

export function isMonth(input: string): input is keyof typeof MONTH_NAME_MAP {
  return Object.keys(MONTH_NAME_MAP).includes(input);
}

export const DAY_NAME_MAP = {
  'one': 1,
  'first': 1,

  'two': 2,
  'second': 2,

  'three': 3,
  'third': 3,

  'four': 4,
  'fourth': 4,

  'five': 5,
  'fifth': 5,

  'six': 6,
  'sixth': 6,

  'seven': 7,
  'seventh': 7,

  'eight': 8,
  'eighth': 8,

  'nine': 9,
  'ninth': 9,

  'ten': 10,
  'tenth': 10,

  'eleven': 11,
  'eleventh': 11,

  'twelve': 12,
  'twelfth': 12,

  'thirteen': 13,
  'thirteenth': 13,

  'fourteen': 14,
  'fourteenth': 14,

  'fifteen': 15,
  'fifteenth': 15,

  'sixteen': 16,
  'sixteenth': 16,

  'seventeen': 17,
  'seventeenth': 17,

  'eighteen': 18,
  'eighteenth': 18,

  'nineteen': 19,
  'nineteenth': 19,

  'twenty': 20,
  'twentieth': 20,

  'twenty one': 21,
  'twenty first': 21,

  'twenty two': 22,
  'twenty second': 22,

  'twenty three': 23,
  'twenty third': 23,

  'twenty four': 24,
  'twenty fourth': 24,

  'twenty five': 25,
  'twenty fifth': 25,

  'twenty six': 26,
  'twenty sixth': 26,

  'twenty seven': 27,
  'twenty seventh': 27,

  'twenty eight': 28,
  'twenty eighth': 28,

  'twenty nine': 29,
  'twenty ninth': 29,

  'thirty': 30,
  'thirtieth': 30,

  'thirty one': 31,
  'thirty first': 31,
};

export function isDay(input: string): input is keyof typeof DAY_NAME_MAP {
  return Object.keys(DAY_NAME_MAP).includes(input);
}
