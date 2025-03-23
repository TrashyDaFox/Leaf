import { GameMode, Player, system, world } from "@minecraft/server";
import { worldTags } from "../worldTags";
import configAPI from "../api/config/configAPI";
import { prismarineDb } from "../lib/prismarinedb";
configAPI.registerProperty("CLog", configAPI.Types.Boolean, true);
configAPI.registerProperty("CLogSecCooldown", configAPI.Types.Number, 10);
configAPI.registerProperty("CLogEnterMessageEnabled", configAPI.Types.Boolean, true);
configAPI.registerProperty("CLogEnterMessage", configAPI.Types.String, "You have entered combat!");
configAPI.registerProperty("CLogExitMessageEnabled", configAPI.Types.Boolean, true);
configAPI.registerProperty("CLogExitMessage", configAPI.Types.String, "You have left combat!");
configAPI.registerProperty("CLogDisableUIs", configAPI.Types.Boolean, true);
configAPI.registerProperty("CLogDisableCommands", configAPI.Types.Boolean, true);
configAPI.registerProperty("CLogKill", configAPI.Types.Boolean, true);

export let combatMap = new Map();

system.runInterval(()=>{
    if(!configAPI.getProperty("CLog")) return;
    for(const key of combatMap.keys()) {
        let exp = combatMap.get(key)
        if(Date.now() >= exp) {
            let player = world.getPlayers().find(_=>_.id == key);
            combatMap.delete(key);
            if(player) {
                if(configAPI.getProperty("CLogExitMessageEnabled"))
                    player.sendMessage(configAPI.getProperty("CLogExitMessage"))
            }
        }
    }
},1)

world.beforeEvents.playerLeave.subscribe(e=>{
    if(!configAPI.getProperty("CLog")) return;
    if(!combatMap.has(e.player.id)) return;
    if(!world.gameRules.keepInventory) {
        let items = [];
        let loc = e.player.location
        let inventory = e.player.getComponent("inventory")
        for(let i = 0;i < inventory.container.size;i++) {
            let item = inventory.container.getItem(i);
            if(item) items.push(item)
        }
        let dim = e.player.dimension
        system.run(()=>{
            for(const item of items) {
                try {
                    dim.spawnItem(item, loc);

                } catch(e) {
                    console.warn(`${e}`)                    
                }
            }
        })
    }
})

world.afterEvents.playerSpawn.subscribe(e=>{
    if(!e.initialSpawn) return;
    if(!configAPI.getProperty("CLog")) return;
    if(worldTags.hasTag(`clear-inv:${e.player.id}`)) {
        let inventory = e.player.getComponent('inventory');
        for(let i = 0;i < inventory.container.size;i++) {
            let item = inventory.container.getItem(i);
            if(!item) continue;
            inventory.container.setItem(i)
        }
        worldTags.removeTag(`clear-inv:${e.player.id}`)
    }
    if(worldTags.hasTag(`kill:${e.player.id}`)) {
        e.player.kill()
        worldTags.removeTag(`kill:${e.player.id}`)
    }
})

world.afterEvents.playerLeave.subscribe(e=>{
    if(!configAPI.getProperty("CLog")) return;
    if(!combatMap.has(e.playerId)) return;
    if(!world.gameRules.keepInventory) {
        worldTags.addTag(`clear-inv:${e.playerId}`)
    }
    worldTags.addTag(`kill:${e.playerId}`)
})

system.runInterval(()=>{
    for(const player of world.getPlayers()) {
        if(ignore(player) && combatMap.has(player.id)) combatMap.delete(player.id)
    }
},10)

function ignore(player) {
    return player.getGameMode() == GameMode.creative || prismarineDb.permissions.hasPermission(player, "clog.bypass")
}

world.afterEvents.entityHitEntity.subscribe(e=>{
    if(!configAPI.getProperty("CLog")) return;
    let { hitEntity, damagingEntity } = e;
    if(hitEntity.typeId != "minecraft:player" || damagingEntity.typeId != "minecraft:player") return;
    if(ignore(hitEntity) || ignore(damagingEntity)) return;
    let exp = Date.now() + (configAPI.getProperty("CLogSecCooldown") * 1000)
    if(!combatMap.has(hitEntity.id)) {
        if(configAPI.getProperty("CLogEnterMessageEnabled")) hitEntity.sendMessage(configAPI.getProperty("CLogEnterMessage"))
    }
    if(!combatMap.has(damagingEntity.id)) {
        if(configAPI.getProperty("CLogEnterMessageEnabled")) damagingEntity.sendMessage(configAPI.getProperty("CLogEnterMessage"))
    }
    combatMap.set(hitEntity.id, exp)
    combatMap.set(damagingEntity.id, exp)

})