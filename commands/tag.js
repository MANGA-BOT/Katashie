import fs, { createWriteStream } from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import configManager from '../utils/manageConfigs.js';
import { OWNER_NAME } from '../config.js';
import { downloadMediaMessage } from 'baileys';
import channelSender from './channelSender.js';

// ======================= TAG FUNCTIONS =======================
export async function tagall(message, client) {
    const remoteJid = message.key.remoteJid;
    if (!remoteJid.includes('@g.us')) {
        await channelSender(message, client, `
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋  ⚠️ *Cette commande ne fonctionne*
> ┋  *que dans les groupes.*
> ┗▣
power by *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
        `, "");
        return;
    }

    try {
        const groupMetadata = await client.groupMetadata(remoteJid);
        const participants = groupMetadata.participants.map(u => u.id);
        const mentionsText = participants.map(u => `➤ @${u.split('@')[0]}`).join('\n');

        const tagMessage = `
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋     *TAG GÉNÉRAL*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋
> ┋ 👥 *Groupe :* ${groupMetadata.subject}
> ┋
> ${mentionsText.split('\n').map(line => `> ┋ ${line}`).join('\n')}
> ┋
> ┋ 💬 *Message de :* @${message.key.participant?.split('@')[0] || 'Someone'}
> ┗▣
> power by *${OWNER_NAME} Tech* 🥷🏾
        `.trim();

        // Utilisation de channelSender avec mentions
        await channelSender(message, client, tagMessage, "2.png", participants);
    } catch (error) {
        console.error("❌ _Error mentioning all:_", error);
    }
}

export async function tagadmin(message, client) {
    const remoteJid = message.key.remoteJid;
    const botNumber = client.user.id.split(':')[0] + '@s.whatsapp.net';

    if (!remoteJid.includes('@g.us')) {
        await channelSender(message, client, `
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋  ⚠️ *Cette commande ne fonctionne*
> ┋  *que dans les groupes.*
> ┗▣
power by *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
        `, "");
        return;
    }

    try {
        const { participants } = await client.groupMetadata(remoteJid);
        const admins = participants.filter(p => p.admin && p.id !== botNumber).map(p => p.id);

        if (!admins.length) {
            await channelSender(message, client, `
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋  ❌ *Aucun administrateur trouvé.*
> ┗▣
power by *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
            `, "");
            return;
        }

        const adminList = admins.map(u => `@${u.split('@')[0]}`).join('\n');
        const text = `
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋     *ADMINISTRATEURS*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋
> ${adminList.split('\n').map(line => `> ┋ ${line}`).join('\n')}
> ┗▣
power by *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
        `;
        // Utilisation de channelSender avec mentions (admins)
        await channelSender(message, client, text, "3.png", admins);
    } catch (error) {
        console.error("❌ Error mentioning admins:", error);
        await channelSender(message, client, `
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋  ❌ *Erreur lors du tag des admins.*
> ┗▣
power by *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
        `, "");
    }
}
// ======================= TAG MEDIA (audio, vidéo, image, sticker, texte) =======================
async function convertToPTT(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .audioCodec("libopus")
            .format("ogg")
            .audioBitrate("48k")
            .audioChannels(1)
            .save(outputPath)
            .on("end", () => resolve(outputPath))
            .on("error", reject);
    });
}

