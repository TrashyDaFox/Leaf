import giftCodes from "../../api/giftCodes";
import icons from "../../api/icons";
import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.Gifts.Edit, "Edit Gift Code", (player, id)=>{
    if(!giftCodes.db.getByID(id)) return;
    let form = new ActionForm();
    form.button("§eEdit Code\n§7Edit the gift code", icons.resolve(`leaf/image-578`), (player)=>{
        uiManager.open(player, config.uiNames.Gifts.Add, id);
    })
    form.button("§cDelete\n§7Delete this gift code", icons.resolve(`leaf/iamge-557`), (player)=>{
        uiManager.open(player, config.uiNames.Basic.Confirmation, `Are you sure you want to delete this?`, ()=>{
            giftCodes.db.deleteDocumentByID(id);
            uiManager.open(player, config.uiNames.Gifts.Root)
        }, ()=>{
            uiManager.open(player, config.uiNames.Gifts.Edit, id);
        })
    })
    form.show(player, false, ()=>{})
})