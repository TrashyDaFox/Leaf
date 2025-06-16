import { system, world } from "@minecraft/server";
import { prismarineDb } from "../lib/prismarinedb";
import playerStorage from "../api/playerStorage";
import { ModalForm } from "../lib/form_func";
let accessMap = new Map();
world.beforeEvents.playerInteractWithBlock.subscribe((e) => {
    try {
        if (
            e.block.typeId === "minecraft:barrel" ||
            e.block.typeId === "minecraft:chest"
        ) {
            let container = e.block.getComponent("inventory");
            let lockItem = null;
            for (let i = 0; i < container.container.size; i++) {
                let item = container.container.getItem(i);
                if (item && item.typeId === "leaf:lock") {
                    lockItem = item;
                    break;
                }
            }

            let mode = lockItem.getDynamicProperty("mode");
            if (mode == 0) {
                let owner = lockItem.getDynamicProperty("owner");
                if (e.player.id !== owner) {
                    e.cancel = true;
                    e.player.error(
                        "You dont have permission to open this chest"
                    );
                }
            } else if (mode == 1) {
                let lockID = `${lockItem.getDynamicProperty("id")}`;
                if (accessMap.has(`${e.player.id}:${lockID}`)) {
                    let expiration = accessMap.get(`${e.player.id}:${lockID}`);
                    if (Date.now() > expiration) {
                        accessMap.delete(`${e.player.id}:${lockID}`);
                    } else {
                        return;
                    }
                }
                e.cancel = true;
                system.run(() => {
                    let modalForm = new ModalForm();
                    modalForm.textField(
                        "Password",
                        "Type the password for this chest",
                        undefined
                    );
                    modalForm.title("Locked Chest");
                    modalForm.submitButton("Unlock Chest");
                    modalForm.show(e.player, false, (player, response) => {
                        let inputPassword = response.formValues[0];
                        let realPassword =
                            lockItem.getDynamicProperty("password");
                        if (inputPassword == realPassword) {
                            accessMap.set(
                                `${e.player.id}:${lockID}`,
                                Date.now() + 10000
                            );
                            e.player.info(
                                "Correct password! Chest will be unlocked for 10 seconds"
                            );
                        } else {
                            e.player.error("Incorrect password");
                        }
                    });
                });
            } else if (mode == 2) {
                system.run(() => {
                    e.player.applyKnockback(
                        e.player.getViewDirection().x,
                        e.player.getViewDirection().z,
                        1,
                        20
                    );
                });
            }
        }
    } catch {}
});
world.beforeEvents.playerBreakBlock.subscribe((e) => {
    try {
        let lockItem = null;
        let blocks = [e.block, e.block.above(), e.block.below()];
        for (const block of blocks) {
            let container = block.getComponent("inventory");
            if (container) {
                for (let i = 0; i < container.container.size; i++) {
                    let item = container.container.getItem(i);
                    if (item && item.typeId === "leaf:lock") {
                        lockItem = item;
                        break;
                    }
                }
            }
            if (lockItem) break;
        }
        if (lockItem) {
            e.player.error("You cant break locked chests.");
            e.cancel = true;
        }
    } catch {}
});
world.beforeEvents.playerPlaceBlock.subscribe((e) => {
    try {
        let lockItem = null;
        let blocks = [e.block, e.block.above(), e.block.below()];
        for (const block of blocks) {
            let container = block.getComponent("inventory");
            if (container) {
                for (let i = 0; i < container.container.size; i++) {
                    let item = container.container.getItem(i);
                    if (item && item.typeId === "leaf:lock") {
                        lockItem = item;
                        break;
                    }
                }
            }
            if (lockItem) break;
        }
        if (lockItem) {
            e.player.error(
                "You cant place blocks above or below locked chests."
            );
            e.cancel = true;
        }
    } catch {}
});
world.beforeEvents.explosion.subscribe((e) => {
    e.setImpactedBlocks(
        e.getImpactedBlocks().filter((block) => {
            let container = block.getComponent("inventory");
            if (!container) return true;
            for (let i = 0; i < container.container.size; i++) {
                let item = container.container.getItem(i);
                if (item && item.typeId === "leaf:lock") {
                    return false;
                }
            }
            return true;
        })
    );
});
// const blockDb = prismarineDb.table("BlockDB");
// function vec3ToString(vec3) {
//     return `${vec3.x},${vec3.y},${vec3.z}`;
// }
// function stringToVec3(string) {
//     return `${parseFloat(string.split(',')[0])},${parseFloat(string.split(',')[1])},${parseFloat(string.split(',')[2])}`
// }
// world.afterEvents.playerPlaceBlock.subscribe(e=>{
//     if(e.block.typeId != "minecraft:chest") return;
//     if(!e.player.hasTag("leaf:chest-lock-tip")) {
//         e.player.sendMessage("§bTIP: §fYou can interact with the chest while sneaking to lock it");
//         e.player.addTag("leaf:chest-lock-tip")
//     }
// })
// world.beforeEvents.playerInteractWithBlock.subscribe(e=>{
//     if(e.block.typeId != "minecraft:chest") return;
//     let doc = blockDb.findFirst({loc:vec3ToString(e.block.location)});
//     let isOwner = !doc || doc.data.owner == playerStorage.getID(e.player);
//     if(isOwner) {
//         if(e.player.isSneaking) {
//             e.cancel = true;
//             let newDoc = {
//                 loc: vec3ToString(e.block.location),
//                 owner: playerStorage.getID(e.player),
//                 locked: doc ? !doc.data.locked : true
//             };
//             if(doc) {
//                 blockDb.overwriteDataByID(doc.id, newDoc);
//             } else {
//                 blockDb.insertDocument(newDoc);
//             }
//             system.run(()=>{
//                 if(newDoc.locked) {
//                     e.player.sendMessage(`§aYou have locked this chest`);
//                 } else {
//                     e.player.sendMessage(`§cYou have unlocked this chest`);
//                 }
//             })
//         }
//     } else {
//         if(doc && !isOwner) {
//             e.cancel = true;
//             e.player.sendMessage("You are not the owner of this chest.");
//         }
//     }
// })
