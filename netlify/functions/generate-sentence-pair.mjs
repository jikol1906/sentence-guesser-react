import { GoogleGenAI } from '@google/genai';

// --- Constants and Mode Definitions ---

const MODES = {
  PAIR: 'pair',
  CLOZE: 'cloze',
};

// --- Helper Functions for Generating Prompt Components ---

const generateWordOrPhrase = (wordOrPhrase) => wordOrPhrase ? `WORD/PHRASE: ${wordOrPhrase}` : '';
const generateLanguage = (language) => language ? `LANGUAGE: ${language}` : '';
const generatePreviousSentences = (previousSentences) => previousSentences ? `PREVIOUS_SENTENCES: ${JSON.stringify(previousSentences)}` : '';
const generateTargetLanguage = (targetLanguage) => targetLanguage ? `TARGET: ${targetLanguage}` : '';
const generateSourceLanguage = (sourceLanguage) => sourceLanguage ? `SOURCE: ${sourceLanguage}` : '';
const generateContextSentence = (contextSentence) => contextSentence ? `CONTEXT_SENTENCE: ${contextSentence}` : '';

// --- System and User Message Generation for Sentence Pair Mode (IMPROVED) ---

const generateModelSystemMessageSentencePair = `
You are an expert linguist and AI assistant who creates high-quality sentence pairs for language learning. Your task is to analyze the provided input, which contains a word or phrase, a context sentence, a SOURCE language, and a TARGET language.

Based on the meaning of the word/phrase in that context, create a new, distinct, and natural-sounding example sentence in the TARGET language that clearly demonstrates its usage. Then, provide the translation of your newly created sentence into the SOURCE language.

The sentences you generate should be distinct from the list of sentences contained in PREVIOUS_SENTENCES (if provided).

Your final output MUST be a single JSON object. The keys of this object MUST be the lowercase names of the languages provided in the user's request. For example, if the user provides 'TARGET: spanish', one of the keys in your JSON must be "spanish".`;

const generateUserMessageSentencePair = (
  wordOrPhrase,
  contextSentence,
  sourceLanguage,
  targetLanguage,
  previousSentences
) => [
  generateWordOrPhrase(wordOrPhrase),
  generateContextSentence(contextSentence),
  generateSourceLanguage(sourceLanguage),
  generateTargetLanguage(targetLanguage),
  generatePreviousSentences(previousSentences),
].filter(Boolean).join('\n');

/**
 * IMPROVED: Generates a JSON string for the model's response using dynamic language keys.
 */
const generateModelMessageSentencePair = (targetLanguage, targetSentence, sourceLanguage, sourceSentence) => {
  const response = {};
  response[targetLanguage.toLowerCase()] = targetSentence;
  response[sourceLanguage.toLowerCase()] = sourceSentence;
  return JSON.stringify(response, null, 2);
};

/**
 * IMPROVED: Uses varied, language-agnostic examples to teach the model the format.
 */
const generateChatSentencePair = (requestBody) => {
  const { wordOrPhrase, contextSentence, sourceLanguage, targetLanguage, previousSentences } = requestBody;

  return [
    // Example 1: Spanish/French
    {
      role: "user",
      parts: [{ text: generateUserMessageSentencePair("manzana", "Me gusta comer una manzana roja.", "french", "spanish") }],
    },
    {
      role: "model",
      parts: [{ text: generateModelMessageSentencePair("spanish", "La manzana es una fruta muy popular.", "french", "La pomme est un fruit très populaire.") }],
    },
    // Example 2: Japanese/German
    {
        role: "user",
        parts: [{ text: generateUserMessageSentencePair("走る", "彼は毎朝走るのが好きです。", "german", "japanese") }],
      },
      {
        role: "model",
        parts: [{ text: generateModelMessageSentencePair("japanese", "彼は速く<WORD>走る</WORD>ことができます。", "german", "Er kann schnell rennen.") }],
      },
    // Actual user request
    {
      role: "user",
      parts: [{ text: generateUserMessageSentencePair(wordOrPhrase, contextSentence, sourceLanguage, targetLanguage, previousSentences) }],
    },
  ];
};

