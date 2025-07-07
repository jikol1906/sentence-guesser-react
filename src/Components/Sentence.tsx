import { Language, wordIsSurroundedByTags, removeWordTags } from "../Utils";
import Word from "./Word";
import type { SentenceData } from "./App";

interface SentenceProps {
  sentence: SentenceData;
  languageToTranslateInto: Language;
  isLastSentence?: boolean;
  guessOnlyWordMode?: boolean;
}

const Sentence = ({
  languageToTranslateInto,
  sentence,
  isLastSentence,
  guessOnlyWordMode = false, // Default to false if not provided
}: SentenceProps) => {
  return (
    <div className="space-y-8 border-b-2 border-b-gray-700" data-is-last-sentence={isLastSentence}>
      {!guessOnlyWordMode && (
        <div className="sticky text-lg top-7 mb-7 p-4 bg-slate-600 z-10 rounded-md">
          <p>{sentence.sentenceToShow}</p>
        </div>
      )}
      {sentence.sentenceToGuess.split(" ").map((word, i) => (
        <Word
          key={i}
          word={guessOnlyWordMode ? removeWordTags(word) : word} // Remove tags if in guess-only mode
          languageToTranslateInto={languageToTranslateInto}
          animationDelay={`${i * 0.02}s`}
          wordIsShown={guessOnlyWordMode && !wordIsSurroundedByTags(word)} // If the word is not surrounded by tags and not in guess-only mode, treat it as static
        />
      ))}
    </div>
  );
};

export default Sentence;
