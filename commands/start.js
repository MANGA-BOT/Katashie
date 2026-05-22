import { isUserInChannel } from '../utils/checkmember.js';

export async function start(bot, msg) {

  const CHANNEL_USERNAME = '@katashiev2';

  const GROUP_USERNAME = '@katashiebot';

  const chatId = msg.chat.id;

  const userId = msg.from.id;

  const isMember = await isUserInChannel(bot, userId);

  if (isMember) {

    await bot.sendPhoto(chatId, 'images/image3.jpg', {

      caption:

`┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋          *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  👋 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 ${msg.from.first_name}
┋
┋  ✅ 𝚈𝚘𝚞 𝚊𝚛𝚎 𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍
┋  ⚡ 𝚂𝚝𝚊𝚝𝚞𝚜 : 𝙾𝙽𝙻𝙸𝙽𝙴
┋  🤖 𝚂𝚢𝚜𝚝𝚎𝚖 : 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝙱𝚘𝚝
┋
┋  📌 𝚄𝚜𝚎 /menu
┋  𝚝𝚘 𝚟𝚒𝚎𝚠
┋  𝚊𝚕𝚕 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜
┗▣

𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*`,

      parse_mode: 'Markdown'

    });

  } else {

    await bot.sendPhoto(chatId, 'images/image1.jpg', {

      caption:

`┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋          *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  👋 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 ${msg.from.first_name}
┋
┋  🔒 𝚂𝚎𝚌𝚞𝚛𝚎 𝙿𝚊𝚒𝚛𝚒𝚗𝚐
┋  ⚡ 𝙵𝚊𝚜𝚝 𝙲𝚘𝚗𝚗𝚎𝚌𝚝
┋  🤖 𝚃𝚎𝚕𝚎𝚐𝚛𝚊𝚖 𝚂𝚢𝚜𝚝𝚎𝚖
┋
┋  📢 𝙹𝚘𝚒𝚗 𝚘𝚞𝚛
┋  𝚌𝚑𝚊𝚗𝚗𝚎𝚕 & 𝚐𝚛𝚘𝚞𝚙
┋  𝚝𝚘 𝚌𝚘𝚗𝚝𝚒𝚗𝚞𝚎
┗▣

👉 [𝙹𝚘𝚒𝚗 𝙲𝚑𝚊𝚗𝚗𝚎𝚕](${`https://t.me/${CHANNEL_USERNAME.replace('@', '')}`})

👉 [𝙹𝚘𝚒𝚗 𝙶𝚛𝚘𝚞𝚙](${`https://t.me/${GROUP_USERNAME.replace('@', '')}`})

𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*`,

      parse_mode: 'Markdown',

      reply_markup: {

        inline_keyboard: [

          [{ text: "✅ 𝙹'𝚊𝚒 𝚛𝚎𝚓𝚘𝚒𝚗𝚝", callback_data: 'check_join' }]

        ]
      }
    });
  }
}

export default start;