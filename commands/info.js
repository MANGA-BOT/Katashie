import configManager from '../utils/manageConfigs.js';
import { BOT_NAME, OWNER_NAME } from '../config.js';
import fs from 'fs';
import path from 'path';
import channelSender from './channelSender.js';  // ← ajout

export async function info(message, client) {
    const remoteJid = message.key.remoteJid;
    const today = new Date();
    const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const number = client.user.id.split(':')[0];
    const username = message.pushName || "Unknown";
    const prefix = configManager.config?.users[number]?.prefix || '.';
    const NEWSLETTER = "120363409977869938@newsletter";

    const t = `
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋ *ᴘʀᴇғɪx* : ${prefix}
> ┋ *ᴜsᴇʀ* : ${username}
> ┋ *ᴅᴀʏ* : ${daysOfWeek[today.getDay()]}
> ┋ *ᴅᴀᴛᴇ* : ${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}
> ┋ *𝚋𝚘𝚝 𝚝𝚐* : t.me/katashie2_bot
> ┋ *𝚋𝚘𝚝 𝚠𝚎𝚋* : https://katashie.pagnol.xyz
> ┋ *ᴘʟᴜɢɪɴs* : 180+
> ┗▣
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋          *𝙶𝙴𝙽𝙴𝚁𝙰𝙻*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋ ✘ ${prefix}menu
> ┋ ✘ ${prefix}ping
> ┋ ✘ ${prefix}owner
> ┋ ✘ ${prefix}device
> ┋ ✘ ${prefix}update
> ┋ ✘ ${prefix}gcstatus
> ┋ ✘ ${prefix}test
> ┋ ✘ ${prefix}senku
> ┋ ✘ ${prefix}autosticker
> ┋ ✘ ${prefix}autostatus
> ┋ ✘ ${prefix}antistatus
> ┋ ✘ ${prefix}antisticker
> ┋ ✘ ${prefix}antivoice
> ┋ ✘ ${prefix}antimsm
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋          *𝚄𝚃𝙸𝙻𝚂*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋ ✘ ${prefix}getid
> ┋ ✘ ${prefix}getsudo
> ┋ ✘ ${prefix}sudo
> ┋ ✘ ${prefix}delsudo
> ┋ ✘ ${prefix}tourl
> ┋ ✘ ${prefix}fancy
> ┋ ✘ ${prefix}getpp
> ┋ ✘ ${prefix}getconfig
> ┋ ✘ ${prefix}setprefix
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋          *𝚃𝙰𝙶*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋ ✘ ${prefix}tagall
> ┋ ✘ ${prefix}tagadmin
> ┋ ✘ ${prefix}tag
> ┋ ✘ ${prefix}settag
> ┋ ✘ ${prefix}respons
> ┋ ✘ ${prefix}tgstick
> ┋ ✘ ${prefix}tgload
> ┋ ✘ ${prefix}clearstickers
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋          *𝙲𝙾𝙽𝙵𝙸𝙶*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋ ✘ ${prefix}online
> ┋ ✘ ${prefix}welcome
> ┋ ✘ ${prefix}autotype
> ┋ ✘ ${prefix}autorecord
> ┋ ✘ ${prefix}autoreact
> ┋ ✘ ${prefix}statuslike
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋          *𝙶𝚁𝙾𝚄𝙿*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋ ✘ ${prefix}kick
> ┋ ✘ ${prefix}promote
> ┋ ✘ ${prefix}demote
> ┋ ✘ ${prefix}kickall
> ┋ ✘ ${prefix}purge
> ┋ ✘ ${prefix}demoteall
> ┋ ✘ ${prefix}promoteall
> ┋ ✘ ${prefix}mute
> ┋ ✘ ${prefix}unmute
> ┋ ✘ ${prefix}gclink
> ┋ ✘ ${prefix}antilink
> ┋ ✘ ${prefix}settitle
> ┋ ✘ ${prefix}bye
> ┋ ✘ ${prefix}dlt
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋          *𝙼𝙴𝙳𝙸𝙰*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋ ✘ ${prefix}sticker
> ┋ ✘ ${prefix}take
> ┋ ✘ ${prefix}toaudio
> ┋ ✘ ${prefix}video
> ┋ ✘ ${prefix}photo
> ┋ ✘ ${prefix}vv
> ┋ ✘ ${prefix}setpp
> ┋ ✘ ${prefix}save
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋          *𝚂𝙴𝙰𝚁𝙲𝙷*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋ ✘ ${prefix}wiki-en
> ┋ ✘ ${prefix}wiki-fr
> ┋ ✘ ${prefix}img
> ┋ ✘ ${prefix}play
> ┋ ✘ ${prefix}tiktok
> ┋ ✘ ${prefix}song
> ┋ ✘ ${prefix}lyrics
> ┋ ✘ ${prefix}extract
> ┋ ✘ ${prefix}addnumbers
> ┋ ✘ ${prefix}idch
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋        *𝚃𝙴𝚇𝚃𝙼𝙰𝙺𝙴𝚁*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋ ✘ ${prefix}neon
> ┋ ✘ ${prefix}fire
> ┋ ✘ ${prefix}metallic
> ┋ ✘ ${prefix}ice
> ┋ ✘ ${prefix}snow
> ┋ ✘ ${prefix}matrix
> ┋ ✘ ${prefix}devil
> ┋ ✘ ${prefix}purple
> ┋ ✘ ${prefix}glitch
> ┋ ✘ ${prefix}naruto
> ┋ ✘ ${prefix}blackpink
> ┋ ✘ ${prefix}marvel
> ┋ ✘ ${prefix}pornhub
> ┋ ✘ ${prefix}graffiti
> ┋ ✘ ${prefix}futuristic
> ┋ ✘ ${prefix}clouds
> ┗▣
> 𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
`;

    // Image aléatoire
    const imageFolder = path.join(process.cwd(), 'images');
    let imagePath = null;
    if (fs.existsSync(imageFolder)) {
        const imageFiles = fs.readdirSync(imageFolder).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
        if (imageFiles.length) {
            imagePath = path.join(imageFolder, imageFiles[Math.floor(Math.random() * imageFiles.length)]);
        }
    }

    // Envoi du message principal
    if (imagePath && fs.existsSync(imagePath)) {
        // Avec image → on garde client.sendMessage (car channelSender n’envoie que du texte)
        await client.sendMessage(remoteJid, {
            image: fs.readFileSync(imagePath),
            caption: t,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: NEWSLETTER,
                    newsletterName: "𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴",
                    serverMessageId: 1
                }
            },
            quoted: message
        });
    } else {
        // Pas d'image → on utilise channelSender
        await channelSender(message, client, t, "");
    }

    // Audio optionnel (inchangé)
    const audioPath = path.join(process.cwd(), 'audio', 'menu.mp3');
    if (fs.existsSync(audioPath)) {
        await client.sendMessage(remoteJid, {
            audio: fs.readFileSync(audioPath),
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: NEWSLETTER,
                    newsletterName: "𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴",
                    serverMessageId: 1
                }
            },
            quoted: message
        });
    }
}

export default info;
