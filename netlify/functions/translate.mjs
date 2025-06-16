import * as deepl from 'deepl-node';

const langToDeepLTargetLang = (lang) => {
  switch (lang) {
    case 'german':
      return 'de';
    case 'spanish':
      return 'es';
    case 'french':
      return 'fr';
    default:
      return 'de';
  }
}

const handler = async (event, context) => {
  try {

    const authKey = process.env.DEEPL_API_KEY;
    const translator = new deepl.Translator(authKey);

    // Data is now in the body of the POST request
    const { sentence, lang } = JSON.parse(event.body);
    const targetLang = langToDeepLTargetLang(lang);
    const {text} = await translator.translateText(sentence,null,targetLang, {formality:'more'})

    return {
      statusCode: 200,
      body: JSON.stringify({ translation: text }),
    };
  } catch (err) {
    return {
      statusCode: 500, // Using 500 for server-side errors is more conventional
      body: JSON.stringify({ error: err.toString() }),
    };
  }
};

export {handler}