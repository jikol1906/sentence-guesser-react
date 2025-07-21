import { useEffect } from "react";
import { WordType } from "../../types";
import { useImmer } from "use-immer";

const useClozeSentence = (initialSentences: WordType[][], onSentencesChange?: (sentences: WordType[][]) => void) => {

    const [sentences, setSentences] = useImmer<WordType[][]>(initialSentences);

    // If a callback is provided, call it whenever sentences change
    useEffect(() => {
        if (onSentencesChange) {
            onSentencesChange(sentences);
        }
    }, [sentences, onSentencesChange]);

    const revealLetter = (sentenceIndex: number, wordIndex: number) => {
        setSentences((draft) => {
            const word = draft[sentenceIndex].filter(sentence => typeof sentence === "object")[wordIndex];
            const unrevealedIndexes = word.letters
            .map((_, index) => index)
            .filter(index => !word.shownIndexes.includes(index));
        
        if (unrevealedIndexes.length > 0) {
            const randomIndex = Math.floor(Math.random() * unrevealedIndexes.length);
            word.shownIndexes.push(unrevealedIndexes[randomIndex]);
        }
        });
    }

    const reset = () => {
        setSentences(initialSentences);
    };

    return {
        sentences,
        setSentences,
        revealLetter,
        reset,
    };

}

export default useClozeSentence;