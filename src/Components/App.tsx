import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import { Language, languageRegexes, randomIntFromInterval } from "../Utils";
import Footer from "./Footer";
import GameView, {ParagraphData} from "./GameView";
import LoadingSpinner from "./LoadingSpinner";
import SentenceGuesserHeader from "./SentenceGuesserHeader";
import TranslateForm from "./TranslateForm";
import Paragraph from "./Paragraph";
import Paragraphs from "./Paragraphs";
import { WordBankManager } from "./WordBankManager";

// const testData: ParagraphData[] = [
//   {
//     sentenceToShow: "This is a long examplesentence to test if this app works as expected. I really hope it does. I will just make it a bit longer, because I need to test if position sticky works for the shown sentence",
//     sentenceToGuess: "Dies ist ein langer Beispielsatz, um zu testen, ob diese Anwendung wie erwartet funktioniert. Ich hoffe wirklich, dass sie das tut. Ich werde ihn nur ein bisschen länger machen, weil ich testen muss, ob Position Sticky für den gezeigten Satz funktioniert",
//   },
//   {
//     sentenceToShow: "This is a long examplesentence to test if this app works as expected. I really hope it does. I will just make it a bit longer, because I need to test if position sticky works for the shown sentence",
//     sentenceToGuess: "Dies ist ein langer Beispielsatz, um zu testen, ob diese Anwendung wie erwartet funktioniert. Ich hoffe wirklich, dass sie das tut. Ich werde ihn nur ein bisschen länger machen, weil ich testen muss, ob Position Sticky für den gezeigten Satz funktioniert",
//   },
// ]

// The type for our array of words and context sentences
export type WordData = {
  word: string;
  contextSentence: string;
};

// Initial list of words. This will be the default state.
const initialWordBank: WordData[] = [
  { word: 'nachhaltig', contextSentence: 'Wir versuchen, nachhaltiger zu leben.' },
  { word: 'Herausforderung', contextSentence: 'Die neue Aufgabe ist eine große Herausforderung.' },
  { word: 'begeistert', contextSentence: 'Ich bin von dieser Idee begeistert.' },
  { word: 'entwickeln', contextSentence: 'Die Firma will neue Produkte entwickeln.' },
  { word: 'umfangreich', contextSentence: 'Die Bibliothek hat eine umfangreiche Sammlung.' },
  { word: 'Gelegenheit', contextSentence: 'Das ist eine gute Gelegenheit, etwas Neues zu lernen.'}
];

const testData: ParagraphData[] = [
  {
    sentenceToShow: `Companies often try to lure talented employees with high salaries and benefits.`,
    sentenceToGuess: `Unternehmen versuchen oft, talentierte Mitarbeiter mit hohen Gehältern und Vorteilen zu ködern.`,
  },
]

interface ITest2Props {}

