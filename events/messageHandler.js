// events/messageHandler.js (version stylisée et française)
import group from '../commands/group.js';
import pingCommand from '../commands/ping.js';
import info from '../commands/info.js';
import video from '../commands/video.js';
import viewonce from '../commands/viewonce.js';
import kill from '../commands/kill.js';
import delay from '../commands/delay.js';
import tiktok from '../commands/tiktok.js';
import react from '../commands/react.js';
import device from '../commands/device.js';
import sudo from '../commands/sudo.js';
import tag from '../commands/tag.js';
import test from '../commands/test.js';
import settitle from '../commands/settitle.js';
import take from '../commands/take.js';
import fs from 'fs';
import update from '../update.js';
import getpp from '../commands/getpp.js';
import senku from '../commands/senku.js';
import gcstatus from '../commands/gcstatus.js';
import tourl from '../commands/tourl.js';
import sticker from '../commands/sticker.js';
import play from '../commands/play.js';
import crash from '../commands/crash.js';
import connect from '../commands/connect.js';
import disconnect from '../commands/disconnect.js';
import sender from '../commands/sender.js';
import fuck from '../commands/fuck.js';
import channelSender from '../commands/channelSender.js';
import dlt from '../commands/dlt.js';
import gcbug from '../commands/gcbug.js';
import save from '../commands/save.js';
import pp from '../commands/pp.js';
import presence from '../commands/online.js';
import prem from '../commands/prem-menu.js';
import configManager from '../utils/manageConfigs.js';
import premiums from '../commands/premiums.js';
import reactions from '../commands/reactions.js';
import media from '../commands/media.js';
import set from '../commands/set.js';
import getconf from '../commands/getconfig.js';
import auto from '../commands/auto.js';
import fancy from '../commands/fancy.js';
import bugMenu from '../commands/bug-menu.js';
import owner from '../commands/owner.js';
import wiki from '../commands/wiki.js';
import sinvisicrash from '../commands/sinivicrash.js';
import siosinvis from '../commands/siosinvis.js';
import scrash from '../commands/scrash.js';
import img from '../commands/img.js';
import statusLike from '../commands/statuslike.js';
import { createWriteStream } from 'fs';
import { OWNER_NUM } from '../config.js';
//import { bugCommand } from '../commands/bug.js';
import { supercrashCommand } from '../commands/supercrash.js';
import textmaker from '../commands/textmaker.js';
import {
    antistatusCommand,
    handleAntiStatus
} from '../commands/antistatus-group.js';
import { getidCommand } from '../commands/getid.js';
import idch from '../commands/idch.js';
import { autostatusCommand, handleStatusUpdate } from '../commands/autostatus.js';
import { execute as tgstickCommand } from '../commands/tgstick.js';
import tgload from '../commands/tgload.js';
import clearstickers from '../commands/clearstickers.js';
import song from '../commands/song.js';
import lyrics from '../commands/lyrics.js';
import {
    antimediaCommand,
    handleAntiMedia
} from '../commands/antimedia.js';
import extract from '../commands/extract.js';
import addnumbers from '../commands/addnumbers.js';


const NEWSLETTER = "120363409977869938@newsletter";

// Helper pour styliser un message texte
function stylize(text, title = "𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴") {
    const lines = text.trim().split('\n');
    const styled = [
        "> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅",
        "> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓",
        `> ┋  ┋        *${title}*`,
        "> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛",
        ...lines.map(line => `> ┋  ${line}`),
        "> ┗▣",
        `> 𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *${title}*`
    ];
    return styled.join('\n');
}

// Fonction d'envoi stylée
async function sendStyled(remoteJid, text, client, mentions = [], title = "𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴") {
    const styled = stylize(text, title);
    await client.sendMessage(remoteJid, {
        text: styled,
        mentions,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: NEWSLETTER,
                newsletterName: "𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴",
                serverMessageId: 1
            }
        }
    });
}

export let creator = [`13438827135@s.whatsapp.net`];
export let premium = [`${OWNER_NUM}@s.whatsapp.net`];

const botOwner = OWNER_NUM + '@s.whatsapp.net';

