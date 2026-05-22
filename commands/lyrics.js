// commands/lyrics.js
import axios from 'axios';
import { sendStyled } from '../events/messageHandler.js';
import { BOT_NAME } from '../config.js';

export default async function lyrics(message, client, args) {
    const remoteJid = message.key.remoteJid;
    const query = args.join(' ').trim();

    if (!query) {
        await sendStyled(remoteJid, "🎵 *Recherche de paroles*\n\nUtilisation : .lyrics <nom de la chanson>\nExemple : .lyrics faded", client);
        return;
    }

    await sendStyled(remoteJid, "🔍 Recherche des paroles...", client);

    try {
        const url = `https://apiskeith.top/search/lyrics2?query=${encodeURIComponent(query)}`;
        const { data } = await axios.get(url);

        if (!data.status || !data.result) {
            await sendStyled(remoteJid, "❌ Paroles non trouvées.", client);
            return;
        }

        let lyricsText = data.result;
        let truncated = false;
        if (lyricsText.length > 3000) {
            lyricsText = lyricsText.slice(0, 3000) + "\n\n_...paroles tronquées_";
            truncated = true;
        }

        const caption = `🎵 *${(BOT_NAME || "KATASHIE").toUpperCase()} LYRICS*\n\n🔎 Requête : ${query}\n\n${lyricsText}\n\n⚡ Propulsé par Keith API`;
        await sendStyled(remoteJid, caption, client);
    } catch (err) {
        console.error("LYRICS ERROR :", err);
        await sendStyled(remoteJid, `❌ Erreur lors de la récupération des paroles.\n${err.message}`, client);
    }
}