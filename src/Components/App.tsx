import * as React from "react";
import { useEffect, useState } from "react";
import { Language  } from "../Utils";
import Footer from "./Footer";
import LoadingSpinner from "./LoadingSpinner";
import SentenceGuesserHeader from "./SentenceGuesserHeader";
import Sentences from "./Sentences";
import { WordBankManager } from "./WordBankManager";
import Button from "./Button";
import useLocalStorageState from "../hooks/useLocalStorageState";

// The type for our array of words and context sentences
export type WordData = {
  word: string;
  contextSentence: string;
};

export type SentenceData = {
  sentenceToShow: string;
  sentenceToGuess: string;
};

//Function to shuffle array
const shuffleArray = <T extends any>(array: T[]): T[] => array.sort(() => Math.random() - 0.5);

// Initial list of words. This will be the default state.
const initialWordBank: WordData[] = [
  { word: 'nachhaltig', contextSentence: 'Wir versuchen, nachhaltiger zu leben.' },
  { word: 'Herausforderung', contextSentence: 'Die neue Aufgabe ist eine große Herausforderung.' },
  { word: 'begeistert', contextSentence: 'Ich bin von dieser Idee begeistert.' },
];

const App: React.FunctionComponent = () => {
  const [languageToTranslateInto, setLanguageToTranslateInto] =
    useState<Language>("german");
  const [sentences, setSentences] = useLocalStorageState<SentenceData[]>('sentences',[]);

  const [targetLanguage, setTargetLanguage] = useState<Language>('german');
  const [loading, setLoading] = useState(false);
  const [wordBankOrder, setWordBankOrder] = useLocalStorageState<number[]>('wordBankOrder',[]);
  const [error, setError] = useState<string | null>(null);

  const [wordBank, setWordBank] = useLocalStorageState<WordData[]>('wordBank',[]);

  useEffect(() => {

    //Generate array with increasing numbers equal to length of wordBank
    const newOrder = Array.from({ length: wordBank.length }, (_, i) => i);
    //shuffle
    const shuffledOrder = shuffleArray(newOrder);
    setWordBankOrder(shuffledOrder);
  }, [wordBank]);

  //If wordbankOrder is empty, reset it
  useEffect(() => {
    if (wordBankOrder.length === 0 && wordBank.length > 0) {
      const newOrder = Array.from({ length: wordBank.length }, (_, i) => i);
      setWordBankOrder(shuffleArray(newOrder));
    }
  }, [wordBankOrder, wordBank.length]);

  const fetchSentencePair = async () => {
    setLoading(true);
    setError(null);

    // 1. Get the index from the end of the array.
    const nextIdx = wordBankOrder[wordBankOrder.length - 1];

    // 2. Create a NEW array that contains all but the last element.
    const newOrder = wordBankOrder.slice(0, -1);

    // 3. Update the state with the new array. This has a new reference,
    // which WILL trigger the useEffect hook when the component rerenders.
    setWordBankOrder(newOrder);

    const randomWordData = wordBank[nextIdx];

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

      const sentencePair: SentenceData = {
        sentenceToShow: data['english'],
        sentenceToGuess: data[targetLanguage],
      };

      // add the sentence to previousSentences of the wordBank

      setSentences(prevParagraphs => [...prevParagraphs, sentencePair]);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearParagraphData = () => {
    setSentences([]); // Clear the paragraphData state
  };


  return (
    <div className="relative min-h-screen bg-slate-800  flex py-32 px-5">
      <div className="max-w-5xl m-auto flex-1 text-white space-y-14 grid">
        <SentenceGuesserHeader />
        <WordBankManager
          words={wordBank}
          onWordsChange={(updatedWords) => {
            setWordBank(updatedWords);
          }}
        />
        <Button
          onClick={clearParagraphData}
          buttonType="danger"
          className="justify-self-center"
        >
          Clear challenges
        </Button>
        <Sentences
          sentences={sentences}
          languageToTranslateInto={languageToTranslateInto}
        />
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Button
            className="bg-slate-500 p-4 m-auto flex items-center justify-center gap-2"
            onClick={fetchSentencePair}
          >
            New challenge
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"
              />
            </svg>
          </Button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;
