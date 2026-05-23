// commands/pindl.js
import axios from 'axios';
import { sendStyled } from '../events/messageHandler.js';

export default async function pindl(message, client, args) {
    const remoteJid = message.key.remoteJid;
    const url = args[0];

    if (!url) {
        await sendStyled(remoteJid, "❌ Utilisation : .pindl <url pinterest>\nExemple : .pindl https://pin.it/xxx", client);
        return;
    }

    if (!url.includes('pinterest.com') && !url.includes('pin.it')) {
        await sendStyled(remoteJid, "❌ Veuillez fournir une URL Pinterest valide.", client);
        return;
    }

    // Message d'attente
    await sendStyled(remoteJid, "⏳ Téléchargement du média Pinterest en cours...", client);

    try {
        const { data } = await axios.get(
            `https://api.drexapp.space/downloader/pinterest?url=${encodeURIComponent(url)}`
        );

        if (!data.status || !data.result) {
            throw new Error("Média introuvable");
        }

        const res = data.result;
        const type = res.type === 'video' ? 'Vidéo' : 'Image';
        const caption =
            `📌 *Pinterest - ${type}*\n\n` +
            `📝 Titre : ${res.title || 'N/A'}\n` +
            `👤 Auteur : ${res.author || 'N/A'} (@${res.username || 'N/A'})\n` +
            `📅 Date : ${res.upload_date ? new Date(res.upload_date).toDateString() : 'N/A'}\n\n` +
            `⚡ Powered by KATASHIE`;

        if (res.type === 'video') {
            await client.sendMessage(remoteJid, {
                video: { url: res.media_url },
                caption: caption,
                mimetype: 'video/mp4'
            }, { quoted: message });
        } else {
            await client.sendMessage(remoteJid, {
                image: { url: res.media_url },
                caption: caption
            }, { quoted: message });
        }

    } catch (err) {
        console.error('PINDL Error:', err);
        await sendStyled(remoteJid, "❌ Erreur lors du téléchargement du média Pinterest.\nVérifiez l'URL et réessayez.", client);
    }
}
