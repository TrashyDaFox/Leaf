import { world } from "@minecraft/server";
import commandManager from "../api/commands/commandManager";

commandManager.addCommand("msg", { description: "Message people", category: "Players", author: "FruitKitty", format: "!msg <player> <msg>" }, ({ msg, args }) => {
    let targetPlayer;
    let message = `${args.slice(1).join(" ")}`

    for (const player of world.getPlayers()) {
        if (player.name.toLowerCase() == args[0].toLowerCase()) targetPlayer = player;
    }
    if (targetPlayer.name == (`${msg.sender.name}`)) return msg.sender.error("You can't send messages to yourself, silly!")
    targetPlayer.sendMessage(`§b§l${msg.sender.name} - You >>§r§7 ${message}`)
    msg.sender.success(`Sent message to ${targetPlayer.name}`)
})