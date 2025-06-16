import { world } from "@minecraft/server";
import commandManager from "../api/commands/commandManager";

commandManager.addCommand(
    "to",
    {
        description: "Teleport to someone without them knowing",
        author: "FruitKitty + TrashyKitty",
        category: "Admin",
        format: "!to <player>",
    },
    ({ msg, args }) => {
        // if (!msg.sender.hasTag("admin"))
        //     return msg.sender.error("You are not an admin!");
        let targetPlayer;
        for (const player of world.getPlayers()) {
            if (player.name.toLowerCase() == args[0].toLowerCase())
                targetPlayer = player;
        }
        if (!targetPlayer)
            return msg.sender.error("That is not an online player!");
        if (targetPlayer.name == `${msg.sender.name}`)
            return msg.sender.error("You can't teleport to yourself, silly!"); // i used lua syntax and somehow it worked
        // let targetPlayerLocation = `${targetPlayer.location.map(Math.floor).map(_=>_.toString()).join(" ")}`
        // msg.sender.runCommandAsync(`tp ${targetPlayerLocation}`)
        msg.sender.teleport(targetPlayer.location, {
            dimension: targetPlayer.dimension,
        });
        msg.sender.success(`Successfully teleported to ${targetPlayer.name}!`);
    }
);
// i fixed it for u
// im gonna go to bed
// i wont sleep for a while but i will leave my pc on overnight so u can fuck around with my shit
// i'll be online on discord

// §e${Object.values(targetPlayer.location).map(Math.floor)}
// okay
// i trust you, do NOT run any commands outside of the server idk even know how to use powershell lmao
//ok :3
// im gonna improve ur code a bit
// it works :3
