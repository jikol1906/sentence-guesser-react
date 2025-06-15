import * as React from 'react';
import { useState } from 'react';
import { Language } from '../Utils';
import Button from './Button';
import HelperDialog from './HelperDialog';

interface ITranslateFormProps {
    onSubmit: (e:React.FormEvent<HTMLFormElement>) => void
    selectedLanguage: Language
    onLanguageChange:(lang:Language) => void
    showBorderOnEmptyInput:boolean
    setShowBorderOnEmptyInput:React.Dispatch<React.SetStateAction<boolean>>
}

const TranslateForm: React.FunctionComponent<ITranslateFormProps> = ({onSubmit,selectedLanguage,onLanguageChange, showBorderOnEmptyInput, setShowBorderOnEmptyInput}) => {
    const [showHelp,setShowHelp] = useState(false);


    const languages:Language[] = ["german","spanish","french"]

    return (
        <form onSubmit={onSubmit} className="grid gap-5">
            <div className='flex items-center space-x-2'>
                <p>Translate to:</p>
                {languages.map(l => <Button type='button' key={l} onMouseDown={e => e.preventDefault()} onClick={() => onLanguageChange(l)} active={selectedLanguage === l}>{l}</Button>)}
                <button onMouseDown={e => e.preventDefault()} onClick={() => setShowHelp(prev => !prev)} type="button" className='w-5 h-5 rounded-full bg-slate-600 flex justify-center items-center text-sm'>?</button>
            </div>
            <div className='relative'>
                <textarea
                    name="test"
                    className={`block p-4 w-full text-sm  bg-gray-700 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 rounded-lg resize-none ${showBorderOnEmptyInput ? "border-red-600 border-2" : "border-transparent"}`}
                    placeholder="Enter sentence to translate"
                    required
                    rows={4}
                    onChange={(e) => {
                        if (e.currentTarget.value.length > 0) {
                            setShowBorderOnEmptyInput(false)
                        }
                    }}
                />
            </div>
            <Button>Translate and start guessing</Button>
            {showHelp && <HelperDialog onClose={() => setShowHelp(false)}/>}
        </form>
    );
};

export default TranslateForm;