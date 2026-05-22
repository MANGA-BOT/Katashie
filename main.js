// main.js (version robuste)
import connectToWhatsApp from './auth/authHandler.js';
import handleIncomingMessage from './events/messageHandler.js';
import { startBot } from './events/bot.js';
import startSession from './utils/connector.js';
import fs from 'fs';
import path from 'path';
// utils/web.js (ou dans main.js directement)
import express from 'express';
const app = express();

// Vérifie si une session est complète (creds.json présent)
function isSessionValid(number) {
    const credsPath = `./sessions/${number}/creds.json`;
    return fs.existsSync(credsPath);
}

// Récupère la liste des sessions depuis sessions.json ou par scan du dossier
function getSessionList() {
    const sessionsFile = './sessions.json';
    if (fs.existsSync(sessionsFile)) {
        try {
            const data = JSON.parse(fs.readFileSync(sessionsFile, 'utf8'));
            if (data.sessions && data.sessions.length) return data.sessions;
        } catch (err) {
            console.error("Erreur lecture sessions.json :", err.message);
        }
    }
    // Fallback : scanner le dossier sessions/
    const sessionsDir = './sessions';
    if (fs.existsSync(sessionsDir)) {
        const dirs = fs.readdirSync(sessionsDir);
        const valid = dirs.filter(dir => isSessionValid(dir));
        if (valid.length) {
            console.log(`📁 ${valid.length} session(s) trouvée(s) dans le dossier sessions/`);
            return valid;
        }
    }
    return [];
}

// Recharge toutes les sessions valides
async function restartAllSessions() {
    const sessionsList = getSessionList();
    if (sessionsList.length === 0) {
        console.log("ℹ️ Aucune session existante à recharger.");
        return;
    }
    console.log(`📱 Rechargement de ${sessionsList.length} session(s) enregistrée(s)...`);
    for (const number of sessionsList) {
        if (!isSessionValid(number)) {
            console.log(`⚠️ Session ${number} incomplète (creds.json manquant) – ignorée.`);
            continue;
        }
        console.log(`🔄 Relance de la session pour ${number}`);
        try {
            await startSession(number, handleIncomingMessage, false);
            await new Promise(resolve => setTimeout(resolve, 2000)); // pause entre chaque
        } catch (err) {
            console.error(`❌ Erreur relance session ${number}:`, err.message);
        }
    }
}

(async () => {
    console.log("🚀 Démarrage des bots...");

    // Lancer WhatsApp (session principale) – ne pas attendre
    const whatsappPromise = connectToWhatsApp(handleIncomingMessage).catch(err => {
        console.error("❌ WhatsApp erreur (non bloquante) :", err);
        return null;
    });

    // Lancer Telegram
    const telegramPromise = startBot().catch(err => {
        console.error("❌ Telegram erreur :", err);
        return null;
    });

    // Attendre un peu que la session principale ait eu le temps de s'initialiser
    // mais on ne bloque pas le rechargement des autres sessions
    await new Promise(resolve => setTimeout(resolve, 3001));

    // Recharger toutes les sessions existantes (indépendamment de la session principale)
    await restartAllSessions();

    // Maintenir les deux bots
    await Promise.allSettled([whatsappPromise, telegramPromise]);
    console.log("✅ Bots démarrés (WhatsApp optionnel, Telegram actif)");
})();