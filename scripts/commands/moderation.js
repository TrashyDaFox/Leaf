import { world } from "@minecraft/server";
import commandManager from "../api/commands/commandManager";

commandManager.addCommand(
    "kick",
    {
        description: "Kick people",
        category: "Uncategorized",
        author: "FruitKitty + TrashyKitty",
        category: "Moderation",
        format: "!kick <player> <message>",
    },
    ({ msg, args }) => {
        // if (!msg.sender.hasTag("admin"))
        //     return msg.sender.error("You don't have admin permission!");
        let tryingtokickplayer;
        let kickreason = `${args.slice(1).join(" ")}`;

        for (const player of world.getPlayers()) {
            if (player.name.toLowerCase() == args[0].toLowerCase())
                tryingtokickplayer = player;
        }
        if (!tryingtokickplayer) return msg.sender.error("Player not found");
        if (tryingtokickplayer.hasTag("admin"))
            return msg.sender.error(`You can't kick an admin!`);
        msg.sender.runCommandAsync(
            `kick ${args[0]} §cKicked by ${msg.sender.name}! Reason: ${kickreason}`
        );
    }
);
commandManager.addSubcommand(
    "kick",
    "admin",
    {
        description: "Kick an admin (Owner only)",
        format: "!kick admin <admin> <message>",
    },
    ({ msg, args }) => {
        // if (!msg.sender.hasTag("leafdb:owner"))
        //     return msg.sender.error("You don't have owner permission!");
        let tryingtokickplayer;
        let kickreason = `${args.slice(1).join(" ")}`;

        for (const player of world.getPlayers()) {
            if (player.name.toLowerCase() == args[0].toLowerCase())
                tryingtokickplayer = player;
        }
        if (!tryingtokickplayer) return msg.sender.error("Player not found");
        if (tryingtokickplayer.hasTag("leafdb:owner"))
            return msg.sender.error(`You can't kick an Owner!`);
        msg.sender.runCommandAsync(
            `kick ${args[0]} §cKicked by ${msg.sender.name} using the Owner Permission! Reason: ${kickreason}`
        );
    }
);
