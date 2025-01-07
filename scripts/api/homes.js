import { world } from "@minecraft/server";
import { prismarineDb } from "../lib/prismarinedb";
import playerStorage from "./playerStorage";

class Homes {
    constructor() {
        this.db = prismarineDb.table('homes')
    }
    createHome(name, player) {
        let owner = playerStorage.getID(player)
        let h = this.db.findFirst({ owner, name })
        if(h) return false;
        let h2 = this.db.insertDocument({
            owner,
            name,
            loc: player.location,
            sharedTo: []
        })
        return h2;
    }
    removeHome(name, player) {
        let owner = playerStorage.getID(player)
        let h = this.db.findFirst({ owner, name})
        if(!h) return false;
        this.db.deleteDocumentByID(h.id)
        return true;
    }
    editName(id, name, player) {
        let owner = playerStorage.getID(player)
        let h = this.db.getByID(id)
        if(!h) return false;
        h.data.name = name;
        this.db.overwriteDataByID(id, h.data)
        return true;
    }
    teleport(id, player) {
        let h = this.db.getByID(id)
        player.teleport({
            x: h.data.loc.x,
            y: h.data.loc.y,
            z: h.data.loc.z
        })
        return true;
    }
    shareHome(id, player) {
        let h = this.db.getByID(id)
        if(!h) return false
        h.data.sharedTo.push(player.name)
        this.db.overwriteDataByID(id, h.data)
        return true;
    }
    getSharedHomes(player) {
        let hs = [];
        for (const h of this.db.findDocuments()) {
            for (const sh of h.data.sharedTo) {
                if(sh == player.name) {
                    hs.push(h)
                }
            }
        }
        return hs;
    }
    removeShare(id, name) {
        let h = this.db.getByID(id)
        if(!h) return false;
        let index = h.data.sharedTo.findIndex(sh => sh == name)
        if(index) return h.data.sharedTo.splice(index, 1);
        this.db.overwriteDataByID(id, h.data)
    }
    delete(id) {
        let h = this.db.getByID(id)
        if(!h) return false;
        this.db.deleteDocumentByID(h.id)
        return true;
    }
    getAllFromPlayer(player) {
        let owner = playerStorage.getID(player)
        return this.db.findDocuments({ owner })
    }
    get(id) {
        return this.db.getByID(id)
    }
}

export default new Homes();