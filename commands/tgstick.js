// commands/tgstick.js
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import webp from 'node-webpmux';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { TELEGRAM_BOT_TOKEN, OWNER_NAME, BOT_NAME } from '../config.js';
import { sendStyled } from '../events/messageHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Utiliser une image locale du dossier images/
const THUMBNAIL_PATH = path.join(process.cwd(), 'images', 'image5.jpg'); // ← ajuste le nom si nécessaire
const THUMBNAIL_BUFFER = (() => {
    try {
        if (fs.existsSync(THUMBNAIL_PATH)) return fs.readFileSync(THUMBNAIL_PATH);
        else console.warn("⚠️ Image thumbnail locale non trouvée :", THUMBNAIL_PATH);
    } catch (e) {}
    return null;
})();

const NEWSLETTER = "120363427806151081@newsletter";

export const name = 'tgstick';
export const description = 'Télécharge un pack de stickers depuis Telegram.';
export const usage = '.tgstick <lien du pack>';

export async function execute(message, client, args) {
    const remoteJid = message.key.remoteJid;
    const url = args[0]?.trim();

    if (!url) {
        await sendStyled(remoteJid, "⚠️ Utilisation : .tgstick https://t.me/addstickers/...", client);
        return;
    }

    if (!url.match(/(https:\/\/t.me\/addstickers\/)/gi)) {
        await sendStyled(remoteJid, "❌ URL invalide. Assurez-vous que c'est un lien de pack Telegram.", client);
        return;
    }

    const packName = url.replace("https://t.me/addstickers/", "");

    if (!TELEGRAM_BOT_TOKEN) {
        await sendStyled(remoteJid, "❌ Token Telegram non configuré. Contactez le propriétaire.", client);
        return;
    }

    try {
        const response = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getStickerSet?name=${encodeURIComponent(packName)}`,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "User-Agent": "Mozilla/5.0"
                }
            }
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const stickerSet = await response.json();
        if (!stickerSet.ok || !stickerSet.result) throw new Error('Pack introuvable ou réponse API invalide.');

        const total = stickerSet.result.stickers.length;
        const packTitle = stickerSet.result.title || 'Sans titre';
        const packCreator = stickerSet.result.name || 'Inconnu';

        const debutMsg = `📦 *Pack* : ${packTitle}\n👤 *Créateur* : ${packCreator}\n🗂 *Contient* : ${total} stickers.\n\n⚙️ Téléchargement en cours...`;
        await sendStyled(remoteJid, debutMsg, client);

        const tmpDir = path.join(__dirname, '../tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

        let successCount = 0;
        let pack = 'By';
        let author = OWNER_NAME || 'KATASHIE';
        if (args.length > 1) {
            const customPack = args.slice(1).join(' ');
            if (customPack) {
                pack = customPack;
                author = customPack;
            }
        }

        for (let i = 0; i < total; i++) {
            try {
                const sticker = stickerSet.result.stickers[i];
                const fileId = sticker.file_id;

                const fileInfo = await fetch(
                    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`
                );
                if (!fileInfo.ok) continue;
                const fileData = await fileInfo.json();
                if (!fileData.ok || !fileData.result.file_path) continue;

                const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${fileData.result.file_path}`;
                const imageRes = await fetch(fileUrl);
                const imageBuffer = await imageRes.buffer();

                const tempInput = path.join(tmpDir, `temp_${Date.now()}_${i}`);
                const tempOutput = path.join(tmpDir, `sticker_${Date.now()}_${i}.webp`);
                fs.writeFileSync(tempInput, imageBuffer);

                const isAnimated = sticker.is_animated || sticker.is_video;
                const ffmpegCmd = isAnimated
                    ? `ffmpeg -i "${tempInput}" -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 75 -compression_level 6 "${tempOutput}"`
                    : `ffmpeg -i "${tempInput}" -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 75 -compression_level 6 "${tempOutput}"`;

                await new Promise((resolve, reject) => {
                    exec(ffmpegCmd, (error) => {
                        if (error) reject(error);
                        else resolve();
                    });
                });

                const webpBuffer = fs.readFileSync(tempOutput);
                const img = new webp.Image();
                await img.load(webpBuffer);

                const metadata = {
                    'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
                    'sticker-pack-name': pack,
                    'sticker-pack-publisher': author,
                    'emojis': sticker.emoji ? [sticker.emoji] : ['🤖']
                };

                const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
                const jsonBuffer = Buffer.from(JSON.stringify(metadata), 'utf8');
                const exif = Buffer.concat([exifAttr, jsonBuffer]);
                exif.writeUIntLE(jsonBuffer.length, 14, 4);
                img.exif = exif;

                const finalBuffer = await img.save(null);

                await client.sendMessage(remoteJid, { sticker: finalBuffer });
                successCount++;

                fs.unlinkSync(tempInput);
                fs.unlinkSync(tempOutput);
                await delay(800);
            } catch (err) {
                console.error(`Erreur sticker ${i}:`, err);
                continue;
            }
        }

        const finMsg = `✅ *Téléchargement terminé !*\n📦 Pack : ${packTitle}\n✅ *${successCount}/${total} stickers envoyés.*`;
        await sendStyled(remoteJid, finMsg, client);

    } catch (error) {
        console.error('Erreur tgstick:', error);
        await sendStyled(remoteJid, "❌ Échec du téléchargement.\nVérifiez que le pack existe et est public.", client);
    }
}