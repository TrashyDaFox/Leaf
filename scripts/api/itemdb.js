import { system, world, EquipmentSlot, ScriptEventSource, ItemStack, BlockVolume } from "@minecraft/server";
// import { playerStorage } from "./apis/PlayerStorage";
import { prismarineDb } from "../lib/prismarinedb";
const equipmentSlots = [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet, EquipmentSlot.Offhand];

async function saveInventory(player, invName) {
    const stasherName = `invstash_${invName}`;
    const stasher = player.dimension.spawnEntity("azalea:inventory_stasher", { ...player.location, y: 0 });
    stasher.nameTag = stasherName;
    const inv = player.getComponent("inventory").container;
    const invStash = stasher.getComponent("inventory").container;
    const equipment = player.getComponent("equippable");
    for (let i = 0; i < 36; i++) {
        invStash.setItem(i, inv.getItem(i));
    }
    for (let i = 0; i < 5; i++) {
        invStash.setItem(i + 36, equipment.getEquipment(equipmentSlots[i]));
    }
    await player.runCommandAsync(`structure save "azalea:${stasherName}" ~ 0 ~ ~ 0 ~ true disk false`);
    stasher.triggerEvent("azalea:despawn");
    stasher.nameTag = "despawned";
}
async function loadInventory(player, invName) {
    const stasherName = `invstash_${invName}`;
    if ((await player.runCommandAsync(`structure load "azalea:${stasherName}" ~ 0 ~`)).successCount === 0) {
        throw `Failed to load inventory "${invName}"`;
    }
    ;
    const stasher = player.dimension.getEntities({ name: stasherName })[0];
    const inv = player.getComponent("inventory").container;
    const invStash = stasher.getComponent("inventory").container;
    const equipment = player.getComponent("equippable");
    for (let i = 0; i < 36; i++) {
        inv.setItem(i, invStash.getItem(i));
    }
    for (let i = 0; i < 5; i++) {
        equipment.setEquipment(equipmentSlots[i], invStash.getItem(i + 36));
    }
    stasher.triggerEvent("azalea:despawn");
    stasher.nameTag = "despawned";
}
async function deleteInventory(invName) {
    const stasherName = `invstash_${invName}`;
    await world.getDimension("overworld").runCommandAsync(`structure delete "azalea:${stasherName}"`);
}

class ItemDB {
    constructor() {
        this.db = prismarineDb.table("ItemDB");
        // this.db.clear();
        this.keyval = this.db.keyval("config");
    }
    getItemCount() {
        return this.keyval.get("itemCount") ? this.keyval.get("itemCount") : 0;
    }
    getStash() {
        return Math.floor(this.getItemCount() / 62);
    }
    getItem(stash, slot) {
        let id = `leaf_stash:stash_${stash}`;
        let stasherName = `leaf_stash_${stash}`
        let player = world.getPlayers()[0];
        if(player) {
            if(world.structureManager.get(id)) {
                world.structureManager.place(id, player.dimension, { x: player.location.x, y: 0, z: player.location.z });
                let entity = player.dimension.getEntities({name: stasherName})[0];
                let inv = entity.getComponent('inventory');
                let item = inv.container.getItem(slot);
                entity.triggerEvent("azalea:despawn");
                entity.nameTag = "despawned";
                return item;
            }
        }
    }
    saveItem(itemStack) {
        if(!(itemStack instanceof ItemStack)) return;
        let stash = this.getStash();
        let id = `leaf_stash:stash_${stash}`;
        let stasherName = `leaf_stash_${stash}`
        let player = world.getPlayers()[0];
        if(player) {
            if(world.structureManager.get(id)) {
                world.structureManager.place(id, player.dimension, { x: player.location.x, y: 0, z: player.location.z });
                let entity = player.dimension.getEntities({name:stasherName})[0];
                entity.nameTag = stasherName;
                let inventory = entity.getComponent('inventory');
                let slot = 0;
                for(let i = 0;i < inventory.container.size;i++) {
                    if(!inventory.container.getItem(i)) {
                        inventory.container.setItem(i, itemStack);
                        slot = i;
                        break;
                    }
                }
                if(slot == 0) {
                    inventory.container.setItem(slot, itemStack);

                }
                // let struct = world.structureManager.createFromWorld(id, player.dimension, {
                //     x: player.location.x,
                //     y: 0,
                //     z: player.location.z
                // }, {
                //     x: player.location.x,
                //     y: 0,
                //     z: player.location.z
                // }, {
                //     "includeBlocks": false,
                //     "includeEntities": true
                // });
                // struct.
                // struct.saveToWorld();
                player.runCommand(`structure save "${id}" ~ 0 ~ ~ 0 ~ true disk false`)
                entity.triggerEvent("azalea:despawn");
                // system.run(()=>{
                //     entity.kill();
                // })
                entity.nameTag = "despawned";
                this.keyval.set("itemCount", this.getItemCount() + 1);
                return [stash, slot];
                
            } else {
                let entity = player.dimension.spawnEntity(`leaf:item_stasher`, {x: player.location.x, y: 0, z: player.location.z})
                entity.nameTag = stasherName;
                let inventory = entity.getComponent('inventory');
                let slot = 0;
                for(let i = 0;i < inventory.container.size;i++) {
                    if(!inventory.container.getItem(i)) {
                        inventory.container.setItem(i, itemStack);
                        slot = i;
                        break;
                    }
                }
                // let struct = world.structureManager.createFromWorld(id, player.dimension, {
                //     x: player.location.x,
                //     y: 0,
                //     z: player.location.z
                // }, {
                //     x: player.location.x,
                //     y: 0,
                //     z: player.location.z
                // }, {
                //     "includeBlocks": false,
                //     "includeEntities": true
                // });
                // struct.saveToWorld();
                player.runCommand(`structure save "${id}" ~ 0 ~ ~ 0 ~ true disk false`)

                entity.triggerEvent("azalea:despawn");
                // system.run(()=>{
                //     entity.kill();
                // })

                entity.nameTag = "despawned";
                this.keyval.set("itemCount", this.getItemCount() + 1);
                return [stash, slot];
            }
        }
    }
}

export default new ItemDB();