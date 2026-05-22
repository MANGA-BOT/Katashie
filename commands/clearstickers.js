// commands/clearstickers.js

import fs from 'fs';
import path from 'path';

export default async function clearstickers(message, client) {

    const remoteJid = message.key.remoteJid;

    try {

        const stickersDir = path.join(process.cwd(), 'stickers');

        if (!fs.existsSync(stickersDir)) {

            return await client.sendMessage(remoteJid, {
                text: "❌ Dossier stickers introuvable."
            });

        }

        const files = fs.readdirSync(stickersDir);

        for (const file of files) {

            fs.unlinkSync(path.join(stickersDir, file));

        }

        await client.sendMessage(remoteJid, {
            text: `✅ ${files.length} stickers supprimés.`
        });

    } catch (e) {

        console.log(e);

        await client.sendMessage(remoteJid, {
            text: "❌ Impossible de supprimer les stickers."
        });

    }

}