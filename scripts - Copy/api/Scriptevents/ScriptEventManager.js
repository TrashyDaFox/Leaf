import { system } from "@minecraft/server";


class ScripteventManager {
    constructor() {
        this.scriptevents = {};

        system.afterEvents.scriptEventReceive.subscribe(e=>{
            if(this.scriptevents[e.id]) {
                this.scriptevents[e.id]({source:"command",event: e});
            }
        })
    }
    register(identifier, fn) {
        this.scriptevents[identifier] = fn;
    }
    unregister(identifier) {
        try {
            delete this.scriptevents[identifier];
        } catch {}
    }
}

export default new ScripteventManager();