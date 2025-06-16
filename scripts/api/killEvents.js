/*
7

Triduoseptember 3.14, 2089

We met a new person named FruitKitty, she is another trans girl. Shes feeding us milkified bricks.

Very delicious, i must say.

We even got let outside for the first time in years.

What the fuck is this nasty green carpet? And this bright ass light?

Never again.

We will continue to be basement dwellers, we got lesbian flags in the basement now tho.

I think Trashy might be lesbian...
*/

import { world } from "@minecraft/server";
import { prismarineDb } from "../lib/prismarinedb";
import actionParser from "./actionParser";

class KillEvents {
    constructor() {
        this.db = prismarineDb.table("KillEvents");
        this.#initialize();
    }
    #initialize() {
        world.afterEvents.entityDie.subscribe((e) => {
            if (!e.damageSource || !e.damageSource.damagingEntity) return;
            let entity = e.damageSource.damagingEntity;
            if (
                e.deadEntity.typeId != "minecraft:player" ||
                entity.typeId != "minecraft:player"
            )
                return;
            let docs = this.db.findDocuments({ type: "KILL_EVENT" });
            for (const doc of docs) {
                actionParser.runAction(entity, doc.data.action);
            }
            let docs2 = this.db.findDocuments({ type: "DEATH_EVENT" });
            for (const doc of docs2) {
                actionParser.runAction(e.deadEntity, doc.data.action);
            }
        });
    }
    addKillEvent(name, action) {
        this.db.insertDocument({
            name,
            action,
            type: "KILL_EVENT",
        });
    }
    addDeathEvent(name, action) {
        this.db.insertDocument({
            name,
            action,
            type: "DEATH_EVENT",
        });
    }
}

export default new KillEvents();
