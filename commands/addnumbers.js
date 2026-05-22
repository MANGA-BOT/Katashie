// commands/addnumbers.js
import fs from 'fs';
const delay = (ms) =>
    new Promise(resolve =>
        setTimeout(resolve, ms)
    );
export default async function addnumbers(
    message,
    client
) {
    try {
        const remoteJid =
            message.key.remoteJid;
        //━━━━━━━━━━ GROUP ONLY ━━━━━━━━━━//
        if (!remoteJid.endsWith('@g.us')) {
            return await client.sendMessage(
                remoteJid,
                {
                    text:
                        "❌ Groupe uniquement."
                }
            );
        }
        //━━━━━━━━━━ CHECK REPLY FILE ━━━━━━━━━━//
        const quoted =
            message.message?.extendedTextMessage
            ?.contextInfo?.quotedMessage;
        const doc =
            quoted?.documentMessage;
        if (!doc) {
            return await client.sendMessage(
                remoteJid,
                {
                    text:
                        "❌ Réponds au fichier txt."
                }
            );
        }
        //━━━━━━━━━━ DOWNLOAD FILE ━━━━━━━━━━//
        const buffer =
            await client.downloadMediaMessage({
                message: quoted
            });
        const content =
            buffer.toString();
        //━━━━━━━━━━ EXTRACT NUMBERS ━━━━━━━━━━//
        const rawNumbers =
            content
            .split('\n')
            .map(v =>
                v.trim()
                .replace(/\D/g, '')
            )
            .filter(Boolean);
        const numbers =
            [...new Set(rawNumbers)];
        //━━━━━━━━━━ GET EXISTING MEMBERS ━━━━━━━━━━//
        const metadata =
            await client.groupMetadata(
                remoteJid
            );
        const existing =
            metadata.participants.map(
                p => p.id
            );
        //━━━━━━━━━━ COUNTERS ━━━━━━━━━━//
        let added = 0;
        let failed = 0;
        let already = 0;
        //━━━━━━━━━━ ADD LOOP ━━━━━━━━━━//
        for (const num of numbers) {
            try {
                const jid =
                    `${num}@s.whatsapp.net`;
                //━━━━━━━━━━ ALREADY IN GROUP ━━━━━━━━━━//
                if (
                    existing.includes(jid)
                ) {
                    already++;
                    continue;
                }
                //━━━━━━━━━━ ADD MEMBER ━━━━━━━━━━//
                await client.groupParticipantsUpdate(
                    remoteJid,
                    [jid],
                    "add"
                );
                added++;
                //━━━━━━━━━━ DELAY 3s ━━━━━━━━━━//
                await delay(3000);
            } catch {
                failed++;
            }
        }
        //━━━━━━━━━━ RESULT ━━━━━━━━━━//
        await client.sendMessage(
            remoteJid,
            {
                text:
`✅ Ajout terminé
👥 Ajoutés : ${added}
⚠️ Échecs : ${failed}
📌 Déjà présents : ${already}`
            }
        );
    } catch (e) {
        console.log(
            "ADDNUMBERS ERROR :",
            e
        );
    }
}