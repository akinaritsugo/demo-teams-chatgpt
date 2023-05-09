// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');
const { OpenAIClient } = require('./openai');

var client = new OpenAIClient();

class EchoBot extends ActivityHandler {
  constructor() {
    super();
    // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
    this.onMessage(async (context, next) => {
      // const replyText = `Echo: ${context.activity.text}`;
      // await context.sendActivity(MessageFactory.text(replyText, replyText));
      // // By calling next() you ensure that the next BotHandler is run.
      try {
        const message = context.activity.text;
        const response = await client.getCahtCompletionsAsync(message);
        await context.sendActivity(MessageFactory.text(response));
      } catch (err) {
        console.log(err);
        await context.sendActivity(MessageFactory.text('エラーが発生しました。しばらく時間を空けて試してください。'));
      }
      await next();
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
