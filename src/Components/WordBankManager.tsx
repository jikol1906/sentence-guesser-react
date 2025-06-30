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
    if (newWord.trim()) { // Only check if newWord is provided
      const updatedWords = [
        ...words,
        { word: newWord, contextSentence: newContextSentence.trim() || '' } // Default to an empty string if not provided
      ];
      onWordsChange(updatedWords);
      setNewWord('');
      setNewContextSentence('');
    }
  };

  const handleRemoveWord = (indexToRemove: number) => {
    const updatedWords = words.filter((_, index) => index !== indexToRemove);
    onWordsChange(updatedWords);
  };

  const handleClearAll = () => {
    onWordsChange([]); // Clear the entire word bank
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
          <label htmlFor="new-context-sentence" className="block text-sm font-medium text-gray-300 mb-1">
            Context Sentence
          </label>
          <input
            id="new-context-sentence"
            type="text"
            value={newContextSentence}
            onChange={(e) => setNewContextSentence(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., Nachhaltig leben ist wichtig."
          />
        </div>
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          Add Word
        </Button>
      </form>

      {/* Clear All Button */}
      <div className="text-center mb-8">
        <Button
          onClick={handleClearAll}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Clear All
        </Button>
      </div>

      {/* Word List */}
      <ul className="space-y-4">
        {words.map((wordData, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-700 p-4 rounded-lg shadow"
          >
            <div>
              <p className="font-bold">{wordData.word}</p>
              <p className="text-sm text-gray-400">{wordData.contextSentence}</p>
            </div>
            <Button
              onClick={() => handleRemoveWord(index)}
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};