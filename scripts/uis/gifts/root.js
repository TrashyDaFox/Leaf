import giftCodes from "../../api/giftCodes";
import icons from "../../api/icons";
import config from "../../config";
import { ActionForm } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.Gifts.Root, "Gifts Root", (player)=>{
    let form = new ActionForm();
    form.button(`§aAdd Gift Code\n§7Adds a code`, icons.resolve(`leaf/image-630`), (player)=>{
        uiManager.open(player, config.uiNames.Gifts.Add);
    })
    for(const giftCode of giftCodes.db.data) {
        form.button(`§c${giftCode.data.code}\n§7${giftCode.data.action}`, null, (player)=>{
            uiManager.open(player, config.uiNames.Gifts.Edit, giftCode.id)
        })
    }
    form.show(player, false, (player, response)=>{})
})