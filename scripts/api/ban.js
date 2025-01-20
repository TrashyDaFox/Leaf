import { prismarineDb } from "../lib/prismarinedb";
import { SegmentedStoragePrismarine } from "../prismarineDbStorages/segmented";

class BanSystem {
    constructor() {
        this.db = prismarineDb.customStorage("bans", SegmentedStoragePrismarine)
    }

    addBan(player, reason, duration) {
        let doc = this.db.findFirst({player:player.id})
        if(doc) {
            doc.data.reason = reason;
            doc.data.duration = duration;
            doc.data.time = new Date().getTime();
            this.db.overwriteDataByID(doc.id, doc.data);
        } else {
            this.db.insertDocument({
                player: player.id,
                reason: reason,
                duration: duration,
                time: new Date().getTime()
            })
        }
    }
}