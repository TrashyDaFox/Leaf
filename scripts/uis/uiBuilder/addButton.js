import icons from "../../api/icons";
import uiBuilder from "../../api/uiBuilder";
import config from "../../config";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

// uiManager.addUI(config.uiNames.UIBuilderAddButton, "Add a button", (player, id, defaultText=undefined, defaultSubtext=undefined, defaultAction=undefined, defaultIcon=undefined, error=null, index = -1)=>{
//     let form = new ModalForm();
//     form.textField("Text§c*", "Text on the button", defaultText);
//     form.textField("Subtext", "Subtext on the button", defaultSubtext);
//     form.textField("Action§c*", "Example: /say hi", defaultAction);
//     form.textField("Icon", "Example: vanilla/iron_sword", defaultIcon);
//     form.textField("Required Tag", "yes", defaultIcon);
//     form.show(player, false, (player, response)=>{
//         if(response.canceled) return;
//         if(!response.formValues[0]) return uiManager.open(player, config.uiNames.UIBuilderAddButton, id, response.formValues[0], response.formValues[1], response.formValues[2], response.formValues[3], "Text is required", index);
//         if(!response.formValues[2]) return uiManager.open(player, config.uiNames.UIBuilderAddButton, id, response.formValues[0], response.formValues[1], response.formValues[2], response.formValues[3], "Text is required", index);
//         if(index >= 0) {
//             let ui = uiBuilder.db.getByID(id);
//             ui.data.buttons[index].text = response.formValues[0];
//             ui.data.buttons[index].subtext = response.formValues[1];
//             ui.data.buttons[index].action = response.formValues[2];
//             ui.data.buttons[index].iconID = response.formValues[3];
//             ui.data.buttons[index].requiredTag = response.formValues[4];
//             uiBuilder.db.overwriteDataByID(id, ui.data)
//             uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
//             return;
//         }
//         uiBuilder.addButtonToUI(id, response.formValues[0], response.formValues[1], response.formValues[2], response.formValues[3], response.formValues[4]);
//         uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
//     })
// })

uiManager.addUI(config.uiNames.UIBuilderAddButton, "Add a button", (player, id, index = -1, data2, initial = true)=>{
    let form = new ActionForm();
    let ui = uiBuilder.db.getByID(id);
    let data = data2 ? data2 : {};
    if(initial && index > -1) {
        data.text = ui.data.buttons[index].text;
        data.subtext = ui.data.buttons[index].subtext;
        data.action = ui.data.buttons[index].action;
        data.iconID = ui.data.buttons[index].iconID;
        data.requiredTag = ui.data.buttons[index].requiredTag;
    }
    form.button("§cBack\n§7Go back", null, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
    })
    form.button("§aSet Icon\n§7Set the icon", data.iconID ? icons.resolve(data.iconID) : null, (player)=>{
        uiManager.open(player, config.uiNames.IconViewer, 0, (player, iconID)=>{
            if(iconID != null) data.iconID = iconID;
            return uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
        })
    });
    form.button(`§dSet display ${!data.text ? " §c*" : ""}\n§7Set the display of the button`, null, (player)=>{
        let modalForm = new ModalForm();
        modalForm.textField("Text§c*", "Text on the button", data.text ? data.text : undefined);
        modalForm.textField("Subtext", "Subtext on the button", data.subtext ? data.subtext : undefined);
        modalForm.textField("Required Tag", "Tag required to use button", data.requiredTag ? data.requiredTag : undefined);
        modalForm.show(player, false, (player, response)=>{
            if(response.canceled) return uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
            data.text = response.formValues[0];
            data.subtext = response.formValues[1];
            data.requiredTag = response.formValues[2];
            uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
        })
    })
    form.button(`§6Set action ${!data.action ? " §c*" : ""}\n§7Set the action of the button`, null, (player)=>{
        let modalForm = new ModalForm();
        modalForm.textField("Action§c*", "Command when button clicked", data.action ? data.action : undefined);
        modalForm.show(player, false, (player, response)=>{
            if(response.canceled) return uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
            data.action = response.formValues[0];
            uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
        })
    })
    if(data.text && data.action) {
        form.button(`§a${index > -1 ? "Edit" : "Create"} button\n§7Click me to ${index > -1 ? "edit" : "create"}`, null, (player)=>{
            if(index > -1) {
                let ui = uiBuilder.db.getByID(id);
                ui.data.buttons[index].text = data.text;
                ui.data.buttons[index].subtext = data.subtext;
                ui.data.buttons[index].requiredTag = data.requiredTag;
                ui.data.buttons[index].iconID = data.iconID;
                ui.data.buttons[index].action = data.action;
                uiBuilder.db.overwriteDataByID(id, ui.data);
                uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
            } else {
                uiBuilder.addButtonToUI(id, data.text, data.subtext, data.action, data.iconID, data.requiredTag);
                uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
            }
        });
    }
    form.show(player, false, (player, response)=>{})
    // form.textField("Text§c*", "Text on the button", defaultText);
    // form.textField("Subtext", "Subtext on the button", defaultSubtext);
    // form.textField("Action§c*", "Example: /say hi", defaultAction);
    // form.textField("Icon", "Example: vanilla/iron_sword", defaultIcon);
    // form.textField("Required Tag", "yes", defaultIcon);
    // form.show(player, false, (player, response)=>{
    //     if(response.canceled) return;
    //     if(!response.formValues[0]) return uiManager.open(player, config.uiNames.UIBuilderAddButton, id, response.formValues[0], response.formValues[1], response.formValues[2], response.formValues[3], "Text is required", index);
    //     if(!response.formValues[2]) return uiManager.open(player, config.uiNames.UIBuilderAddButton, id, response.formValues[0], response.formValues[1], response.formValues[2], response.formValues[3], "Text is required", index);
    //     if(index >= 0) {
    //         let ui = uiBuilder.db.getByID(id);
    //         ui.data.buttons[index].text = response.formValues[0];
    //         ui.data.buttons[index].subtext = response.formValues[1];
    //         ui.data.buttons[index].action = response.formValues[2];
    //         ui.data.buttons[index].iconID = response.formValues[3];
    //         ui.data.buttons[index].requiredTag = response.formValues[4];
    //         uiBuilder.db.overwriteDataByID(id, ui.data)
    //         uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
    //         return;
    //     }
    //     uiBuilder.addButtonToUI(id, response.formValues[0], response.formValues[1], response.formValues[2], response.formValues[3], response.formValues[4]);
    //     uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
    // })
})