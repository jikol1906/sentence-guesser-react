import React, { useState } from 'react';
import Button from './Button'; // Assuming Button component accepts children and onClick
import { WordData } from './App';

type WordBankManagerProps = {
  words: WordData[];
  onWordsChange: (updatedWords: WordData[]) => void;
};

export const WordBankManager: React.FC<WordBankManagerProps> = ({ words, onWordsChange }) => {
  const [newWord, setNewWord] = useState('');
  const [newContextSentence, setNewContextSentence] = useState('');

  const handleAddWord = (event: React.FormEvent) => {
    event.preventDefault();
    if (newWord.trim() === '') {
      alert('Please enter a word or phrase.');
      return;
    }

    const newWordData: WordData = {
      word: newWord.trim(),
      contextSentence: newContextSentence.trim(),
    };

    const updatedWords = [...words, newWordData];
    onWordsChange(updatedWords);

    // Clear input fields
    setNewWord('');
    setNewContextSentence('');
  };

  const handleRemoveWord = (indexToRemove: number) => {
    const updatedWords = words.filter((_, index) => index !== indexToRemove);
    onWordsChange(updatedWords);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-5xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Manage Word Bank</h2>

      {/* Form for adding new words */}
      <form onSubmit={handleAddWord} className="mb-8 p-4 border border-gray-700 rounded-lg">
        <div className="mb-4">
          <label htmlFor="new-word" className="block text-sm font-medium text-gray-300 mb-1">
            Word or Phrase <span className="text-red-500">*</span>
          </label>
          <input
            id="new-word"
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., nachhaltig"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="context-sentence" className="block text-sm font-medium text-gray-300 mb-1">
            Context Sentence (Optional)
          </label>
          <input
            id="context-sentence"
            type="text"
            value={newContextSentence}
            onChange={(e) => setNewContextSentence(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., Wir versuchen, nachhaltiger zu leben."
          />
        </div>
        <Button type="submit">
          Add Word
        </Button>
      </form>

      {/* List of existing words */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Current Words</h3>
        <div className="space-y-3">
          {words.length > 0 ? (
            words.map((wordData, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-700 p-3 rounded-md"
              >
                <div>
                  <p className="font-bold">{wordData.word}</p>
                  {wordData.contextSentence && (
                    <p className="text-sm text-gray-400">{wordData.contextSentence}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveWord(index)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">The word bank is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
};