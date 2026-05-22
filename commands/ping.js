// commands/ping.js
import channelSender from './channelSender.js';
import fs from 'fs';
import path from 'path';

export async function pingCommand(message, client) {
    const msgTimestamp = message.messageTimestamp * 1000;
    const latency = Date.now() - msgTimestamp;
    
    const text = `
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋    *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅〩┛
> ┋  ⚡ *𝚂ᴘᴇᴇᴅ* : ${latency} ms
> ┗▣
> 𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
`;

    // Chargement de l'image locale depuis le dossier images/
    const imagePath = path.join(process.cwd(), 'images', 'image2.jpg');
    let imageBuffer = null;
    try {
        if (fs.existsSync(imagePath)) {
            imageBuffer = fs.readFileSync(imagePath);
        } else {
            console.warn("Image non trouvée :", imagePath);
        }
    } catch (err) {
        console.error("Erreur lecture image ping :", err);
    }

    // Appel à channelSender (texte, num="ping", mentions=[], imageBuffer)
    await channelSender(message, client, text, "1", [], imageBuffer);
}

export default pingCommand;