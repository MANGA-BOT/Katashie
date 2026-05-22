// commands/autosticker.js

import configManager from '../utils/manageConfigs.js';

export async function autosticker(message, client) {

    const remoteJid = message.key.remoteJid;

    const number = client.user.id.split(':')[0];

    const body =
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text ||
        "";

    const args = body.trim().split(/\s+/);

    const option = args[1]?.toLowerCase();

    if (!option || !["on", "off"].includes(option)) {

        return await client.sendMessage(remoteJid, {

            text:
`┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ❌ INVALID OPTION
┋
┋  📌 EXAMPLE :
┋  .autosticker on
┋  .autosticker off
┗▣

𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*`

        });

    }

    configManager.config.users[number].autosticker =
        option === "on";

    configManager.save();

    await client.sendMessage(remoteJid, {

        text:
`┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ✅ AUTOSTICKER
┋
┋  STATUS :
┋  ${option.toUpperCase()}
┗▣

𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*`

    });

}

export default autosticker;