export async function respond(message, client, lid) {
    const number = client.user.id.split(":")[0];
    const remoteJid = message.key.remoteJid;
    const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || "";

    if (!configManager.config?.users[number]) return;
    const tagRespond = configManager.config.users[number]?.response;
    if (!message.key.fromMe && tagRespond && (messageBody.includes(`@${number}`) || messageBody.includes("@" + lid[0]?.split("@")[0]))) {
        console.log("Mention détectée, envoi du média enregistré");
        const mediaType = configManager.config.users[number]?.tagMediaType;
        const mediaPath = configManager.config.users[number]?.tagMediaPath;
        const mediaText = configManager.config.users[number]?.tagText;

        if (mediaType === 'text' && mediaText) {
            // Envoyer un texte
            await channelSender(message, client, mediaText, "");
        } else if (mediaType === 'audio' && mediaPath && fs.existsSync(mediaPath)) {
            // Convertir en PTT si nécessaire (optionnel)
            const outputAudio = path.join("temp", `tag_${Date.now()}.ogg`);
            if (!fs.existsSync("temp")) fs.mkdirSync("temp");
            const convertedPath = await convertToPTT(mediaPath, outputAudio);
            await client.sendMessage(remoteJid, {
                audio: { url: convertedPath },
                mimetype: "audio/ogg; codecs=opus",
                ptt: false,
                contextInfo: {
                    stanzaId: message.key.id,
                    participant: message.key.participant || remoteJid,
                    quotedMessage: message.message
                }
            });
            fs.unlinkSync(convertedPath);
        } else if (mediaType === 'video' && mediaPath && fs.existsSync(mediaPath)) {
            // Envoyer une vidéo
            const videoBuffer = fs.readFileSync(mediaPath);
            await client.sendMessage(remoteJid, {
                video: videoBuffer,
                caption: "",
                contextInfo: {
                    stanzaId: message.key.id,
                    participant: message.key.participant || remoteJid,
                    quotedMessage: message.message
                }
            });
        } else if (mediaType === 'image' && mediaPath && fs.existsSync(mediaPath)) {
            // Envoyer une image
            const imageBuffer = fs.readFileSync(mediaPath);
            await client.sendMessage(remoteJid, {
                image: imageBuffer,
                caption: "",
                contextInfo: {
                    stanzaId: message.key.id,
                    participant: message.key.participant || remoteJid,
                    quotedMessage: message.message
                }
            });
        } else if (mediaType === 'sticker' && mediaPath && fs.existsSync(mediaPath)) {
            // Envoyer un sticker
            const stickerBuffer = fs.readFileSync(mediaPath);
            await client.sendMessage(remoteJid, {
                sticker: stickerBuffer,
                contextInfo: {
                    stanzaId: message.key.id,
                    participant: message.key.participant || remoteJid,
                    quotedMessage: message.message
                }
            });
        } else {
            // Fallback : message par défaut
            await channelSender(message, client, "⚠️ Aucun média valide enregistré pour la réponse aux tags.", "");
        }
    }
}

export async function settag(message, client) {
    const number = client.user.id.split(':')[0];
    const remoteJid = message.key.remoteJid;
    try {
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMessage) {
            await channelSender(message, client, `
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋  ❌ *Répondez à un message (audio, vidéo, image, sticker ou texte).*
> ┗▣
power by *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
            `, "");
            return;
        }

        let mediaType = null;
        let mediaPath = null;
        let mediaText = null;

        // Détection du type de message cité
        if (quotedMessage.audioMessage) {
            mediaType = 'audio';
            const audio = await downloadMediaMessage({ message: quotedMessage }, "stream");
            const filePath = path.join(process.cwd(), `${number}_tag_audio.mp3`);
            const writeStream = createWriteStream(filePath);
            await new Promise((resolve, reject) => {
                audio.pipe(writeStream);
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });
            mediaPath = filePath;
        } else if (quotedMessage.videoMessage) {
            mediaType = 'video';
            const video = await downloadMediaMessage({ message: quotedMessage }, "stream");
            const filePath = path.join(process.cwd(), `${number}_tag_video.mp4`);
            const writeStream = createWriteStream(filePath);
            await new Promise((resolve, reject) => {
                video.pipe(writeStream);
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });
            mediaPath = filePath;
        } else if (quotedMessage.imageMessage) {
            mediaType = 'image';
            const image = await downloadMediaMessage({ message: quotedMessage }, "stream");
            const filePath = path.join(process.cwd(), `${number}_tag_image.jpg`);
            const writeStream = createWriteStream(filePath);
            await new Promise((resolve, reject) => {
                image.pipe(writeStream);
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });
            mediaPath = filePath;
        } else if (quotedMessage.stickerMessage) {
            mediaType = 'sticker';
            const sticker = await downloadMediaMessage({ message: quotedMessage }, "stream");
            const filePath = path.join(process.cwd(), `${number}_tag_sticker.webp`);
            const writeStream = createWriteStream(filePath);
            await new Promise((resolve, reject) => {
                sticker.pipe(writeStream);
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });
            mediaPath = filePath;
        } else if (quotedMessage.conversation || quotedMessage.extendedTextMessage?.text) {
            mediaType = 'text';
            mediaText = quotedMessage.conversation || quotedMessage.extendedTextMessage?.text;
        } else {
            await channelSender(message, client, `
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋  ❌ *Type de média non supporté.*
> ┗▣
power by *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
            `, "");
            return;
        }

        // Enregistrement dans configManager
        configManager.config.users[number] = configManager.config.users[number] || {};
        configManager.config.users[number].tagMediaType = mediaType;
        if (mediaType !== 'text') {
            configManager.config.users[number].tagMediaPath = mediaPath;
            // Supprimer l'ancien tagAudioPath si existant (pour éviter doublon)
            if (configManager.config.users[number].tagAudioPath) {
                const oldPath = configManager.config.users[number].tagAudioPath;
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                delete configManager.config.users[number].tagAudioPath;
            }
        } else {
            configManager.config.users[number].tagText = mediaText;
        }
        configManager.save();

        // Message de confirmation stylisé
        let confirmText = `✅ *Média de tag mis à jour* : ${mediaType}`;
        if (mediaType === 'text') confirmText += `\n\n📝 "${mediaText}"`;
        await channelSender(message, client, confirmText, "");
    } catch (error) {
        console.error("_Error changing the tag media:_", error);
        await channelSender(message, client, "❌ *Erreur lors de la mise à jour du média de tag.*", "");
    }
}

