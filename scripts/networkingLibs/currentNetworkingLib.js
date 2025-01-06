import { world } from "@minecraft/server";
import { prismarineDb } from "../lib/prismarinedb";
import SHA256 from '../lib/sha256';
import { JSEncrypt } from '../lib/jsencrypt-lib/JSEncrypt';
import config from "../config";
let pubKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwRAxPPomPqL2I2tz4zWR
5wQhupVqHsGS3QUFFLcaAOA2vF5/AakqdQnZZp3Tc3pFTvB9Bskx1MFHjbGPU1bD
fwpGY57hlhL5D9G+/58CMGu4RkBtyKZJQoPa2nLgHsBY2PIJY0OXrIbfBYSJAH6f
qilpGbaHsdvO125KxKHIBWNGx3c4oEswrsV0DPyAgPyhffrRhNRC45Ooak5z35dz
+o05G+e+fueFxY+6HGrzEmhDkvYcrkLYB4wwYvkYGUb4u1rXmNREr334i0G1j6+O
iepaIZrD39Et96GAnlEKzkTAdQVtrMmDseVmpnEHXBMZgv+2tBzm8wUYEhs9uZvg
dwIDAQAB`;
class HTTP {
    constructor() {
        this.player;
        this.requests = new Map();
        this.requests2 = new Map();
    }
    setPlayer(player) {
        // if (!this.player || !this.player.id || player.id !== this.player.id) {
        //     if(config.DiscordLoggingWebhook) {
        //         this.player = player;
        //         this.makeRequest({
        //             method: 'post',
        //             url: config.DiscordLoggingWebhook,
        //             data: {
        //                 avatar_url: config.Discord.AvatarURL,
        //                 username: config.Discord.Username,
        //                 embeds: [
        //                     {
        //                         color: 0x4DB6AC,
        //                         description: `**External Networking** has been enabled!\n\`\`\`\nConnector Bot >> ${this.player.name}\n\`\`\``
        //                     }
        //                 ]
        //             }
        //         })
                    
        //     }
        // }
        this.player = player;
    }
    makeRequest(args, response) {
        if (!this.player) return;
        let id = Date.now().toString();
        this.requests.set(id, response);
        this.requests2.set(id, "");
        this.player.sendMessage(JSON.stringify({
            command: "make_request",
            request: args,
            id
        }))
    }
}
let http = new HTTP();
function getSpkiDer(spkiPem) {
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    var pemContents = spkiPem.substring(pemHeader.length, spkiPem.length - pemFooter.length);
    var binaryDerString = window.atob(pemContents);
    return str2ab(binaryDerString);
}
function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}
world.beforeEvents.chatSend.subscribe(async e => {
    if (!config.HTTPEnabled) return;
    if (e.message.startsWith(".NETWORKING_LIB-COMPATIBLE-PLAYER:")) {
        e.cancel = true;
        // much security
        let signature = e.message.substring(".NETWORKING_LIB-COMPATIBLE-PLAYER:".length);
        let jsenc = new JSEncrypt()
        jsenc.setPublicKey(pubKey)
        let val = `${e.sender.name}/${Math.floor(Date.now() / 10000)}`;
        let verified = jsenc.verify(val, signature, SHA256)
        if (!verified) {
            e.cancel = true;
            e.sender.sendMessage(`ERROR: Invalid signature`)
        } else {
            e.cancel = true;
            // e.cancel = true;
            http.setPlayer(e.sender);
        }
    }
    if (http.player && e.sender.id == http.player.id) {

        //503
        if (e.message.startsWith(`.APPEND:`)) {
            e.cancel = true;
            let id = e.message.substring('.APPEND:'.length).split(',')[0]
            let data = e.message.substring('.APPEND:'.length).split(',').slice(1).join(',')
            if (!http.requests2.has(id)) return;
            http.requests2.set(id, http.requests2.get(id) + data)
        }
        if (e.message.startsWith(`.END:`)) {
            e.cancel = true;
            let id = e.message.substring(`.END:`.length);
            let msg = http.requests2.get(id);
            // world.sendMessage(msg)
            if (msg) {
                if (msg.startsWith(`.RES:`)) {
                    // e.cancel = true;
                    let status = parseInt(msg.substring('.RES:'.length).split(',', 3)[0])
                    let id = msg.substring('.RES:'.length).split(',', 3)[1]
                    let data = msg.substring('.RES:'.length).split(',').slice(2).join(',')
                    if (http.requests.has(id)) {
                        http.requests.get(id)(status, data.replaceAll('\\n', '\n'))
                    }
                }
            }
        }
    }
    if (e.message == ".test") {
        http.makeRequest({
            method: 'get',
            url: 'https://nekos.life/api/v2/cat',
        }, (status, data) => {
            // world.sendMessage(`sent message`)
            world.sendMessage(`Received a response from https://nekos.life/api/v2/cat with status ${status} and data:\n${data}`)
        })
    }
})
export default http