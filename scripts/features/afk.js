import { system, world } from "@minecraft/server";
import configAPI from "../api/config/configAPI";

let players = {};

function getAfkTimeout() {
    return 60;
}

configAPI.registerProperty("AFKSystem", configAPI.Types.Boolean, true);

system.runInterval(() => {
    if (!configAPI.getProperty("AFKSystem")) return;
    for (const player of world.getPlayers()) {
        if (!players[player.id]) {
            players[player.id] = {
                loc: player.location,
                rot: player.getRotation(),
                afkFor: 0,
            };
        } else {
            let { loc, rot } = players[player.id];
            let rotation = player.getRotation();
            if (
                loc.x != player.location.x ||
                loc.y != player.location.y ||
                loc.z != player.location.z
            ) {
                if (players[player.id].afkFor >= getAfkTimeout()) {
                    world.sendMessage(`§7* ${player.name} is no longer AFK`);
                }
                players[player.id].afkFor = 0;
            } else {
                players[player.id].afkFor++;
            }
            if (players[player.id].afkFor == getAfkTimeout()) {
                players[player.id].preAfkLocation = {
                    x: player.location.x,
                    y: player.location.y,
                    z: player.location.z,
                };
                world.sendMessage(`§7* ${player.name} is now AFK`);
            }
            players[player.id] = {
                ...players[player.id],
                loc: player.location,
                rot: player.getRotation(),
            };
        }
    }
}, 20);
