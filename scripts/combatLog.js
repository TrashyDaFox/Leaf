import { Player, system, world } from "@minecraft/server";
import { worldTags } from "./worldTags";
import { prismarineDb } from "./lib/prismarinedb";
import commandManager from "./api/commands/commandManager";
import permissionsSystem from "./api/permissionsSystem";
import { combatLogDB } from "./configs";
let cfgDb = combatLogDB;
export let combatLog = new Map();
function getSeconds() {
    return parseInt(
        cfgDb.get("CombatlogSeconds") ? cfgDb.get("CombatlogSeconds") : 10
    );
}
function getIsEnabled() {
    return cfgDb.get("CombatlogEnabled") ? true : false;
}
let enabled = false;
let seconds = 10;
let enterMessage = "§aYou have entered combat";
let defaultEnterMessage = "§aYou have entered combat";
let exitMessage = "§cYou have exited combat";
let defaultExitMessage = "§cYou have exited combat";
commandManager.addCommand(
    "combatlog",
    { description: "yes", author: "TrashyKitty", category: "Admin" },
    ({ msg, args }) => {
        msg.sender.sendCommand(
            "Use !combatlog toggle to toggle and !combatlog set-seconds to set seconds"
        );
    }
);
commandManager.addSubcommand(
    "combatlog",
    "toggle",
    { description: "toggle combat log" },
    ({ msg, args }) => {
        if (!permissionsSystem.hasPermission(msg.sender, "combatlog.edit"))
            return msg.sender.sendMessage("§cyou no no have permission");
        let currentValue = getIsEnabled();
        cfgDb.set("CombatlogEnabled", !currentValue);

        if (currentValue) {
            msg.sender.sendMessage("§cDisabled");
        } else msg.sender.sendMessage("§aEnabled");
    }
);
commandManager.addSubcommand(
    "combatlog",
    "set-seconds",
    { description: "toggle combat log" },
    ({ msg, args }) => {
        if (!permissionsSystem.hasPermission(msg.sender, "combatlog.edit"))
            return msg.sender.sendMessage("§cyou no no have permission");
        let currentValue = getSeconds();
        if (args.length) {
            if (!/^\d+$/.test(args[0]))
                return msg.sender.sendMessage(
                    "§cFirst argument needs to be a number"
                );
            cfgDb.set("CombatlogSeconds", parseInt(args[0]));
            return msg.sender.sendMessage(
                `§aSet seconds to §f${parseInt(args[0])}`
            );
        } else {
            return msg.sender.sendMessage(
                `§cYou need a number amount: §f${currentValue}`
            );
        }
    }
);
// system.runInterval(() => {
// enabled = getIsEnabled();
// seconds = getSeconds();
// if (!enabled) combatLog.clear();
// if (!enabled) return;
// let CLEnter = cfgDb.get("CLEnter");
// let CLExit = cfgDb.get("CLExit");
// if (!CLEnter) cfgDb.set("CLEnter", defaultEnterMessage)
// if (!CLExit) cfgDb.set("CLExit", defaultExitMessage)
// if (CLEnter) enterMessage = CLEnter;
// if (CLExit) exitMessage = CLExit;
// }, 200);
world.afterEvents.entityHitEntity.subscribe((e) => {
    if (!enabled) return;
    if (
        e.hitEntity.typeId != "minecraft:player" ||
        e.damagingEntity.typeId != "minecraft:player"
    )
        return;
    if (!combatLog.has(e.hitEntity.id)) e.hitEntity.sendMessage(enterMessage);
    if (!combatLog.has(e.damagingEntity.id))
        e.damagingEntity.sendMessage(enterMessage);
    combatLog.set(e.hitEntity.id, Date.now());
    combatLog.set(e.damagingEntity.id, Date.now());
});

world.afterEvents.playerLeave.subscribe((e) => {
    if (!enabled) return;
    if (combatLog.has(e.playerId)) {
        combatLog.delete(e.playerId);
        worldTags.addTag(`kill-${e.playerId}`);
    }
});

world.afterEvents.playerSpawn.subscribe((e) => {
    if (!enabled) return;
    if (e.initialSpawn) {
        let { player } = e;
        if (worldTags.hasTag(`kill-${player.id}`)) {
            if (combatLog.has(player.id)) combatLog.delete(player.id);
            worldTags.removeTag(`kill-${player.id}`);
            e.player.kill();
        }
    }
});

// system.runInterval(() => {
//     if (!enabled) return;
//     for (const key of combatLog.keys()) {
//         let entity = world.getPlayers().find(_ => _.id == key);
//         if (!entity) return;
//         let val = combatLog.get(key);
//         if (Date.now() >= val + seconds * 1000) {
//             combatLog.delete(key);
//             entity.sendMessage(exitMessage);
//         }
//     }
// }, 15);
