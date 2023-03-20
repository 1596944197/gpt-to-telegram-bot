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

  const chatId = msg.chat.id;
  const resp = match?.[1] || '';

  try {
    const aiText = await gpt.sendMessage(resp)
    bot.sendMessage(chatId, aiText);
  } catch (error) {
    console.warn(error)
    bot.sendMessage(chatId, '出错了');
  }
});
