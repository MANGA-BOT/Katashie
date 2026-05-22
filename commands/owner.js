import { OWNER_NUM } from '../config.js'
import { OWNER_NAME } from '../config.js'

export async function owner(message, client) {

    const remoteJid = message.key.remoteJid;

    const vcard =
            'BEGIN:VCARD\n'
            + 'VERSION:3.0\n'
            + `FN:${OWNER_NAME}\n`
            + `ORG:𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴 𝚂𝚈𝚂𝚃𝙴𝙼;\n`
            + `TEL;type=CELL;type=VOICE;waid=${OWNER_NUM}:+${OWNER_NUM}\n`
            + 'END:VCARD';

    await client.sendMessage(remoteJid, {

        text: `
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋          *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  👑 *𝙾𝚆𝙽𝙴𝚁 𝙸𝙽𝙵𝙾*
┋
┋  👤 *ɴᴀᴍᴇ* : ${OWNER_NAME}
┋  📞 *ɴᴜᴍʙᴇʀ* : +${OWNER_NUM}
┋  🤖 *ʙᴏᴛ* : KATASHIE
┋
┗▣

𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
`,

        contacts: {
            displayName: `𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴 - ${OWNER_NAME}`,
            contacts: [{ vcard }]
        },

        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363401347800000@newsletter",
                newsletterName: "𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴 𝚂𝚈𝚂𝚃𝙴𝙼",
                serverMessageId: 143
            }
        }

    });

}

export default owner;