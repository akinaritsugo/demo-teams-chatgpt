const axios = require('axios');

const BASE_URL = process.env.ENDPOINT;
const API_KEY = process.env.API_KEY;
const DEPLOYMENT_NAME = process.env.DEPLOYMENT_NAME;
const API_VERSION = '2023-03-15-preview';
const URL = `${ BASE_URL }/openai/deployments/${ DEPLOYMENT_NAME }/chat/completions?api-version=${ API_VERSION }`;

class OpenAIClient {
  constructor() {
  }

  async getCahtCompletionsAsync(prompt) {
    var payload = {
      messages:
        [
          { role: 'system', content: 'あなたは親切なアシスタントです。' },
          { role: 'user', content: prompt }
        ]
    };

    var response = await axios.post(URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY
      }
    });
    // console.log(JSON.stringify(response.data, null, 2));
    var data = response.data;
    var message = data.choices[0]?.message;
    return message?.content;
  }
}

module.exports.OpenAIClient = OpenAIClient;
