import uiBuilder from "../../api/uiBuilder";
import config from "../../versionData";
import { ActionForm, ModalForm } from "../../lib/form_func";
import { ModalFormData } from '@minecraft/server-ui'
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.UIBuilderEditButton, "Edit Button", (player, id, index, buttonIndex) => {
    if(id == 1719775088275) return;
    let actionForm = new ActionForm();
    actionForm.title(`Editing button`)
    let ui = uiBuilder.db.getByID(id);
    
    // Handle buttons in groups
    let button;
    let isGroupButton = typeof buttonIndex === 'number';
    if(isGroupButton) {
        // Button is in a group
        button = ui.data.buttons[index]?.buttons[buttonIndex];
        if(!button) {
            console.warn(`Failed to find group button at group ${index}, button ${buttonIndex}`);
            return uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
        }
    } else {
        // Regular button
        button = ui.data.buttons[index];
        if(!button) {
            console.warn(`Failed to find button at index ${index}`);
            return uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
        }
    }

    actionForm.button("§cBack\n§7Go back", `textures/azalea_icons/2`, (player) => {
        uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
    });

    if(button.type != "header" && button.type != "label" && button.type != "divider") {
        actionForm.button(`§eEdit Properties\n§7Opens the edit menu`, `textures/azalea_icons/ClickyClick`, (player) => {
            let doc = uiBuilder.db.getByID(id);
            if (!doc) return;
            
            // Pass both indices for group buttons
            if(isGroupButton) {
                uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, {
                    isGroupButton: true,
                    buttonIndex: buttonIndex,
                    ...button
                });
            } else {
                uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index);
            }
        });

        actionForm.button(`§uEdit Actions\n§7Edit the actions`, `textures/azalea_icons/action edit`, (player)=>{
            uiManager.open(player, "edit_actions", id, index, buttonIndex);
        });

        actionForm.button(`§aDuplicate\n§7Create a copy`, `textures/azalea_icons/copy`, (player)=>{
            // Create deep copy of the button
            const buttonCopy = JSON.parse(JSON.stringify(button));
            
            // Insert copy after current button
            let doc = uiBuilder.db.getByID(id);
            doc.data.buttons.splice(index + 1, 0, buttonCopy);
            uiBuilder.db.overwriteDataByID(id, doc.data);
            uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
        });
    }

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
                index =uiBuilder.moveButtonInUI(id, "down", index);
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

        if(isGroupButton) {
            // Delete button from group
            let group = doc.data.buttons[index];
            if(group && group.buttons) {
                group.buttons = group.buttons.filter((_, i) => i !== buttonIndex);
                uiBuilder.db.overwriteDataByID(id, doc.data);
            }
        } else {
            // Delete regular button
            doc.data.buttons = doc.data.buttons.filter((_, i) => i !== index);
            uiBuilder.db.overwriteDataByID(id, doc.data);
        }
        
        uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
    });

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