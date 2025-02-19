import { world, GameMode } from "@minecraft/server";
import commandManager from "../api/commands/commandManager";
import { prismarineDb } from "../lib/prismarinedb";

commandManager.addCommand("gm", { description: "Gamemode Switcher", category: "Gamemodes", author: "FruitKitty + TrashyKitty", format: "!gm <gamemode>" }, ({ msg, args }) => {
    msg.sender.sendMessage(`
    gm s - survival
    gm c - creative
    gm sp - spectator
    gm a - adventure
        `)

})
commandManager.addSubcommand("gm", "s", { description: "become survival" }, ({ msg }) => {
    if (!prismarineDb.permissions.hasPermission(msg.sender, "gamemodes.survival")) return msg.sender.error("Unkown Command, check if you have perms to use it.")
    msg.sender.setGameMode(GameMode.survival);
    return msg.sender.info(`§bGamemode changed to §aSurvival`);
});
commandManager.addSubcommand("gm", "c", { description: "become creative" }, ({ msg }) => {
    if (!prismarineDb.permissions.hasPermission(msg.sender, "gamemodes.creative")) return msg.sender.error("Unkown Command, check if you have perms to use it.")
    msg.sender.setGameMode(GameMode.creative);
    return msg.sender.info(`§bGamemode changed to §aCreative`);
});
commandManager.addSubcommand("gm", "sp", { description: "become spectator" }, ({ msg }) => {
    if (!prismarineDb.permissions.hasPermission(msg.sender, "gamemodes.spectator")) return msg.sender.error("Unkown Command, check if you have perms to use it.")
    msg.sender.setGameMode(GameMode.spectator);
    return msg.sender.info(`§bGamemode changed to §aSpectator`);
});
commandManager.addSubcommand("gm", "a", { description: "become adventure" }, ({ msg }) => {
    if (!prismarineDb.permissions.hasPermission(msg.sender, "gamemodes.adventure")) return msg.sender.error("Unkown Command, check if you have perms to use it.") 
    msg.sender.setGameMode(GameMode.adventure);
    return msg.sender.info(`§bGamemode changed to §aAdventure`);
});