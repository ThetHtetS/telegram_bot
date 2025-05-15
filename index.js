const express = require("express")
require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const app = express()

const Port =  process.env.PORT || 8080

const menu = JSON.parse(fs.readFileSync('./menu.json', 'utf8'));


app.listen(Port, ()=> {
    
    console.log(`server is listening on port: ${Port}`)
})

   const bot = new TelegramBot(process.env.BOTTOKEN, {polling: true});

        bot.onText(/\/start/, (msg) => {
        bot.sendMessage(msg.chat.id, `👋 Welcome to Food Order Bot! Type /menu to see our items.`);
        });
        // bot.on('message', (msg) => {
        //     const chatId = msg.chat.id;
          
        // // send a message to the chat acknowledging receipt of their message
        // bot.sendMessage(chatId, 'Received your message');
        // });

        bot.onText(/\/menu/, (msg) => {
        let response = '📋 Menu:\n';
        menu.forEach(item => {
            response += `${item.id}. ${item.name} - $${item.price}\n`;
        });
        response += `\nTo order, type: /order <item_id>`;
        bot.sendMessage(msg.chat.id, response);
        });

        bot.onText(/\/order (\d+)/, (msg, match) => {
        const chatId = msg.chat.id;
        const itemId = parseInt(match[1]);
        const item = menu.find(m => m.id === itemId);

        if (!item) {
            return bot.sendMessage(chatId, '❌ Invalid item ID. Try /menu again.');
        }

        if (!orders[chatId]) orders[chatId] = [];
        orders[chatId].push(item);

        bot.sendMessage(chatId, `✅ ${item.name} added to your order! Type /cart to view or /checkout to finish.`);
        });

        bot.onText(/\/cart/, (msg) => {
        const chatId = msg.chat.id;
        const cart = orders[chatId];

        if (!cart || cart.length === 0) {
            return bot.sendMessage(chatId, '🛒 Your cart is empty.');
        }

        let response = '🛒 Your Cart:\n';
        let total = 0;
        cart.forEach((item, idx) => {
            response += `${idx + 1}. ${item.name} - $${item.price}\n`;
            total += item.price;
        });
        response += `\nTotal: $${total}`;
        bot.sendMessage(chatId, response);
        });

        bot.onText(/\/checkout/, (msg) => {
        const chatId = msg.chat.id;
        const cart = orders[chatId];

        if (!cart || cart.length === 0) {
            return bot.sendMessage(chatId, '🛒 Your cart is empty. Use /menu to add items.');
        }

        let total = cart.reduce((sum, item) => sum + item.price, 0);
        orders[chatId] = []; // Clear the cart

        bot.sendMessage(chatId, `🎉 Thank you for your order! Total: $${total}\nYour food will arrive soon!`);
        });