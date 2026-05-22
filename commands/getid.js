import { sendStyled } from '../events/messageHandler.js';

export async function getidCommand(message, client) {
    const remoteJid = message.key.remoteJid;
    if (!remoteJid.endsWith('@g.us')) {
        await sendStyled(remoteJid, "❌ Cette commande ne fonctionne que dans un groupe.", client);
        return;
    }
    await sendStyled(remoteJid, `👥 *ID du groupe* :\n\`${remoteJid}\``, client);
}