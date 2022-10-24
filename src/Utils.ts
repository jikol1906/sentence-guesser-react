export function randomIntFromInterval(min:number, max:number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}


export const languageRegexes = {
  german: /[a-zA-ZäöüßÄÖÜẞ]/
} as const

export type Language = keyof typeof languageRegexes;

export type SentenceGuesserConfig = {
  showBorderOnEmptyInput:boolean,
  oneLetterAtATimeMode:boolean
}

export type SentenceGuesserConfigOptions = keyof SentenceGuesserConfig;

export function isCharacter(character:string,lang:Language) {
  return languageRegexes[lang].test(character)
}