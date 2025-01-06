import { world } from '@minecraft/server';
import {prismarineDb} from '../lib/prismarinedb';
import actionParser from './actionParser';
class Events {
    constructor() {
        this.eventsDb = prismarineDb.table("Events");
        world.afterEvents.entityDie.subscribe(e=>{
            if(e.deadEntity.typeId !== 'minecraft:player') return;
            let killEvents = this.eventsDb.findDocuments({type:"KILL"})
            for(const event of killEvents) {
                if(e.damageSource.damagingEntity && event.data.command && e.damageSource.damagingEntity.typeId === "minecraft:player") {
                    actionParser.runAction(e.deadEntity, event.data.command);
                    if(event.data.commandSelf) {
                        actionParser.runAction(e.damageSource.damagingEntity, event.data.commandSelf);
                    }
                }
            }
            let deathEvents = this.eventsDb.findDocuments({type:"DEATH"})
            for(const event of deathEvents) {
                if(event.data.command) {
                    actionParser.runAction(e.deadEntity, event.data.command);
                }
            }
        })
    }
    addKillEvent(comment, command, commandSelf) {
        this.eventsDb.insertDocument({
            type: "KILL",
            command,
            commandSelf,
            comment
        })
    }
    addDeathEvent(comment, command) {
        this.eventsDb.insertDocument({
            type: "DEATH",
            command,
            comment
        })
    }
}

export default new Events();