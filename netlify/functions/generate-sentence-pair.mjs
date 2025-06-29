import { GoogleGenAI } from '@google/genai';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { wordOrPhrase, contextSentence, sourceLanguage, targetLanguage } = JSON.parse(event.body);

    if (!wordOrPhrase || !sourceLanguage || !targetLanguage) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'wordOrPhrase, sourceLanguage, and targetLanguage are required' }),
      };
    }

    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const fullContents = [
      { role: 'user', parts: [{ text: `{"wordOrPhrase": "ausziehen", "sourceLanguage": "german", "targetLanguage": "english"}` }] },
      { role: 'model', parts: [{ text: `{"german": "Ich muss nächste Woche ausziehen, weil mein Mietvertrag abläuft.", "english": "I have to move out next week because my rental contract is expiring."}` }] },
      { role: 'user', parts: [{ text: `{"wordOrPhrase": "ködern", "contextSentence": "Wie Großkanzleien mit Luxusreisen junge Anwälte ködern", "sourceLanguage": "german", "targetLanguage": "english"}` }] },
      { role: 'model', parts: [{ text: `{"german": "Die Firma versucht, neue Talente mit hohen Gehältern zu ködern.", "english": "The company tries to lure new talents with high salaries."}` }] },
      { role: 'user', parts: [{ text: JSON.stringify({ wordOrPhrase, contextSentence, sourceLanguage, targetLanguage }) }] },
    ];

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: fullContents,
      config: {
        temperature: 2.0,
        thinkingBudget: 0, // Disables thinking
        responseMimeType: 'application/json',
        systemInstruction: 
              `Your purpose is to generate a sentence pair; a sentence in ${sourceLanguage} and the sentence in its ${targetLanguage} translation. In the ${sourceLanguage} sentence a word/phrase provided by the user should be present.

              The user will provide you with a word/phrase, the source and target languages, and an optional context sentence in which the word/phrase occurs. The input will be in the following format:

              {
                "wordOrPhrase": "<Word that should be in the ${sourceLanguage} sentence>",
                "contextSentence": "<Optional context sentence to show a concrete usage of the word. The sentence you generate should be very different from this one>",
                "sourceLanguage": "${sourceLanguage}",
                "targetLanguage": "${targetLanguage}"
              }

              You will then return the sentence pair in the following JSON format:

              {
                "${sourceLanguage}" : "<The sentence in ${sourceLanguage} here>",
                "${targetLanguage}" : "<The sentence in its ${targetLanguage} translation here>"
              }
              `,
      }
    });

    // This is the corrected section
    const response = result.candidates[0].content;

    console.log(response)

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