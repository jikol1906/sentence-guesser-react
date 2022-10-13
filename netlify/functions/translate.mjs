import * as deepl from 'deepl-node';



const handler = async (event, context) => {
  try {

    const authKey = process.env.DEEPL_API_KEY;
    const translator = new deepl.Translator(authKey);

    const { sentence } = event.queryStringParameters;
    const {text} = await translator.translateText(sentence,null,"de", {formality:'more'})

 

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