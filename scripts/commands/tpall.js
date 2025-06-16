import { world } from "@minecraft/server";
import commandManager from "../api/commands/commandManager";

commandManager.addCommand(
    "tpall",
    {
        description: "Teleport everyone to you",
        category: "Admin",
        author: "FruitKitty",
    },
    ({ msg, args }) => {
        // if (!msg.sender.hasTag("admin"))
        //     return msg.sender.error(
        //         "You don't have permission to run this command!"
        //     );
        world.sendMessage(`§b§l${msg.sender.name} summoned everyone!`);
        msg.sender.runCommandAsync("tp @a @s");
    }
);
