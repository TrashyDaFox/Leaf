import icons from "../../api/icons";
import shopAPI from "../../api/shopAPI";
import config from "../../config";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.Shop.RootAdmin, "Shop Root (Admin)", (player, id = shopAPI.getDefaultShop().id)=>{
    let shop = shopAPI.shops.getByID(id);
    let form = new ActionForm();
    form.button(`§cBack\n§7Go back`, `textures/blocks/barrier`, (player)=>{
        uiManager.open(player, config.uiNames.Shop.Root, id);
    })
    form.button(`§bAdd Category\n§7Adds a new category`, icons.resolve("leaf/image-0876"), (player)=>{
        let modalForm = new ModalForm();
        modalForm.textField("Category Name", "Example: Tools", undefined)
        modalForm.show(player, false, (player, response)=>{
            if(response.canceled) return uiManager.open(player, config.uiNames.Shop.RootAdmin, id);
            if(response.formValues[0]) shopAPI.addCategory(id, response.formValues[0])
            return uiManager.open(player, config.uiNames.Shop.RootAdmin, id)
        })
    })
    form.button(`§eSet Display\n§7Set the display of shop`, icons.resolve("leaf/image-770"), (player)=>{
        let modal = new ModalForm();
        modal.textField("Shop Title", "Shop Title", shop.data.title ? shop.data.title : "")
        modal.textField("Shop Description", "Shop Description", shop.data.description ? shop.data.description : "")
        modal.show(player, false, (player, response)=>{
            if(response.canceled) return uiManager.open(player, config.uiNames.Shop.RootAdmin, id);
            shopAPI.setShopTitle(id, response.formValues[0]);
            shopAPI.setShopDescription(id, response.formValues[1]);
            return uiManager.open(player, config.uiNames.Shop.RootAdmin, id);
        })
    })
    for(const category of shop.data.categories) {
        form.button(`${category.name}${category.subtext ? `\n§r§7${category.subtext}` : ``}`, category.icon ? icons.resolve(category.icon) : null, (player)=>{
            uiManager.open(player, config.uiNames.Shop.CategoryAdmin, id, category.id);
        });
    }
    form.show(player, false, (player, response)=>{})
})