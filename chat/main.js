const axios = require('axios');

const BASE_URL = process.env.ENDPOINT;
const API_KEY = process.env.API_KEY;
const DEPLOYMENT_NAME = process.env.DEPLOYMENT_NAME;
const API_VERSION = "2023-03-15-preview";

const URL = `${BASE_URL}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}`;

var prompt = "Once upon a time,";
var payload = {
  "messages":
    [
      { "role": "system", "content": "You are a helpful assistant." },
      { "role": "user", "content": prompt }
    ]
};

(async () => {
  try {
    var response = await axios.post(URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY
      }
    });
    console.log(JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.log(err);
  }
})();
