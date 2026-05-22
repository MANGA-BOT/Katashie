import start from '../commands/start.js';

import menu from '../commands/menu.js';

import handleCheckJoin from '../utils/checkJoin.js';

import { isUserInChannel } from '../utils/checkmember.js';

import sessionCount from '../utils/sessionCount.js';

import redirect from '../utils/redirect.js';

import { LIMIT } from '../config.js';

import connect from '../utils/connect.js';

import disconnect from '../utils/disconnect.js';

export function messageHandler(bot) {

  bot.onText(/\/start/, async (msg) => {

    await start(bot, msg);

  });

  bot.onText(/\/myid/, async (msg) => {

    const id = msg.from.id;

    return bot.sendMessage(msg.chat.id,

`┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  🆔 𝚈𝚘𝚞𝚛 𝚃𝚎𝚕𝚎𝚐𝚛𝚊𝚖 𝙸𝙳
┋  ⚡ ${id}
┗▣

𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*`,

    { parse_mode: 'Markdown' });

  });

  bot.onText(/\/menu/, async (msg) => {

    const userId = msg.from.id;

    const isMember = await isUserInChannel(bot, userId);

    if (!isMember) return await start(bot, msg);

    await menu(bot, msg);

  });

  bot.onText(/\/connect(?: (.+))?/, async (msg, match) => {

    const userId = msg.from.id;

    const isMember = await isUserInChannel(bot, userId);

    if (!isMember) return await start(bot, msg);

    const session = sessionCount();

    if (session >= LIMIT) {

      await redirect(bot, msg);

    } else {

      await connect(bot, msg, match);

    }

  });

  bot.onText(/\/disconnect(?: (.+))?/, async (msg, match) => {

    const userId = msg.from.id;

    const isMember = await isUserInChannel(bot, userId);

    if (!isMember) return await start(bot, msg);

    const session = sessionCount();

    if (session >= LIMIT) {

      await redirect(bot, msg);

    } else {

      await disconnect(bot, msg, match);

    }

  });

  bot.on('callback_query', async (callbackQuery) => {

    if (callbackQuery.data === 'check_join') {

      await handleCheckJoin(bot, callbackQuery);

    }

  });

}