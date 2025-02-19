import { world } from "@minecraft/server";
import commandManager from "../api/commands/commandManager";
import { prismarineDb } from "../lib/prismarinedb";
import { createMessage } from "../createMessage";

commandManager.addCommand("speakas", {
    description: "Make other players send messages :3",
    category: "Admin",
    format: "!speakas <player> <msg>"
}, ({msg, args})=>{
    if(!prismarineDb.permissions.hasPermission(msg.sender, "commands.speakas")) return;
    let player;
    for(const player2 of world.getPlayers()) {
        if(player2.name.toLowerCase() == args[0].toLowerCase()) player = player2;
    }
    if(!player) msg.sender.sendMessage("§cPlayer not found");
    createMessage(player, args.slice(1).join(' '))
})