// commands/group.js
import axios from 'axios';
import sharp from 'sharp';
import { isJidGroup, getContentType } from 'baileys';
import configManager from '../utils/manageConfigs.js';
import channelSender from '../commands/channelSender.js';
import { OWNER_NUM } from '../config.js';
import fs from 'fs';

// ======================= FONCTIONS D'AIDE =======================
async function isGroupAdmin(client, groupJid, userJid) {
    try {
        const metadata = await client.groupMetadata(groupJid);
        const participant = metadata.participants.find(p => p.id === userJid);
        return !!(participant?.admin);
    } catch {
        return false;
    }
}

async function isAdmin(client, groupJid, userJid) {
    try {
        const metadata = await client.groupMetadata(groupJid);
        const participants = metadata.participants;
        return participants.some(p => p.id === userJid && (p.admin === "admin" || p.admin === "superadmin"));
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des métadonnées du groupe :", error);
        return false;
    }
}

// ======================= WELCOME / GOODBYE =======================
export async function welcome(update, client) {
    try {
        const metadata = await client.groupMetadata(update.id);
        for (const participantObj of update.participants) {
            const participant = participantObj.id; // ← l'ID est dans la propriété id
            const name = participant.split("@")[0];
            // ... reste du code

            if (update.action === 'add') {
                const welcomeMsg = `
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋
> ┋  👋 𝚆𝚎𝚕𝚌𝚘𝚖𝚎
> ┋  @${name}
> ┋
> ┋  🎉 𝚈𝚘𝚞 𝚓𝚘𝚒𝚗𝚎𝚍
> ┋  *${metadata.subject}*
> ┋
> ┋  📚 𝚁𝚎𝚊𝚍 𝚝𝚑𝚎
> ┋  𝚐𝚛𝚘𝚞𝚙 𝚛𝚞𝚕𝚎𝚜
> ┋
> ┋  ⚡ 𝙴𝚗𝚓𝚘𝚢 𝚢𝚘𝚞𝚛
> ┋  𝚜𝚝𝚊𝚢 𝚑𝚎𝚛𝚎
> ┗▣
>   𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
                `.trim();
                await client.sendMessage(update.id, {
                    image: fs.readFileSync('./images/image1.jpg'), // Assurez-vous que le fichier existe
                    caption: welcomeMsg,
                    mentions: [participant],
                    contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363409977869938@newsletter",
                            newsletterName: "𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴",
                            serverMessageId: 143
                        }
                    }
                });
            } else if (update.action === 'remove') {
                const byeMsg = `
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋
> ┋  😢 𝙶𝚘𝚘𝚍𝚋𝚢𝚎
> ┋  @${name}
> ┋
> ┋  📤 𝚈𝚘𝚞 𝚕𝚎𝚏𝚝
> ┋  *${metadata.subject}*
> ┋
> ┋  🕊️ 𝚂𝚎𝚎 𝚢𝚘𝚞
> ┋  𝚊𝚐𝚊𝚒𝚗 𝚖𝚊𝚢𝚋𝚎
> ┗▣
>   𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
                `.trim();
                await client.sendMessage(update.id, {
                    image: fs.readFileSync('./images/image3.jpg'), // Assurez-vous que le fichier existe
                    caption: byeMsg,
                    mentions: [participant],
                    contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363409977869938@newsletter",
                            newsletterName: "𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴",
                            serverMessageId: 143
                        }
                    }
                });
            }
        }
    } catch (err) {
        console.error("❌ Error in welcome/goodbye:", err);
    }
}

// ======================= ACTIONS DE GROUPE =======================
export async function handleGroupAction(message, client, action) {
    const remoteJid = message.key.remoteJid;
    try {
        const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';
        const commandAndArgs = messageBody.slice(1).trim();
        const parts = commandAndArgs.split(/\s+/);
        const args = parts.slice(1);
        const user = message.key.participant;
        let participant;

        if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            participant = message.message.extendedTextMessage.contextInfo.participant;
        } else if (args.length > 0) {
            if (user?.includes("@lid")) {
                participant = args[0].replace('@', '') + '@lid';
            } else {
                participant = args[0].replace('@', '') + '@s.whatsapp.net';
            }
        } else {
            throw new Error('Aucun participant spécifié.');
        }

        const num = `@${participant.replace('@s.whatsapp.net', '').replace('@lid', '')}`;
        await client.groupParticipantsUpdate(remoteJid, [participant], action);

        const actionMessages = {
            remove: `${num} a été retiré.`,
            promote: `_${num} a été promu administrateur._`,
            demote: `_${num} a été retiré des administrateurs._`
        };
        await client.sendMessage(remoteJid, { text: actionMessages[action] });
    } catch (error) {
        await client.sendMessage(remoteJid, { text: `_Erreur : Impossible d'effectuer l'action. ${error.message}_` });
    }
}

