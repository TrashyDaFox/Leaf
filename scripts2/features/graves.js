import { world } from "@minecraft/server";

world.afterEvents.entityDie.subscribe(e=>{
    if(e.deadEntity.typeId == "minecraft:player") {
        e.deadEntity.setDynamicProperty("deathLoc", e.deadEntity.location)
    }
})