import { world } from "@minecraft/server";
import { prismarineDb } from "../lib/prismarinedb";
import actionParser from "./actionParser";

class KillEvents {
    constructor() {
        this.db = prismarineDb.table("KillEvents");
        this.#initialize();
    }
    #initialize() {
        world.afterEvents.entityDie.subscribe(e=>{
            if(!e.damageSource || !e.damageSource.damagingEntity) return;
            let entity = e.damageSource.damagingEntity;
            if(e.deadEntity.typeId != "minecraft:player" || entity.typeId != "minecraft:player") return;
            let docs = this.db.findDocuments({type:"KILL_EVENT"});
            for(const doc of docs) {
                actionParser.runAction(entity, doc.data.action)
            }
            let docs2 = this.db.findDocuments({type:"DEATH_EVENT"});
            for(const doc of docs2) {
                actionParser.runAction(e.deadEntity, doc.data.action)
            }
        })
    }
    addKillEvent(name, action) {
        this.db.insertDocument({
            name,
            action,
            type: "KILL_EVENT"
        })
    }
    addDeathEvent(name, action) {
        this.db.insertDocument({
            name,
            action,
            type: "DEATH_EVENT"
        })
    }
}

export default new KillEvents();