export async function kick(message, client) {
    await handleGroupAction(message, client, 'remove');
}

export async function promote(message, client) {
    await handleGroupAction(message, client, 'promote');
}

export async function demote(message, client) {
    await handleGroupAction(message, client, 'demote');
}

export async function kickall(message, client) {
    const remoteJid = message.key.remoteJid;
    try {
        const groupMetadata = await client.groupMetadata(remoteJid);
        const participants = groupMetadata.participants;
        let removedCount = 0;
        for (const participant of participants) {
            if (!participant.admin) {
                try {
                    await client.groupParticipantsUpdate(remoteJid, [participant.id], 'remove');
                    removedCount++;
                } catch (err) {
                    console.log(err);
                }
            }
        }
        await client.sendMessage(remoteJid, { text: `_Nettoyage terminé. ${removedCount} membre(s) retiré(s)._` });
    } catch (error) {
        await client.sendMessage(remoteJid, { text: `_Erreur : Impossible de traiter le retrait. ${error.message}_` });
    }
}

export async function purge(message, client) {
    const remoteJid = message.key.remoteJid;
    try {
        const groupMetadata = await client.groupMetadata(remoteJid);
        const nonAdmins = groupMetadata.participants.filter(p => !p.admin).map(p => p.id);
        if (nonAdmins.length === 0) {
            await client.sendMessage(remoteJid, { text: 'Aucun membre non-admin à retirer.' });
            return;
        }
        await client.groupParticipantsUpdate(remoteJid, nonAdmins, 'remove');
        const purgeMessage = `Ｑ𝐮𝐚𝐧𝐭 ｌ𝐞 ｓ𝐢𝐥𝐞𝐧𝐜𝐞 ｏ𝐮 ｔ𝐨𝐧 ａ̂𝐦𝐞 ｓ𝐞 ｎ𝐨𝐢𝐞 , 
 ｊ𝐞 ｔ'𝐨𝐛𝐬𝐞𝐫𝐯𝐞, ｉ𝐧𝐯𝐢𝐬𝐢𝐛𝐥𝐞 ｅ𝐭 ｆ𝐫𝐨𝐢𝐝, ｃ𝐡𝐚𝐪𝐮𝐞 ｐ𝐚𝐬 ｑ𝐮𝐞 ｔ𝐮 ｆ𝐚𝐢𝐬... Ｔ𝐞 ｍ𝐞̀𝐧𝐞 𝐚̀ ｍ𝐨𝐢. 
 ｅ𝐭 ｑ𝐮𝐚𝐧𝐝 ｌ𝐚 ｎ𝐮𝐢𝐭 ｔ'𝐞𝐧𝐠𝐥𝐨𝐮𝐭𝐢𝐫𝐚  , ｔ𝐮 ｃ𝐨𝐦𝐩𝐫𝐞𝐧𝐝𝐫𝐚𝐬 ｑ𝐮𝐞 ｓ'𝐞́𝐭𝐚𝐢𝐭 ｄ𝐞́𝐣𝐚 ｍ𝐨𝐢.

                      Ｋａｔａｓｈｉｅ ＭＤ.`;
        // (Optionnel) envoyer l'image avec caption
        await client.sendMessage(remoteJid, { text: purgeMessage });
    } catch (error) {
        console.log(error);
    }
}

export async function bye(message, client) {
    const remoteJid = message.key.remoteJid;
    try {
        await client.sendMessage(remoteJid, { text: '_Au revoir !_' });
        await client.groupLeave(remoteJid);
    } catch (error) {
        await client.sendMessage(remoteJid, { text: `_Erreur : Impossible de quitter le groupe. ${error.message}_` });
    }
}

export async function pall(message, client) {
    const remoteJid = message.key.remoteJid;
    try {
        const groupMetadata = await client.groupMetadata(remoteJid);
        const nonAdmins = groupMetadata.participants.filter(p => !p.admin).map(p => p.id);
        await client.groupParticipantsUpdate(remoteJid, nonAdmins, 'promote');
        await client.sendMessage(remoteJid, { text: '_Tous les non-admins ont été promus administrateurs._' });
    } catch (error) {
        await client.sendMessage(remoteJid, { text: `_Erreur : Impossible de promouvoir les participants. ${error.message}_` });
    }
}

export async function dall(message, client, userLid) {
    const remoteJid = message.key.remoteJid;
    try {
        const { participants } = await client.groupMetadata(remoteJid);
        const botNumber = client.user.id.split(':')[0] + '@s.whatsapp.net';
        const botId = userLid ? userLid.split(':')[0] + "@lid" : "";
        const admins = participants.filter(p => p.admin && p.id !== botNumber && p.id !== botId).map(p => p.id);
        if (admins.length > 0) {
            await client.groupParticipantsUpdate(remoteJid, admins, 'demote');
            await client.sendMessage(remoteJid, { text: '_Je prends le contrôle de ce groupe pour l\'instant._' });
        } else {
            await client.sendMessage(remoteJid, { text: 'Aucun autre admin à rétrograder.' });
        }
    } catch (error) {
        await client.sendMessage(remoteJid, { text: `_Erreur : ${error.message}_` });
    }
}

