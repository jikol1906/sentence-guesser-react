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

    const { sentence, lang } = event.queryStringParameters;
    const targetLang = langToDeepLTargetLang(lang);
    const {text} = await translator.translateText(sentence,null,targetLang, {formality:'more'})

 

    return {
      statusCode: 200,
      body: JSON.stringify({ translation: text }),
    };
  } catch (err) {
    return {
      statusCode: 404,
      body: err.toString(),
    };
  }
};


export {handler}