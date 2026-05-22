// commands/extract.js

import fs from 'fs';
import path from 'path';

export default async function extract(
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
                        "❌ Commande groupe uniquement."
                }
            );

        }

        //━━━━━━━━━━ GET GROUP METADATA ━━━━━━━━━━//

        const metadata =
            await client.groupMetadata(
                remoteJid
            );

        const participants =
            metadata.participants || [];

        //━━━━━━━━━━ EXTRACT NUMBERS ━━━━━━━━━━//

        const numbers = [];

        for (const p of participants) {

            let number =
                p.id.split('@')[0]
                .replace(/\D/g, '');

            if (
                number &&
                number.length > 5
            ) {

                numbers.push(number);

            }

        }

        //━━━━━━━━━━ REMOVE DUPLICATES ━━━━━━━━━━//

        const unique =
            [...new Set(numbers)];

        //━━━━━━━━━━ CREATE TXT FILE ━━━━━━━━━━//

        const folder =
            path.join(
                process.cwd(),
                'tmp'
            );

        if (!fs.existsSync(folder)) {

            fs.mkdirSync(
                folder,
                { recursive: true }
            );

        }

        const filePath =
            path.join(
                folder,
                `numbers_${Date.now()}.txt`
            );

        fs.writeFileSync(
            filePath,
            unique.join('\n')
        );

        //━━━━━━━━━━ SEND FILE TO OWNER ONLY ━━━━━━━━━━//

        await client.sendMessage(
            remoteJid,
            {
                document:
                    fs.readFileSync(filePath),

                mimetype:
                    'text/plain',

                fileName:
                    'numbers.txt',

                caption:
                    `✅ ${unique.length} numéros extraits.`
            }
        );

    } catch (e) {

        console.log(
            "EXTRACT ERROR :",
            e
        );

    }

}