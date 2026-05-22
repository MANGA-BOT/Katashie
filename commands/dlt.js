import sender from "../commands/sender.js";

async function dlt(message, client) {

    try {

        const quotedMessageInfo = message.message?.extendedTextMessage?.contextInfo;

        if (!quotedMessageInfo || !quotedMessageInfo.quotedMessage) {

            sender(message, client, "❌ Répondez à un message pour le supprimer.");

            return;
        }

        const chatId = message.key.remoteJid;

        const quotedMessageKey = quotedMessageInfo.stanzaId;

        const quotedSender = quotedMessageInfo.participant;
        
        const isFromBot = quotedSender === client.user.id;

        if (!quotedMessageKey || !chatId) {

            sender(message, client, "❌ Impossible de trouver le message à supprimer.");
            
            return;
        }

        console.log(`🗑 Suppression du message ID: ${quotedMessageKey} dans ${chatId}`);

        // 1️⃣ Tentative de suppression pour tout le monde
        try {

            await client.sendMessage(remoteJid, { delete: quotedMessageKey });

            console.log("✅ Message supprimé pour tout le monde.");

            return;

        } catch (error) {
            console.error("⚠️ Impossible de supprimer pour tout le monde, tentative locale...");
        }

        // 2️⃣ Si ça échoue, suppression uniquement pour le bot
        try {
            await client.chatModify(
                { clear: { messages: [{ id: quotedMessageKey, fromMe: isFromBot }] } },
                chatId
            );
            console.log("✅ Message supprimé localement.");
        } catch (error) {
            console.error("❌ Échec de la suppression locale :", error);
            sender(message, client, "❌ Impossible de supprimer le message.");
        }

    } catch (error) {
        console.error("❌ Erreur lors de la suppression :", error);
        sender(message, client, "❌ Échec de la suppression du message.");
    }
}

export default dlt;