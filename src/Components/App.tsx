import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  convertClozeApiResponseToWords,
  isCharacter,
  Language,
  shuffleArray,
  wordIsSurroundedByTags,
} from "../Utils";
import Footer from "./Footer";
import LoadingSpinner from "./LoadingSpinner";
import SentenceGuesserHeader from "./SentenceGuesserHeader";
import Sentences, { SentenceGroup } from "./Sentences";
import { WordBankManager } from "./WordBankManager";
import Button from "./Button";
import useLocalStorageState from "../hooks/useLocalStorageState";
import LanguageSelector from "./LanguageSelector";
import { WordType } from "../types";
import ClozeSentence from "./ClozeSentence";

// The type for our array of words and context sentences
export type WordData = {
  word: string;
  contextSentence: string;
  previousSentencesIncludingWord?: string[]; // Optional property to store previous sentences
};

type ChallengeMode = "pair" | "cloze";

type ClozeApiResponse = {
  words: string[];
};

// Initial list of words. This will be the default state.
const initialWordBank: WordData[] = [
  {
    word: "nachhaltig",
    contextSentence: "Wir versuchen, nachhaltiger zu leben.",
  },
  {
    word: "Herausforderung",
    contextSentence: "Die neue Aufgabe ist eine große Herausforderung.",
  },
  {
    word: "begeistert",
    contextSentence: "Ich bin von dieser Idee begeistert.",
  },
];

const App: React.FunctionComponent = () => {
  const [clozeSentences, setClozeSentences] = useLocalStorageState<
    WordType[][]
  >("clozeSentences", []);
  const [mode] = useLocalStorageState<ChallengeMode>(
    "challengeMode",
    "cloze"
  );
  const [targetLanguage, setTargetLanguage] = useState<Language>("german");
  const [loading, setLoading] = useState(false);
  const [wordBankOrder, setWordBankOrder] = useLocalStorageState<number[]>(
    "wordBankOrder",
    []
  );
  const [error, setError] = useState<string | null>(null);

  const previousWordBankLength = useRef<number>(0);

  const [wordBank, setWordBank] = useLocalStorageState<WordData[]>(
    "wordBank",
    []
  );

  //If wordbankOrder is empty, reset it
  useEffect(() => {
    if (
      wordBank.length > 0 &&
      previousWordBankLength.current !== wordBank.length
    ) {
      const newOrder = Array.from({ length: wordBank.length }, (_, i) => i);
      setWordBankOrder(shuffleArray(newOrder));
      previousWordBankLength.current = wordBank.length;
    }
  }, [wordBankOrder, wordBank.length]);

  const fetchNewClozeSentence = async () => {
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
      const response = await fetch(
        "/.netlify/functions/generate-sentence-pair",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wordOrPhrase: randomWordData.word,
            contextSentence: randomWordData.contextSentence,
            mode: mode,
            targetLanguage: targetLanguage,
            previousSentences: randomWordData.previousSentencesIncludingWord,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch sentence pair: ${response.statusText}`
        );
      }

      const data = await response.json() as ClozeApiResponse;

      const sentence = data.words as string[];

      const convertedToWords = convertClozeApiResponseToWords(
        sentence,
        targetLanguage
      );

      // add the sentence to previousSentences of the wordBank

      setWordBank((prevWordBank) => {
        const updatedWordBank = [...prevWordBank];
        updatedWordBank[nextIdx] = {
          ...updatedWordBank[nextIdx],
          previousSentencesIncludingWord: [
            ...(updatedWordBank[nextIdx].previousSentencesIncludingWord || []),
            sentence.join(" "),
          ],
        };
        return updatedWordBank;
      });

      setClozeSentences((prevSentences) => [
        ...prevSentences,
        convertedToWords,
      ]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearSentenceData = () => {
    setClozeSentences([]); // Clear the sentence data state
  };

  return (
    <div className="relative min-h-screen bg-slate-800  flex py-32 px-5">
      <div className="max-w-5xl m-auto flex-1 text-white space-y-14 grid">
        <SentenceGuesserHeader />
        <LanguageSelector onLanguageChosen={setTargetLanguage} />
        <WordBankManager
          words={wordBank}
          onWordsChange={(updatedWords) => setWordBank(updatedWords)}
        />
        <Button
          onClick={clearSentenceData}
          buttonType="danger"
          className="justify-self-center"
        >
          Clear challenges
        </Button>
        {clozeSentences.map((sentenceWords, i) => (
          <ClozeSentence
            key={i}
            words={sentenceWords}
          />
        ))}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Button
            className="bg-slate-500 p-4 m-auto flex items-center justify-center gap-2"
            onClick={fetchNewClozeSentence}
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
