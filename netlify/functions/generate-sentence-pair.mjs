import { GoogleGenAI } from '@google/genai';

const MODES = {
  PAIR: 'pair',
  CLOZE: 'cloze',
}

const generateWordOrPhrase = (wordOrPhrase) => wordOrPhrase ? `WORD/PHRASE: ${wordOrPhrase}` : '';
const generateLanguage = (language) => language ? `LANGUAGE: ${language}` : '';
const generatePreviousSentences = (previousSentences) => previousSentences ? `PREVIOUS_SENTENCES: ${JSON.stringify(previousSentences)}` : '';
const generateTargetLanguage = (targetLanguage) => targetLanguage ? `TARGET: ${targetLanguage}` : '';
const generateSourceLanguage = (sourceLanguage) => sourceLanguage ? `SOURCE: ${sourceLanguage}` : '';
const generateContextSentence = (contextSentence) => contextSentence ? `CONTEXT_SENTENCE: ${contextSentence}` : '';

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

const generateModelMessageSentencePair = (germanSentence, englishSentence) => {
  return `
  {
    "german": "${germanSentence}",
    "english": "${englishSentence}"
  }
`;
};

const generateChatSentencePair = (requestBody) => {

  const { wordOrPhrase, contextSentence, sourceLanguage, targetLanguage, previousSentences } = requestBody;

  if (!wordOrPhrase || !sourceLanguage || !targetLanguage) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'wordOrPhrase, sourceLanguage, and targetLanguage are required in sentence pair mode.' }),
    };
  }

  return [
    {
      role: "user",
      parts: [
        {
          text: generateUserMessageSentencePair(
            "absegnen",
            "Der Chef muss den Urlaubsantrag noch absegnen.",
            "english",
            "german"
          ),
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: generateModelMessageSentencePair(
            "Der Chef muss den Urlaubsantrag noch <WORD>absegnen</WORD>.",
            "The boss still needs to approve the vacation request."
          ),
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: generateUserMessageSentencePair(
            "vergegenwärtigen",
            "Es ist wichtig, sich zu vergegenwärtigen, dass das menschliche Bewusstsein in seiner Natur dual angelegt ist.",
            "english",
            "german",
            [
              "Es ist wichtig, sich zu vergegenwärtigen, dass das menschliche Bewusstsein in seiner Natur dual angelegt ist.",
            ]
          ),
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: generateModelMessageSentencePair(
            "Es ist wichtig, sich die Konsequenzen seiner Handlungen zu <WORD>vergegenwärtigen</WORD>.",
            "It is important to visualize the consequences of your actions."
          ),
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: generateUserMessageSentencePair(
            wordOrPhrase,
            contextSentence,
            sourceLanguage,
            targetLanguage,
            previousSentences
          ),
        },
      ],
    },
  ];
}

const generateModelSystemMessageSentencePair = `
You are an expert linguist and AI assistant who creates high-quality sentence pairs for language learning. Your task is to analyze the provided input, which contains a word or phrase and a context sentence as well as a source and target language

Based on the meaning of the word/phrase in that context, create a new, distinct, and natural-sounding example sentence in the target language, that clearly demonstrates its usage. provide the translation of your newly created sentence into the other specified language (the source language).

the sentence you generate in the source language should also be vastly different from the list of words contained in PREVIOUS_SENTENCES (if it is present in the input).

Your final output must be a single JSON object. The keys of this JSON object must be the lowercase names of the languages (e.g., "english", "german").`

const geneerateUserMessageClozeExercise = ({wordOrPhrase, contextSentence, targetLanguage, previousSentences}) => [
  generateWordOrPhrase(wordOrPhrase),
  generateContextSentence(contextSentence),
  generateLanguage(targetLanguage),
  generatePreviousSentences(previousSentences),
].filter(Boolean).join('\n');

const generateModelMessageClozeExercise = (sentence) => JSON.stringify({
  words: sentence
})


const generateModelSystemMessageClozeExercise = `You generate cloze deletion exercises

The user will provide the following input:

  * **WORD/PHRASE**: The word or phrase to be hidden.
  * **CONTEXT\_SENTENCE** (Optional): A sentence to provide context for the word/phrase.
  * **LANGUAGE**: The language in which the sentence should be generated.
  * **PREVIOUS\_SENTENCES** (Optional): A list of sentences that the generated sentence should differ from as much as possible.

Based on this information, you will generate a random cloze deletion sentence for the given word/phrase. Your output will be a JSON object with a single key \`words\`, whose value is an array of the words in the sentence. The word(s) that should be hidden will be wrapped in underscores (e.g., \`_word_\`). If there are multiple words that should be hidden, wrap each of them individually. It is very important that a single word starting with underscore must always also end with underscore

You **MUST** construct the sentence in such a way that the hidden word(s) can be easily deduced from the surrounding words and the overall context of the sentence.`

const generateChatClozeExercise = (requestBody) => {
  const { wordOrPhrase, contextSentence, targetLanguage, previousSentences } = requestBody;

  return [
    {
      role: "user",
      parts: [
        {
          text: geneerateUserMessageClozeExercise({
            wordOrPhrase : 'über die Runden kommen',
            targetLanguage : 'German',
          }),
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: generateModelMessageClozeExercise([
            "Viele",
            "kleine",
            "Unternehmen",
            "kämpfen",
            "in",
            "der",
            "aktuellen",
            "Wirtschaftslage",
            "darum,",
            "_über_",
            "_die_",
            "_Runden_",
            "_zu_",
            "_kommen._"
          ]),
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: geneerateUserMessageClozeExercise({
            wordOrPhrase : 'triefen',
            targetLanguage : 'German',
            previousSentences : [
              "Die Nase triefte vor Kälte.",
              "Nach dem Regen begannen die Blätter der Bäume zu triefen.", "Sein Gesicht begann vor Angst zu triefen."
            ],
          }),
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: generateModelMessageClozeExercise([
            "Die",
            "Wäsche",
            "auf",
            "der",
            "Leine",
            "begann",
            "zu",
            "_triefen_",
            "als",
            "der",
            "Regen",
            "einsetzte."
          ]),
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: geneerateUserMessageClozeExercise({
            wordOrPhrase,
            contextSentence,
            targetLanguage,
            previousSentences
          }),
        },
      ],
    },
  ];
}


const getSystemMessage = (mode) => {
  switch (mode) {
    case MODES.PAIR:
      return generateModelSystemMessageSentencePair;
    case MODES.CLOZE:
      return generateModelSystemMessageClozeExercise;
    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
}

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
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

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
      contents : getChatContents(event.body),
      config,
    });

    // This is the corrected section
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