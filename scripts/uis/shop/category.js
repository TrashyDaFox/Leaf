import { world } from "@minecraft/server";
import icons from "../../api/icons";
import itemdb from "../../api/itemdb";
import shopAPI from "../../api/shopAPI";
import config from "../../config";
import { ActionForm, ModalForm } from "../../lib/form_func";
import { prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";
import playerStorage from "../../api/playerStorage";
import { SegmentedStoragePrismarine } from "../../prismarineDbStorages/segmented";
function parseItemID(id) {
    let text = id.split(':')[1];
    return text.split('_').map(_=>`${_[0].toUpperCase()}${_.substring(1)}`).join(' ');
}
let shopSt = prismarineDb.customStorage("ShopStats", SegmentedStoragePrismarine);
export let shopStats = shopSt.keyval("main")
uiManager.addUI(config.uiNames.Shop.Category, "Shop Category", (player, shopID, categoryID, error = null)=>{
    let shop = shopAPI.shops.getByID(shopID);
    let form = new ActionForm();
    if(error) form.body(`§c${error}`);
    form.button("§cBack\n§7Go back", `textures/blocks/barrier`, (player)=>{
        uiManager.open(player, config.uiNames.Shop.Root, shopID);
    })
    let category = shop.data.categories.find(_=>_.id == categoryID);
    for(let i = 0;i < category.items.length;i++) {
        let item = category.items[i];
        if(item.type == "ITEMDB_ITEM") {
            let itemStack = itemdb.getItem(item.stash, item.slot);
            let currency = prismarineDb.economy.getCurrency(item.currency) ? prismarineDb.economy.getCurrency(item.currency) : prismarineDb.economy.getCurrency("default");
            form.button(`§e${item.displayName ? item.displayName : parseItemID(itemStack.typeId)}\n§r§7${currency.symbol} ${item.price}`, item.icon ? icons.resolve(item.icon) : undefined, (player)=>{
                let count = prismarineDb.economy.getMoney(player, item.currency)
                if(count >= item.price) {
                    uiManager.open(player, config.uiNames.Basic.Confirmation, `Are you sure you want to buy this item for ${item.price} §b${currency.symbol} ${currency.displayName}`, ()=>{
                        if(shop.data.type == "PLAYER_SHOP") {
                            let stats = shopStats.has(shop.id) ? shopStats.get(shop.id) : {};
                            if(stats.sales) {
                                stats.sales += 1;
                            } else {
                                stats.sales = 1;
                            }
                            if(stats.moneyMade) {
                                stats.moneyMade += item.price;
                            } else {
                                stats.moneyMade = item.price;
                            }
                            shopStats.set(shop.id, stats);
                            try {
                                let ownerID = shop.data.owner;
                                let player = world.getPlayers().find(_=>playerStorage.getID(_) == ownerID);
                                if(player) {
                                    prismarineDb.economy.addMoney(player, item.price, item.currency);
                                } else {
                                    playerStorage.addReward(shop.data.owner, item.currency, item.price)
                                }
    
                            } catch {

                            }
                            shopAPI.deleteItem(shopID, categoryID, i);
                        }

                        prismarineDb.economy.removeMoney(player, item.price, item.currency);
                        let inv = player.getComponent('inventory');
                        inv.container.addItem(itemStack.clone())
                        uiManager.open(player, config.uiNames.Shop.Category, shopID, categoryID, error);
                    }, ()=>{
                        uiManager.open(player, config.uiNames.Shop.Category, shopID, categoryID, error);
                    });
                } else {
                    uiManager.open(player, config.uiNames.Shop.Category, shopID, categoryID, "Not enough money :(");
                }
            })
    
        }
    }
    form.show(player, false, (player, response)=>{

    })
})