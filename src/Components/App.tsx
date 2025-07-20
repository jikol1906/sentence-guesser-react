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
import ClozeSentence from "./ClozeSentence/ClozeSentence";
import ClozeSentenceGroup from "./ClozeSentence/ClozeSentenceGroup";
import ExpandableWrapper from "./ExpandableWrapper";
import { Drawer } from "./Drawer";

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

const testData: WordType[][] = [
  [
    ...[
      ...'This is some text with some'.split(" "),
      { letters: 'words'.split(""), shownIndexes: [] },
      ...'that serves as an'.split(" "),
      { letters: 'example'.split(""), shownIndexes: [] },
    ]
  ],
  ['this','is',{ letters : 'another'.split(""), shownIndexes: [] },'test','sentence','with','some','words','to','fill','the','gap'],
];

const App: React.FunctionComponent = () => {
  const [clozeSentences, setClozeSentences] = useLocalStorageState<
    WordType[][]
  >("clozeSentences", []);
  const [mode] = useLocalStorageState<ChallengeMode>("challengeMode", "cloze");
  const [targetLanguage, setTargetLanguage] = useState<Language>("german");
  const [loading, setLoading] = useState(false);
  const [wordBankOrder, setWordBankOrder] = useLocalStorageState<number[]>(
    "wordBankOrder",
    []
  );
  const [error, setError] = useState<string | null>(null);

  const [wordBank, setWordBank] = useLocalStorageState<WordData[]>(
    "wordBank",
    []
  );

  //If wordbankOrder is empty, reset it
  useEffect(() => {
    if (wordBank.length > 0 && wordBankOrder.length === 0) {
      const newOrder = Array.from({ length: wordBank.length }, (_, i) => i);
      setWordBankOrder(shuffleArray(newOrder));
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

      const data = (await response.json()) as ClozeApiResponse;

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
    setClozeSentences([]);
    setWordBankOrder([]);
  };

  return (
    <div className="relative min-h-screen bg-slate-800 text-white py-32">
      <div className="max-w-5xl m-auto flex flex-col gap-6">
        <SentenceGuesserHeader />
        <Drawer title="Manage word bank">
          {/* <LanguageSelector onLanguageChosen={setTargetLanguage} /> */}
          <WordBankManager
            words={wordBank}
            onWordsChange={(updatedWords) => setWordBank(updatedWords)}
            onClearAll={() => setWordBankOrder([])}
          />
        </Drawer>
        <Button
          onClick={clearSentenceData}
          buttonType="danger"
          className="self-center"
        >
          Clear challenges
        </Button>
      </div>
      <ClozeSentenceGroup onLetterEntered={(i, l) => console.log(i, l)}>
        {clozeSentences.map((sentenceWords, i) => (
          <div className="py-[125px] px-2 border-b-[1px] border-secondary">
            <ClozeSentence key={i} words={sentenceWords} />
          </div>
        ))}
      </ClozeSentenceGroup>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Button
          className="bg-slate-500 p-4 m-auto flex items-center justify-center gap-2 mt-10"
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

      <Footer />
    </div>
  );
};

export default App;
