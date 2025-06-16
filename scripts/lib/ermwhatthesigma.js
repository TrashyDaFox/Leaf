import { world, system, Player, ItemStack } from "@minecraft/server";
import commandManager from "../api/commands/commandManager";
//   import { MinecraftItemTypes } from "../node_modules/@minecraft/vanilla-data/";

commandManager.addCommand(
    "grab",
    { description: "Grab a players inventory" },
    ({ msg, args }) => {
        let message = msg.message;
        let sender = msg.sender;
        const args = message.split(" ");
        const targetName = args[1];
        if (!targetName) {
            sender.error("No player name provided.");
            return;
        }

        const targetPlayer = [...world.getPlayers()].find(
            (p) => p.name.toLowerCase() === targetName.toLowerCase()
        );
        if (!targetPlayer) {
            sender.error(`Could not find player "${targetName}".`);
            return;
        }

        const senderInv = sender.getComponent("inventory")?.container;
        const targetInv = targetPlayer.getComponent("inventory")?.container;

        if (!senderInv || !targetInv) {
            sender.error("Inventory access failed.");
            return;
        }

        // Clear sender's inventory
        for (let i = 0; i < senderInv.size; i++) {
            senderInv.setItem(i, undefined);
        }

        // Copy target's inventory to sender
        for (let i = 0; i < targetInv.size; i++) {
            const item = targetInv.getItem(i);
            if (item) {
                senderInv.setItem(i, item.clone());
            }
        }

        sender.success("§a§lSuccess!");
    }
);
