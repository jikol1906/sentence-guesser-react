import * as React from 'react';
import {Language} from '../Utils';
import Word from './Word';

interface ISentenceGuesserProps {
    lettersAndIndexes: { letters: string[]; indexes: number[] }[];
    languageToTranslateInto: Language;
}

const Paragraph: React.FunctionComponent<ISentenceGuesserProps> = ({
                                                                       languageToTranslateInto,
                                                                       lettersAndIndexes,
                                                                   }) => {

    return (
        <div className="font-mono">
            {lettersAndIndexes.map(({letters, indexes}, i) => (
                <Word
                    key={i}
                    letters={letters}
                    indexes={indexes}
                    languageToTranslateInto={languageToTranslateInto}
                    animationDelay={`${i * 0.02}s`}
                />
            ))
            }
        </div>
    );
};

export default Paragraph;