import { system, world } from "@minecraft/server";
import commandManager from "../api/commands/commandManager";
import translation from "../api/translation";
import { prismarineDb } from "../lib/prismarinedb";
import actionParser from "../api/actionParser";
import uiBuilder from "../api/uiBuilder";


let pdbKeyval = await prismarineDb.keyval("binds");
if(!pdbKeyval.has(`leaf:navigator`)) {
    pdbKeyval.set(`leaf:navigator`, `/scriptevent leaf:open leaf/nav`)
}
commandManager.addCommand("bind", { description: "Bind items to commands", category: "Setup", format: "!bind <command>" }, ({ msg, args }) => {
    let player = msg.sender;
    if(!prismarineDb.permissions.hasPermission(player, "bind")) return player.error(`Nuh uh`)
    let inventory = player.getComponent('inventory');
    let container = inventory.container;
    
    if (!container.getItem(player.selectedSlotIndex)) return player.error("You need to be holding an item");
    
    let item = container.getItem(player.selectedSlotIndex);
    pdbKeyval.set(item.typeId, args.join(' '));
    player.success(`Successfully set ${item.typeId} to §a${args.join(' ')}`);
});

commandManager.addSubcommand("bind", "item", { description: "Binds a command to the specific item you are holding" }, ({ msg, args }) => {
    let player = msg.sender;
    if(!prismarineDb.permissions.hasPermission(player, "bind")) return player.error(`Nuh uh`)
        let inventory = player.getComponent("inventory");
    let item = inventory.container.getItem(player.selectedSlotIndex);
    if (!item) return player.error("You need to hold an item.");
    if (item.isStackable) return player.error("This command only works on unstackable items.");

    item.setDynamicProperty("bind_command", args.join(' '));
    inventory.container.setItem(player.selectedSlotIndex, item);
    player.success(`Successfully bound command §a${args.join(' ')}§r to this specific item`);
});

commandManager.addSubcommand("bind", "name", { description: "Binds a command to items with matching type and name" }, ({ msg, args }) => {
    let player = msg.sender;
    if(!prismarineDb.permissions.hasPermission(player, "bind")) return player.error(`Nuh uh`)
    let inventory = player.getComponent("inventory");
    let item = inventory.container.getItem(player.selectedSlotIndex);
    if (!item) return player.error("You need to hold an item.");
    if (!item.nameTag) return player.error("This item needs to have a custom name.");

    const bindKey = `${item.typeId}:${item.nameTag}`;
    pdbKeyval.set(bindKey, args.join(' '));
    player.success(`Successfully bound command §a${args.join(' ')}§r to items of type ${item.typeId} named "${item.nameTag}"`);
});

commandManager.addSubcommand("bind", "list", { description: "Lists all binds" }, ({ msg }) => {
    let player = msg.sender;
    if(!prismarineDb.permissions.hasPermission(player, "bind")) return player.error(`Nuh uh`)
    const binds = [];
    for (const key of pdbKeyval.keys()) {
        binds.push(`§b${key} §7-> §a${pdbKeyval.get(key)}`);
    }
    if (binds.length === 0) {
        player.sendMessage("§cNo binds found.");
    } else {
        player.sendMessage("§2Current binds:\n" + binds.join('\n'));
    }
});

commandManager.addCommand("unbind", { description: "Removes any bind from the held item", category: "Setup", format: "!unbind" }, ({ msg }) => {
    let player = msg.sender;
    if(!prismarineDb.permissions.hasPermission(player, "bind")) return player.error(`Nuh uh`)
    let inventory = player.getComponent("inventory");
    let item = inventory.container.getItem(player.selectedSlotIndex);
    if (!item) return player.error("You need to hold an item.");

    let found = false;

    // Check for item-specific bind
    if (item.getDynamicProperty("bind_command")) {
        item.setDynamicProperty("bind_command", undefined);
        inventory.container.setItem(player.selectedSlotIndex, item);
        player.success("Removed the specific bind from this item");
        found = true;
    }

    // Check for name-specific bind
    if (item.nameTag) {
        const nameBindKey = `${item.typeId}:${item.nameTag}`;
        if (pdbKeyval.has(nameBindKey)) {
            pdbKeyval.delete(nameBindKey);
            player.success(`Removed bind for ${item.typeId} items named "${item.nameTag}"`);
            found = true;
        }
    }

    // Check for type bind
    if (pdbKeyval.has(item.typeId)) {
        pdbKeyval.delete(item.typeId);
        player.success(`Removed bind for all ${item.typeId} items`);
        found = true;
    }

    if (!found) {
        player.error("This item has no binds to remove");
    }
});

commandManager.addCommand("binds", { description: "Shows all global and named item binds", category: "Setup", format: "!binds" }, ({ msg }) => {
    let player = msg.sender;
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
    
    player.sendMessage(message);
});

// Event listener for item use
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
