import uiBuilder from "../../api/uiBuilder";
import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import { ModalFormData } from '@minecraft/server-ui'
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.UIBuilderEditButton, "Edit Button", (player, id, index) => {
    if(id == 1719775088275) return;
    let actionForm = new ActionForm();
    let button = uiBuilder.db.getByID(id).data.buttons[index]
    actionForm.button(`§eEdit`, `textures/azalea_icons/ClickyClick`, (player) => {
        let doc = uiBuilder.db.getByID(id);
        if (!doc) return;
        let button = doc.data.buttons[index];
        uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index);
    })
    actionForm.button("§cBack\n§7Go back", null, (player) => {
        uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
    })
    actionForm.button(`§eEdit Actions`, null, (player)=>{
        uiManager.open(player, "edit_actions", id, index)
    })
    // actionForm.button("§aAdd Action\n§7Add an action", 'textures/azalea_icons/1.png', (player) => {
    //     let form2 = new ModalFormData();
    //     form2.title('Add Action')
    //     form2.textField('Action', 'Action here..', null)
    //     form2.show(player).then((res) => {
    //         let action = res.formValues[0]

    //         uiBuilder.addActiontoButton(index, id, action)
    //         uiManager.open(player, config.uiNames.UIBuilderEditButton, id, index);
    //     })
    // })
    // u need actions to be usable in add button
    // oh ok
    // just make sure action edits the actions list when editing the button idk how to do that 
    // i'll add it later but i can just remove it from the edit button ui and u have to edit it in here, ok
    // is it bad that i reuse add button for editing the button, no its harder tbh 
    // what still needs to be done in the update ????
    // what im doing is making them only add one on add button then later they can add more
    // did u know that this was one of the first uis in leaf, first thing i added was the ui builder yes because it said 'added in v0.1' somewhere // what still needs to be done in the update ????
    // actionForm.button(`§cDelete Action`, `textures/azalea_icons/Delete`, (player) => {
    //     let form = new ActionForm();
    //     form.title('Delete action')
    //     form.button('§cBack', 'textures/azalea_icons/2.png', (player) => {
    //         uiManager.open(player, config.uiNames.UIBuilderEditButton, id, index);
    //     })
    //     for (const action of button.actions) {
    //         form.button(`§a${action}\n§7[Click to remove]`, `textures/azalea_icons/Delete`, (player) => {
    //             uiBuilder.removeActionFromButton(index, id, button.actions.findIndex(ac => ac == action)) // brb
    //             uiManager.open(player, config.uiNames.UIBuilderEditButton, id, index);
    //         })
    //     }
    //     form.show(player)
    // })

    //player, id, defaultText=undefined, defaultSubtext=undefined, defaultAction=undefined, defaultIcon=undefined, error=null
    actionForm.button(`§cDelete`, `textures/azalea_icons/Delete`, (player) => {
        let doc = uiBuilder.db.getByID(id);
        if (!doc) return;
        doc.data.buttons.splice(index, 1);
        uiBuilder.db.overwriteDataByID(doc.id, doc.data);
        uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
    })
    actionForm.button(`§aMove Up`, `textures/azalea_icons/Up`, (player) => {
        uiBuilder.moveButtonInUI(id, "up", index);
        uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
    })
    actionForm.button(`§cMove Down`, `textures/azalea_icons/Down`, (player) => {
        uiBuilder.moveButtonInUI(id, "down", index);
        uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
    })
    actionForm.button(`§eEdit Meta (Advanced)`, null, (player)=>{
        let form = new ModalFormData();
        form.title("Edit Meta")
        form.textField("Meta", "Meta here...", button.meta ? button.meta : "")
        form.show(player).then((res)=>{
            if(res.canceled) return uiManager.open(player, config.uiNames.UIBuilderEditButton, id, index)
            uiBuilder.editButtonMeta(id, button.id, res.formValues[0])
            uiManager.open(player, config.uiNames.UIBuilderEditButton, id, index)
        })
    })
    actionForm.show(player, false, () => { })
})