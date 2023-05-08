// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');
const { OpenAIClient } = require('./openai');

var client = new OpenAIClient();

class EmptyBot extends ActivityHandler {
    constructor(userState) {
        super();

        this.userProperty = userState.createProperty('user');
        this.userState = userState;

        // This method is called when user joins the conversation.
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('Hello! Please ask me any questions!');
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        // This method is called when user sends a message to the bot.
        this.onMessage(async (context, next) => {
            var prompt = context.activity.text;
            var response = await client.getCahtCompletionsAsync(prompt);
            await context.sendActivity(response);
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.EmptyBot = EmptyBot;