export async function mute(message, client) {
    const remoteJid = message.key.remoteJid;
    try {
        await client.groupSettingUpdate(remoteJid, 'announcement');
        await client.sendMessage(remoteJid, { text: 'Le groupe a été verrouillé (seuls les admins peuvent envoyer).' });
    } catch (error) {
        await client.sendMessage(remoteJid, { text: `_Erreur : ${error.message}_` });
    }
}

export async function unmute(message, client) {
    const remoteJid = message.key.remoteJid;
    try {
        await client.groupSettingUpdate(remoteJid, 'not_announcement');
        await client.sendMessage(remoteJid, { text: 'Le groupe a été déverrouillé (tout le monde peut envoyer).' });
    } catch (error) {
        await client.sendMessage(remoteJid, { text: `_Erreur : ${error.message}_` });
    }
}

export async function gclink(message, client) {
    const remoteJid = message.key.remoteJid;
    try {
        const code = await client.groupInviteCode(remoteJid);
        await client.sendMessage(remoteJid, { text: `https://chat.whatsapp.com/${code}` });
    } catch (error) {
        await client.sendMessage(remoteJid, { text: `_Erreur lors de la génération du lien du groupe : vous n'êtes pas admin. ${error.message}_` });
    }
}

export function gcid(message, client) {
    const remoteJid = message.key.remoteJid;
    if (remoteJid.endsWith('@g.us')) {
        channelSender(message, client, `L'ID du groupe est : ${remoteJid}`, 5);
    } else {
        channelSender(message, client, `Désolé, ce n'est pas un groupe.`, 3);
    }
}

export async function mentiondetect(message, client, lids = []) {
    const remoteJid = message.key.remoteJid;
    const number = client.user.id.split(':')[0];
    const senderJid = message.key.participant || remoteJid;
    const botId = number + "@s.whatsapp.net";
    const botLids = Array.isArray(lids) ? lids : [lids];
    const type = getContentType(message.message);

    if (type === 'groupStatusMentionMessage') {
        console.log("mention détectée");
        const senderIsAdmin = await isAdmin(client, remoteJid, senderJid);
        const mainBotIsAdmin = await isAdmin(client, remoteJid, botId);
        const linkedBotsAreAdmin = await Promise.all(botLids.map(lid => isAdmin(client, remoteJid, lid)));
        const atLeastOneLinkedBotAdmin = linkedBotsAreAdmin.includes(true);
        const botIsAdmin = mainBotIsAdmin || atLeastOneLinkedBotAdmin;
        const senderIsBot = senderJid === botId || botLids.includes(senderJid);

        if (!botIsAdmin || senderIsAdmin || senderIsBot) return;
        await client.sendMessage(remoteJid, { delete: message.key });
    }
}

// ======================= ANTI-LINK =======================
export async function antilink(message, client) {
    // Récupérer le statut depuis la config ou le définir
    const remoteJid = message.key.remoteJid;
    const number = client.user.id.split(':')[0];
    const antilinkEnabled = configManager.config?.users[number]?.antilink || false;
    if (!antilinkEnabled) return;

    const messageText = message.message?.extendedTextMessage?.text || message.message?.conversation || "";
    // Regex simple pour détecter les liens
    const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|\b\w+\.(com|org|net|fr|xyz|me|link)\b)/i;
    if (linkRegex.test(messageText)) {
        // Vérifier si l'expéditeur est admin
        const senderJid = message.key.participant || remoteJid;
        const isSenderAdmin = await isAdmin(client, remoteJid, senderJid);
        if (!isSenderAdmin) {
            await client.sendMessage(remoteJid, { delete: message.key });
            await client.sendMessage(remoteJid, { text: `⚠️ Lien détecté ! ${senderJid.split('@')[0]} a été supprimé.` });
            // Optionnel : virer le membre
            // await client.groupParticipantsUpdate(remoteJid, [senderJid], 'remove');
        }
    }
}

export async function linkDetection(message, client, lids = []) {
    // Alternative à antilink, appelée dans messageHandler
    await antilink(message, client);
}

// ======================= EXPORT PAR DÉFAUT =======================
export default {
    welcome, 
    kick,
    kickall,
    promote,
    demote,
    bye,
    pall,
    dall,
    mute,
    unmute,
    gclink,
    purge,
    gcid,
    mentiondetect,
    antilink,
    linkDetection
};