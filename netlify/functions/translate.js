const axios = require("axios");

exports.handler = async function (event, context) {
  try {
    const { sentence } = event.queryStringParameters;
    const response = await axios.get(
      `https://api-free.deepl.com/v2/translate?auth_key=${
        process.env.DEEPL_API_KEY
      }&text=${encodeURIComponent(sentence)}&target_lang=de&formality=less`
    );

    console.log(response);
    return {
      statusCode: 200,
      body: JSON.stringify({ translation: response.data.translations[0].text }),
    };
  } catch (err) {
    return {
      statusCode: 404,
      body: err.toString(),
    };
  }
};
