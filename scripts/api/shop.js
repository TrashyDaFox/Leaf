import { prismarineDb } from "../lib/prismarinedb";
import { SegmentedStoragePrismarine } from "../prismarineDbStorages/segmented";
import playerStorage from "./playerStorage";

class ShopAPI {
    constructor() {
        this.db = prismarineDb.customStorage("Shop", SegmentedStoragePrismarine);
        if(!this.db.findFirst({
            type: "ADMIN_SHOP"
        })) {
            this.db.insertDocument({
                type: "ADMIN_SHOP",
                title: "Shop",
                body: "Welcome to tbe shop!",
                data: [
                    {
                        name: "Uncategorized",
                        items: []
                    }
                ]
            })
        }
    }
    createPlayerShop(title, body, player) {
        let id = playerStorage.getID(player);
        return this.db.insertDocument({
            type: "PLAYER_SHOP",
            owner: id,
            title,
            body,
            data: [
                {
                    name: "Uncategorized",
                    items: []
                }
            ]
        });
    }
    createAdminShop(title, body, player) {
        let id = playerStorage.getID(player);
        return this.db.insertDocument({
            type: "ADMIN_SHOP",
            owner: id,
            title,
            body,
            data: [
                {
                    name: "Uncategorized",
                    items: []
                }
            ]
        });
    }
    createAdminSellShop(title, body, player) {
        let id = playerStorage.getID(player);
        return this.db.insertDocument({
            type: "SELL_SHOP",
            owner: id,
            title,
            body,
            data: [
                {
                    name: "Uncategorized",
                    items: []
                }
            ]
        });
    }
}