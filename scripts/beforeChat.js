import commandManager from "./api/commands/commandManager";
import configAPI from "./api/config/configAPI";
import OpenClanAPI from "./api/OpenClanAPI";
import config from "./versionData";
import { createMessage } from "./createMessage";
import { isMuted } from "./uis/moderation_hub/bans";

export default function(e) {
    if (e.message.startsWith('!')) {
        e.cancel = true;
        commandManager.run(e)
        return;
    }
    if(e.sender.hasTag(`disable:chat`)) return e.sender.error("Chat is disabled")
        let playerIsMuted = isMuted(e.sender);
    if(playerIsMuted) {
        e.cancel = true;
        e.sender.error("You are muted :<")
        return;
    }
    if (configAPI.getProperty("Chatranks")) {
        e.cancel = true;
        if (e.message.startsWith('.') && config.HTTPEnabled) return;
        if (e.sender.hasTag("clan-chat")) {
            let clan = OpenClanAPI.getClan(e.sender)
            if (clan) {
                OpenClanAPI.clanSendMessage(e.sender, clan.id, e.message);
                return;
            }
        }
        createMessage(e.sender, e.message);
    }
}