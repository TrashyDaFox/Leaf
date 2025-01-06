import { prismarineDb } from "../lib/prismarinedb";
import { SegmentedStoragePrismarine } from "../prismarineDbStorages/segmented";
import playerStorage from "./playerStorage";

export class PlayerShops {
    constructor() {
        this.db = prismarineDb.customStorage("PlayerShops", SegmentedStoragePrismarine);
    }
    createPlayerShop(player, title, description) {
        this.db.insertDocument({
            owner: playerStorage.getID(player),
            title,
            description,
            items: []
        })
    }
}