import { WordType } from "./types";

export function randomIntFromInterval(min:number, max:number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function removeWordTags(sentence:string) {
  return sentence.replace(/<WORD>(.*?)<\/WORD>/g, '$1');
}

export function wordIsSurroundedByTags(word:string) {
  return word.includes("<WORD>") && word.includes("</WORD>");
}


export const convertClozeApiResponseToWords = (sentence: string[], language: Language = 'german'): WordType[] => {
  const words = sentence.map((word) => {
    let letters = word.split('');
    const isHiddenWord = /_.+_/.test(word);

    //Remove underscores from hidden words
    letters = letters.filter(letter => letter !== '_');
    
    return {
      letters: letters,
      shownIndexes: letters.map((_, i) => !isCharacter(letters[i], language) ? i : -1).filter(i => i !== -1),
      showWord: !isHiddenWord,
    };
  });

  return words;
}


export const languageRegexes = {
  german: /[a-zA-ZäöüßÄÖÜẞ]/,
  spanish: /[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/,
  french: /[a-zA-ZàâçéèêëîïôûùüÿæœÀÂÇÉÈÊËÎÏÔÛÙÜŸÆŒ]/,
} as const

export type Language = keyof typeof languageRegexes;

export const LANGUAGES: Language[] = Object.keys(languageRegexes) as Language[];

export function isCharacter(character:string,lang:Language) {
  return languageRegexes[lang].test(character)
} //Function to shuffle array
export const shuffleArray = <T extends any>(array: T[]): T[] => array.sort(() => Math.random() - 0.5);