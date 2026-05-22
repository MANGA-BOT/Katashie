// commands/channelSender.js
import fs from 'fs';
import path from 'path';
import { WA_CHANNEL } from "../config.js";

async function channelSender(message, client, texts, num, mentions = []) {
    const remoteJid = message.key.remoteJid;
    const imagePath = path.resolve(`${num}.png`);
    let thumbBuffer;
    try {
        thumbBuffer = fs.readFileSync(imagePath);
    } catch (err) {
        console.error("❌ Thumbnail not found:", err.message);
        thumbBuffer = null;
    }

    await client.sendMessage(remoteJid, {
        text: texts,
        mentions: mentions,   // ← support des mentions
        contextInfo: {
            externalAdReply: {
                title: "𝙱𝙸𝙴𝙽𝚅𝙴𝙽𝚄𝙴 𝙳𝙰𝙽𝚂 𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴",
                body: "𝙰𝙱𝙴𝚂𝚂-𝙼𝙳",
                mediaType: 1,
                thumbnail: thumbBuffer,
                renderLargerThumbnail: false,
                mediaUrl: `${num}.png`,
                sourceUrl: `${num}.png`,
                thumbnailUrl: `${WA_CHANNEL}`,
            }
        }
    });
}

export default channelSender;