const App: React.FunctionComponent<ITest2Props> = (props) => {
  const [words, setWords] = useState<string[][]>([]);
  const [translatedSentence, setTranslatedSentence] = useImmer<string[]>([]);
  const [originalSentence, setOriginalSentence] = useState("");
  const [enteringSentence, setEnteringSentence] = useState(true);
  const [languageToTranslateInto, setLanguageToTranslateInto] =
    useState<Language>("german");
  const [showBorderOnEmptyInput, setShowBorderOnEmptyInput] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [paragraphData, setParagraphData] = useState<ParagraphData[]>(testData);


  const [targetLanguage, setTargetLanguage] = useState<Language>('german');
  // The word input is removed, as we now select from the wordBank
  const [paragraphs, setParagraphs] = useState<ParagraphData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wordBank, setWordBank] = useState<WordData[]>(initialWordBank);

  /**Refs for the letter inputs.  */
  const inputRefs = useRef<React.RefObject<HTMLInputElement>[][]>([]);

  //Update letterinformation when enteredSentence changes
  useEffect(() => {
    const letterInformationArr: string[][] = [];
    inputRefs.current = [];
    translatedSentence.forEach((s) => {
      const arr: React.RefObject<HTMLInputElement>[] = [];
      const letterInformation: string[] = [];
      s.split("").forEach((l) => {
        arr.push(React.createRef()); // Create a ref for all letter inputs, so that we can programatically advance to the next or previous input
        letterInformation.push(l);
      });
      letterInformationArr.push(letterInformation);
      inputRefs.current.push(arr);
    });

    setWords(letterInformationArr);
  }, [setWords, translatedSentence, languageToTranslateInto]);

  /*Only solution I could find to delete the character from the current input and
  go to the previously available input was to check for Backspace or Delete with onKeyUp event.
  onKeyDown and onKeyPressed are called before the character from the current input is deleted
   */
  const onKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement>,
    wordNum: number,
    letterNum: number
  ) => {
    const isBackspaceOrDelete = e.key === "Backspace" || e.key === "Delete";

    if (isBackspaceOrDelete) {
      const [wordToSelect, letterToSelect] = getNextPreviousAvailableInput(
        wordNum,
        letterNum
      );
      clearInput(wordToSelect, letterToSelect);
      selectInput(wordToSelect, letterToSelect);
    }
  };

  const fetchSentencePair = async () => {
    setLoading(true);
    setError(null);

    // 1. Select a random word object from the wordBank
    const randomIndex = Math.floor(Math.random() * wordBank.length);
    const randomWordData = wordBank[randomIndex];

    try {
      // 2. Send the randomly selected data to the backend
      const response = await fetch('/.netlify/functions/generate-sentence-pair', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wordOrPhrase: randomWordData.word,
          contextSentence: randomWordData.contextSentence,
          sourceLanguage: 'english',
          targetLanguage: targetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch sentence pair: ${response.statusText}`);
      }

      const data = await response.json();

      const newParagraph: ParagraphData = {
        sentenceToShow: data['english'],
        sentenceToGuess: data[targetLanguage],
      };

      setParagraphs(prevParagraphs => [...prevParagraphs, newParagraph]);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reveals one random letter of the specified word
   * @param wordNumber - index of the word which will have one letter revealed.
   */
  const revealRandLetter = (wordNumber: number) => {
    const inputsWithWrongLetters = inputRefs.current[wordNumber].filter(
      (i) => !i.current!.checkValidity()
    );
    if (inputsWithWrongLetters.length > 0) {
      const inputToReveal =
        inputsWithWrongLetters[
          randomIntFromInterval(0, inputsWithWrongLetters.length - 1)
        ];
      inputToReveal.current!.value = inputToReveal.current!.getAttribute(
        "data-correct-letter"
      )!;
      inputToReveal.current!.disabled = true;
      if (document.activeElement === inputToReveal.current) {
        inputToReveal.current!.blur();
      }
    }
  };

  const onInput = (
    e: React.FormEvent<HTMLInputElement>,
    wordNum: number,
    letterNum: number
  ) => {
    const value = e.currentTarget.value;
    //Disable inputs with correct value, no point in being able to delete correct words
    if (e.currentTarget.checkValidity()) {
      e.currentTarget.disabled = true;
    }
    if (languageRegexes[languageToTranslateInto].test(value)) {
      selectNextAvailableInput(wordNum, letterNum);
    }
  };

  const tryNewSentence = () => {
    setWords([]);
    setEnteringSentence(true);
  };

  const translate = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const translationInputText = formData.get("test");

    try {
      const res = await fetch(
        `/.netlify/functions/translate`, // URL doesn't need query params
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sentence: translationInputText,
            lang: languageToTranslateInto,
          }),
        }
      );

      if (!res.ok) {
        const message = `An error has occured: ${res.status} ${res.statusText}`;
        throw new Error(message);
      }

      const json = await res.json();
      setTranslatedSentence(json.translation.trim().split(" ") as string[]);
      setOriginalSentence(translationInputText?.toString()!);
      setEnteringSentence(false);
    } catch (error) {
      alert(error);
    }

    setIsLoading(false);
  };

  /**
   * Select the next available letter input skipping all the disabled inputs until the next non disabled input or the last letter is reached
   * @param fromWord - the word to start from
   * @param fromLetter - the letter of the word to start from
   */
  const selectNextAvailableInput = (fromWord: number, fromLetter: number) => {
    if (!isLastLetterOfLastWord(fromWord, fromLetter)) {
      let [nextWordNumber, nextLetterNumber] = getNextLetterInput(
        fromWord,
        fromLetter
      );

      while (inputIsDisabled(nextWordNumber, nextLetterNumber)) {
        if (isLastLetterOfLastWord(nextWordNumber, nextLetterNumber)) {
          return;
        }
        [nextWordNumber, nextLetterNumber] = getNextLetterInput(
          nextWordNumber,
          nextLetterNumber
        );
      }

      selectInput(nextWordNumber, nextLetterNumber);
    }
  };

  const getNextPreviousAvailableInput = (
    fromWord: number,
    fromLetter: number
  ) => {
    if (!isFirstLetterofFirstWord(fromWord, fromLetter)) {
      let [previousWord, previousLetter] = getPreviousLetterInput(
        fromWord,
        fromLetter
      );

      while (inputIsDisabled(previousWord, previousLetter)) {
        if (isFirstLetterofFirstWord(previousWord, previousLetter)) {
          return [fromWord, fromLetter];
        }
        [previousWord, previousLetter] = getPreviousLetterInput(
          previousWord,
          previousLetter
        );
      }

      return [previousWord, previousLetter];
    }

    return [fromWord, fromLetter];
  };

  const inputIsDisabled = (wordNum: number, letterNum: number) => {
    return inputRefs.current[wordNum][letterNum].current?.disabled;
  };

  const selectInput = (wordNum: number, letterNum: number) => {
    return inputRefs.current[wordNum][letterNum].current?.focus();
  };

  /**
   * Return the word and letter index of the next letter input (the input to the right)
   * @param fromWord - the word to start from
   * @param fromLetter - the letter of the word to start from
   * @returns Tuple containing the next word and letter indexes
   */
  const getNextLetterInput = (
    fromWord: number,
    fromLetter: number
  ): [nextWord: number, nextLetter: number] => {
    if (isLastLetterOfWord(fromWord, fromLetter)) {
      return [fromWord + 1, 0];
    } else {
      return [fromWord, fromLetter + 1];
    }
  };

  /**
   * Return the word and letter index of the previous letter input (the input to the left)
   * @param fromWord - the word to start from
   * @param fromLetter - the letter of the word to start from
   * @returns Tuple containing the previous word and letter indexes
   */
  const getPreviousLetterInput = (
    fromWord: number,
    fromLetter: number
  ): [previousWord: number, previousLetter: number] => {
    if (fromLetter === 0) {
      return [fromWord - 1, inputRefs.current![fromWord - 1].length - 1];
    } else {
      return [fromWord, fromLetter - 1];
    }
  };

  const isLastLetterOfWord = (wordNumber: number, letterNumber: number) => {
    return inputRefs.current[wordNumber]!.length - 1 === letterNumber;
  };

  const isLastWord = (wordNumber: number) => {
    return inputRefs.current!.length - 1 === wordNumber;
  };

  const isLastLetterOfLastWord = (wordNumber: number, letterNumber: number) => {
    return (
      isLastWord(wordNumber) && isLastLetterOfWord(wordNumber, letterNumber)
    );
  };

  const isFirstLetterofFirstWord = (
    wordNumber: number,
    letterNumber: number
  ) => {
    return wordNumber === 0 && letterNumber === 0;
  };

  const clearInput = (wordNumber: number, letterNumber: number) => {
    inputRefs.current[wordNumber][letterNumber].current!.value = "";
  };

  const removeAllWrongLetters = () => {
    inputRefs.current.forEach((word) => {
      word.forEach((letterInput) => {
        if (!letterInput.current!.checkValidity()) {
          letterInput.current!.value = "";
        }
      });
    });
  };

  return (
    <div className="relative min-h-screen bg-slate-800  flex py-32 px-5">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="max-w-5xl m-auto flex-1 text-white space-y-14">
          <SentenceGuesserHeader />
            <WordBankManager
              words={wordBank}
              onWordsChange={(updatedWords) => {
                setWordBank(updatedWords);
              }}
            />
            <Paragraphs
              paragraphData={paragraphData}
              languageToTranslateInto={languageToTranslateInto} 
            />
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;
