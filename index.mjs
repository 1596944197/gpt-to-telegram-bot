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
  baseUrl: process.env.OPENAI_BASE_URL || '',
})

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// # 在用户输入斜杠时给予提示
bot.setMyCommands([{ command: 'start', description: '触发聊天,有效期为10分钟' }])

let isReady = false
// # 匹配
bot.onText(/\/start/, async (msg, match) => {
  if (isReady) return
  isReady = true
  setTimeout(() => {
    isReady = false
  }, 600000);
});

bot.on('message', async (event, msgType) => {
  if (!isReady) return
  if (event.from?.is_bot) return
  const chatId = event.chat.id;
  const text = event.text;

  if (text?.toLocaleLowerCase() === 'reset') {
    gpt.reset()
    bot.sendMessage(chatId, '重置成功');
    return
  }
  try {
    const aiText = await gpt.sendMessage(text)
    bot.sendMessage(chatId, aiText);
  } catch (error) {
    console.warn(error)
    bot.sendMessage(chatId, '出错了');
  }
})

