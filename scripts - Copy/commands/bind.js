import { system, world } from "@minecraft/server";
import commandManager from "../api/commands/commandManager";
import translation from "../api/translation";
import { prismarineDb } from "../lib/prismarinedb";
import actionParser from "../api/actionParser";
let pdbKeyval = await prismarineDb.keyval("binds");
// commandManager.addCommand("bind", { description: "Bind items to commands", category: "Setup", format: "!bind <command>" }, ({ msg, args }) => {
    // let player = msg.sender;
    // if (!prismarineDb.permissions.hasPermission(player, "bind")) return player.error(translation.getTranslation(player, "commands.errors.noperms", "bind"))
//     let inventory = msg.sender.getComponent('inventory');
//     let container = inventory.container;
//     if (!container.getItem(player.selectedSlotIndex)) return player.error("You need to be holding an item");
//     let item = container.getItem(player.selectedSlotIndex);
//     pdbKeyval.set(item.typeId, args.join(' '))
//     player.success(`Set the bind of §f${item.typeId} §7to §f${args.join(' ')}`);
// })
// commandManager.addSubcommand("bind", "list", { description: "Lists all binds" }, ({ msg }) => {
//     let player = msg.sender;
//     let text = [];
//     for (const key of pdbKeyval.keys()) {
//         text.push(`${key} - ${pdbKeyval.get(key)}`);
//     }
//     player.sendMessage(text.join('\n'))
// })
// commandManager.addSubcommand("bind", "delete", { description: "Deletes bind" }, ({ msg }) => {
//     let player = msg.sender;
//     if (!prismarineDb.permissions.hasPermission(player, "bind")) return player.error(translation.getTranslation(player, "commands.errors.noperms", "bind"))
//     let inventory = msg.sender.getComponent('inventory');
//     let container = inventory.container;
//     if (!container.getItem(player.selectedSlotIndex)) return player.error("You need to be holding an item");
//     let item = container.getItem(player.selectedSlotIndex);
//     if (!pdbKeyval.has(item.typeId)) return player.error("This item does not have anything binded to it.");
//     pdbKeyval.set(item.typeId, "");
//     pdbKeyval.delete(item.typeId);
//     player.success(`Successfully unbinded ${item.typeId}`);
// })

import { CommandHandler } from "../api/commandHandler";
world.beforeEvents.itemUse.subscribe(e => {
    if (e.source.typeId != "minecraft:player") return;
    if (e.itemStack.typeId == "leaf:config_ui") return;

    let command = null;
    
    // Check item-specific bind first
    command = e.itemStack.getDynamicProperty("bind_command");
    
    // Check name-specific bind
    if (!command && e.itemStack.nameTag) {
        const nameBindKey = `${e.itemStack.typeId}:${e.itemStack.nameTag}`;
        command = pdbKeyval.get(nameBindKey);
    }
    
    // Check type bind
    if (!command) {
        command = pdbKeyval.get(e.itemStack.typeId);
    }
    
    if (command) {
        e.cancel = true;
        system.run(() => {
            actionParser.runAction(e.source, command);
        });
    }
});
CommandHandler.registerCommand("bind", (args, sender)=>{
    let inventory = sender.getComponent("inventory");
    let item = inventory.container.getItem(sender.selectedSlotIndex);
    if(!item) return sender.error("You need to hold an item.")
    pdbKeyval.set(item.typeId, args.join(' '));
    sender.success(`Successfully set ${item.typeId} to §a${args.join(' ')}`)
}, {
    helpMessage: ([
        "§b!bind §a<command> §7- §fBinds a command to an item of the type you are holding",
        "§b!bind §ditem §a<command> §7- §fBinds a command to ONLY the item you are holding (only works on unstackable items)",
        "§b!bind §dname §a<command> §7- §fBinds a command to the name and type of the item you are holding",
    ]).join('\n§r'),
    requiredPermission: "binding"
})

