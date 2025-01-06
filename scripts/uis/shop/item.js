import icons from "../../api/icons";
import shopAPI from "../../api/shopAPI";
import config from "../../config";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.Shop.ItemAdmin, "Item Admin", (player, shopID, categoryID, itemIndex)=>{
    let shop = shopAPI.shops.getByID(shopID);
    let category = shop.data.categories.find(_=>_.id == categoryID);
    if(category.items[itemIndex] && category.items[itemIndex].type == "ITEMDB_ITEM") {
        let form = new ActionForm();
        form.button("§cBack\n§7Go back", `textures/blocks/barrier`, (player)=>{
            uiManager.open(player, config.uiNames.Shop.CategoryAdmin, shopID, categoryID)
        })
        form.button(`§eSet Display\n§7Set the display`, icons.resolve("leaf/image-770"), (player)=>{
            let modal = new ModalForm();
            modal.textField("Display Name", "Display name of the item", category.items[itemIndex].displayName ? category.items[itemIndex].displayName : undefined);
            modal.show(player, false, (player, response)=>{
                if(response.canceled) return uiManager.open(player, config.uiNames.Shop.ItemAdmin, shopID, categoryID, itemIndex);
                shopAPI.setItemDisplayName(shopID, categoryID, itemIndex, response.formValues[0]);
                return uiManager.open(player, config.uiNames.Shop.ItemAdmin, shopID, categoryID, itemIndex);
            })
        })
        form.button(`§cSet Icon\n§7Set the icon`, category.items[itemIndex].icon ? icons.resolve(category.items[itemIndex].icon) : icons.resolve("leaf/image-789"), (player)=>{
            uiManager.open(player, config.uiNames.IconViewer, 0, (player, iconID)=>{
                if(iconID != null) {
                    shopAPI.setItemIcon(shopID, categoryID, itemIndex, iconID);
                }
                return uiManager.open(player, config.uiNames.Shop.ItemAdmin, shopID, categoryID, itemIndex);
            })
        })
        form.button(`§cDelete item\n§7Delete the item`, `textures/blocks/barrier`, (player)=>{
            uiManager.open(player, config.uiNames.Basic.Confirmation, "Are you sure you want to delete this item?", ()=>{
                shopAPI.deleteItem(shopID, categoryID, itemIndex);
                return uiManager.open(player, config.uiNames.Shop.CategoryAdmin, shopID, categoryID);
            }, ()=>{
                return uiManager.open(player, config.uiNames.Shop.ItemAdmin, shopID, categoryID, itemIndex);
            })
        })
        form.show(player, false, (player, response)=>{})
    }
})