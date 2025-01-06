import { ItemStack } from "@minecraft/server";
import { prismarineDb } from "../lib/prismarinedb";
import { SegmentedStoragePrismarine } from "../prismarineDbStorages/segmented";
import itemdb from "./itemdb";
import playerStorage from "./playerStorage";

class ShopAPI {
    constructor() {
        this.shops = prismarineDb.customStorage("Shops", SegmentedStoragePrismarine);
        // this.shops.clear();
        if(!this.shops.findFirst({default:true})) {
            this.shops.insertDocument({
                type: "ADMIN_SHOP",
                default: true,
                categories: [
                    {
                        id: Date.now(),
                        name: "Example Category",
                        items: []
                    }
                ],
                title: "Server Shop",
                description: ""
            });
        }
    }
    createPlayerShop(title, owner) {
        return this.shops.insertDocument({
            type: "PLAYER_SHOP",
            default: false,
            owner: playerStorage.getID(owner),
            categories: [],
            title: title,
            description: ""
        })
    }
    createAdminShop(title) {
        return this.shops.insertDocument({
            type: "ADMIN_SHOP",
            default: false,
            categories: [
                {
                    id: Date.now(),
                    name: "Example Category",
                    items: []
                }
            ],
            title: title,
            description: ""
        })
    }
    getDefaultShop() {
        return this.shops.findFirst({default:true});
    }
    getShops() {
        return this.shops.findDocuments({type:"ADMIN_SHOP"})
    }
    setShopIcon(shopID, iconID) {
        let doc = this.shops.getByID(shopID);
        doc.data.icon = iconID;
        this.shops.overwriteDataByID(doc.id, doc.data)
    }
    deleteShop(shopID) {
        let doc = this.shops.getByID(shopID);
        if(!doc || doc.data.default) return;
        this.shops.deleteDocumentByID(doc.id);
    }
    deleteCategory(shopID, categoryID) {
        let doc = this.shops.getByID(shopID);
        if(!doc) return;
        let category = doc.data.categories.findIndex(_=>_.id == categoryID);
        if(category < 0) return;
        doc.data.categories.splice(category, 1);
        this.shops.overwriteDataByID(doc.id, doc.data);
    }
    addItem(shopID, itemStack, categoryID, price, currency) {
        if(!prismarineDb.economy.getCurrency(currency)) return;
        if(!(itemStack instanceof ItemStack)) return;
        let doc = this.shops.getByID(shopID);
        if(!doc) return;
        let category = doc.data.categories.findIndex(_=>_.id == categoryID);
        if(category < 0) return;
        let [stash, slot] = itemdb.saveItem(itemStack)
        doc.data.categories[category].items.push({
            type: "ITEMDB_ITEM",
            stash,
            slot,
            price,
            currency
        })
        this.shops.overwriteDataByID(doc.id, doc.data)
    }
    addCategory(shopID, name) {
        let doc = this.shops.getByID(shopID);
        if(!doc) return;
        doc.data.categories.push({
            id: Date.now(),
            name,
            items: []
        });
        this.shops.overwriteDataByID(doc.id, doc.data);
    }
    setShopTitle(shopID, title) {
        let doc = this.shops.getByID(shopID);
        if(!doc) return;
        doc.data.title = title
        this.shops.overwriteDataByID(doc.id, doc.data);
    }
    setShopDescription(shopID, description) {
        let doc = this.shops.getByID(shopID);
        if(!doc) return;
        doc.data.description = description;
        this.shops.overwriteDataByID(doc.id, doc.data);
    }

    setCategoryIcon(shopID, categoryID, iconID) {
        let doc = this.shops.getByID(shopID);
        if(!doc) return;
        let category = doc.data.categories.findIndex(_=>_.id == categoryID);
        if(category < 0) return;
        doc.data.categories[category].icon = iconID;
        this.shops.overwriteDataByID(doc.id, doc.data)
    }
    setCategoryName(shopID, categoryID, name) {
        let doc = this.shops.getByID(shopID);
        if(!doc) return;
        let category = doc.data.categories.findIndex(_=>_.id == categoryID);
        if(category < 0) return;
        doc.data.categories[category].name = name;
        this.shops.overwriteDataByID(doc.id, doc.data)
    }
    setCategorySubtext(shopID, categoryID, subtext) {
        let doc = this.shops.getByID(shopID);
        if(!doc) return;
        let category = doc.data.categories.findIndex(_=>_.id == categoryID);
        if(category < 0) return;
        doc.data.categories[category].subtext = subtext;
        this.shops.overwriteDataByID(doc.id, doc.data)
    }
    setItemDisplayName(shopID, categoryID, itemIndex, displayName) {
        let doc = this.shops.getByID(shopID);
        if(!doc) return;
        let category = doc.data.categories.findIndex(_=>_.id == categoryID);
        if(category < 0) return;
        doc.data.categories[category].items[itemIndex].displayName = displayName;
        this.shops.overwriteDataByID(doc.id, doc.data)
    }
    setItemIcon(shopID, categoryID, itemIndex, iconID) {
        let doc = this.shops.getByID(shopID);
        if(!doc) return;
        let category = doc.data.categories.findIndex(_=>_.id == categoryID);
        if(category < 0) return;
        doc.data.categories[category].items[itemIndex].icon = iconID;
        this.shops.overwriteDataByID(doc.id, doc.data)
    }
    deleteItem(shopID, categoryID, itemIndex) {
        let doc = this.shops.getByID(shopID);
        if(!doc) return;
        let category = doc.data.categories.findIndex(_=>_.id == categoryID);
        if(category < 0) return;
        doc.data.categories[category].items.splice(itemIndex, 1)
        this.shops.overwriteDataByID(doc.id, doc.data)

    }
}
export default new ShopAPI();