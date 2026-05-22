import { isUserInChannel } from '../utils/checkmember.js'
import { TELEGRAM_CHANNEL } from '../config.js'
import { TELEGRAM_GROUP } from '../config.js'

export async function handleCheckJoin(bot, callbackQuery) {

  const chatId = callbackQuery.message.chat.id

  const messageId = callbackQuery.message.message_id

  const userId = callbackQuery.from.id

  const user = callbackQuery.from.first_name || "unknown"

  await bot.answerCallbackQuery(callbackQuery.id)

  try {

    await bot.deleteMessage(chatId, messageId)

  } catch (e) {

    console.warn("Couldn't delete message:", e.message)

  }

  const isMember = await isUserInChannel(bot, userId)

  if (isMember) {

    await bot.sendPhoto(chatId, 'images/image3.jpg', {

      caption:

`┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋          *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  👋 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 ${user}
┋
┋  ✅ 𝚈𝚘𝚞 𝚊𝚛𝚎
┋  𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍
┋
┋  📌 𝚄𝚜𝚎 /menu
┋  𝚝𝚘 𝚟𝚒𝚎𝚠
┋  𝚊𝚕𝚕 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜
┗▣

𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*`,

      parse_mode: 'Markdown'

    })

  } else {

    await bot.sendPhoto(chatId, 'images/image1.jpg', {

      caption:

`┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋          *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  🚫 𝚈𝚘𝚞 𝚊𝚛𝚎
┋  𝚗𝚘𝚝 𝚒𝚗
┋  𝚝𝚑𝚎 𝚐𝚛𝚘𝚞𝚙𝚜
┋
┋  📢 𝙹𝚘𝚒𝚗
┋  𝚝𝚑𝚎 𝚌𝚑𝚊𝚗𝚗𝚎𝚕
┋  & 𝚐𝚛𝚘𝚞𝚙
┋  𝚝𝚘 𝚌𝚘𝚗𝚝𝚒𝚗𝚞𝚎
┗▣

👉 [𝙹𝚘𝚒𝚗 𝙲𝚑𝚊𝚗𝚗𝚎𝚕](https://t.me/${TELEGRAM_CHANNEL.replace('@', '')})

👉 [𝙹𝚘𝚒𝚗 𝙶𝚛𝚘𝚞𝚙](https://t.me/${TELEGRAM_GROUP.replace('@', '')})

𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*`,

      parse_mode: 'Markdown',

      reply_markup: {

        inline_keyboard: [

          [{ text: "✅ 𝙹'𝚊𝚒 𝚛𝚎𝚓𝚘𝚒𝚗𝚝", callback_data: 'check_join' }]

        ]
      }
    })
  }
}

export default handleCheckJoin