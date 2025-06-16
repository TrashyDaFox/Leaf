import tpa from "../api/tpa";
import commandManager from "../api/commands/commandManager";
import { world } from "@minecraft/server";

commandManager.addCommand(
    "tpa",
    {
        description: "Teleport to players",
        category: "Players",
        author: "FruitKitty",
        format: "!tpa <player>",
    },
    ({ msg, args }) => {
        // let plr;
        // for (const player of world.getPlayers()) {
        //     if (player.name === args.join(" ")) {
        //         plr = player;
        //     }
        // }
        // if (!plr) return msg.sender.error("No player found");
        // tpa.request(msg.sender, plr, false);
        // msg.sender.success("Sent tpa request");
        msg.sender.error("TODO")
    }
);

// commandManager.addCommand(
//     "tpahere",
//     {
//         description: "Teleport to players",
//         category: "Players",
//         author: "FruitKitty",
//         format: "!tpa <player>",
//     },
//     ({ msg, args }) => {
//         let plr;
//         for (const player of world.getPlayers()) {
//             if (player.name === args.join(" ")) {
//                 plr = player;
//             }
//         }
//         if (!plr) return msg.sender.error("No player found");
//         tpa.request(msg.sender, plr, true);
//         msg.sender.success("Sent tpa request");
//     }
// );
