import { world } from "@minecraft/server";

world.afterEvents.entityDie.subscribe(e=>{
    if(!e.damageSource || !e.damageSource.damagingEntity) return;
    let entity = e.damageSource.damagingEntity;
})