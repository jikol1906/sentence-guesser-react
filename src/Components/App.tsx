import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import { Language, languageRegexes, randomIntFromInterval } from "../Utils";
import Footer from "./Footer";
import GameView, {ParagraphData} from "./GameView";
import LoadingSpinner from "./LoadingSpinner";
import SentenceGuesserHeader from "./SentenceGuesserHeader";
import TranslateForm from "./TranslateForm";
import Sentence from "./Sentence";
import Sentences from "./Sentences";
import { WordBankManager } from "./WordBankManager";
import Button from "./Button";

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
];

const testData: ParagraphData[] = [
  {
    sentenceToShow: `Companies often try to lure talented employees with high salaries and benefits.`,
    sentenceToGuess: `Unternehmen versuchen oft, talentierte Mitarbeiter mit hohen Gehältern und Vorteilen zu ködern.`,
  },
]

const App: React.FunctionComponent = () => {
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

      setParagraphData(prevParagraphs => [...prevParagraphs, newParagraph]);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
            <Sentences
              paragraphData={paragraphData}
              languageToTranslateInto={languageToTranslateInto} 
            />
            <Button onClick={fetchSentencePair}>new</Button>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;
