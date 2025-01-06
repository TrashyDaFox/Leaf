import uiBuilder from "../../api/uiBuilder";
import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import { ModalFormData } from '@minecraft/server-ui'
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.UIBuilderEditButton, "Edit Button", (player, id, index)=>{
    let actionForm = new ActionForm();
    actionForm.button(`§eEdit`, `textures/azalea_icons/ClickyClick`, (player)=>{
        let doc = uiBuilder.db.getByID(id);
        if(!doc) return;
        let button = doc.data.buttons[index];
        uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index);
    })
    actionForm.button("§cBack\n§7Go back", null, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
    })
    actionForm.button("§cAdd Action\n§7Add an action", 'textures/azalea_icons/1.png', (player)=>{
        let form2 = new ActionForm();
        form2.title('Add Action')
        form2.
    })

//player, id, defaultText=undefined, defaultSubtext=undefined, defaultAction=undefined, defaultIcon=undefined, error=null
    actionForm.button(`§cDelete`, `textures/azalea_icons/Delete`, (player)=>{
        let doc = uiBuilder.db.getByID(id);
        if(!doc) return;
        doc.data.buttons.splice(index, 1);
        uiBuilder.db.overwriteDataByID(doc.id, doc.data);
        uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
    })
    actionForm.button(`§aMove Up`, `textures/azalea_icons/Up`, (player)=>{
        uiBuilder.moveButtonInUI(id, "up", index);
        uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
    })
    actionForm.button(`§cMove Down`, `textures/azalea_icons/Down`, (player)=>{
        uiBuilder.moveButtonInUI(id, "down", index);
        uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
    })
    actionForm.show(player, false, ()=>{})
})