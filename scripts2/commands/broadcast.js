import { world } from "@minecraft/server";
import commandManager from "../api/commands/commandManager";
import {CommandHandler} from "../api/commandHandler"

commandManager.addCommand("broadcast", { description: "Broadcast stuff to the world", category: "Admin", author: "FruitKitty", aliases: ["broadcast", "bc"], format: "!broadcast <message>" }, ({ msg, args }) => {
    if (!msg.sender.hasTag("admin")) return msg.sender.error("You don't have admin permission!")
    let bcMessage = `${args.slice(0).join(" ")}`
    world.sendMessage(`§b§lBROADCAST >>§r ${bcMessage}`);
})

CommandHandler.registerCommand('bc', (sender,args)=>{
    if(!msg.sender.hasTag('admin')) return sender.error('no perms too bad loololo');
    world.sendMessage(`${args.join(' ')}`)
})
// are u porting commands from azalea
// no i made it myself