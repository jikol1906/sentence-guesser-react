import { Language } from "../Utils";
import Word from "./Word";
import { SentenceGroup } from "./Sentences";

interface SentenceProps {
  sentenceGroup: SentenceGroup;
  languageToTranslateInto: Language;
  isLastSentence?: boolean;
  guessOnlyWordMode?: boolean;
}

const Sentence = ({
  languageToTranslateInto,
  sentenceGroup,
  isLastSentence,
  guessOnlyWordMode = false, // Default to false if not provided
}: SentenceProps) => {
  return (
    <div className="space-y-8 border-b-2 border-b-gray-700" data-is-last-sentence={isLastSentence}>
      {!guessOnlyWordMode && (
        <div className="sticky text-lg top-7 mb-7 p-4 bg-slate-600 z-10 rounded-md">
          <p>{sentenceGroup.sentenceToShow}</p>
        </div>
      )}
      {sentenceGroup.sentenceToGuessWords.map((word, i) => (
        <Word
          key={i}
          word={word} // Remove tags if in guess-only mode
          languageToTranslateInto={languageToTranslateInto}
          animationDelay={`${i * 0.02}s`}
          wordIsShown={word.showWord} // If the word is not surrounded by tags and not in guess-only mode, treat it as static
        />
      ))}
    </div>
  );
};

export default Sentence;
