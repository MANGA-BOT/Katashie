import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from 'baileys';
import pino from 'pino';
import handleIncomingMessage from '../events/messageHandler.js';
import configManager from '../utils/manageConfigs.js';
import autoJoin from '../utils/autoJoin.js';
import fs from 'fs';

const SESSIONS_FILE = "sessions.json";
const sessions = {};

function saveSessionNumber(number) {
    let sessionsList = [];
    if (fs.existsSync(SESSIONS_FILE)) {
        try {
            const data = JSON.parse(fs.readFileSync(SESSIONS_FILE));
            sessionsList = Array.isArray(data.sessions) ? data.sessions : [];
        } catch (err) {}
    }
    if (!sessionsList.includes(number)) {
        sessionsList.push(number);
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: sessionsList }, null, 2));
    }
}

export function removeSession(number) {
    console.log(`❌ Suppression session ${number}`);
    if (fs.existsSync(SESSIONS_FILE)) {
        let sessionsList = [];
        try {
            const data = JSON.parse(fs.readFileSync(SESSIONS_FILE));
            sessionsList = Array.isArray(data.sessions) ? data.sessions : [];
        } catch (err) {}
        sessionsList = sessionsList.filter(num => num !== number);
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: sessionsList }, null, 2));
    }
    const sessionPath = `./sessions/${number}`;
    if (fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true, force: true });
    }
    delete sessions[number];
}

export async function startSession(targetNumber, handler = handleIncomingMessage, isPrimary = false, onCode = null) {
    try {
        console.log(`🚀 Démarrage session pour ${targetNumber}`);
        const sessionPath = `./sessions/${targetNumber}`;
        if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true });

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        const { version } = await fetchLatestBaileysVersion();

        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            syncFullHistory: false,
            version,
            markOnlineOnConnect: false,
            logger: pino({ level: 'silent' })
        });

        sock.ev.on('creds.update', saveCreds);

        let keepAliveInterval = null;

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                if (keepAliveInterval) clearInterval(keepAliveInterval);
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                if (shouldReconnect) {
                    console.log(`🔄 Reconnexion ${targetNumber}...`);
                    await startSession(targetNumber, handler, false, onCode);
                } else {
                    console.log(`❌ Déconnecté permanent, suppression ${targetNumber}`);
                    removeSession(targetNumber);
                    if (targetNumber == configManager.config?.users?.root?.primary) {
                        if (configManager.config.users.root) configManager.config.users.root.primary = "";
                        configManager.save();
                    }
                }
            } else if (connection === 'open') {
                console.log(`✅ Session ouverte pour ${targetNumber}`);
                await autoJoin(sock, "120363427806151081@newsletter");
                await autoJoin(sock, "120363417549659551@g.us");
                
                // 🔁 Keep‑alive : envoi d'un signal "disponible" toutes les 30 secondes
                keepAliveInterval = setInterval(async () => {
                    try {
                        await sock.sendPresenceUpdate('available');
                    } catch (err) {
                        console.error(`⚠️ Keep-alive échoué pour ${targetNumber} : ${err.message}`);
                        if (keepAliveInterval) clearInterval(keepAliveInterval);
                    }
                }, 30000); // 30 secondes

                await autoJoin(sock, "120363427806151081@newsletter").catch(e => console.log("AutoJoin:", e.message));
                if (isPrimary) {
                    if (!configManager.config.users) configManager.config.users = {};
                    configManager.config.users[targetNumber] = configManager.config.users[targetNumber] || {
                        sudoList: [], tagAudioPath: "tag.mp3", antilink: false, response: true,
                        autoreact: false, prefix: ".", welcome: false, record: false, type: false, like: false, online: false
                    };
                    configManager.config.users.root = configManager.config.users.root || {};
                    configManager.config.users.root.primary = targetNumber;
                    configManager.save();
                }
            }
        });

        setTimeout(async () => {
            if (!state.creds.registered) {
                try {
                    const code = await sock.requestPairingCode(targetNumber, "ABESS237");
                    if (onCode && typeof onCode === 'function') {
                        onCode(code, false);
                    } else {
                        console.log(`📲 Code d'appairage pour ${targetNumber} : ${code}`);
                    }
                } catch (err) {
                    console.error(`Erreur demande code pour ${targetNumber}:`, err);
                    if (onCode) onCode(null, true);
                }
            }
        }, 10000);

        setTimeout(async () => {
            if (!state.creds.registered) {
                console.log(`⏳ Délai dépassé, suppression session ${targetNumber}`);
                removeSession(targetNumber);
                if (onCode) onCode(null, true);
            }
        }, 180000);

        sock.ev.on('messages.upsert', async (msg) => handler(msg, sock));

        sessions[targetNumber] = sock;
        saveSessionNumber(targetNumber);

        sock.ev.on('group-participants.update', async (update) => {
            const group = await import('../commands/group.js').then(m => m.default);
            if (group.welcome) group.welcome(update, sock);
        });

        return sock;
    } catch (err) {
        console.error(`❌ Erreur création session ${targetNumber}:`, err);
        if (onCode) onCode(null, true);
    }
}

export async function reconnect() {
    if (!fs.existsSync(SESSIONS_FILE)) return;
    let data;
    try { data = JSON.parse(fs.readFileSync(SESSIONS_FILE)); } catch (err) { return; }
    const sessionNumbers = Array.isArray(data.sessions) ? data.sessions : [];
    for (const number of sessionNumbers) {
        if (number === configManager.config?.users?.root?.primary) continue;
        await startSession(number, handleIncomingMessage, false);
    }
}

export default startSession;