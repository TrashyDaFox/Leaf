import { GameMode, system, world } from "@minecraft/server";
import configAPI from "../api/config/configAPI";
import warpAPI from "../api/warpAPI";
import { prismarineDb } from "../lib/prismarinedb";
import { SegmentedStoragePrismarine } from "../prismarineDbStorages/segmented";
import uiManager from "../uiManager";
import versionData from "../versionData";
import { ModalForm } from "../lib/form_func";
import uiBuilder from "../api/uiBuilder";

function nan0(string, def = 0) {
    let num = parseInt(string);
    if(isNaN(num)) return def;
    return num;
}
function nan1(string, def = 0) {
    let num = parseFloat(string);
    if(isNaN(num)) return def;
    return num;
}
let players = {};
let tpCache = prismarineDb.customStorage("AFKSystemTpCache", SegmentedStoragePrismarine)
uiManager.addUI(versionData.uiNames.Afk, "AFK", (player)=>{
    let modalForm = new ModalForm();
    modalForm.title("AFK System Config")
    modalForm.toggle("AFK System", configAPI.getProperty("AFKSystem"))
    modalForm.slider("AFK Timeout", 30, 1000, 15, configAPI.getProperty("AFKTimeout"), ()=>{})
    let warps = uiBuilder.db.findDocuments({type: 12}).map(_=>{
        return _.data.name;
    })
    let warps2 = ["None", ...warps]
    modalForm.dropdown("AFK Location", warps2.map(_=>{
        return {
            option: _,
            callback() {}
        }
    }), warps.findIndex(_=>{
        if(_ == "None" && configAPI.getProperty("AFKWarp") == "") return false;
        if(configAPI.getProperty("AFKWarp") == _) return true;
        return false;
    }) + 1, ()=>{}, "Will set the AFK location to this warp. Players will be teleported back when they move or rejoin");
    modalForm.toggle("AFK Location Spectator", configAPI.getProperty("AFKWarpSpectator"), ()=>{}, "If an AFK warp is set, the player will go into spectator mode while in that location.\nThey will be turned back to their previous gamemode after moving or rejoining.")
    modalForm.toggle("AFK Kick", configAPI.getProperty("AFKKick"), ()=>{}, "Kick players when going afk")
    modalForm.show(player, false, (player, response)=>{
        if(response.canceled) return uiManager.open(player, versionData.uiNames.Config.Misc)
        configAPI.setProperty("AFKSystem", response.formValues[0])
        configAPI.setProperty("AFKTimeout", response.formValues[1])
        configAPI.setProperty("AFKWarp", response.formValues[2] > 0 ? warps[response.formValues[2] - 1] : "")
        configAPI.setProperty("AFKWarpSpectator", response.formValues[3])
        configAPI.setProperty("AFKKick", response.formValues[4])
        return uiManager.open(player, versionData.uiNames.Config.Misc)
    })
})
configAPI.registerProperty("AFKSystem", configAPI.Types.Boolean, false);
configAPI.registerProperty("AFKKick", configAPI.Types.Boolean, false);
configAPI.registerProperty("AFKTimeout", configAPI.Types.Number, 90);
configAPI.registerProperty("AFKWarp", configAPI.Types.String, "");
configAPI.registerProperty("AFKWarpSpectator", configAPI.Types.Boolean, true);

function getAfkTimeout() {
    return configAPI.getProperty("AFKTimeout");
}
world.afterEvents.playerLeave.subscribe(e=>{
    if(!configAPI.getProperty("AFKSystem")) return;
    if(players[e.playerId].tpBack || players[e.playerId].removeSpectator) {
        tpCache.insertDocument({
            player: e.playerId,
            tpBack: players[e.playerId].tpBack,
            removeSpectator: players[e.playerId].removeSpectator,
            loc: players[e.playerId].preAfkLocation,
            dim: players[e.playerId].preAfkDimension,
            previousGamemode: players[e.playerId].previousGamemode
        })
    }
    delete players[e.playerId]
})
// tpCache.waitLoad().then(()=>{
//     tpCache.clear()
// })
world.afterEvents.playerSpawn.subscribe(e=>{
    if(!configAPI.getProperty("AFKSystem")) return;
    let doc = tpCache.findFirst({player: e.player.id})
    if(doc) {
        if(doc.data.tpBack) {
            e.player.teleport(doc.data.loc, {
                dimension: world.getDimension(doc.data.dim)
            })
        }
        if(doc.data.removeSpectator) {
            e.player.setGameMode(doc.data.previousGamemode)
        }
        tpCache.deleteDocumentByID(doc.id)
        if(e.player.hasTag("leaf:afk")) e.player.removeTag("leaf:afk")
    }
})
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
                loc.z != player.location.z || rot.x != rotation.x || rot.y != rotation.y
            ) {
                if (players[player.id].afkFor >= getAfkTimeout()) {
                    world.sendMessage(`§7* ${player.name} is no longer AFK`);
                    if(player.hasTag(`leaf:afk`)) player.removeTag(`leaf:afk`)
                    if(players[player.id].tpBack) {
                        player.teleport(players[player.id].preAfkLocation, {
                            dimension: world.getDimension(players[player.id].preAfkDimension),
                        })
                        players[player.id].tpBack = false;
                    }
                    if(players[player.id].removeSpectator) {
                        player.setGameMode(players[player.id].previousGamemode)
                    }
                }
                players[player.id].afkFor = 0;
            } else {
                players[player.id].afkFor++;
            }
            if (players[player.id].afkFor == getAfkTimeout()) {
                if(configAPI.getProperty("AFKKick")) {
                    delete players[player.id]
                    player.runCommand(`kick "${player.name}" Kicked for inactivity`)
                    return;
                }
                players[player.id].preAfkLocation = {
                    x: player.location.x,
                    y: player.location.y,
                    z: player.location.z,
                };
                players[player.id].preAfkDimension = player.dimension.id;
                if(configAPI.getProperty("AFKWarp") && warpAPI.getWarp(configAPI.getProperty("AFKWarp"))) {
                    warpAPI.tpToWarp(player, configAPI.getProperty("AFKWarp"), true)
                    players[player.id].tpBack = true;
                    if(configAPI.getProperty("AFKWarpSpectator")) {
                        players[player.id].removeSpectator = true;
                        players[player.id].previousGamemode = player.getGameMode()
                        player.setGameMode(GameMode.Spectator)
                    }
                }
                world.sendMessage(`§7* ${player.name} is now AFK`);
                if(!player.hasTag(`leaf:afk`)) player.addTag(`leaf:afk`)
            } else {
                if(player.hasTag("leaf:afk")) player.removeTag("leaf:afk")
            }
            if(configAPI.getProperty("AFKWarp") && warpAPI.getWarp(configAPI.getProperty("AFKWarp"))) {
                system.runTimeout(()=>{
                    players[player.id] = {
                        ...players[player.id],
                        loc: player.location,
                        rot: player.getRotation(),
                    };
                }, 10)
            } else {
                players[player.id] = {
                    ...players[player.id],
                    loc: player.location,
                    rot: player.getRotation(),
                };
            }
        }
    }
}, 20);
