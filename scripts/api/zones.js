import { EntityInitializationCause, world } from "@minecraft/server";
import { prismarineDb } from "../lib/prismarinedb";
import { SegmentedStoragePrismarine } from "../prismarineDbStorages/segmented";
import landclaims from "./landclaims/landclaims";
import playerStorage from "./playerStorage";

function isPointInCube(px, py, pz, x1, y1, z1, x2, y2, z2) {
    // Ensure the coordinates are ordered correctly (min and max)
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    const minZ = Math.min(z1, z2);
    const maxZ = Math.max(z1, z2);
    
    // Check if the point is within the cube bounds
    return px >= minX && px <= maxX &&
           py >= minY && py <= maxY &&
           pz >= minZ && pz <= maxZ;
}

class Zones {
    constructor() {
        this.zonesDB = prismarineDb.customStorage("Zones", SegmentedStoragePrismarine);
        this.flags = [
            "DisallowBlockPlacing",
            "DisallowBlockBreaking",
            "DisallowAllBlockInteractions",
            "DisallowLeverInteractions",
            "DisallowTrapdoorInteractions",
            "DisableDoorInteractions",
            "DisableChestInteractions",
            "DisablePVP",
            "DisallowLogStripping",
            "DisallowLandClaiming",
            "DisallowGenPlacing",
            "DisallowMobSpawning"
        ]
        this.initEvents();
        this.msg = "You cant do this here"
    }
    initEvents() {
        world.beforeEvents.playerPlaceBlock.subscribe(e=>{
            let zone = this.getZoneAtVec3(e.block.location);
            if(this.hasPerms(e.player, zone)) return;
            if(zone && zone.data.flags.includes("DisallowBlockPlacing")) {
                e.cancel = true;
                e.player.error(this.msg)
            }
        })
        world.beforeEvents.playerBreakBlock.subscribe(e=>{
            let zone = this.getZoneAtVec3(e.block.location);
            if(this.hasPerms(e.player, zone)) return;
            if(zone && zone.data.flags.includes("DisallowBlockBreaking")) {
                e.cancel = true;
                e.player.error(this.msg)
            }
        })
        world.beforeEvents.playerInteractWithBlock.subscribe(e=>{
            let zone = this.getZoneAtVec3(e.block.location);
            if(this.hasPerms(e.player, zone)) return;
            if(zone) {
                if(zone.data.flags.includes("DisallowAllBlockInteractions")) {
                    e.cancel = true;
                    if(e.isFirstEvent) e.player.error(this.msg)
                    return;
    
                }
                if(zone.data.flags.includes("DisableDoorInteractions") && (e.block.typeId.includes(':door_') || e.block.typeId.includes('_door'))) {
                    e.cancel = true;
                    if(e.isFirstEvent) e.player.error(this.msg)
                    return;
    
                }
                if(zone.data.flags.includes("DisallowTrapdoorInteractions") && (e.block.typeId.includes(':trapdoor_') || e.block.typeId.includes('_trapdoor') || e.block.typeId == "minecraft:trapdoor")) {
                    e.cancel = true;
                    if(e.isFirstEvent) e.player.error(this.msg)

                    return;
    
                }
                if(zone.data.flags.includes("DisableChestInteractions") && ['minecraft:chest', 'minecraft:barrel'].includes(e.block.typeId)) {
                    e.cancel = true;
                    if(e.isFirstEvent) e.player.error(this.msg)

                    return;
    
                }
                if(zone.data.flags.includes("DisallowLogStripping") && e.block.typeId.includes('log') && e.itemStack && e.itemStack.typeId.includes('axe')) {
                    e.cancel = true;
                    if(e.isFirstEvent) e.player.error(this.msg)

                    return;
    
                }
                if(zone.data.flags.includes("DisallowLeverInteractions") && e.block.typeId == "minecraft:lever") {
                    e.cancel = true;
                    if(e.isFirstEvent) e.player.error(this.msg)
                    return;
    
                }

            }
            
        })
        world.afterEvents.entitySpawn.subscribe(e=>{
            if(e.entity.typeId == "minecraft:player" || e.entity.typeId.startsWith('leaf:')) return;
            let zone = this.getZoneAtVec3(e.entity.location)
            if(zone && zone.data.flags.includes("DisallowMobSpawning")) {
                e.entity.remove();
            }
        })
    }
    hasPerms(player, zone) {
        if(zone && zone.data.type == "CLAIM") {
            // return false;
            let id = ""
            try {
                id = playerStorage.getID(player)
            } catch {}
            return playerStorage.getID(player) == zone.data.owner || (id && zone.data.allowedPlayers && zone.data.allowedPlayers.includes(id)) || player.hasTag("admin");
        }
        return player.hasTag("admin");
    }
    getZoneAtVec3(vec3) {
        let zones = [...this.getZones(), ...landclaims.db.findDocuments({type: "CLAIM"})].sort((a,b)=>b.data.priority - a.data.priority)
        let px = Math.floor(vec3.x);
        let py = Math.floor(vec3.y);
        let pz = Math.floor(vec3.z);
        for(const zone of zones) {
            if(zone.data.type == "ZONE") {
                let {x1, y1, z1, x2, y2, z2} = zone.data;
                if(isPointInCube(px, py, pz, x1, y1, z1, x2, y2, z2)) {
                    return zone;
                }
            } else if(zone.data.type == "CLAIM") {
                let x1 = zone.data.pos1.x;
                let x2 = zone.data.pos2.x;
                let y1 = zone.data.pos1.y;
                let y2 = zone.data.pos2.y;
                let z1 = zone.data.pos1.z;
                let z2 = zone.data.pos2.z;
                if(isPointInCube(px, py, pz, x1, y1, z1, x2, y2, z2)) {
                    return zone;
                }
            }
        }
    }
    getZones() {
        return this.zonesDB.findDocuments({type: "ZONE"})
    }
    addZone(name, x1, y1, z1, x2, y2, z2, priority = 1, flags = []) {
        if(this.zonesDB.findFirst({name})) return;
        this.zonesDB.insertDocument({
            name,
            type: "ZONE",
            x1,
            y1,
            z1,
            x2,
            y2,
            z2,
            priority,
            flags
        })
    }
    editFlags(name, flags = []) {
        let doc = this.zonesDB.findFirst({name})
        if(!doc) return;
        doc.data.flags = flags;
        this.zonesDB.overwriteDataByID(doc.id, doc.data);
    }
    getZones() {
        return this.zonesDB.findDocuments({type:"ZONE"})
    }
}

export default new Zones();