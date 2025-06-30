import * as React from "react";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { Language  } from "../Utils";
import Footer from "./Footer";
import {ParagraphData} from "./GameView";
import LoadingSpinner from "./LoadingSpinner";
import SentenceGuesserHeader from "./SentenceGuesserHeader";
import Sentences from "./Sentences";
import { WordBankManager } from "./WordBankManager";
import Button from "./Button";

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

const App: React.FunctionComponent = () => {
  const [languageToTranslateInto, setLanguageToTranslateInto] =
    useState<Language>("german");
  const [showBorderOnEmptyInput, setShowBorderOnEmptyInput] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [paragraphData, setParagraphData] = useState<ParagraphData[]>([]);

  const [targetLanguage, setTargetLanguage] = useState<Language>('german');
  // The word input is removed, as we now select from the wordBank
  const [paragraphs, setParagraphs] = useState<ParagraphData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [wordBank, setWordBank] = useState<WordData[]>(() => {
    // Retrieve the word bank from localStorage on initial load
    const storedWordBank = localStorage.getItem('wordBank');
    return storedWordBank ? JSON.parse(storedWordBank) : initialWordBank;
  });

  // Save the word bank to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wordBank', JSON.stringify(wordBank));
  }, [wordBank]);

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
          <div className="max-w-5xl m-auto flex-1 text-white space-y-14 grid">
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
        </>
      )}
    </div>
  );
};

export default App;
