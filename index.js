const express = require("express")
require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const app = express()

const Port =  process.env.PORT || 8080



app.listen(Port, ()=> {
        
        const bot = new TelegramBot(process.env.BOTTOKEN, {polling: true});

        // Matches "/echo [whatever]"
        // bot.onText(/\/echo (.+)/, (msg, match) => {
        // // 'msg' is the received Message from Telegram
        // // 'match' is the result of executing the regexp above on the text content
        // // of the message

        // const chatId = msg.chat.id;
        // const resp = match[1]; // the captured "whatever"

        // // send back the matched "whatever" to the chat
        // bot.sendMessage(chatId, resp);
        // });

        bot.on('message', (msg) => {
            const chatId = msg.chat.id;
          
        // send a message to the chat acknowledging receipt of their message
        bot.sendMessage(chatId, 'Received your message');
        });


    console.log(`server is listening on port: ${Port}`)
})