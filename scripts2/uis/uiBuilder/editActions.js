import uiBuilder from "../../api/uiBuilder";
import { array_move } from "../../api/utils/array_move";
import config from "../../versionData";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI("add_action", "a", (player, id, index)=>{
    let ui = uiBuilder.db.getByID(id);
    let button = ui.data.buttons[index];
    let form = new ModalForm();
    form.textField("Action", "Type action here...");
    form.show(player, false, (player, response)=>{
        if(response.canceled || !response.formValues[0]) return uiManager.open(player, "edit_actions", id, index)

        button.actions.push(response.formValues[0])

        uiBuilder.db.overwriteDataByID(ui.id, ui.data);

        return uiManager.open(player, "edit_actions", id, index)
    })
})

uiManager.addUI("edit_action", "a", (player, id, index, index2)=>{
    let ui = uiBuilder.db.getByID(id);
    let button = ui.data.buttons[index];
    let form = new ActionForm();

    form.button(`§6Back\n§7Go back`, null, (player)=>{

        uiManager.open(player, "edit_actions", id, index)
    })
    
    form.button(`§cMove Up\n§7Move this action up`, null, (player)=>{
        let newIndex = index2 - 1 < 0 ? index2 : index2 - 1;
        array_move(button.actions, index2, newIndex)
        uiBuilder.db.overwriteDataByID(ui.id, ui.data)
        uiManager.open(player, "edit_action", id, index, newIndex)
    })

    form.button(`§cMove Down\n§7Move this action down`, null, (player)=>{
        let newIndex = index2 + 1 >= button.actions.length ? index2 : index2 + 1;
        array_move(button.actions, index2, newIndex)
        uiBuilder.db.overwriteDataByID(ui.id, ui.data)
        uiManager.open(player, "edit_action", id, index, newIndex)
    })

    form.button(`§eEdit action\n§7Edit this action`, null, (player)=>{
        let modal = new ModalForm();
        modal.textField("Action", "Type action here...", button.actions[index2]);
        modal.show(player, false, (player, response)=>{
            if(response.canceled || !response.formValues[0]) return uiManager.open(player, "edit_actions", id, index)

            button.actions[index2] = response.formValues[0]
            uiBuilder.db.overwriteDataByID(ui.id, ui.data)        

            return uiManager.open(player, "edit_actions", id, index)
        })
    })

    form.button(`§cRemove action\n§7Remove this action up`, null, (player)=>{
        button.actions.splice(index2, 1);
        uiBuilder.db.overwriteDataByID(ui.id, ui.data)
        uiManager.open(player, "edit_actions", id, index)
    })
    

    form.show(player, false, ()=>{})
})

uiManager.addUI("edit_actions", "a", (player, id, index)=>{
    let form = new ActionForm();
    let ui = uiBuilder.db.getByID(id);
    let button = ui.data.buttons[index];
    form.button(`§6Back\n§7Click to go back`, null, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderEditButton, id, index)
    })
    form.button(`§aAdd Action\n§7[ Click to add action ]`, null, (player)=>{
        uiManager.open(player, "add_action", id, index)
    })
    form.button(`§d${button.conditionalActions ? "Disable" : "Enable"} Conditional Actions\n§7Conditional`, null, (player)=>{
        uiBuilder.editConditionalAction(id, button.id, button.conditionalActions ? false : true)
        uiManager.open(player, "edit_actions", id, index)
    })
    for(let index2 = 0;index2 < button.actions.length;index2++) {
        form.button(`${button.actions[index2]}`, null, (player)=>{
            uiManager.open(player, "edit_action", id, index, index2)
        })
    }

    form.show(player, false, (player, response)=>{

    })
})