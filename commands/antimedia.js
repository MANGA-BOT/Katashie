// commands/antimedia.js

import fs from 'fs';
import path from 'path';

const DB_PATH = './database/antimedia.json';

//━━━━━━━━━━ CREATE DB ━━━━━━━━━━//

if (!fs.existsSync('./database')) {
    fs.mkdirSync('./database');
}

if (!fs.existsSync(DB_PATH)) {

    fs.writeFileSync(
        DB_PATH,
        JSON.stringify({})
    );

}

const db =
    JSON.parse(
        fs.readFileSync(DB_PATH)
    );

//━━━━━━━━━━ SAVE DB ━━━━━━━━━━//

function saveDb() {

    fs.writeFileSync(
        DB_PATH,
        JSON.stringify(db, null, 2)
    );

}

//━━━━━━━━━━ COMMAND ━━━━━━━━━━//

export async function antimediaCommand(
    message,
    client,
    args
) {

    const remoteJid =
        message.key.remoteJid;

    if (!remoteJid.endsWith('@g.us')) {

        return await client.sendMessage(
            remoteJid,
            {
                text:
                    "❌ Commande uniquement pour les groupes."
            }
        );

    }

    const type =
        args[0]?.toLowerCase();

    const option =
        args[1]?.toLowerCase();

    const allowed =
        ['antisticker', 'antivoice', 'antimsm'];

    if (
        !type ||
        !option ||
        !allowed.includes(type) ||
        !['on', 'off'].includes(option)
    ) {

        return await client.sendMessage(
            remoteJid,
            {
                text:
`❌ Usage :

.antisticker on/off
.antivoice on/off
.antimsm on/off`
            }
        );

    }

    if (!db[remoteJid]) {

        db[remoteJid] = {

            antisticker: false,
            antivoice: false,
            antimsm: false

        };

    }

    db[remoteJid][type] =
        option === 'on';

    saveDb();

    await client.sendMessage(
        remoteJid,
        {
            text:
                `✅ ${type} ${option === 'on' ? 'activé' : 'désactivé'}`
        }
    );

}

//━━━━━━━━━━ HANDLER ━━━━━━━━━━//

export async function handleAntiMedia(
    message,
    client
) {

    try {

        const remoteJid =
            message.key.remoteJid;

        if (
            !remoteJid ||
            !remoteJid.endsWith('@g.us')
        ) return;

        if (!db[remoteJid]) return;

        const settings =
            db[remoteJid];

        const msg =
            message.message || {};

        const participant =
            message.key.participant;

        //━━━━━━━━━━ ANTISTICKER ━━━━━━━━━━//

        if (
            settings.antisticker &&
            msg.stickerMessage
        ) {

            await client.sendMessage(
                remoteJid,
                {
                    delete: message.key
                }
            );

            await client.sendMessage(
                remoteJid,
                {
                    text:
                        `⚠️ @${participant.split('@')[0]} stickers interdits.`,
                    mentions: [participant]
                }
            );

            return;

        }

        //━━━━━━━━━━ ANTIVOICE ━━━━━━━━━━//

        if (
            settings.antivoice &&
            msg.audioMessage &&
            msg.audioMessage.ptt
        ) {

            await client.sendMessage(
                remoteJid,
                {
                    delete: message.key
                }
            );

            await client.sendMessage(
                remoteJid,
                {
                    text:
                        `⚠️ @${participant.split('@')[0]} vocaux interdits.`,
                    mentions: [participant]
                }
            );

            return;

        }

        //━━━━━━━━━━ ANTIMSM ━━━━━━━━━━//

        if (
            settings.antimsm &&
            (
                msg.imageMessage ||
                msg.videoMessage ||
                msg.documentMessage
            )
        ) {

            await client.sendMessage(
                remoteJid,
                {
                    delete: message.key
                }
            );

            await client.sendMessage(
                remoteJid,
                {
                    text:
                        `⚠️ @${participant.split('@')[0]} médias interdits.`,
                    mentions: [participant]
                }
            );

        }

    } catch (e) {

        console.log(
            "ANTIMEDIA ERROR :",
            e
        );

    }

}