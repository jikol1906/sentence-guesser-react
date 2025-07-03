import { GoogleGenAI } from '@google/genai';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { wordOrPhrase, contextSentence, sourceLanguage, targetLanguage, previousSentences } = JSON.parse(event.body);

    if (!wordOrPhrase || !sourceLanguage || !targetLanguage) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'wordOrPhrase, sourceLanguage, and targetLanguage are required' }),
      };
    }

    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: 
              `
WORD: absegnen
CONTEXT: Der Chef muss den Urlaubsantrag noch absegnen.
SOURCE: english
TARGET: german
              `,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: 
              `
{
  "german": "Der Ausschuss wird die neuen Vorschriften morgen absegnen.",
  "english": "The committee will approve the new regulations tomorrow."
}
              `,
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: 
              `
WORD: vergegenwärtigen
SOURCE: english
TARGET: german
PREVIOUS_SENTENCES: ["Es ist wichtig, sich zu vergegenwärtigen, dass das menschliche Bewusstsein in seiner Natur dual angelegt ist."]
              `,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: 
              `
{
  "german": "Es ist wichtig, sich die Konsequenzen seiner Handlungen zu vergegenwärtigen.",
  "english": "It is important to visualize the consequences of your actions."
}
              `,
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: 
              `
WORD: ${wordOrPhrase}
CONTEXT: ${contextSentence}
SOURCE: ${sourceLanguage}
TARGET: ${targetLanguage}
${previousSentences ? `PREVIOUS_SENTENCES: ${JSON.stringify(previousSentences)}` : ''}
            `,
          },
        ],
      },
    ];

    const config = {
      temperature: 2,
      responseMimeType: 'application/json',
      systemInstruction: [
        {
          text: 
            `
You are an expert linguist and AI assistant who creates high-quality sentence pairs for language learning. Your task is to analyze the provided input, which contains a word or phrase and a context sentence as well as a source and target language

Based on the meaning of the word/phrase in that context, create a new, distinct, and natural-sounding example sentence in the target language, that clearly demonstrates its usage. Then, provide the translation of your newly created sentence into the other specified language (the source language).

the sentence you generate in the source language should also be vastly different from the list of words contained in PREVIOUS_SENTENCES (if it is present in the input).

Your final output must be a single JSON object. The keys of this JSON object must be the lowercase names of the languages (e.g., "english", "german").
            `,
        },
      ],
    };

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
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