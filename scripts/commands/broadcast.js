import { world } from "@minecraft/server";
import commandManager from "../api/commands/commandManager";

commandManager.addCommand("broadcast", { description: "Broadcast stuff to the world", category: "Admin", author: "FruitKitty", aliases: ["broadcast", "bc"], format: "!broadcast <message>" }, ({ msg, args }) => {
    if (!msg.sender.hasTag("admin")) return msg.sender.error("You don't have admin permission!")
    let bcMessage = `${args.slice(0).join(" ")}`
    world.sendMessage(`§b§lBROADCAST >>§r ${bcMessage}`);
})
// are u porting commands from azalea
// no i made it myself