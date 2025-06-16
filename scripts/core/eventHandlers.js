import { world, system, ScriptEventSource } from "@minecraft/server";
import { uiManager } from "./uiManager.js";
import { createMessage } from "./createMessage.js";
import config from "./config.js";
import { betterArgs } from "./utils.js";
import playerStorage from "./api/playerStorage.js";
import OpenClanAPI from "./api/OpenClanAPI.js";
import configAPI from "./api/config/configAPI.js";

export function setupEventHandlers() {
    // Chat events
    world.beforeEvents.chatSend.subscribe(handleChat);

    // Player events
    world.afterEvents.playerSpawn.subscribe(handlePlayerSpawn);
    world.beforeEvents.playerLeave.subscribe(handlePlayerLeave);

    // Item use events
    world.afterEvents.itemUse.subscribe(handleItemUse);

    // Script events
    system.afterEvents.scriptEventReceive.subscribe(handleScriptEvent);
}

function handleChat(e) {
    if (e.message.startsWith("!")) {
        e.cancel = true;
        commandManager.run(e);
        return;
    }

    if (configAPI.getProperty("Chatranks")) {
        e.cancel = true;
        if (e.message.startsWith(".") && config.HTTPEnabled) return;
        if (e.sender.hasTag("clan-chat")) {
            let clan = OpenClanAPI.getClan(e.sender);
            if (clan) {
                OpenClanAPI.clanSendMessage(e.sender, clan.id, e.message);
                return;
            }
        }
        createMessage(e.sender, e.message);
    }
}

// ... implement other event handlers
