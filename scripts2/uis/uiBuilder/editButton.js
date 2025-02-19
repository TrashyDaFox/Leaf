import uiBuilder from "../../api/uiBuilder";
import config from "../../versionData";
import { ActionForm, ModalForm } from "../../lib/form_func";
import { ModalFormData } from '@minecraft/server-ui'
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.UIBuilderEditButton, "Edit Button", (player, id, index) => {
    if(id == 1719775088275) return;
    let actionForm = new ActionForm();
    actionForm.title(`Editing button`)
    let ui = uiBuilder.db.getByID(id)
    let button = uiBuilder.db.getByID(id).data.buttons[index]
    actionForm.button("§cBack\n§7Go back", `textures/azalea_icons/2`, (player) => {
        uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
    })
    if(button.type != "header" && button.type != "label" && button.type != "divider") {
        actionForm.button(`§eEdit Properties\n§7Opens the edit menu`, `textures/azalea_icons/ClickyClick`, (player) => {
            let doc = uiBuilder.db.getByID(id);
            if (!doc) return;
            let button = doc.data.buttons[index];
            uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index);
        })

        actionForm.button(`§uEdit Actions\n§7Edit the actions`, `textures/azalea_icons/action edit`, (player)=>{
            uiManager.open(player, "edit_actions", id, index)
        })
    }
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

    if(index != 0) {
        actionForm.button(`§aMove Up\n§7Moves the button up by 1`, `textures/azalea_icons/Up`, (player) => {
            uiBuilder.moveButtonInUI(id, "up", index);
            uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
        })
    }
    if(index != ui.data.buttons.length) {
        actionForm.button(`§6Move Down\n§7Moves the button down by 1`, `textures/azalea_icons/Down`, (player) => {
            uiBuilder.moveButtonInUI(id, "down", index);
            uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
        })
    }
    if(index != 0) {
        actionForm.button(`§aMove To Top\n§7Moves the button to the top`, `textures/azalea_icons/Up`, (player) => {
            for(let i = 0; i < ui.data.buttons.length + 1;i++) {
                index = uiBuilder.moveButtonInUI(id, "up", index);
            }
            uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
        })    
    }
    if(index != ui.data.buttons.length - 1) {
        actionForm.button(`§6Move To Bottom\n§7Moves the button to the bottom`, `textures/azalea_icons/Down`, (player) => {
            for(let i = 0; i < ui.data.buttons.length + 1;i++) {
                index = uiBuilder.moveButtonInUI(id, "down", index);
            }
            uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
        })
    }
    if(button.type == "header" || button.type == "label") {
        actionForm.button(`§eEdit Text\n§7Edit the ${button.type}`, null, (player)=>{
            let modal = new ModalForm();
            modal.title("Edit Text");
            modal.textField("Text", "Sample Text", button.text ? button.text : "");
            modal.show(player, false, (player, response)=>{
                if(response.canceled) return uiManager.open(player, config.uiNames.UIBuilderEditButton, id, index)
                button.text = response.formValues[0];
                let form = uiBuilder.db.getByID(id);
                form.data.buttons[index] = button;
                uiBuilder.db.overwriteDataByID(form.id, form.data)
                return uiManager.open(player, config.uiNames.UIBuilderEditButton, id, index)
            })
        })
    }
    actionForm.button(`§cDelete\n§7Deletes the button`, `textures/azalea_icons/Delete`, (player) => {
        let doc = uiBuilder.db.getByID(id);
        if (!doc) return;
        doc.data.buttons.splice(index, 1);
        uiBuilder.db.overwriteDataByID(doc.id, doc.data);
        uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
    })
    if(button.type != "header" && button.type != "label" && button.type != "divider") {
        
        actionForm.button(`§dEdit Meta (Advanced)\n§7More features`, `textures/azalea_icons/ExtIcon`, (player)=>{
            let form = new ModalFormData();
            form.title("Edit Meta")
            form.textField("Meta", "Meta here...", button.meta ? button.meta : "")
            form.show(player).then((res)=>{
                if(res.canceled) return uiManager.open(player, config.uiNames.UIBuilderEditButton, id, index)
                uiBuilder.editButtonMeta(id, button.id, res.formValues[0])
                uiManager.open(player, config.uiNames.UIBuilderEditButton, id, index)
            })
        })
        actionForm.button(`§bEdit Icon Overrides\n§7Override icon`, `textures/azalea_icons/DevSettings`, (player)=>{
            uiManager.open(player, "edit_icon_overrides", id, index)
        })
    }
    actionForm.show(player, false, () => { })
})