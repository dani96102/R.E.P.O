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
  throw new Error('BOT_TOKEN is required');
}

let bot;
try {
  bot = new TelegramBot(token);
} catch (error) {
  console.error('Failed to initialize TelegramBot:', error);
  throw error;
}

// مدیریت دستور /start
bot.onText(/\/start/, async (msg) => {
  try {
    console.log('Received /start command from chat:', msg.chat.id);
    await bot.sendMessage(msg.chat.id, '🎮 بازی R.E.P.O آماده‌ست! روی دکمه کلیک کن 👇', {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '▶️ شروع بازی',
            web_app: { url: 'https://r-e-p-o.vercel.app' }
          }
        ]]
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
  }
});

// هندلر اصلی
module.exports = async (req, res) => {
  console.log('Received webhook request:', req.method);
  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method);
    return res.status(405).send('Method Not Allowed');
  }

  const buf = await buffer(req);
  let update;
  try {
    update = JSON.parse(buf.toString());
    console.log('Parsed update:', update);
  } catch (e) {
    console.error('Invalid JSON:', e);
    return res.status(400).send('Invalid JSON');
  }

  try {
    await bot.processUpdate(update);
    console.log('Update processed successfully');
  } catch (error) {
    console.error('Error processing update:', error);
    return res.status(500).send('Internal Server Error');
  }

  return res.status(200).send('OK');
};