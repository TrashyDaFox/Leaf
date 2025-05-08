/*
6

Tridecember 50, 2089

It has been a few years now. Earth had the 2.0 update and many new months were added.

Trashy has given us some pineapple on pizza to celebrate, and we watched tv static for a few hours.

Shes a really nice person, and she has a nice basement.

She also gave us a brand new miku plushie
*/

import { system, world, EquipmentSlot, ScriptEventSource, ItemStack, BlockVolume } from "@minecraft/server";
// import { playerStorage } from "./apis/PlayerStorage";
import { prismarineDb } from "../lib/prismarinedb";
const equipmentSlots = [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet, EquipmentSlot.Offhand];

export async function saveInventory(player, invName) {
    const stasherName = `invstash_${invName}`;
    const stasher = player.dimension.spawnEntity("leaf:inventory_stasher", { ...player.location, y: 0 });
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
    player.runCommand(`structure save "azalea:${stasherName}" ~ 0 ~ ~ 0 ~ true disk false`);
    stasher.triggerEvent("azalea:despawn");
    stasher.nameTag = "despawned";
}
export async function loadInventory(player, invName) {
    const stasherName = `invstash_${invName}`;
    if ((player.runCommand(`structure load "azalea:${stasherName}" ~ 0 ~`)).successCount === 0) {
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
export async function deleteInventory(invName) {
    const stasherName = `invstash_${invName}`;
    await world.getDimension("overworld").runCommand(`structure delete "azalea:${stasherName}"`);
}


class ItemDB {
    constructor() {
        this.db = prismarineDb.table("ItemDB");
        this.initializeKeyval();
    }

    async initializeKeyval() {
        this.keyval = await this.db.keyval("config");
    }

    getItemCount() {
        return this.keyval.get("itemCount") ? this.keyval.get("itemCount") : 0;
    }

    getStash() {
        return Math.floor(this.getItemCount() / 62);
    }

    saveItem(itemStack) {
        if (!(itemStack instanceof ItemStack)) return;
        
        const stash = this.getStash();
        const stasherName = `leaf_stash_${stash}`;
        const id = `leaf_stash:stash_${stash}`;
        const player = world.getPlayers()[0];
        
        if (!player) return;

        // Spawn the stasher entity
        let stasher = player.dimension.getEntities({ name: stasherName })[0];
        
        if (!stasher) {
            stasher = player.dimension.spawnEntity("leaf:item_stasher", { x: player.location.x, y: 0, z: player.location.z });
            stasher.nameTag = stasherName;
        }

        const inv = stasher.getComponent('inventory').container;

        // Find an empty slot or overwrite the first slot if needed
        let slot = 0;
        for (let i = 0; i < inv.size; i++) {
            if (!inv.getItem(i)) {
                inv.setItem(i, itemStack);
                slot = i;
                break;
            }
        }
        if (slot === 0) {
            inv.setItem(slot, itemStack);
        }

        // Save the structure
        player.runCommand(`structure save "${id}" ~ 0 ~ ~ 0 ~ true disk false`);

        // Mark the stasher as despawned
        stasher.triggerEvent("azalea:despawn");
        stasher.nameTag = "despawned";

        this.keyval.set("itemCount", this.getItemCount() + 1);
        return [stash, slot];
    }

    getItem(stash, slot) {
        const id = `leaf_stash:stash_${stash}`;
        const stasherName = `leaf_stash_${stash}`;
        const player = world.getPlayers()[0];

        if (!player) return;

        // Load the structure
        if ((player.runCommand(`structure load "${id}" ~ 0 ~`)).successCount === 0) {
            throw `Failed to load stash "${stash}"`;
        }

        const stasher = player.dimension.getEntities({ name: stasherName })[0];
        const inv = stasher.getComponent('inventory').container;

        const item = inv.getItem(slot);

        // Mark the stasher as despawned
        stasher.triggerEvent("azalea:despawn");
        stasher.nameTag = "despawned";

        return item;
    }

    deleteItem(stash) {
        const id = `leaf_stash:stash_${stash}`;
        world.getDimension("overworld").runCommand(`structure delete "${id}"`);
    }
}


export default new ItemDB();