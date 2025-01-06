import { system, world } from "@minecraft/server";
import commandManager from "../api/commands/commandManager";
import translation from "../api/translation";
import { prismarineDb } from "../lib/prismarinedb";
import actionParser from "../api/actionParser";
let pdbKeyval = prismarineDb.keyval("binds");
commandManager.addCommand("bind", { description: "Bind items to commands", category: "Setup", format: "!bind <command>" }, ({ msg, args }) => {
    let player = msg.sender;
    if (!prismarineDb.permissions.hasPermission(player, "bind")) return player.error(translation.getTranslation(player, "commands.errors.noperms", "bind"))
    let inventory = msg.sender.getComponent('inventory');
    let container = inventory.container;
    if (!container.getItem(player.selectedSlotIndex)) return player.error("You need to be holding an item");
    let item = container.getItem(player.selectedSlotIndex);
    pdbKeyval.set(item.typeId, args.join(' '))
    player.success(`Set the bind of §f${item.typeId} §7to §f${args.join(' ')}`);
})
commandManager.addSubcommand("bind", "list", { description: "Lists all binds" }, ({ msg }) => {
    let player = msg.sender;
    let text = [];
    for (const key of pdbKeyval.keys()) {
        text.push(`${key} - ${pdbKeyval.get(key)}`);
    }
    player.sendMessage(text.join('\n'))
})
commandManager.addSubcommand("bind", "delete", { description: "Deletes bind" }, ({ msg }) => {
    let player = msg.sender;
    if (!prismarineDb.permissions.hasPermission(player, "bind")) return player.error(translation.getTranslation(player, "commands.errors.noperms", "bind"))
    let inventory = msg.sender.getComponent('inventory');
    let container = inventory.container;
    if (!container.getItem(player.selectedSlotIndex)) return player.error("You need to be holding an item");
    let item = container.getItem(player.selectedSlotIndex);
    if (!pdbKeyval.has(item.typeId)) return player.error("This item does not have anything binded to it.");
    pdbKeyval.set(item.typeId, "");
    pdbKeyval.delete(item.typeId);
    player.success(`Successfully unbinded ${item.typeId}`);
})
world.beforeEvents.itemUse.subscribe(e => {
    if (e.source.typeId != "minecraft:player") return;
    if (e.itemStack.typeId == "leaf:config_ui") return;
    if (!pdbKeyval.has(e.itemStack.typeId)) return;
    if (!pdbKeyval.get(e.itemStack.typeId)) return;
    e.cancel = true;
    system.run(() => {
        actionParser.runAction(e.source, pdbKeyval.get(e.itemStack.typeId)) // im a furry btw
    })
})