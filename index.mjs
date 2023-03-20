import dotenv from 'dotenv';
import { createGptChat } from 'gpt-api';
import TelegramBot from "node-telegram-bot-api";


dotenv.config()
// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN;

if (!token) {
  throw new Error('错误：请在 .env 文件中设置 TELEGRAM_TOKEN')
}

const gpt = createGptChat({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/b (.+)/, async (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match?.[1] || ''; // the captured "whatever"

  const aiText = await gpt.sendMessage(resp)

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, aiText);
});
