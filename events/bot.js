 // events/bot.js
import TelegramBot from 'node-telegram-bot-api';
import { TELEGRAM_BOT_TOKEN } from '../config.js';
import { messageHandler } from './handler.js';

let bot;

export async function startBot() {
  try {
    bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
    messageHandler(bot);
    console.log('🤖 Telegram bot is running...');
    return bot;
  } catch (error) {
    console.error('❌ Failed to start Telegram bot:', error);
    process.exit(1);
  }
}

// Exécution directe (optionnel)
if (import.meta.url === `file://${process.argv[1]}`) {
  startBot();
}

export { bot };