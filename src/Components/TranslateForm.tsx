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
                    className={`block p-4 pl-10 w-full text-sm  bg-gray-700 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 rounded-lg resize-none ${showBorderOnEmptyInput ? "border-red-600 border-2" : "border-transparent"}`}
                    placeholder="Enter sentence to translate"
                    required
                    rows={4}
                    onChange={(e) => {
                        if (e.currentTarget.value.length > 0) {
                            setShowBorderOnEmptyInput(false)
                        }
                    }}
                />
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
            </div>
            <Button>Translate and start guessing</Button>
            {showHelp && <HelperDialog onClose={() => setShowHelp(false)}/>}
        </form>
    );
};

export default TranslateForm;