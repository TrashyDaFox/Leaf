import giftCodes from "../../api/giftCodes";
import config from "../../config";
import { ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.Gifts.Add, "Add Gift", (player, id = null)=>{
    let gift = {};
    if(id) {
        gift = giftCodes.db.getByID(id).data;
    }
    let form = new ModalForm();
    form.textField("Code", "Type the code", gift.code ? gift.code : undefined);
    form.textField("Action", "Command run when using this", gift.action ? gift.action : undefined);
    form.toggle("Use once?", gift.useOnce ? gift.useOnce : false);
    form.show(player, false, (player, response)=>{
        if(!response.formValues[0]) return uiManager.open(player, config.uiNames.Gifts.Root);
        if(!response.formValues[1]) return uiManager.open(player, config.uiNames.Gifts.Root);
        gift.code = response.formValues[0];
        gift.action = response.formValues[1];
        gift.useOnce = response.formValues[2];
        if(id) {
            giftCodes.db.overwriteDataByID(id, gift);
        } else {
            giftCodes.createCode(gift.code, gift.action, gift.useOnce)
        }
        return uiManager.open(player, config.uiNames.Gifts.Root);
    })
})