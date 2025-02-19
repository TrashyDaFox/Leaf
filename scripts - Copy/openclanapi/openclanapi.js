import { Player } from "@minecraft/server";
import { prismarineDb } from "../lib/prismarinedb";
import { SegmentedStoragePrismarine } from "../prismarineDbStorages/segmented";
import playerStorage from "../api/playerStorage";

class OpenClanAPI {
    constructor(prismarineDB = prismarineDb) {
        this.pdb = prismarineDB;
        this.db = this.pdb.customStorage("Clans", SegmentedStoragePrismarine);
        this.keyval = this.db.keyval("ClanMembers")
    }
    /**
     * @description Creates a clan
     * @param {Player} player 
     * @param {string} clanName 
     */
    createClan(player, clanName) {
        if(this.db.findFirst({type:"CLAN",name:clanName})) throw new Error("Clan name is already taken");
        if(clanName.length < 2) throw new Error("Clan name must be minimum 2 characters");
        if(clanName.length > 10) throw new Error("Clan name can be only be 10 characters at most");
        let playerID = playerStorage.getID(player);
        let id = this.db.insertDocument({
            owner: playerID,
            clanConfig: {},
            name: clanName,
            type: "CLAN"
        })
        this.keyval.set(playerID, id);
    }

    deleteClan(id) {
        this.db.deleteDocumentByID(id);
        for(const key of this.keyval.keys()) {
            if(this.keyval.get(key) == id) this.keyval.set(key, -1);
        }
    }

    getClan(player) {
        let playerID = playerStorage.getID(player);
        return this.keyval.has(playerID) && this.keyval.get(playerID) != -1 ? this.db.getByID(this.keyval.get(playerID)) : null;
    }
}