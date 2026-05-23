import { sendStyled } from '../events/messageHandler.js';

export default async function pingCommand(message, client) {
    try {
        const msgTimestamp = Number(message.messageTimestamp) * 1000;
        const latency = Date.now() - msgTimestamp;

        const text = `👾 *KATASHIE* : ${latency} ms`;

        await sendStyled(
            message.key.remoteJid,
            text,
            client
        );

    } catch (err) {
        console.error('Erreur commande ping :', err);
    }
}
