/*
1

"im hungry" says the children in my basement, all in unison

i have no idea what that means but i feed them frozen milk

little do i know they are lactose intolerant

in life, shit happens. that includes in the basement.

moral of the story: dont buy milk
*/
import { prismarineDb } from "../lib/prismarinedb";
import { SegmentedStoragePrismarine } from "../prismarineDbStorages/segmented";
import playerStorage from "./playerStorage";

class Bank {
    constructor() {
        this.db = prismarineDb.customStorage(
            "Bank",
            SegmentedStoragePrismarine
        );
    }

    getPlayerBankData(player) {
        let playerId = playerStorage.getID(player);
        let doc = this.db.findFirst({ player: playerId });
        if (doc) {
            return doc;
        } else {
            let data = {
                player: playerId,
                currencies: [],
            };
            let id = this.db.insertDocument(data);
            return { id, data };
        }
    }

    setPlayerBankData(player, data = {}) {
        this.getPlayerBankData(player);
        let playerId = playerStorage.getID(player);
        let doc = this.db.findFirst({ player: playerId });
        this.db.overwriteDataByID(doc.id, data);
    }

    deposit(player, currency = "default") {
        if (!prismarineDb.economy.getCurrency(currency)) return;
        let curnc = prismarineDb.economy.getCurrency(currency); // curnc reference?! no way!
    }
}
