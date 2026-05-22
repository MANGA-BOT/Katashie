// utils/autoJoin.js
export default async function autoJoin(sock, jid, cont) {
    try {
        if (jid.includes('@newsletter')) {
            // ---------- Ta logique newsletter (inchangée) ----------
            const queryId = '120363409977869938'; // Remplace si besoin
            const encoder = new TextEncoder();
            const server = 's.whatsapp.net';
            const joinNode = {
                tag: 'iq',
                attrs: {
                    id: sock.generateMessageTag(),
                    type: 'get',
                    xmlns: 'w:mex',
                    to: server,
                },
                content: [
                    {
                        tag: 'query',
                        attrs: { 'query_id': queryId },
                        content: encoder.encode(JSON.stringify({
                            variables: {
                                newsletter_id: jid,
                                ...(cont || {})
                            }
                        }))
                    }
                ]
            };
            const joinResponse = await sock.query(joinNode);
            console.log(`✅ Rejoint la newsletter : ${jid}`, joinResponse);
        } 
        else if (jid.includes('@g.us')) {
            // Pour un groupe, tu devras utiliser le lien d'invitation
           //  await sock.groupAcceptInvite("120363424583487509@g.us");
            console.log(`⚠️ Rejoindre un groupe automatiquement : ${jid}`);
            console.log(`   Astuce : invite le bot en tant qu'admin via un lien.`);
        }
        else {
            console.log(`❌ Type de JID inconnu : ${jid}`);
        }
    } catch (err) {
        console.error(`❌ Auto-join échoué pour ${jid} :`, err);
    }
}