import { prismarineDb } from "../lib/prismarinedb";

class WarpAPI {
    constructor() {
        this.db = prismarineDb.table("Warps");
    }
    setWarpAtVec3(vec3, name) {
        let doc = this.db.findFirst({name});
        if(doc) {
            doc.data.loc = vec3;
            doc.data.name = name;
            this.db.overwriteDataByID(doc.id, doc.data);
        } else {
            this.db.insertDocument({
                loc: vec3,
                name
            })
        }
        return true;
    }
    deleteWarp(name) {
        let doc = this.db.findFirst({name});
        if(doc) {
            this.db.deleteDocumentByID(doc.id);
            return true;
        } else {
            return false;
        }
    }
    getWarp(name) {
        return this.db.findFirst({name});
    }
    getWarps() {
        return this.db.data;
    }
    tpToWarp(player, name) {
        let warp = this.getWarp(name);
        if(!warp) return false;
        player.teleport({
            x: warp.data.loc.x,
            y: warp.data.loc.y,
            z: warp.data.loc.z
        });
        return true;
    }
    deleteWarp(name) {
        let warp = this.getWarp(name);
        if(!warp) return true;
        this.db.deleteDocumentByID(warp.id)
    }
}

export default new WarpAPI();