// ======================= TAG OPTION =======================
export async function tagoption(message, client) {
    const number = client.user.id.split(':')[0];
    const remoteJid = message.key.remoteJid;
    const messageBody = message.message?.conversation || message.message?.extendedTextMessage?.text || "";
    const args = messageBody.slice(1).trim().split(/\s+/).slice(1);

    if (!configManager.config?.users[number]) return;

    try {
        const option = args.join(' ').toLowerCase();
        if (option.includes("on")) {
            configManager.config.users[number].response = true;
            configManager.save();
            await channelSender(message, client, `
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋  ✅ *Réponse aux tags activée.*
> ┗▣
power by *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
            `, "");
        } else if (option.includes("off")) {
            configManager.config.users[number].response = false;
            configManager.save();
            await channelSender(message, client, `
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋  ❌ *Réponse aux tags désactivée.*
> ┗▣
power by *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
            `, "");
        } else {
            await channelSender(message, client, `
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋  ⚠️ *Choisis une option : on / off*
> ┗▣
power by *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
            `, "");
        }
    } catch (error) {
        console.error("_Error changing the tag option:_", error);
    }
}

// ======================= TAG MESSAGE =======================
export async function tag(message, client) {
    const remoteJid = message.key.remoteJid;
    if (!remoteJid.includes('@g.us')) {
        await channelSender(message, client, `
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋  ⚠️ *Cette commande ne fonctionne*
> ┋  *que dans les groupes.*
> ┗▣
power by *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
        `, "");
        return;
    }

    try {
        const groupMetadata = await client.groupMetadata(remoteJid);
        const participants = groupMetadata.participants.map(u => u.id);
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (quotedMessage) {
            const quotedText = quotedMessage.conversation || quotedMessage.extendedTextMessage?.text || "";
            const sticker = quotedMessage.stickerMessage;
            if (sticker) {
                // Envoi de sticker avec mentions (pas de channelSender)
                await client.sendMessage(remoteJid, {
                    sticker,
                    mentions: participants
                });
            } else {
                const styledText = `
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋  ${quotedText.split('\n').map(line => `> ┋ ${line}`).join('\n')}
> ┗▣
power by *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
                `;
                await channelSender(message, client, styledText, "", participants);
            }
            return;
        }

        const messageBody = message.message?.conversation || message.message?.extendedTextMessage?.text || "";
        const textBody = messageBody.slice(1).trim().split(/\s+/).slice(1).join(' ') || '@everyone';
        const styledText = `
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋  ${textBody.split('\n').map(line => `> ┋ ${line}`).join('\n')}
> ┗▣
power by *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
        `;
        await channelSender(message, client, styledText, "", participants);
    } catch (error) {
        console.error("_Error mentioning all:_", error);
    }
}

export default { tagall, tagadmin, tagoption, settag, respond, tag };