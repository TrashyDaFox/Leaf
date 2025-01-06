import configAPI from "../../api/config/configAPI";
import emojis from "../../api/emojis";
import config from "../../config";
import { ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.RoleEditor.EditPerms, "Edit Perms", (player)=>{
    let modalForm = new ModalForm();
    modalForm.title("Edit perms");
    modalForm.toggle("example")
    modalForm.toggle("example")
    modalForm.toggle(`§aexample ${emojis.potion48}`)
    modalForm.toggle("example")
    modalForm.toggle("example")
    modalForm.toggle(`§aexample ${emojis.potion48}`)
    modalForm.toggle(`§aexample ${emojis.potion48}`)
    modalForm.toggle(`example`)
    modalForm.toggle(`§bexample ${emojis.potion49}`)
    modalForm.show(player, false, (player, response)=>{
        if(response.canceled) return uiManager.open(player, config.uiNames.RoleEditor.Edit);
        
        return uiManager.open(player, config.uiNames.RoleEditor.Edit);
    })
})