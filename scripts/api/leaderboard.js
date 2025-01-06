import { system, world } from "@minecraft/server";
import { prismarineDb } from "../lib/prismarinedb";

let db = prismarineDb.table("Leaderboards");
let eventHandler = prismarineDb.getEventHandler("lb");
let themes = [
    {
        name: "Default",
        headerLines: "§8",
        headerText: "§a",
        scorePlace: "§b",
        scorePlayer: "§e",
        scoreNumber: "§7"
    }
]
eventHandler.on("create", (objective, loc, dimension = "minecraft:overworld")=>{
    if(!world.scoreboard.getObjective(objective)) return;
    db.insertDocument({
        objective,
        loc,
        dimension,
        offline: true,
        theme: 0
    });
})
// system.runInterval(()=>{
//     for(const lb of db.data) {
//         let entity;
//         if(!lb.data.entityID) {
//             entity = world.getDimension(lb.data.dimension).spawnEntity('leaf:floating_text', lb.data.loc);
//             lb.data.entityID = entity.id;
//             db.overwriteDataByID(lb.id, lb.data);
//         } else {
//             try {
//                 entity = world.getEntity(lb.data.entityID);
//             } catch {entity = null}
//             if(!entity) entity = null;
//             if(!entity) {
//                 entity = world.getDimension(lb.data.dimension).spawnEntity('leaf:floating_text', lb.data.loc);
//                 lb.data.entityID = entity.id;
//                 db.overwriteDataByID(lb.id, lb.data);
//             }
//         }
//         entity.nameTag = `${Date.now()}`
//     }
// },20);