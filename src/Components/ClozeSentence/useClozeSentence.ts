import { useEffect } from "react";
import { ClozeWord, WordType } from "../../types";
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
            const word = draft[sentenceIndex].filter((w) => typeof w === 'object')[wordIndex] as ClozeWord;

            if( word.shownIndexes.length === word.letters.length) {
                return;
            }

            let currIndex = 0;
            while(word.shownIndexes.includes(currIndex)) {
                currIndex++;
            }
            word.shownIndexes.push(currIndex);

            
        });
    }

    const updateRevealedLetters = (sentenceIndex: number, wordIndex: number, letterIndex: number) => {
        setSentences((draft) => {
            const word = draft[sentenceIndex].filter((w) => typeof w === 'object')[wordIndex] as ClozeWord;

            if(!word.shownIndexes.includes(letterIndex)) {
                word.shownIndexes.push(letterIndex);
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
        updateRevealedLetters,
        reset,
    };

}

export default useClozeSentence;