import * as React from 'react';
import {Language, isCharacter} from '../Utils';
import LetterInput from './LetterInput';
import {useState} from "react";

interface IWordProps {
    letters: string[];
    indexes: number[];
    languageToTranslateInto: Language;
    animationDelay: string;
}

const Word: React.FunctionComponent<IWordProps> = ({
                                                       letters,
                                                       indexes,
                                                       languageToTranslateInto,
                                                       animationDelay
                                                   }) => {
    const [revealedIndexes, setRevealedIndexes] = useState<number[]>([]);

    const onRevealRandomLetter = (indexes: number[]) => {
        const unrevealedIndexes = indexes.filter(index => !revealedIndexes.includes(index));
        if (unrevealedIndexes.length === 0) {
            return;
        }
        const randomIndex = Math.floor(Math.random() * unrevealedIndexes.length);
        setRevealedIndexes([...revealedIndexes, unrevealedIndexes[randomIndex]]);
    }


    const updateRevealedIndexes = (inputIndex: number) => {
        if (revealedIndexes.includes(inputIndex)) {
            return; // Already revealed
        }
        setRevealedIndexes([...revealedIndexes, inputIndex]);
    };

    return (
        <div
            className="inline-grid pb-3 pr-3 md:pb-7 md:pr-10 animate-fadeInTop"
            style={{'--animation-delay': animationDelay} as React.CSSProperties}
        >
            <div className="space-x-1 text-base sm:text-2xl md:text-3xl">
                {letters.map((letter, j) => (
                    <LetterInput
                        key={indexes[j]}
                        onCorrectLetterEntered={(inputIndex: number) => updateRevealedIndexes(inputIndex)}
                        revealed={revealedIndexes.includes(indexes[j])}
                        inputIndex={indexes[j]}
                        isNonCharacter={!isCharacter(letter, languageToTranslateInto)}
                        correctLetter={letter}
                    />
                ))}
            </div>
            <button
                onClick={() => onRevealRandomLetter(indexes)}
                className="mt-4 text-xs opacity-40 hover:opacity-100"
            >
                Reveal
            </button>
        </div>
    );
};

export default Word;