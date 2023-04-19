// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');
const axios = require('axios');

var getChatCompletion = async function (prompt) {
  const BASE_URL = process.env.ENDPOINT;
  const API_KEY = process.env.API_KEY;
  const DEPLOYMENT_NAME = process.env.DEPLOYMENT_NAME;
  const API_VERSION = "2023-03-15-preview";

  const URL = `${BASE_URL}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}`;

  var payload = {
    "messages":
      [
        { "role": "system", "content": "You are a helpful assistant." },
        { "role": "user", "content": prompt }
      ]
  };

  try {
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
  } catch (err) {
    console.log(err);
  }
};


class EchoBot extends ActivityHandler {
  constructor() {
    super();
    // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
    this.onMessage(async (context, next) => {
      const replyText = await getChatCompletion(context.activity.text);
      await context.sendActivity(MessageFactory.text(replyText, replyText));
      await next();
      // const replyText = `Echo: ${context.activity.text}`;
      // await context.sendActivity(MessageFactory.text(replyText, replyText));
      // // By calling next() you ensure that the next BotHandler is run.
      // await next();
    });

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      const welcomeText = 'Hello and welcome!';
      for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
        if (membersAdded[cnt].id !== context.activity.recipient.id) {
          await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
        }
      }
      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });
  }
}

module.exports.EchoBot = EchoBot;
