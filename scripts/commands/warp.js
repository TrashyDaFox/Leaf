import { system } from "@minecraft/server";
import commandManager from "../api/commands/commandManager";
import translation from "../api/translation";
import uiBuilder from "../api/uiBuilder";
import warpAPI from "../api/warpAPI";
import { prismarineDb } from "../lib/prismarinedb";
import versionData from "../versionData";
import uiManager from "../uiManager";

commandManager.addCommand(
    "warp",
    {
        description: "Warps!",
        category: "Admin",
        aliases: ["warps", "w"],
        format: "!warp <warpname>",
    },
    ({ msg, args }) => {
        if (!args.length) {
            let text = [`§7-----> §2Warps §7<-----`];
            let warps = uiBuilder.db.findDocuments({ type: 12 });
            for (const warp of warps) {
                text.push(`§8> §a${warp.data.name}`);
            }
            msg.sender.sendMessage(text.join("\n§r"));
        } else {
            let result = warpAPI.tpToWarp(msg.sender, args.join(" "));
            if (!result) {
                msg.sender.sendMessage(
                    translation.getTranslation(
                        msg.sender,
                        "error",
                        "Warp not found"
                    )
                );
            } else {
                msg.sender.sendMessage(
                    translation.getTranslation(
                        msg.sender,
                        "success",
                        "Teleported to warp!"
                    )
                );
            }
        }
    }
);

commandManager.addSubcommand(
    "warp",
    "set",
    { description: "set a warp", format: "!warp set" },
    ({ msg, args }) => {
        // if (!prismarineDb.permissions.hasPermission(msg.sender, "warps.set"))
        //     return msg.sender.sendMessage(
        //         translation.getTranslation(
        //             msg.sender,
        //             "error",
        //             translation.getTranslation(
        //                 msg.sender,
        //                 "commands.errors.noperms",
        //                 "warps.set"
        //             )
        //         )
        //     );

        // let result = warpAPI.setWarpAtVec3(msg.sender.location, args.join(' '));
        // msg.sender.sendMessage(translation.getTranslation(msg.sender, "success", "Successfully set warp!"))
        let player = msg.sender;
        let loc = {
            ...player.location,
        };
        let ticks = 0;
        player.success("Close chat to open UI");
        
        let interval = system.runInterval(() => {
            let loc2 = {
                ...player.location,
            };
            ticks += 2;
            if (ticks >= 200) {
                player.error("Timed out");
                system.clearRun(interval);
            }
            if (loc.x != loc2.x || loc.y != loc2.y || loc.z != loc2.z) {
                uiManager.open(player, versionData.uiNames.Warps.Wizard.Root);
                system.clearRun(interval);
            }
        }, 2);
    }
);
commandManager.addSubcommand(
    "warp",
    "remove",
    { description: "remove a warp", format: "!warp remove <warpname>" },
    ({ msg, args }) => {
        // if (!prismarineDb.permissions.hasPermission(msg.sender, "warps.remove"))
        //     return msg.sender.sendMessage(translation.getTranslation(msg.sender, "error", translation.getTranslation(msg.sender, "commands.errors.noperms", "warps.remove")))

        // let result = warpAPI.deleteWarp(args.join(' '));
        // if (!result) {
        //     msg.sender.sendMessage(translation.getTranslation(msg.sender, 'error', "Warp not found"))
        // } else {
        //     msg.sender.sendMessage(translation.getTranslation(msg.sender, 'success', "Deleted warp"))
        // }
        msg.sender.error(
            `To be implemented... (use customizer to remove warps if i forgeted)`
        );
    }
);

commandManager.addCommand(
    "spawn",
    {
        description: "Set and teleport to spawn",
        category: "Admin",
        aliases: ["warps", "w"],
    },
    ({ msg, args }) => {
        let result = warpAPI.tpToWarp(msg.sender, "spawn");
        // if (!result) {
        //     msg.sender.sendMessage(translation.getTranslation(msg.sender, 'error', "Warp not found"))
        // } else {
        //     msg.sender.sendMessage(translation.getTranslation(msg.sender, 'success', "Teleported to warp!"))
        // }
    }
);
commandManager.addSubcommand(
    "spawn",
    "set",
    { description: "set spawn" },
    ({ msg, args }) => {
        msg.sender.error(
            `This is deprecated! Please set a warp named "spawn" in customizer instead.`
        );
        // if (!prismarineDb.permissions.hasPermission(msg.sender, "warps.set")) return msg.sender.sendMessage(translation.getTranslation(msg.sender, "error", translation.getTranslation(msg.sender, "commands.errors.noperms", "warps.set")))

        // let result = warpAPI.setWarpAtVec3(msg.sender.location, 'Server Spawn');
        // msg.sender.sendMessage(translation.getTranslation(msg.sender, "success", "Successfully set warp!"))
    }
);