// --- System and User Message Generation for Cloze Exercise Mode (Unchanged) ---

const generateModelSystemMessageClozeExercise = `You generate cloze deletion exercises

The user will provide the following input:

  * **WORD/PHRASE**: The word or phrase to be hidden.
  * **CONTEXT\_SENTENCE** (Optional): A sentence to provide context for the word/phrase.
  * **LANGUAGE**: The language in which the sentence should be generated.
  * **PREVIOUS\_SENTENCES** (Optional): A list of sentences that the generated sentence should differ from as much as possible.

Based on this information, you will generate a random cloze deletion sentence for the given word/phrase. Your output will be a JSON object with a single key \`words\`, whose value is an array of the words in the sentence. The word(s) that should be hidden will be wrapped in underscores (e.g., \`_word_\`). If there are multiple words that should be hidden, wrap each of them individually. It is very important that a single word starting with underscore must always also end with underscore

You **MUST** construct the sentence in such a way that the hidden word(s) can be easily deduced from the surrounding words and the overall context of the sentence.`;

const geneerateUserMessageClozeExercise = ({ wordOrPhrase, contextSentence, targetLanguage, previousSentences }) => [
  generateWordOrPhrase(wordOrPhrase),
  generateContextSentence(contextSentence),
  generateLanguage(targetLanguage),
  generatePreviousSentences(previousSentences),
].filter(Boolean).join('\n');

const generateModelMessageClozeExercise = (sentence) => JSON.stringify({
  words: sentence
});

const generateChatClozeExercise = (requestBody) => {
  const { wordOrPhrase, contextSentence, targetLanguage, previousSentences } = requestBody;

  return [
    {
      role: "user",
      parts: [{ text: geneerateUserMessageClozeExercise({ wordOrPhrase: 'über die Runden kommen', targetLanguage: 'German' }) }],
    },
    {
      role: "model",
      parts: [{ text: generateModelMessageClozeExercise(["Viele", "kleine", "Unternehmen", "kämpfen", "in", "der", "aktuellen", "Wirtschaftslage", "darum,", "_über_", "_die_", "_Runden_", "_zu_", "_kommen._"]) }],
    },
    {
      role: "user",
      parts: [{ text: geneerateUserMessageClozeExercise({ wordOrPhrase: 'triefen', targetLanguage: 'German', previousSentences: ["Die Nase triefte vor Kälte.", "Nach dem Regen begannen die Blätter der Bäume zu triefen.", "Sein Gesicht begann vor Angst zu triefen."] }) }],
    },
    {
      role: "model",
      parts: [{ text: generateModelMessageClozeExercise(["Die", "Wäsche", "auf", "der", "Leine", "begann", "zu", "_triefen_", "als", "der", "Regen", "einsetzte."]) }],
    },
    {
      role: "user",
      parts: [{ text: geneerateUserMessageClozeExercise({ wordOrPhrase, contextSentence, targetLanguage, previousSentences }) }],
    },
  ];
};


// --- Dynamic Content Selectors ---

const getSystemMessage = (mode) => {
  switch (mode) {
    case MODES.PAIR:
      return generateModelSystemMessageSentencePair;
    case MODES.CLOZE:
      return generateModelSystemMessageClozeExercise;
    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
};

const getChatContents = (requestBody) => {
  const { mode } = requestBody;

  switch (mode) {
    case MODES.PAIR:
      return generateChatSentencePair(requestBody);
    case MODES.CLOZE:
      return generateChatClozeExercise(requestBody);
    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
};

// --- Main Handler Function ---

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const requestBody = JSON.parse(event.body);
  const { mode } = requestBody
  

  try {

    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const config = {
      temperature: 2,
      responseMimeType: 'application/json',
      systemInstruction: [
        {
          text: getSystemMessage(mode),
        },
      ],
    };

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents : getChatContents(requestBody),
      config,
    });

    const response = result.candidates[0].content;


    const text = response.parts[0].text;

    return {
      statusCode: 200,
      body: text,
    };
  } catch (error) {
    console.error('Error generating sentence pair:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
};