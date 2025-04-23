// api/telegram-webhook.js
import { buffer } from 'micro';
import axios from 'axios';

// غیرفعال کردن bodyParser پیش‌فرض
export const config = {
  api: { bodyParser: false }
};

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('⚠️ BOT_TOKEN not set');
  throw new Error('BOT_TOKEN is required');
}

const TELEGRAM_API = `https://api.telegram.org/bot${token}`;

// تابع برای ارسال پیام به جای bot.sendMessage
async function sendMessage(chatId, text, replyMarkup) {
  try {
    const response = await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: text,
      reply_markup: replyMarkup
    });
    console.log('Message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending message with axios:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  }
}

// تابع برای پردازش آپدیت‌ها
async function processUpdate(update) {
  if (update.message && update.message.text === '/start') {
    const chatId = update.message.chat.id;
    await sendMessage(
      chatId,
      '🎮 بازی R.E.P.O آماده‌ست! روی دکمه کلیک کن 👇',
      {
        inline_keyboard: [[
          {
            text: '▶️ شروع بازی',
            web_app: { url: 'https://r-e-p-o.vercel.app' }
          }
        ]]
      }
    );
  }
}

// هندلر اصلی
export default async function handler(req, res) {
  console.log('Received webhook request:', req.method);
  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method);
    return res.status(405).send('Method Not Allowed');
  }

  let buf;
  try {
    buf = await buffer(req);
  } catch (error) {
    console.error('Error reading buffer:', error);
    return res.status(500).send('Buffer Error');
  }

  let update;
  try {
    update = JSON.parse(buf.toString());
    console.log('Parsed update:', update);
  } catch (error) {
    console.error('Invalid JSON:', error);
    return res.status(400).send('Invalid JSON');
  }

  try {
    await processUpdate(update);
    console.log('Update processed successfully');
  } catch (error) {
    console.error('Error processing update:', error.message);
    console.error('Stack:', error.stack);
    return res.status(500).send('Internal Server Error');
  }

  return res.status(200).send('OK');
}