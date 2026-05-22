// commands/tgload.js
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import webp from 'node-webpmux';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { TELEGRAM_BOT_TOKEN } from '../config.js';
import { sendStyled } from '../events/messageHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export default async function tgload(message, client, args) {
    const remoteJid = message.key.remoteJid;
    const url = args[0]?.trim();

    // ---------- Vérifications ----------
    if (!url) {
        await sendStyled(remoteJid, "❌ URL requise.\n📌 Exemple : .tgload https://t.me/addstickers/Pack", client);
        return;
    }
    if (!url.includes('https://t.me/addstickers/')) {
        await sendStyled(remoteJid, "❌ Lien invalide. Envoyez un lien de pack Telegram valide.", client);
        return;
    }
    if (!TELEGRAM_BOT_TOKEN) {
        await sendStyled(remoteJid, "❌ Token Telegram non configuré.", client);
        return;
    }

    try {
        const packName = url.replace("https://t.me/addstickers/", "");
        const response = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getStickerSet?name=${encodeURIComponent(packName)}`
        );
        const data = await response.json();
        if (!data.ok || !data.result) throw new Error("PACK NOT FOUND");

        const stickers = data.result.stickers;
        const total = stickers.length;

        // Création des dossiers
        const stickersDir = path.join(process.cwd(), 'stickers');
        if (!fs.existsSync(stickersDir)) fs.mkdirSync(stickersDir, { recursive: true });
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

        // Message de début
        await sendStyled(remoteJid, `📥 *Téléchargement*\n\n📦 Pack : ${data.result.title}\n🎯 Stickers : ${total}\n📁 Dossier : /stickers`, client);

        let saved = 0;
        for (let i = 0; i < stickers.length; i++) {
            try {
                const sticker = stickers[i];
                const fileId = sticker.file_id;

                const fileRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`);
                const fileJson = await fileRes.json();
                if (!fileJson.ok) continue;
                const filePath = fileJson.result.file_path;
                const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
                const stickerRes = await fetch(fileUrl);
                const stickerBuffer = await stickerRes.buffer();

                const inputFile = path.join(tmpDir, `input_${Date.now()}_${i}`);
                const outputFile = path.join(tmpDir, `output_${Date.now()}_${i}.webp`);
                fs.writeFileSync(inputFile, stickerBuffer);

                const ffmpegCmd = `ffmpeg -i "${inputFile}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p "${outputFile}"`;
                await new Promise((resolve, reject) => {
                    exec(ffmpegCmd, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });

                const img = new webp.Image();
                await img.load(outputFile);
                const metadata = {
                    'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
                    'sticker-pack-name': 'KATASHIE',
                    'sticker-pack-publisher': 'KATASHIE',
                    'emojis': [sticker.emoji || '🤖']
                };
                const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
                const jsonBuffer = Buffer.from(JSON.stringify(metadata), 'utf8');
                const exif = Buffer.concat([exifAttr, jsonBuffer]);
                exif.writeUIntLE(jsonBuffer.length, 14, 4);
                img.exif = exif;
                const finalBuffer = await img.save(null);

                const saveName = `tg_${Date.now()}_${i}.webp`;
                const savePath = path.join(stickersDir, saveName);
                fs.writeFileSync(savePath, finalBuffer);
                saved++;

                fs.unlinkSync(inputFile);
                fs.unlinkSync(outputFile);
                await delay(500);
            } catch (err) {
                console.log(err);
                continue;
            }
        }

        // Message de fin
        await sendStyled(remoteJid, `✅ *Téléchargement terminé*\n\n📦 Sauvegardés : ${saved}/${total}\n📁 Dossier : /stickers\n🎨 Autosticker prêt.`, client);
    } catch (e) {
        console.log(e);
        await sendStyled(remoteJid, "❌ Échec du téléchargement.\nPack invalide ou privé.", client);
    }
}