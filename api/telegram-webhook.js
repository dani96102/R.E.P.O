// api/telegram-webhook.js
import TelegramBot from 'node-telegram-bot-api';
import { buffer } from 'micro';

// غیرفعال‌کردن bodyParser پیش‌فرض
export const config = { api: { bodyParser: false } };

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token);

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, '🎮 بازی R.E.P.O آماده‌ست! روی دکمه کلیک کن 👇', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: "▶️ شروع بازی",
          web_app: { url: "https://https://r-e-p-o.vercel.app/" }
        }
      ]]
    }
  });
});

export default async function handler(req, res) {
  const buf = await buffer(req);
  const update = JSON.parse(buf.toString());
  await bot.processUpdate(update);
  res.status(200).send('OK');
}
