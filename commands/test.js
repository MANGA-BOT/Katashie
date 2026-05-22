import fs from "fs"
import { prepareWAMessageMedia } from "baileys"

export async function test(message, client) {

    const from = message?.key?.remoteJid

    if (!from) return false

    // 🖼️ Préparation image
    const media = await prepareWAMessageMedia(
        {
            image: fs.readFileSync("./images/image7.jpg")
        },
        {
            upload: client.waUploadToServer
        }
    )

    // 📢 Message style KATASHIE
    await client.relayMessage(
        from,
        {
            groupStatusMessageV2: {
                message: {
                    imageMessage: {
                        ...media.imageMessage,

                        caption: `
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋          *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  ✅ *𝚃𝙴𝚂𝚃 𝙼𝙴𝚂𝚂𝙰𝙶𝙴*
┋
┋  🖼️ 𝙸𝚖𝚊𝚐𝚎 𝚂𝚎𝚗𝚍
┋  ⚡ 𝚂𝚝𝚊𝚝𝚞𝚜 : 𝙾𝙽𝙻𝙸𝙽𝙴
┋  🤖 𝚂𝚢𝚜𝚝𝚎𝚖 : ACTIVE
┋
┗▣

𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
`
                    }
                }
            }
        },
        {}
    )

    return true
}

export default test