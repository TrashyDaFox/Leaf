import { ScriptEventSource } from "@minecraft/server";
import ScriptEventManager from "./ScriptEventManager";

ScriptEventManager.register("leaf:switch_sidebar", ({event})=>{
    if(event.sourceType != ScriptEventSource.Entity) return;
    for(const tag of event.sourceEntity.getTags()) {
        if(!tag.startsWith('sidebar:')) continue;
        event.sourceEntity.removeTag(tag);
    }
    if(event.message != "default") event.sourceEntity.addTag(`sidebar:${event.message}`)
})