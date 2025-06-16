import { world } from "@minecraft/server";
import { colors, prismarineDb } from "../lib/prismarinedb";
import { SegmentedStoragePrismarine } from "../prismarineDbStorages/segmented";
import configAPI from "./config/configAPI";

configAPI.registerProperty("CreatedAdminRank", configAPI.Types.Boolean, false);
configAPI.registerProperty("UseNewRanks", configAPI.Types.Boolean, true);
configAPI.registerProperty("SingleRankMode", configAPI.Types.Boolean, false);
configAPI.registerProperty(
    "HighestPrioriyRankFirst",
    configAPI.Types.Boolean,
    true
);

class Ranks {
    constructor() {
        this.ranksDb = prismarineDb.customStorage(
            "Ranks",
            SegmentedStoragePrismarine
        );
        this.ranksDb.waitLoad().then(() => {
            this.createAdminRank();
        });
    }
    createAdminRank() {
        if (!configAPI.getProperty("CreatedAdminRank")) {
            this.createRank(
                "admin",
                "§nAdmin",
                "default",
                "default",
                "default",
                1
            );
            configAPI.setProperty("CreatedAdminRank", true);
        }
    }
    validColor(col) {
        return colors.isValidColorCode(col) || col == "default";
    }
    createRank(tag, name, nameColor, bracketColor, messageColor, priority = 1) {
        if (tag == "" || typeof tag !== "string") return;
        let doc = {
            type: "RANK",
            tag,
            name,
            nameColor,
            bracketColor,
            messageColor,
            priority,
        };
        if (!this.validColor(nameColor)) return;
        if (!this.validColor(bracketColor)) return;
        if (!this.validColor(messageColor)) return;
        // world.sendMessage(tag)
        let existingDoc = this.ranksDb.findFirst({ tag });
        if (existingDoc) {
            this.ranksDb.overwriteDataByID(existingDoc.id, doc);
        } else {
            this.ranksDb.insertDocument(doc);
        }
    }
    deleteRank(tag) {
        let doc = this.ranksDb.findFirst({ tag });
        if (doc) this.ranksDb.deleteDocumentByID(doc.id);
    }
    editRank(tag, newData) {
        let doc = this.ranksDb.findFirst({ tag });
        if (doc) {
            doc.data = {
                ...doc.data,
                ...newData,
            };
            this.ranksDb.overwriteDataByID(doc.id, doc.data);
        }
    }
    getRank(tag) {
        let doc = this.ranksDb.findFirst({ tag });
        return doc ? doc.data : null;
    }
    getRanks() {
        let ranks = this.ranksDb
            .findDocuments({ type: "RANK" })
            .map((_) => _.data)
            .sort((a, b) => {
                return b.priority - a.priority;
            });
        return ranks;
    }
}

export default new Ranks();
