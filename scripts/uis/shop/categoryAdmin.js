import icons from "../../api/icons";
import itemdb from "../../api/itemdb";
import shopAPI from "../../api/shopAPI";
import config from "../../config";
import { ActionForm, ModalForm } from "../../lib/form_func";
import { prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";
function parseItemID(id) {
    let text = id.split(':')[1];
    return text.split('_').map(_=>`${_[0].toUpperCase()}${_.substring(1)}`).join(' ');
}
uiManager.addUI(config.uiNames.Shop.CategoryAdmin, "Category Admin", (player, shopID, categoryID)=>{
    let shop = shopAPI.shops.getByID(shopID);
    let form = new ActionForm();
    form.button("§cBack\n§7Go back", `textures/blocks/barrier`, (player)=>{
        uiManager.open(player, config.uiNames.Shop.RootAdmin, shopID);
    })
    let category = shop.data.categories.find(_=>_.id == categoryID);
    form.button("§cSet Icon\n§7Set the icon", category.icon ? icons.resolve(category.icon) : icons.resolve("leaf/image-789"), (player)=>{
        uiManager.open(player, config.uiNames.IconViewer, 0, (player, iconID)=>{
            shopAPI.setCategoryIcon(shopID, categoryID, iconID);
            uiManager.open(player, config.uiNames.Shop.CategoryAdmin, shopID, categoryID);
        })
    })
    form.button("§dAdd Item\n§7Add an item", icons.resolve("leaf/image-854"), (player)=>{
        uiManager.open(player, config.uiNames.Basic.ItemSelect, (player, item, slot)=>{
            if(item) {
                uiManager.open(player, config.uiNames.Basic.NumberSelector, (player, num, currency)=>{
                    if(!isNaN(num)) {
                        shopAPI.addItem(shopID, item, categoryID, num, currency);
                        if(shop.data.type == "PLAYER_SHOP") {
                            let inv = player.getComponent('inventory');
                            inv.container.setItem(slot);
                        }
                        uiManager.open(player, config.uiNames.Shop.CategoryAdmin, shopID, categoryID);
                    } else {
                        uiManager.open(player, config.uiNames.Shop.CategoryAdmin, shopID, categoryID);
                    }
                }, "Price", true)
            } else {
                uiManager.open(player, config.uiNames.Shop.CategoryAdmin, shopID, categoryID);

            }
        })
    })
    form.button(`§cDelete category\n§7Delete the category`, `textures/blocks/barrier`, (player)=>{
        uiManager.open(player, config.uiNames.Basic.Confirmation, "Are you sure you want to delete this category?", ()=>{
            shopAPI.deleteCategory(shopID, categoryID)
            return uiManager.open(player, config.uiNames.Shop.RootAdmin, shopID);
        }, ()=>{
            return uiManager.open(player, config.uiNames.Shop.CategoryAdmin, shopID, categoryID);
        })
    })
    form.button("§eDisplay\n§7Set the display", icons.resolve("leaf/image-770"), (player)=>{
        let modal = new ModalForm();
        modal.textField("Category Name", "Category Name", category.name ? category.name : undefined);
        modal.textField("Category Subtext", "Category Subtext", category.subtext ? category.subtext : undefined);
        modal.show(player, false, (player, response)=>{
            if(response.canceled) return uiManager.open(player, config.uiNames.Shop.CategoryAdmin, shopID, categoryID);
            shopAPI.setCategoryName(shopID, categoryID, response.formValues[0]);
            shopAPI.setCategorySubtext(shopID, categoryID, response.formValues[1]);
            uiManager.open(player, config.uiNames.Shop.CategoryAdmin, shopID, categoryID);
        })
    })
    // for(const item of category.items) {
    for(let i = 0;i < category.items.length;i++) {
        let item = category.items[i];
        if(item.type == "ITEMDB_ITEM") {
            let itemStack = itemdb.getItem(item.stash, item.slot);
            let currency = prismarineDb.economy.getCurrency(item.currency) ? prismarineDb.economy.getCurrency(item.currency) : prismarineDb.economy.getCurrency("default");
            form.button(`§e${item.displayName ? item.displayName : parseItemID(itemStack.typeId)}\n§r§7${currency.symbol} ${item.price}`, item.icon ? icons.resolve(item.icon) : undefined, (player)=>{
                uiManager.open(player, config.uiNames.Shop.ItemAdmin, shopID, categoryID, i);
            })
    
        }
    }
    form.show(player, false, (player, response)=>{

    })
})