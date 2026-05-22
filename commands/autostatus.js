// commands/autostatus.js
import configManager from '../utils/manageConfigs.js';
import { sendStyled } from '../events/messageHandler.js';
import { OWNER_NUM } from '../config.js';

// Vérifier si l'auto‑visionnage est activé
export function isAutoStatusEnabled() {
    return configManager.config?.autoStatus?.enabled === true;
}

// Vérifier si les réactions sont activées
export function isStatusReactionEnabled() {
    return configManager.config?.autoStatus?.reactOn === true;
}

// Réagir à un statut (💚)
export async function reactToStatus(client, statusKey) {
    if (!isStatusReactionEnabled()) return;
    try {
        await client.relayMessage('status@broadcast', {
            reactionMessage: {
                key: statusKey,
                text: '💚'
            }
        }, {
            messageId: statusKey.id,
            statusJidList: [statusKey.remoteJid, statusKey.participant || statusKey.remoteJid]
        });
    } catch (err) {
        console.error('❌ Erreur réaction statut :', err.message);
    }
}

// Traiter les statuts (appelé depuis messageHandler)
export async function handleStatusUpdate(client, status) {
    if (!isAutoStatusEnabled()) return;
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (status.messages?.length) {
            const msg = status.messages[0];
            if (msg.key?.remoteJid === 'status@broadcast') {
                await client.readMessages([msg.key]);
                await reactToStatus(client, msg.key);
                return;
            }
        }
        if (status.key?.remoteJid === 'status@broadcast') {
            await client.readMessages([status.key]);
            await reactToStatus(client, status.key);
            return;
        }
        if (status.reaction?.key?.remoteJid === 'status@broadcast') {
            await client.readMessages([status.reaction.key]);
            await reactToStatus(client, status.reaction.key);
            return;
        }
    } catch (err) {
        console.error('❌ Erreur auto‑status :', err.message);
    }
}

// Commande principale .autostatus
export async function autostatusCommand(message, client, args) {
    const remoteJid = message.key.remoteJid;
    const senderJid = message.key.participant || message.key.remoteJid;
    const isOwner = message.key.fromMe || senderJid === OWNER_NUM + '@s.whatsapp.net';

    if (!isOwner) {
        await sendStyled(remoteJid, "⚠️ *Commande réservée au propriétaire.*", client);
        return;
    }

    if (!configManager.config.autoStatus) {
        configManager.config.autoStatus = { enabled: false, reactOn: false };
        configManager.save();
    }

    const config = configManager.config.autoStatus;

    if (args.length === 0) {
        const status = config.enabled ? '✅ activé' : '❌ désactivé';
        const reactStatus = config.reactOn ? '✅ activé' : '❌ désactivé';
        await sendStyled(remoteJid, `📱 *Auto‑Status*\n\nVisionnage auto : ${status}\nRéactions : ${reactStatus}\n\nUtilisation :\n.autostatus on/off\n.autostatus react on/off`, client);
        return;
    }

    const cmd = args[0].toLowerCase();

    if (cmd === 'on') {
        config.enabled = true;
        configManager.save();
        await sendStyled(remoteJid, "✅ *Visionnage automatique des statuts activé.*", client);
        return;
    }

    if (cmd === 'off') {
        config.enabled = false;
        configManager.save();
        await sendStyled(remoteJid, "❌ *Visionnage automatique des statuts désactivé.*", client);
        return;
    }

    if (cmd === 'react') {
        if (!args[1]) {
            await sendStyled(remoteJid, "❌ Utilisation : .autostatus react on/off", client);
            return;
        }
        const reactCmd = args[1].toLowerCase();
        if (reactCmd === 'on') {
            config.reactOn = true;
            configManager.save();
            await sendStyled(remoteJid, "✅ *Réactions aux statuts activées.*", client);
        } else if (reactCmd === 'off') {
            config.reactOn = false;
            configManager.save();
            await sendStyled(remoteJid, "❌ *Réactions aux statuts désactivées.*", client);
        } else {
            await sendStyled(remoteJid, "❌ Utilisation : .autostatus react on/off", client);
        }
        return;
    }

    await sendStyled(remoteJid, "❌ Commande inconnue. Utilise .autostatus sans argument pour l’aide.", client);
}