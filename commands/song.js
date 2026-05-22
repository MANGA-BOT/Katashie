// commands/song.js
import ytSearch from 'yt-search';
import axios from 'axios';
import { BOT_NAME } from '../config.js';
import { sendStyled } from '../events/messageHandler.js';

const NEWSLETTER = "120363409977869938@newsletter";

export default async function song(message, client, args) {
    try {
        const remoteJid = message.key.remoteJid;
        const query = args.join(" ");

        if (!query) {
            return await sendStyled(remoteJid, "❌ Utilisation : .song alan walker faded", client);
        }

        const search = await ytSearch(query);
        const video = search.videos[0];
        if (!video) {
            return await sendStyled(remoteJid, "❌ Musique introuvable.", client);
        }

        const youtubeUrl = video.url;
        const api = `https://apis.davidcyril.name.ng/download/ytmp3?url=${encodeURIComponent(youtubeUrl)}`;
        const { data } = await axios.get(api);
        const audioUrl = data?.result?.download_url || data?.result?.downloadUrl || data?.download_url || data?.url;

        if (!audioUrl) {
            console.log("API RESPONSE :", data);
            return await sendStyled(remoteJid, "❌ Impossible de récupérer l'audio.", client);
        }

        const caption = `🎵 *Titre* : ${video.title}\n\n⏱️ Durée : ${video.timestamp}\n👀 Vues : ${video.views}\n📺 Chaîne : ${video.author.name}\n\n🚀 Powered By ${BOT_NAME || "KATASHIE"}`;

        await client.sendMessage(remoteJid, {
            image: { url: video.thumbnail },
            caption,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: NEWSLETTER,
                    newsletterName: "𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴",
                    serverMessageId: 1
                }
            }
        }, { quoted: message });

        await client.sendMessage(remoteJid, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName: `${video.title}.mp3`,
            ptt: false,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: NEWSLETTER,
                    newsletterName: "𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴",
                    serverMessageId: 1
                }
            }
        }, { quoted: message });

    } catch (err) {
        console.log("SONG ERROR :", err);
        return await sendStyled(message.key.remoteJid, `❌ Erreur téléchargement musique.\n\n📛 ${err.message}`, client);
    }
}