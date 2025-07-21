import { WordType } from "../../types";
import { useImmer } from "use-immer";

const useClozeSentence = (sentences: WordType[][]) => {

    const [words, setWords] = useImmer<WordType[][]>(sentences);

    const revealLetter = (sentenceIndex: number, wordIndex: number) => {
        setWords((draft) => {
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
        setWords(sentences);
    };

    return {
        words,
        revealLetter,
        reset,
    };

}

export default useClozeSentence;