CommandHandler.registerSubCommand("bind", "item", (args, sender) => {
    let inventory = sender.getComponent("inventory");
    let item = inventory.container.getItem(sender.selectedSlotIndex);
    if (!item) return sender.error("You need to hold an item.");
    if (item.isStackable) return sender.error("This command only works on unstackable items.");
    
    item.setDynamicProperty("bind_command", args.join(' '));
    inventory.container.setItem(sender.selectedSlotIndex, item)
    sender.success(`Successfully bound command §a${args.join(' ')}§r to this specific item`);
}, {
    helpMessage: "§b!bind item §a<command> §7- §fBinds a command to the specific item you are holding",
    requiredPermission: "binding"
});

CommandHandler.registerSubCommand("bind", "name", (args, sender) => {
    let inventory = sender.getComponent("inventory");
    let item = inventory.container.getItem(sender.selectedSlotIndex);
    if (!item) return sender.error("You need to hold an item.");
    if (!item.nameTag) return sender.error("This item needs to have a custom name.");
    
    const bindKey = `${item.typeId}:${item.nameTag}`;
    pdbKeyval.set(bindKey, args.join(' '));
    sender.success(`Successfully bound command §a${args.join(' ')}§r to items of type ${item.typeId} named "${item.nameTag}"`);
}, {
    helpMessage: "§b!bind name §a<command> §7- §fBinds a command to items with matching type and name",
    requiredPermission: "binding"
});

CommandHandler.registerSubCommand("bind", "list", (args, sender) => {
    const binds = [];
    for (const key of pdbKeyval.keys()) {
        binds.push(`§b${key} §7-> §a${pdbKeyval.get(key)}`);
    }
    if (binds.length === 0) {
        sender.sendMessage("§cNo binds found.");
    } else {
        sender.sendMessage("§2Current binds:\n" + binds.join('\n'));
    }
}, {
    helpMessage: "§b!bind list §7- §fShows all active binds",
    requiredPermission: "binding"
});

CommandHandler.registerCommand("unbind", (args, sender) => {
    let inventory = sender.getComponent("inventory");
    let item = inventory.container.getItem(sender.selectedSlotIndex);
    if (!item) return sender.error("You need to hold an item.");
    
    let found = false;
    
    // Check for item-specific bind
    if (item.getDynamicProperty("bind_command")) {
        item.setDynamicProperty("bind_command", undefined);
        inventory.container.setItem(sender.selectedSlotIndex, item)
        sender.success("Removed the specific bind from this item");
        found = true;
    }

    // Check for name-specific bind
    if (item.nameTag) {
        const nameBindKey = `${item.typeId}:${item.nameTag}`;
        if (pdbKeyval.has(nameBindKey)) {
            pdbKeyval.delete(nameBindKey);
            sender.success(`Removed bind for ${item.typeId} items named "${item.nameTag}"`);
            found = true;
        }
    }

    // Check for type bind
    if (pdbKeyval.has(item.typeId)) {
        pdbKeyval.delete(item.typeId);
        sender.success(`Removed bind for all ${item.typeId} items`);
        found = true;
    }

    if (!found) {
        sender.error("This item has no binds to remove");
    }
}, {
    helpMessage: "§b!unbind §7- §fRemoves any bind from the held item",
    requiredPermission: "binding"
});

CommandHandler.registerCommand("binds", (args, sender) => {
    const typeBinds = [];
    const nameBinds = [];
    
    for (const key of pdbKeyval.keys()) {
        if (key.split(':').length > 2) {
            // Name bind
            const [namespace, type, name] = key.split(':');
            nameBinds.push(`  §b${namespace}:${type}§7 named "§e${name}§r§7" §7-> §a${pdbKeyval.get(key)}`);
        } else {
            // Type bind
            typeBinds.push(`  §b${key} §7-> §a${pdbKeyval.get(key)}`);
        }
    }

    let message = "§2§lActive Binds:§r\n";
    
    if (typeBinds.length > 0) {
        message += "\n§l§6Global Binds:§r\n" + typeBinds.join('\n');
    }
    
    if (nameBinds.length > 0) {
        message += "\n\n§l§6Named Item Binds:§r\n" + nameBinds.join('\n');
    }
    
    if (typeBinds.length === 0 && nameBinds.length === 0) {
        message += "\n§cNo binds found.";
    }
    
    sender.sendMessage(message);
}, {
    helpMessage: "§b!binds §7- §fShows all global and named item binds",
    requiredPermission: "binding"
});


// CommandHandler.registerSubCommand("bind", "")

// CommandHandler.register