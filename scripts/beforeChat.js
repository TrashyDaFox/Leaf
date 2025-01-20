import commandManager from "./api/commands/commandManager";
import configAPI from "./api/config/configAPI";
import OpenClanAPI from "./api/OpenClanAPI";
import config from "./config";
import { createMessage } from "./createMessage";

export default function(e) {
    if (e.message.startsWith('!')) {
        e.cancel = true;
        commandManager.run(e)
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