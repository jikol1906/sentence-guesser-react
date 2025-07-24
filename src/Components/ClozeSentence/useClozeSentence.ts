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
            const word = draft[sentenceIndex].filter((w) => typeof w === 'object')[wordIndex] as WordType;
            
            if(typeof word === 'object') {
                word.shownIndexes.push(word.shownIndexes.length);
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