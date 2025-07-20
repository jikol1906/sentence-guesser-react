import React, { useState } from 'react';
import Button from './Button';
import ExpandableWrapper from './ExpandableWrapper';
import { on } from 'events';

type WordData = {
  word: string;
  contextSentence: string;
};

type WordBankManagerProps = {
  words: WordData[];
  onWordsChange: (updatedWords: WordData[]) => void;
  onClearAll: () => void;
  onClearAllChallengesClicked: () => void;
};

export const WordBankManager: React.FC<WordBankManagerProps> = ({ words, onWordsChange, onClearAll, onClearAllChallengesClicked }) => {
  const [newWord, setNewWord] = useState('');
  const [newContextSentence, setNewContextSentence] = useState('');
  const [bulkInput, setBulkInput] = useState('');

  const handleAddWord = (event: React.FormEvent) => {
    event.preventDefault();
    if (newWord.trim()) {
      const updatedWords = [...words, { word: newWord, contextSentence: newContextSentence.trim() || '' }];
      onWordsChange(updatedWords);
      setNewWord('');
      setNewContextSentence('');
    }
  };

  const handleBulkInputSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const lines = bulkInput.split('\n');
    const parsedWords: WordData[] = lines.map((line) => {
      const [word, contextSentence = ''] = line.split(':').map((part) => part.trim());
      return { word, contextSentence };
    });
    const updatedWords = [...words, ...parsedWords.filter((entry) => entry.word)];
    onWordsChange(updatedWords);
    setBulkInput('');
  };

  const handleRemoveWord = (indexToRemove: number) => {
    const updatedWords = words.filter((_, index) => index !== indexToRemove);
    onWordsChange(updatedWords);
  };

  const handleClearAll = () => {
    onWordsChange([]);
    onClearAll();
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Manage Word Bank</h2>

      {/* Form for adding new words */}
      <form onSubmit={handleAddWord} className="mb-8 p-4 border border-gray-700 rounded-lg">
        <div className="mb-4">
          <label htmlFor="new-word" className="block text-sm font-medium text-gray-300 mb-1">
            Word or Phrase
          </label>
          <input
            id="new-word"
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., nachhaltig"
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
        <Button type="submit" >
          Add
        </Button>
      </form>

      {/* Bulk Input Form */}
      <form onSubmit={handleBulkInputSubmit} className="mb-8 p-4 border border-gray-700 rounded-lg">
        <div className="mb-4">
          <label htmlFor="bulk-input" className="block text-sm font-medium text-gray-300 mb-1">
            Bulk Input (Format: "word : context sentence" for each line)
          </label>
          <textarea
            id="bulk-input"
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={6}
          />
        </div>
        <Button type="submit" >
          Bulk add
        </Button>
      </form>

      {/* Clear All Button */}
      <div className="flex justify-between mb-8">
        <button
          onClick={handleClearAll}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Clear All Words
        </button>
        <Button
          onClick={onClearAllChallengesClicked}
          buttonType="danger"
          className="self-center"
        >
          Clear challenges
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
                {wordData.contextSentence && (
                  <p className="text-sm text-gray-400">{wordData.contextSentence}</p>
                )}
              </div>
              <button
                onClick={() => handleRemoveWord(index)}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
              >
                Remove
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};