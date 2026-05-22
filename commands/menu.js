import { BOT_NAME, OWNER_NAME } from '../config.js';
import fs from 'fs';
import path from 'path';

export async function menu(bot, msg) {
  const chatId = msg.chat.id;

  const today = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = daysOfWeek[today.getDay()];
  const currentDate = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  let caption = `
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋        *${BOT_NAME}*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋ 👋 𝙷𝚎𝚕𝚕𝚘 ${msg.from.first_name}
┋ 📅 𝙳𝚊𝚢 : ${currentDay}
┋ 📆 𝙳𝚊𝚝𝚎 : ${currentDate}/${currentMonth}/${currentYear}
┋ ⚡ 𝚅𝚎𝚛𝚜𝚒𝚘𝚗 : 1.6.0
┋ 🧩 𝙿𝚕𝚞𝚐𝚒𝚗𝚜 : 6
┗▣
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋        *𝙱𝙾𝚃 𝙲𝙼𝙳*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋ ⬢ /start
┋ ⬢ /menu
┋ ⬢ /connect 237xxxxx
┋ ⬢ /disconnect 237xxxxx
┗▣
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋        *𝙾𝚆𝙽𝙴𝚁 𝙲𝙼𝙳*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋ ⬢ /addprem id
┋ ⬢ /delprem id
┗▣
𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *${OWNER_NAME} 𝚃𝚎𝚌𝚑*
`;

  const escapeMarkdownV2 = (text) => {
    return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
  };

  caption = escapeMarkdownV2(caption);

  const photoPath = path.resolve('./images/image4.jpg');
  if (!fs.existsSync(photoPath)) {
    await bot.sendMessage(chatId, '⚠️ The file *menu.jpg* was not found in the project folder.', { parse_mode: 'MarkdownV2' });
    return;
  }

  try {
    await bot.sendPhoto(chatId, fs.createReadStream(photoPath), {
      caption,
      parse_mode: 'MarkdownV2'
    });
  } catch (err) {
    console.error('❌ Error sending menu:', err.message);
    await bot.sendMessage(chatId, `❌ Failed to send menu.\nError: ${err.message}`, { parse_mode: 'MarkdownV2' });
  }
}

export default menu;