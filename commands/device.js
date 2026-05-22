import { getDevice } from 'baileys';

export async function device(message, client) {

    const remoteJid = message.key.remoteJid;

    try {

        // 📱 Récupération de l'appareil cible
        const quotedMessageId = message.message.extendedTextMessage.contextInfo.stanzaId;

        const device = getDevice(quotedMessageId);

        await client.sendMessage(remoteJid, {
            text: `_La cible utilise un système ${device}_`
        });

    } catch (error) {

        await client.sendMessage(remoteJid, {
            text: `_Erreur : impossible de récupérer les informations de l'appareil. ${error.message}_`
        });
    }

}

export default device;