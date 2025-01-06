import { world } from "@minecraft/server";
import { prismarineDb } from "./lib/prismarinedb";


class BlockDB {
    constructor() {
        this.maindb = prismarineDb.table("BlockDB");
        // this.maindb.clear();
        this.db = this.maindb.keyval("BlockDB_V2");
        world.afterEvents.playerBreakBlock.subscribe(e=>{
            if(this.hasBlockData(e.block.location)) this.deleteBlockData(e.block.location);
        })
        world.afterEvents.blockExplode.subscribe(e=>{
            if(this.hasBlockData(e.block.location)) this.deleteBlockData(e.block.location);
        })
    }
    stringToVec3(str) {
        return {
            x: parseFloat(str.split(';')[0]),
            y: parseFloat(str.split(';')[1]),
            z: parseFloat(str.split(';')[2]),
        }
    }
    vec3ToString(vec3) {
        return `${vec3.x};${vec3.y};${vec3.z}`;
    }
    hasBlockData(vec3) {
        return this.db.has(this.vec3ToString(vec3));
    }
    deleteBlockData(vec3) {
        return this.db.delete(this.vec3ToString(vec3));
    }
    setBlockData(vec3, data) {
        this.db.set(this.vec3ToString(vec3), data);
    }
    getBlockData(vec3) {
        let val = this.db.get(this.vec3ToString(vec3));
        if(!val) {
            return {};
        }
        return val;
    }
}

export default new BlockDB();