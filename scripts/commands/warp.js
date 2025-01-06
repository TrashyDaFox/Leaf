import commandManager from "../api/commands/commandManager";
import translation from "../api/translation";
import warpAPI from "../api/warpAPI";
import { prismarineDb } from "../lib/prismarinedb";

commandManager.addCommand("warp", { description: "Warps!", category: "Admin", aliases: ["warps", "w"], format: "!warp <warpname>" }, ({ msg, args }) => {
    if (!args.length) {
        let text = [`§7-----> §2Warps §7<-----`];
        let warps = warpAPI.getWarps();
        for (const warp of warps) {
            text.push(`§8> §a${warp.data.name}`);
        }
        msg.sender.sendMessage(text.join('\n§r'));
    } else {
        let result = warpAPI.tpToWarp(msg.sender, args.join(' '));
        if (!result) {
            msg.sender.sendMessage(translation.getTranslation(msg.sender, 'error', "Warp not found"))
        } else {
            msg.sender.sendMessage(translation.getTranslation(msg.sender, 'success', "Teleported to warp!"))
        }
    }
})
commandManager.addSubcommand("warp", "set", { description: "set a warp", format: "!warp set <warpname>"}, ({ msg, args }) => {
    if (!prismarineDb.permissions.hasPermission(msg.sender, "warps.set"))
        return msg.sender.sendMessage(translation.getTranslation(msg.sender, "error", translation.getTranslation(msg.sender, "commands.errors.noperms", "warps.set")))

    let result = warpAPI.setWarpAtVec3(msg.sender.location, args.join(' '));
    msg.sender.sendMessage(translation.getTranslation(msg.sender, "success", "Successfully set warp!"))
})
commandManager.addSubcommand("warp", "remove", { description: "remove a warp", format: "!warp remove <warpname>" }, ({ msg, args }) => {
    if (!prismarineDb.permissions.hasPermission(msg.sender, "warps.remove"))
        return msg.sender.sendMessage(translation.getTranslation(msg.sender, "error", translation.getTranslation(msg.sender, "commands.errors.noperms", "warps.remove")))

    let result = warpAPI.deleteWarp(args.join(' '));
    if (!result) {
        msg.sender.sendMessage(translation.getTranslation(msg.sender, 'error', "Warp not found"))
    } else {
        msg.sender.sendMessage(translation.getTranslation(msg.sender, 'success', "Deleted warp"))
    }
})

commandManager.addCommand("spawn", { description: "Set and teleport to spawn", category: "Admin", aliases: ["warps", "w"] }, ({ msg, args }) => {
    let result = warpAPI.tpToWarp(msg.sender, 'Server Spawn');
    if (!result) {
        msg.sender.sendMessage(translation.getTranslation(msg.sender, 'error', "Warp not found"))
    } else {
        msg.sender.sendMessage(translation.getTranslation(msg.sender, 'success', "Teleported to warp!"))
    }
})
commandManager.addSubcommand("spawn", "set", { description: "set spawn" }, ({ msg, args }) => {
    if (!prismarineDb.permissions.hasPermission(msg.sender, "warps.set")) return msg.sender.sendMessage(translation.getTranslation(msg.sender, "error", translation.getTranslation(msg.sender, "commands.errors.noperms", "warps.set")))

    let result = warpAPI.setWarpAtVec3(msg.sender.location, 'Server Spawn');
    msg.sender.sendMessage(translation.getTranslation(msg.sender, "success", "Successfully set warp!"))
})