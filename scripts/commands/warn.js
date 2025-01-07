// import commented out on line 75 in main.js

import { world } from "@minecraft/server";
import commandManager from "../api/commands/commandManager";


commandManager.addCommand("warn", { description: "Warn people", author: "FruitKitty + TrashyKitty", category: "Moderation" }, ({ msg }) => {
    msg.sender.error("Use a subcommand!")
}) // see i added warn reason that you could turn into a db later and stuff like that
commandManager.addSubcommand("warn", "reason", { description: "Get warn reason" }, ({ msg }) => {
    let warndb;
    let warnreason;
    let warnedplayers;
    // get warn
});
commandManager.addSubcommand("warn", "remove", { description: "Remove warn from someone" }, ({ msg }) => {
    let warndb;
    let warnreason;
    let warnedplayers;
    // remove warn from someone
});
commandManager.addSubcommand("warn", "add", { description: "Give someone a warning" }, ({ msg, args }) => {
    let warnreason = `${args.slice(1).join(" ")}`;
    let warndb;
    let warnplayer;
    let expirydate;

    for (const player of world.getPlayers()) {
        if (player.name.toLowerCase() == args[0].toLowerCase()) warnplayer = player;
    }
    if (!warnplayer) return msg.sender.error("That isn't a player!")
    if (!args[0]) return msg.sender.error("Add a player name!") // not working for some reason
    msg.sender.runCommandAsync(`scoreboard players add ${warnplayer} warnings 1`)
});