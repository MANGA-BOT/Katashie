// commands/connect.js
import startSession from '../utils/connector.js';
import handleIncomingMessage from '../events/messageHandler.js';

const NEWSLETTER = "120363409977869938@newsletter";

export default async function connect(message, client, targetNumber) {
    const remoteJid = message.key.remoteJid;
    
    // Nettoyer le numéro
    let number = targetNumber?.trim().replace(/[^0-9]/g, '');
    if (!number || number.length < 7) {
        await client.sendMessage(remoteJid, { 
            text: `
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋  ❌ *Numéro invalide*
┋  📌 *Utilisation :* .connect 237xxxxxx
┗▣
> power by *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*`,
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
        return;
    }
    
    // Vérifier si la session existe déjà
    const sessionPath = `./sessions/${number}`;
    const fs = await import('fs');
    if (fs.existsSync(sessionPath)) {
        await client.sendMessage(remoteJid, { 
            text: `
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋  ⚠️ *Session existante*
┋  📲 ${number}
┋  🔄 Utilisez .disconnect ${number} d'abord
┗▣
> power by *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*`,
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
        return;
    }
    
    await client.sendMessage(remoteJid, { 
        text: `
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋  🔐 *Demande d'appairage*
┋  📲 ${number}
┋  ⏳ Le code va arriver dans quelques secondes...
┗▣
> power by *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*`,
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
    
    try {
        await startSession(number, handleIncomingMessage, true, async (code, error) => {
            if (error || !code) {
                await client.sendMessage(remoteJid, { 
                    text: `
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋  ❌ *Échec de l'appairage*
┋  📲 ${number}
┋  🔄 Vérifiez le numéro et réessayez.
┗▣
> power by *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*`,
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
                return;
            }
            await client.sendMessage(remoteJid, { 
                text: `
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋  📲 *Code d'appairage* :
┋  \`${code}\`
┋
┋  🔑 Entrez ce code dans WhatsApp
┋  sur le téléphone associé au numéro
┋  *${number}*
┋  (Paramètres → Appareils liés → Lier)
┋  ⏱️ Le code expire après 3 minutes.
┗▣
> power by *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*`,
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
        });
    } catch (err) {
        console.error('Erreur dans la commande connect :', err);
        await client.sendMessage(remoteJid, { 
            text: `
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋        *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋  ❌ *Erreur interne*
┋  ${err.message}
┗▣
> power by *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*`,
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
}