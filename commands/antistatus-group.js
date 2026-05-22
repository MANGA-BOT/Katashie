// commands/antistatus-group.js
import configManager from '../utils/manageConfigs.js';
import { sendStyled } from '../events/messageHandler.js';

// Initialiser la structure si absente
if (!configManager.config.antistatusWarns) {
    configManager.config.antistatusWarns = {};
    configManager.save();
}

export async function antistatusCommand(message, client, args) {
    const remoteJid = message.key.remoteJid;
    if (!remoteJid.endsWith('@g.us')) {
        await sendStyled(remoteJid, "❌ 𝙲𝚎𝚝𝚝𝚎 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚎 𝚗𝚎\n 𝚏𝚘𝚗𝚌𝚝𝚒𝚘𝚗𝚗𝚎 𝚚𝚞𝚎 𝚍𝚊𝚗𝚜 𝚞𝚗 𝚐𝚛𝚘𝚞𝚙𝚎.", client);
        return;
    }

    const option = args[0]?.toLowerCase();
    if (option !== 'on' && option !== 'off') {
        await sendStyled(remoteJid, "⚠️ *𝚄𝚝𝚒𝚕𝚒𝚜𝚊𝚝𝚒𝚘𝚗* : .𝙰𝚗𝚝𝚒𝚜𝚝𝚊𝚝𝚞𝚜-𝚐𝚛𝚘𝚞𝚙 𝚘𝚗/𝚘𝚏𝚏", client);
        return;
    }

    // Activer / désactiver dans la config globale
    if (!configManager.config.antistatusGroups) configManager.config.antistatusGroups = {};
    configManager.config.antistatusGroups[remoteJid] = (option === 'on');
    configManager.save();

    const status = option === 'on' ? 'activé' : 'désactivé';
    await sendStyled(remoteJid, `✅ 𝙰𝚗𝚝𝚒‑𝚜𝚝𝚊𝚝𝚞𝚜 𝚍𝚎𝚜 𝚖𝚎𝚗𝚝𝚒𝚘𝚗𝚜 ${status} 𝚙𝚘𝚞𝚛 𝚌𝚎 𝚐𝚛𝚘𝚞𝚙𝚎.`, client);
}

export async function handleAntiStatus(message, client) {
    const remoteJid = message.key.remoteJid;
    if (!remoteJid?.endsWith('@g.us')) return;
    if (!configManager.config.antistatusGroups?.[remoteJid]) return;

    // Détection du message de statut mentionnant le groupe
    const isStatusMention = !!message.message?.groupStatusMentionMessage;
    if (!isStatusMention) return;

    const sender = message.key.participant;
    if (!sender) return;

    // Supprimer le message
    try {
        await client.sendMessage(remoteJid, { delete: message.key });
    } catch (err) {
        console.error("Erreur suppression statut:", err);
    }

    // Gestion des avertissements
    const warns = configManager.config.antistatusWarns;
    if (!warns[remoteJid]) warns[remoteJid] = {};
    if (!warns[remoteJid][sender]) warns[remoteJid][sender] = 0;
    warns[remoteJid][sender]++;
    configManager.save();

    const totalWarns = warns[remoteJid][sender];
    const mention = `@${sender.split('@')[0]}`;

    await sendStyled(remoteJid, `⚠️ ${mention}\n𝚕𝚎𝚜 𝚖𝚎𝚗𝚝𝚒𝚘𝚗𝚜 𝚍𝚎 𝚜𝚝𝚊𝚝𝚞𝚝 𝚜𝚘𝚗𝚝\n 𝚒𝚗𝚝𝚎𝚛𝚍𝚒𝚝𝚎.\n*𝚠𝚊𝚛𝚗* : ${totalWarns}/3`, client, [sender]);

    // Expulsion après 3 avertissements
    if (totalWarns >= 3) {
        try {
            await client.groupParticipantsUpdate(remoteJid, [sender], "remove");
            delete warns[remoteJid][sender];
            configManager.save();
            await sendStyled(remoteJid, `🚫 ${mention} a été supprimé du groupe.`, client, [sender]);
        } catch (err) {
            console.error("Erreur expulsion:", err);
        }
    }
}