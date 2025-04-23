// api/telegram-webhook.js
const { buffer } = require('micro');
const TelegramBot = require('node-telegram-bot-api');

// غیرفعال کردن bodyParser پیش‌فرض
module.exports.config = {
  api: { bodyParser: false }
};

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('⚠️ BOT_TOKEN not set');
}
const bot = new TelegramBot(token);

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, '🎮 بازی R.E.P.O آماده‌ست! روی دکمه کلیک کن 👇', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: "▶️ شروع بازی",
          web_app: { url: "https://r-e-p-o.vercel.app" }
        }
      ]]
    }
  });
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }
  const buf = await buffer(req);
  let update;
  try {
    update = JSON.parse(buf.toString());
  } catch (e) {
    return res.status(400).send('Invalid JSON');
  }
  await bot.processUpdate(update);
  return res.status(200).send('OK');
};