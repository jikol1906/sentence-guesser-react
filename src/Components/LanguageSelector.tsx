import { useState } from "react";
import { Language, LANGUAGES, languageRegexes } from "../Utils";
import Button from "./Button";
import useLocalStorageState from "../hooks/useLocalStorageState";

interface LanguageSelectorProps {
    onLanguageChosen: (lang: Language) => void;
}

const LanguageSelector = ({ onLanguageChosen } : LanguageSelectorProps) => {

    const [selectedLanguage, setSelectedLanguage] = useLocalStorageState<Language>('chosenLanguage', "german");

    const handleLanguageClick = (lang: Language) => {
        setSelectedLanguage(lang);
        onLanguageChosen(lang);
    };

    return (
        <div className="flex space-x-4 uppercase">
            <p>Translate into</p>
            {LANGUAGES.map((lang) => (
                <Button
                    key={lang}
                    onClick={() => handleLanguageClick(lang)}
                    active={selectedLanguage === lang}
                    buttonType="primary"
                >
                    {lang}
                </Button>
            ))}
        </div>
    );
};

export default LanguageSelector;