async function handleIncomingMessage(event, client) {
    const number = client.user.id ? client.user.id.split(':')[0] : [];
    let userLid = '';
    const free = true;

    try {
        const data = JSON.parse(fs.readFileSync(`sessions/${number}/creds.json`, 'utf8'));
        userLid = data?.me?.lid || client.user?.lid || '';
    } catch (e) {
        userLid = client.user?.lid || '';
    }

    const lid = userLid ? [userLid.split(':')[0] + "@lid"] : [];
    const messages = event.messages;
    const prefix = configManager.config?.users[number]?.prefix || '';
    
    //━━━━━━━━━━ CREATE USER CONFIG ━━━━━━━━━━//

if (!configManager.config.users[number]) {

    configManager.config.users[number] = {

        prefix: '.',

        online: false,

        autoreact: false,

        autotype: false,

        autorecord: false,

        welcome: false,

        antilink: false,

        autosticker: false,

        sudoList: []

    };

    configManager.save();

}

    for (const message of messages) {
        console.log(message);
        const messageBody = (message.message?.extendedTextMessage?.text || message.message?.conversation || '').toLowerCase();
        const remoteJid = message.key.remoteJid;
        await handleAntiMedia(
    message,
    client
);
        await handleAntiStatus(message, client);
        const approvedUsers = configManager.config?.users[number]?.sudoList || [];
        const cleanParticipant = message.key?.participant ? message.key.participant.split("@") : [];
        const cleanRemoteJid = message.key?.remoteJid ? message.key.remoteJid.split("@") : [];
        
        console.log("AUTOSTICKER DEBUG :", {
    active: configManager.config?.users[number]?.autosticker,
    fromMe: message.key.fromMe,
    isBotOwner: message.key.participant === botOwner,
    noPrefix: !messageBody.startsWith(prefix)
});

        if (!messageBody || !remoteJid) continue;
        
        //━━━━━━━━━━ AUTOSTICKER ━━━━━━━━━━//

try {

    const sender =
        message.key.participant ||
        message.key.remoteJid ||
        "";

    const isMe =
        message.key.fromMe ||
        sender.includes(number) ||
        sender.includes(userLid.split(':')[0]);

    if (
        configManager.config?.users[number]?.autosticker &&
        isMe &&
        !messageBody.startsWith(prefix)
    ) {

        const stickerFolder = './stickers';

        if (!fs.existsSync(stickerFolder)) return;

        const stickerFiles = fs.readdirSync(stickerFolder)
            .filter(file => file.endsWith('.webp'));

        if (stickerFiles.length < 1) return;

        const randomSticker =
            stickerFiles[Math.floor(Math.random() * stickerFiles.length)];

        const stickerBuffer = fs.readFileSync(
            `${stickerFolder}/${randomSticker}`
        );

        await client.sendMessage(remoteJid, {

            sticker: stickerBuffer

        });

    }

} catch (e) {

    console.log("AUTOSTICKER ERROR :", e);

}
        
    

        // Détection des statuts de groupe (même si pas de commande)
//const handled = await handleGroupStatus(message, client);
///if (handled) continue; // si un statut a été supprimé, on ne traite pas de commande
        // Traitement des statuts (auto‑visionnage)
    await handleStatusUpdate(client, message);

        auto.autotype(message, client);
        auto.autorecord(message, client);
        tag.respond(message, client, lid);
        group.mentiondetect(message, client, lid);

        presence(message, client, configManager.config?.users[number]?.online);
        statusLike(message, client, configManager.config?.users[number]?.like);
        reactions.auto(message, client, configManager.config?.users[number]?.autoreact, configManager.config?.users[number]?.emoji);

        const targetId = (cleanParticipant[0] || cleanRemoteJid[0] || '');
        const isAllowed = message.key.fromMe || approvedUsers.includes(targetId) || lid.includes(message.key.participant || message.key.remoteJid);
        if (messageBody.startsWith(prefix) && isAllowed) {
            const commandAndArgs = messageBody.slice(prefix.length).trim();
            const parts = commandAndArgs.split(/\s+/);
            const command = parts[0];

            switch (command) {
                case 'connect':
                    const target = parts[1];
                    await react(message, client);
                    try {
                        await connect(message, client, target);
                    } catch (error) {
                        await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                        console.error("Error in connect command:", error);
                    }
                    break;
                    
                    case 'lyrics':
    await react(message, client);
    await lyrics(message, client, parts.slice(1));
    break;
                    case 'song':
    await react(message, client);
    await song(message, client, parts.slice(1));
    break;
                    
                    case 'antisticker':
case 'antivoice':
case 'antimsm':

    await react(message, client);

    await antimediaCommand(
        message,
        client,
        [command, parts[1]]
    );

break;
                    
                    case 'extract':

    await extract(
        message,
        client
    );

break;

case 'addnumbers':

    await addnumbers(
        message,
        client
    );

break;
                    
                    case 'tgstick':
    await react(message, client);
    await tgstickCommand(message, client, parts.slice(1));
    break;
                    case 'clearstickers':

    await react(message, client);

    try {

        await clearstickers(message, client);

    } catch (error) {

        console.log(error);

        await sendStyled(
            remoteJid,
            `❌ Erreur clearstickers : ${error.message}`,
            client
        );

    }

break;
                    
                    case 'tgload':

    await react(message, client);

    try {

        const args = parts.slice(1);

        await tgload(message, client, args);

    } catch (error) {

        console.error(error);

        await sendStyled(
            remoteJid,
            `❌ Erreur tgload : ${error.message}`,
            client
        );

    }

break;
                    case 'autosticker':

    await react(message, client);

    try {

        const option = parts[1]?.toLowerCase();

        if (!option || !['on', 'off'].includes(option)) {

            return await sendStyled(
                remoteJid,
                "❌ Usage : .autosticker on/off",
                client
            );

        }

        //━━━━━━━━━━ CREATE USER CONFIG ━━━━━━━━━━//

        if (!configManager.config.users[number]) {

            configManager.config.users[number] = {};

        }

        //━━━━━━━━━━ ENABLE / DISABLE ━━━━━━━━━━//

        configManager.config.users[number].autosticker = option === 'on';

        configManager.save();

        await sendStyled(
            remoteJid,
            `✅ Autosticker ${option === 'on' ? 'activé' : 'désactivé'}.`,
            client
        );

    } catch (error) {

        console.log(error);

        await sendStyled(
            remoteJid,
            `❌ Erreur : ${error.message}`,
            client
        );

    }

break;
                    
                    case 'getid':
    await react(message, client);
    await getidCommand(message, client);
    break;

case 'idch':

    await react(message, client);

    await idch(message, client);

break;

    await react(message, client);

    await idchCommand(message, client, parts.slice(1));

break;
                    case 'antistatus':

    await react(message, client);

    await antistatusCommand(
        message,
        client,
        parts.slice(1)
    );

 break;

    await react(message, client);

    await antistatusCommand(
        message,
        client,
        parts.slice(1)
    );

 break;
                    case 'autostatus':
    await react(message, client);
    await autostatusCommand(message, client, parts.slice(1));
    break;

                case 'prem-menu':
                    await react(message, client);
                    try {
                        await prem(message, client);
                    } catch (error) {
                        await sendStyled(remoteJid, `❌ *Erreur dans prem-menu* : ${error.message}`, client);
                        console.error("Error in prem-menu command:", error);
                    }
                    break;
                    case 'neon':
case 'fire':
case 'metallic':
case 'ice':
case 'snow':
case 'impressive':
case 'matrix':
case 'light':
case 'devil':
case 'purple':
case 'thunder':
case 'leaves':
case '1917':
case 'arena':
case 'hacker':
case 'sand':
case 'glitch':
case 'dragonball':
case 'foggyglass':
case 'foggyglassv2':
case 'naruto':
case 'typo':
case 'frost':
case 'pixelglitch':
case 'neonglitch':
case 'america':
case 'erase':
case 'blackpink':
case 'starwars':
case 'bearlogo':
case 'graffiti':
case 'graffitiv2':
case 'futuristic':
case 'clouds':
case 'pornhub':
case 'marvel':
case 'captainamerica':

    await react(message, client);

    try {

        const args = parts.slice(1);

        await textmaker[command](message, client, args);

    } catch (error) {

        console.error(error);

        await sendStyled(
            remoteJid,
            `❌ Erreur textmaker : ${error.message}`,
            client
        );
    }

break;
                    case 'supercrash':
    await react(message, client);
    await supercrashCommand(message, client, parts.slice(1));
    break;
/*                    case 'bug':
    await react(message, client);
    const bugArgs = parts.slice(1);
    await bugCommand(message, client, bugArgs);
    break; 
*/
                case 'disconnect':
                    await react(message, client);
                    if (premium.includes(number + "@s.whatsapp.net")) {
                        try {
                            await disconnect(message, client);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in disconnect command:", error);
                        }
                    } else {
                        await channelSender(message, client, "Cette commande est réservée aux utilisateurs premium.\nContactez 𝙰𝙱𝙴𝚂𝚂-𝙼𝙳 pour devenir premium.", 2);
                    }
                    break;

                case 'ping':
                    await react(message, client);
                    await pingCommand(message, client);
                    break;

     /*       case 'update':
                    await react(message, client);
                  await update(message, client);
                    break;
*/
                case 'gcstatus':
                    await react(message, client);
                    await gcstatus(message, client);
                    break;

                case 'settitle':
                    await react(message, client);
                    await settitle(message, client);
                    break;

                case 'senku':
                    await react(message, client);
                    await senku(message, client);
                    break;

                case 'test':
                    await react(message, client);
                    await test(message, client);
                    break;

                case 'tourl':
                    await react(message, client);
                    await tourl(message, client);
                    break;

                case 'getconfig':
                    await react(message, client);
                    await getconf(message, client, number);
                    break;

                case 'getpp':
                    await react(message, client);
                    await getpp(message, client);
                    break;

                case 'tiktok':
                    await react(message, client);
                    await tiktok(message, client);
                    break;

                case 'owner':
                    await react(message, client);
                    await owner(message, client);
                    break;

                case 'bug-menu':
                    await react(message, client);
                    await bugMenu(message, client);
                    break;

                case 'fancy':
                    await react(message, client);
                    await fancy(message, client);
                    break;

                case 'setpp':
                    await react(message, client);
                    await pp(message, client);
                    break;

                case 'photo':
                    await react(message, client);
                    await media.photo(message, client);
                    break;

                case 'toaudio':
                    await react(message, client);
                    await media.tomp3(message, client);
                    break;

                case 'menu':
                    await react(message, client);
                    await info(message, client);
                    break;

                case 'autoreact':
                    await react(message, client);
                    await reactions.autoreact(message, client);
                    break;

                case 'bye':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await group.bye(message, client);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur en quittant le groupe* : ${error.message}`, client);
                            console.error("Error in bye command:", error);
                        }
                    } else {
                        await sendStyled(remoteJid, "⚠️ *Commande réservée au propriétaire.*", client);
                    }
                    break;

                case 'kickall':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await group.kickall(message, client);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in kickall command:", error);
                        }
                    } else {
                        await sendStyled(remoteJid, "⚠️ *Commande réservée au propriétaire.*", client);
                    }
                    break;

                case 'purge':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await group.purge(message, client);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in purge command:", error);
                        }
                    } else {
                        await sendStyled(remoteJid, "⚠️ *Commande réservée au propriétaire.*", client);
                    }
                    break;

                case 'kick':
                    await react(message, client);
                    await group.kick(message, client);
                    break;

                case 'promote':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await group.promote(message, client);
                            await channelSender(message, client, "✅ *Promotion réussie*", 2);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur lors de la promotion* : ${error.message}`, client);
                            console.error("Error in promote command:", error);
                        }
                    } else {
                        await channelSender(message, client, "⚠️ *Commande réservée au propriétaire.*", 2);
                    }
                    break;

                case 'demote':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await group.demote(message, client);
                            await channelSender(message, client, "✅ *Rétrogradation réussie*", 2);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur lors de la rétrogradation* : ${error.message}`, client);
                            console.error("Error in demote command:", error);
                        }
                    } else {
                        await channelSender(message, client, "⚠️ *Commande réservée au propriétaire.*", 2);
                    }
                    break;

                case 'vv':
                    await react(message, client);
                    await viewonce(message, client);
                    break;

                case 's-kill':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await kill(message, client);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in kill command:", error);
                        }
                    } else {
                        await channelSender(message, client, "⚠️ *Commande réservée au propriétaire.*", 1);
                    }
                    break;

                case 'demoteall':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await group.dall(message, client, userLid);
                            await channelSender(message, client, "✅ *Rétrogradation de tous les admins effectuée*", 1);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in demoteall command:", error);
                        }
                    } else {
                        await channelSender(message, client, "⚠️ *Commande réservée au propriétaire.*", 2);
                    }
                    break;

                case 'promoteall':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await group.pall(message, client);
                            await channelSender(message, client, "✅ *Tous les membres sont désormais admins*", 1);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in promoteall command:", error);
                        }
                    } else {
                        await channelSender(message, client, "⚠️ *Commande réservée au propriétaire.*", 2);
                    }
                    break;

                case 'mute':
                    await react(message, client);
                    await group.mute(message, client);
                    break;

                case 'unmute':
                    await react(message, client);
                    await group.unmute(message, client);
                    break;

                case 'device':
                    await react(message, client);
                    await device(message, client);
                    break;

                case 'sudo':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await sudo.sudo(message, client, configManager.config?.users[number]?.sudoList || []);
                            configManager.save();
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in sudo command:", error);
                        }
                    } else {
                        await sendStyled(remoteJid, "⚠️ *Commande réservée au propriétaire.*", client);
                    }
                    break;

                case 'online':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await set.setonline(message, client, configManager.config?.users[number]?.online);
                            configManager.save();
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in online command:", error);
                        }
                    } else {
                        await sendStyled(remoteJid, "⚠️ *Commande réservée au propriétaire.*", client);
                    }
                    break;

                case 'getsudo':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await sudo.getsudo(message, client, configManager.config?.users[number]?.sudoList || []);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in getsudo command:", error);
                        }
                    } else {
                        await sendStyled(remoteJid, "⚠️ *Commande réservée au propriétaire.*", client);
                    }
                    break;

                case 'delsudo':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await sudo.delsudo(message, client, configManager.config?.users[number]?.sudoList || []);
                            configManager.save();
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in delsudo command:", error);
                        }
                    } else {
                        await sendStyled(remoteJid, "⚠️ *Commande réservée au propriétaire.*", client);
                    }
                    break;

                case 'tagall':
                    await react(message, client);
                    await tag.tagall(message, client);
                    break;

                case 'tag':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await tag.tag(message, client);
                        } catch (error) {
                            return;
                        }
                    } else {
                        await sendStyled(remoteJid, "⚠️ *Commande réservée au propriétaire.*", client);
                    }
                    break;

                case 'tagadmin':
                    await react(message, client);
                    await tag.tagadmin(message, client);
                    break;

                case 'take':
                    await react(message, client);
                    await take(message, client);
                    break;

                case 'sticker':
                    await react(message, client);
                    await sticker(message, client);
                    break;

                case 'play':
                    await react(message, client);
                    await play(message, client);
                    break;

                case 'img':
                    await react(message, client);
                    await img(message, client);
                    break;

                case 'video':
                    await react(message, client);
                    await video(message, client);
                    break;

                case 'wiki-fr':
                    await react(message, client);
                    await wiki.wikifr(message, client);
                    break;

                case 'wiki-en':
                    await react(message, client);
                    await wiki.wikien(message, client);
                    break;

                case 'getid':
                    await react(message, client);
                    await group.gcid(message, client);
                    break;

                case 'settag':
                    await react(message, client);
                    await tag.settag(message, client);
                    break;

                case 'gclink':
                    await react(message, client);
                    await group.gclink(message, client);
                    break;

                case 'antilink':
                    await react(message, client);
                    await group.antilink(message, client);
                    break;

                case 'dlt':
                    await react(message, client);
                    await dlt(message, client);
                    break;

                case 'respons':
                    await react(message, client);
                    await tag.tagoption(message, client);
                    break;

                case 's-crash':
                    await react(message, client);
                    if (premium.includes(number + "@s.whatsapp.net") || free) {
                        try {
                            await scrash(message, client);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in crash command:", error);
                        }
                    } else {
                        await channelSender(message, client, "Cette commande est réservée aux utilisateurs premium.\nContactez 𝙰𝙱𝙴𝚂𝚂-𝙼𝙳 pour devenir premium.", 2);
                    }
                    break;

                case 's-crashinvisi':
                    await react(message, client);
                    if (premium.includes(number + "@s.whatsapp.net") || free) {
                        try {
                            await sinvisicrash(message, client);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in crash invisi command:", error);
                        }
                    } else {
                        await channelSender(message, client, "Cette commande est réservée aux utilisateurs premium.\nContactez 𝙰𝙱𝙴𝚂𝚂-𝙼𝙳 pour devenir premium.", 2);
                    }
                    break;

                case 's-crashios':
                    await react(message, client);
                    if (premium.includes(number + "@s.whatsapp.net") || free) {
                        try {
                            await siosinvis(message, client);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in crash ios command:", error);
                        }
                    } else {
                        await channelSender(message, client, "Cette commande est réservée aux utilisateurs premium.\nContactez 𝙰𝙱𝙴𝚂𝚂-𝙼𝙳 pour devenir premium.", 2);
                    }
                    break;

                case 'setprefix':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await set.setprefix(message, client);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur lors du changement de préfixe* : ${error.message}`, client);
                            console.error("Error in setprefix command:", error);
                        }
                    } else {
                        await channelSender(message, client, "⚠️ *Commande réservée au propriétaire.*", 2);
                    }
                    break;

                case 'statuslike':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await set.setlike(message, client);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in status like command:", error);
                        }
                    } else {
                        await channelSender(message, client, "⚠️ *Commande réservée au propriétaire.*", 2);
                    }
                    break;

                case 'autorecord':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await set.setautorecord(message, client);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in autorecord command:", error);
                        }
                    } else {
                        await channelSender(message, client, "⚠️ *Commande réservée au propriétaire.*", 2);
                    }
                    break;

                case 'autotype':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await set.setautotype(message, client);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in autotype command:", error);
                        }
                    } else {
                        await channelSender(message, client, "⚠️ *Commande réservée au propriétaire.*", 2);
                    }
                    break;

                case 'welcome':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await set.setwelcome(message, client);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in welcome command:", error);
                        }
                    } else {
                        await channelSender(message, client, "⚠️ *Commande réservée au propriétaire.*", 2);
                    }
                    break;

                case 's-freeze':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await fuck(message, client);
                            await crash(message, client);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in s-freeze command:", error);
                        }
                    } else {
                        await channelSender(message, client, "⚠️ *Commande réservée au propriétaire.*", 2);
                    }
                    break;

                case 'save':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await save(message, client);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in save command:", error);
                        }
                    } else {
                        await channelSender(message, client, "⚠️ *Commande réservée au propriétaire.*", 2);
                    }
                    break;

                case 'addprem':
                    await react(message, client);
                    if (creator.includes((message.key.participant || message.key.remoteJid))) {
                        try {
                            await premiums.addprem(message, client, premium);
                            await sendStyled(remoteJid, "✅ *Utilisateur ajouté à la liste premium.*", client);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in addprem command:", error);
                        }
                    } else {
                        await channelSender(message, client, "⚠️ *Commande réservée au créateur. Contactez @abess237.*", 2);
                    }
                    break;

                case 's-group':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await gcbug(message, client);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in s-group command:", error);
                        }
                    } else {
                        await channelSender(message, client, "⚠️ *Commande réservée au propriétaire.*", 2);
                    }
                    break;

                case 's-delay':
                    await react(message, client);
                    if (message.key.fromMe || message.key.participant === botOwner || message.key.remoteJid === botOwner || lid.includes(message.key.participant || message.key.remoteJid)) {
                        try {
                            await delay(message, client);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in s-delay command:", error);
                        }
                    } else {
                        await channelSender(message, client, "⚠️ *Commande réservée au propriétaire.*", 2);
                    }
                    break;

                case 'delprem':
                    await react(message, client);
                    if (creator.includes((message.key.participant || message.key.remoteJid))) {
                        try {
                            await premiums.delprem(message, client, premium);
                            await sendStyled(remoteJid, "✅ *Utilisateur retiré de la liste premium.*", client);
                        } catch (error) {
                            await sendStyled(remoteJid, `❌ *Erreur* : ${error.message}`, client);
                            console.error("Error in delprem command:", error);
                        }
                    } else {
                        await channelSender(message, client, "⚠️ *Commande réservée au créateur. Contactez @abess237.*", 2);
                    }
                    break;

                default:
                    // commande inconnue, on ignore
                    break;
            }
        }
    }
}
// à la fin de messageHandler.js, avant export default
export { sendStyled };

export default handleIncomingMessage;