import { BlockPermutation, EquipmentSlot, system, world } from "@minecraft/server";
import { isVec3, prismarineDb } from "./lib/prismarinedb";
import * as storage from './prismarineDbStorages/segmented';
import playerStorage from './api/playerStorage';
import configAPI from "./api/config/configAPI";
let claimMap = new Map();
let claimMap2 = new Map();
export function getClaimText(player) {
    if(!configAPI.getProperty("LandClaims")) return "§cClaims Disabled";
    return claimMap2.has(player.id) ? claimMap2.get(player.id) : "§6Wilderness"
}
let claimDb = prismarineDb.customStorage("Claims", storage.SegmentedStoragePrismarine);
// import playerStorage from "./api/playerStorage";
// import { betweenXYZ } from "./lib/betweenXYZ";
// let claimDb = prismarineDb.customStorage("ClaimsDB", storage.SegmentedStoragePrismarine);
let keyval = claimDb.keyval("claimdb_keyval");
let enabled = true;
export function vec3ToChunkCoordinates(vec3) {
    if(!isVec3(vec3)) return {x:0,z:0};
    return {
        x: Math.floor(vec3.x / 16),
        z: Math.floor(vec3.z / 16)
    };
}
export function createLandClaim(player) {
    if(!configAPI.getProperty("LandClaims")) return false;
    let chunkCoordinates = vec3ToChunkCoordinates(player.location);
    if(keyval.has(`claim:${chunkCoordinates.x},${chunkCoordinates.z}:${player.dimension.id}`)) return false;
    keyval.set(`claim:${chunkCoordinates.x},${chunkCoordinates.z}:${player.dimension.id}`, {
        player: playerStorage.getID(player),
        dimension: player.dimension.id
    })
    return true;
}
export function isOwner(player, chunk, strict = false) {
    if(!configAPI.getProperty("LandClaims")) return true;
    if(player.hasTag("claim-bypass")) return true;
    let playerID =  playerStorage.getID(player);
    let claimKey = `claim:${chunk.x},${chunk.z}:${player.dimension.id}`;
    if(!keyval.has(claimKey)) return true;
    let claim = keyval.get(claimKey);
    if(claim.player == playerID) return true;
    return false;
}
export function setClaimProperty(player, chunk, key, val) {
    if(!configAPI.getProperty("LandClaims")) return null;
    let claimKey = `claim:${chunk.x},${chunk.z}:${player.dimension.id}`;
    if(!keyval.has(claimKey)) return null;
    let claim = keyval.get(claimKey);
    claim[key] = val;
    keyval.set(claimKey, claim);
}
export function getClaimProperty(player, chunk, key) {
    if(!configAPI.getProperty("LandClaims")) return null;
    let claimKey = `claim:${chunk.x},${chunk.z}:${player.dimension.id}`;
    if(!keyval.has(claimKey)) return null;
    let claim = keyval.get(claimKey);
    return claim[key];
}
// world.sendMessage(JSON.stringify(claimDb.data, null, 2))
// world.sendMessage(keyval.keys().join(', '))
function getMaxY(x, z) {
    for(let i = world.getDimension('overworld').heightRange.max;i > world.getDimension('overworld').heightRange.min;i--) {
        if(!world.getDimension('overworld').getBlock({x:x, y:i, z:z}).isAir) return i;
    }
}
function loop() {
    if(!configAPI.getProperty("LandClaims")) return;
    for(const player of world.getPlayers()) {
        // try {
        //     // world.sendMessage(player.getComponent('equippable').getEquipmentSlot(EquipmentSlot.Offhand).getItem().typeId)
        //     if(player.getComponent('equippable').getEquipmentSlot(EquipmentSlot.Offhand).getItem().typeId == "minecraft:nautilus_shell") {
        //         //minecraft:balloon_gas_particle
        //         // world.sendMessage(`hi`)
        //         let chunk = vec3ToChunkCoordinates({x:player.location.x, z: player.location.z});
        //         let coords = [
        //             {
        //                 x: 16 * chunk.x,
        //                 z: 16 * chunk.z
        //             },
        //             {
        //                 x: player.location.x,
        //                 z: player.location.z
        //             }
        //         ];
        //         for(const coord of coords) {
        //             player.spawnParticle("minecraft:blue_flame_particle", {x: coord.x, z: coord.z, y: player.location.y})
        //         }
        //         // player.spawnParticle({x: getMaxY(player.location.x, player.location.z)}
        //     }
        // } catch {}
        if(!claimMap.has(player.id)) {
            claimMap.set(player.id, {x:0,z:0});
            continue;
        }
        let previousChunkLocation = claimMap.get(player.id);
        let chunk = vec3ToChunkCoordinates(player.location);
        let actionbar = null;
        // if(keyval.has(`claim:${chunk.x},${chunk.z}`) && keyval.has(`claim:${previousChunkLocation.x},claim:${previousChunkLocation.z}`)) {
        // } else {

        // world.sendMessage(`${chunk.x},${chunk.z} ; ${previousChunkLocation.x},${previousChunkLocation.z}`)
        if(`${chunk.x},${chunk.z}` != `${previousChunkLocation.x},${previousChunkLocation.z}`) {
            if(keyval.has(`claim:${chunk.x},${chunk.z}:${player.dimension.id}`) && keyval.has(`claim:${previousChunkLocation.x},${previousChunkLocation.z}:${player.dimension.id}`)) {
                let oldKeyval = keyval.get(`claim:${previousChunkLocation.x},${previousChunkLocation.z}:${player.dimension.id}`);
                let newKeyval = keyval.get(`claim:${chunk.x},${chunk.z}:${player.dimension.id}`);
                if(oldKeyval.player != newKeyval.player) {
                    actionbar = {type:"NEW_CLAIM",player:newKeyval.player}
                }
    
            } else if(keyval.has(`claim:${chunk.x},${chunk.z}:${player.dimension.id}`) && !keyval.has(`claim:${previousChunkLocation.x},${previousChunkLocation.z}:${player.dimension.id}`)) {
                let newKeyval = keyval.get(`claim:${chunk.x},${chunk.z}:${player.dimension.id}`);
                actionbar = {type:"NEW_CLAIM",player:newKeyval.player}
            } else if(!keyval.has(`claim:${chunk.x},${chunk.z}:${player.dimension.id}`) && keyval.has(`claim:${previousChunkLocation.x},${previousChunkLocation.z}:${player.dimension.id}`)) {
                actionbar = {type:"WILDERNESS"}
            }

        } else {
            if(keyval.has(`claim:${chunk.x},${chunk.z}:${player.dimension.id}`)) {
                let newKeyval = keyval.get(`claim:${chunk.x},${chunk.z}:${player.dimension.id}`);
                actionbar = {type:"NEW_CLAIM",hide:true,player:newKeyval.player};
            } else {
                actionbar = {type:"WILDERNESS",hide:true}
            }
        }
        // }
        if(actionbar) {
            let text = actionbar.type == "NEW_CLAIM" ? `§e${playerStorage.getPlayerByID(actionbar.player) ? playerStorage.getPlayerByID(actionbar.player).name : "Unknown"}'s §2claim` : `§7Wilderness`;
            if(!actionbar.hide) player.onScreenDisplay.setActionBar(text);
            claimMap2.set(player.id, text);
            // player.sendMessage(text)
        }
        claimMap.set(player.id, vec3ToChunkCoordinates(player.location))
    }
}
world.beforeEvents.playerBreakBlock.subscribe(e=>{
    let chunk = vec3ToChunkCoordinates(e.block.location);
    if(keyval.has(`claim:${chunk.x},${chunk.z}:${e.player.dimension.id}`)) {
        if(!isOwner(e.player, chunk)) {
            e.cancel = true;
            system.run(()=>{
                e.player.onScreenDisplay.setActionBar("§cYou cant do that here")
            })
        }
    }
})
world.beforeEvents.playerPlaceBlock.subscribe(e=>{
    let chunk = vec3ToChunkCoordinates(e.block.location);
    if(keyval.has(`claim:${chunk.x},${chunk.z}:${e.player.dimension.id}`)) {
        if(!isOwner(e.player, chunk)) {
            e.cancel = true;
            system.run(()=>{
                e.player.onScreenDisplay.setActionBar("§cYou cant do that here")
            })
        }
    }
})
world.beforeEvents.playerInteractWithBlock.subscribe(e=>{
    let chunk = vec3ToChunkCoordinates(e.block.location);
    if(keyval.has(`claim:${chunk.x},${chunk.z}:${e.player.dimension.id}`)) {
        if(!isOwner(e.player, chunk)) {
            e.cancel = true;
            system.run(()=>{
                e.player.onScreenDisplay.setActionBar("§cYou cant do that here")
            })
        }
    }
})
world.beforeEvents.playerInteractWithEntity.subscribe(e=>{
    let chunk = vec3ToChunkCoordinates(e.target.location);
    if(keyval.has(`claim:${chunk.x},${chunk.z}:${e.target.dimension.id}`)) {
        if(!isOwner(e.player, chunk)) {
            e.cancel = true;
            system.run(()=>{
                e.player.onScreenDisplay.setActionBar("§cYou cant do that here")
            })
    
        }
    }
})
world.beforeEvents.explosion.subscribe(e=>{
    let blocks = e.getImpactedBlocks();
    e.setImpactedBlocks(blocks.filter(_=>{
        let chunk = vec3ToChunkCoordinates(_.center())
        return !keyval.has(`claim:${chunk.x},${chunk.z}:${e.dimension.id}`);
    }))
})
system.runInterval(()=>{
    if(enabled) loop();
},1);
// export function createClaim(player, xyz1, xyz2) {
//     if(claimDb.data.find(_=>{
//         return betweenXYZ([xyz1.x,xyz1.y,xyz1.z], [xyz2.x,xyz2.y,xyz2.z], _.data.xyz1) ||
//             betweenXYZ([xyz1.x,xyz1.y,xyz1.z], [xyz2.x,xyz2.y,xyz2.z], _.data.xyz2)
//     })) return false;
//     claimDb.insertDocument({
//         xyz1: [xyz1.x, xyz1.y, xyz1.z],
//         xyz2: [xyz2.x, xyz2.y, xyz2.z],
//         owner: playerStorage.getID(player)
//     })
// }