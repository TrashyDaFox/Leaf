import { system, world } from "@minecraft/server";
import { dynamicToast } from "../lib/chatNotifs";
import configAPI from "../api/config/configAPI";
configAPI.registerProperty("WorldBorder", configAPI.Types.Boolean, false);
configAPI.registerProperty("WorldBorderSize", configAPI.Types.Number, 10000);
let playerLocs = {};
function getWorldBorderSize() {
    return configAPI.getProperty("WorldBorderSize");
}
let playerCooldown = {};
let tick = 0;
let threshold = 70;
let threshold2 = 10;
let clamp = (min, val, max) => (val > max ? max : val < min ? min : val);
system.runInterval(() => {
    if (!configAPI.getProperty("WorldBorder")) return;
    tick++;
    let size = getWorldBorderSize();
    for (const player of world.getPlayers()) {
        let newLoc = {
            x: clamp(-size, player.location.x, size),
            y: player.location.y,
            z: clamp(-size, player.location.z, size),
        };
        if (newLoc.x != player.location.x || newLoc.z != player.location.z) {
            // player.teleport(newLoc)
            if (
                playerCooldown[player.id] &&
                tick >= playerCooldown[player.id]
            ) {
                player.sendMessage(
                    dynamicToast("", "§l§cError\n§r§7You cant go here")
                );
                player.playSound("random.glass");
                let tp = false;
                if (
                    player.location.x >= size + threshold2 ||
                    player.location.x < -size - threshold2 ||
                    player.location.z >= size + threshold2 ||
                    player.location.z < -size - threshold2
                ) {
                    player.applyDamage(1);
                }
                if (
                    player.location.x >= size + threshold ||
                    player.location.x < -size - threshold ||
                    player.location.z >= size + threshold ||
                    player.location.z < -size - threshold
                )
                    tp = true;
                if (tp) {
                    player.teleport(newLoc);
                } else {
                    player.applyKnockback(
                        {
                            x: -1,
                            z: -1,
                        },
                        1
                    );
                }
                playerCooldown[player.id] = tick + 15;
            } else if (!playerCooldown[player.id]) {
                playerCooldown[player.id] = tick + 15;
            }
        }
    }
}, 5);
