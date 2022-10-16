import * as deepl from 'deepl-node';
import limiter from 'lambda-rate-limiter';

const rateLimiter = limiter({
  interval:60000
});



// ({
//   interval: 60*1000
// }).check;

const handler = async (event, context) => {

  try {
    await rateLimiter.check(2,event.headers["client-ip"])
  } catch(err) {
    return {statusCode:429}
  }

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