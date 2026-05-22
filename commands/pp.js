import { downloadMediaMessage } from 'baileys';
import sharp from 'sharp';

export async function pp(message, client) {

    try {

        const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        const targetMsg = quoted?.imageMessage || message.message.imageMessage;

        if (!targetMsg) {

            return await client.sendMessage(message.key.remoteJid, {

                text: `
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋          *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  ⚠️ *𝙸𝙼𝙰𝙶𝙴 𝙸𝙽𝚃𝚁𝙾𝚄𝚅𝙰𝙱𝙻𝙴*
┋
┋  📌 Répondez à une image
┋  ou envoyez une image
┋  avec la commande.
┋
┗▣

𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
`
            });
        }

        // 📥 Télécharger l'image
        const buffer = await downloadMediaMessage(
            { message: quoted, client },
            "buffer"
        );

        // 🖼️ Traitement image
        const imageBuffer = await sharp(buffer)
            .resize(256, 256)
            .toFormat('png')
            .toBuffer();

        // ✅ Mise à jour photo profil
        await client.updateProfilePicture(client.user.id, imageBuffer);

        await client.sendMessage(message.key.remoteJid, {

            text: `
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋          *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  ✅ *𝙿𝚁𝙾𝙵𝙸𝙻 𝚄𝙿𝙳𝙰𝚃𝙴*
┋
┋  🖼️ Photo de profil
┋  mise à jour avec succès.
┋
┗▣

𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
`,

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

    } catch (err) {

        console.log(err);

        await client.sendMessage(message.key.remoteJid, {

            text: `
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋          *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  ❌ *𝙴𝚁𝚁𝙴𝚄𝚁*
┋
┋  Impossible de modifier
┋  la photo de profil.
┋
┗▣

𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
`
        });
    }
}

export default pp;