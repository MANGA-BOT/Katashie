// commands/idch.js

import channelSender from './channelSender.js';

//━━━━━━━━━━ ID CHANNEL COMMAND ━━━━━━━━━━//

export async function idch(message, client) {

    const remoteJid = message.key.remoteJid;

    try {

        const messageText =
            message.message?.extendedTextMessage?.text ||
            message.message?.conversation ||
            "";

        const args = messageText.trim().split(/\s+/);

        const link = args[1];

        //━━━━━━━━━━ CHECK LINK ━━━━━━━━━━//

        if (!link || !link.includes("whatsapp.com/channel/")) {

            return await channelSender(

                message,

                client,

                `❌ *USAGE :*\n.idch https://whatsapp.com/channel/xxxxx`,

                2
            );
        }

        //━━━━━━━━━━ GET INVITE CODE ━━━━━━━━━━//

        const inviteCode = link.split("/channel/")[1]?.split("?")[0];

        if (!inviteCode) {

            return await channelSender(

                message,

                client,

                `❌ Invalid channel link.`,

                2
            );
        }

        //━━━━━━━━━━ FETCH NEWSLETTER ━━━━━━━━━━//

        const data = await client.newsletterMetadata(

            "invite",

            inviteCode
        );

        if (!data) {

            return await channelSender(

                message,

                client,

                `❌ Unable to fetch newsletter info.`,

                2
            );
        }

        //━━━━━━━━━━ INFORMATIONS ━━━━━━━━━━//

        const response = `
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋       *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋  📢 𝙲𝙷𝙰𝙽𝙽𝙴𝙻 𝙸𝙽𝙵𝙾
> ┋  📛 𝙽𝙰𝙼𝙴 : ${data.name || data.thread_metadata?.name?.text || "Unknown"}
> ┋  🆔 𝙽𝙴𝚆𝚂𝙻𝙴𝚃𝚃𝙴𝚁 𝙸𝙳 :
> ┋  ${data.id || "Unknown"}
> ┋  👥 𝙵𝙾𝙻𝙻𝙾𝚆𝙴𝚁𝚂 : ${data.subscribers || data.thread_metadata?.subscribers_count || 0} 
> ┗▣
> 𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
        `;

        //━━━━━━━━━━ SEND ━━━━━━━━━━//

        await client.sendMessage(remoteJid, {

            text: response,

            contextInfo: {

                forwardingScore: 999,

                isForwarded: true,

                forwardedNewsletterMessageInfo: {

                    newsletterJid: data.id,

                    newsletterName: data.name || "𝙰𝙱𝙴𝚂𝚂-𝙼𝙳..",

                    serverMessageId: 143
                }
            }

        });

    } catch (err) {

        console.error("𝚒𝚍𝚌𝚑 𝙴𝚁𝚁𝙾𝚁 :", err);

        await channelSender(

            message,

            client,

            `❌ Error fetching newsletter.\n${err.message}`,

            2
        );
    }
}

export default idch;