import uiBuilder from "../../api/uiBuilder";
import { array_move } from "../../api/utils/array_move";
import config from "../../versionData";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI("add_action", "a", (player, id, index, buttonIndex)=>{
    let ui = uiBuilder.db.getByID(id);
    let button = typeof buttonIndex === 'number' 
        ? ui.data.buttons[index].buttons[buttonIndex]
        : ui.data.buttons[index];

    let form = new ModalForm();
    form.textField("Action", "Type action here...");
    form.show(player, false, (player, response)=>{
        if(response.canceled || !response.formValues[0]) return uiManager.open(player, "edit_actions", id, index, buttonIndex);

        button.actions.push(response.formValues[0]);
        uiBuilder.db.overwriteDataByID(ui.id, ui.data);

        return uiManager.open(player, "edit_actions", id, index, buttonIndex);
    });
})

uiManager.addUI("edit_action", "a", (player, id, index, buttonIndex, actionIndex)=>{
    let ui = uiBuilder.db.getByID(id);
    let button = typeof buttonIndex === 'number'
        ? ui.data.buttons[index].buttons[buttonIndex]
        : ui.data.buttons[index];

    let form = new ActionForm();

    form.button(`§6Back\n§7Go back`, null, (player)=>{
        uiManager.open(player, "edit_actions", id, index, buttonIndex);
    });
    
    form.button(`§cMove Up\n§7Move this action up`, null, (player)=>{
        let newIndex = actionIndex - 1 < 0 ? actionIndex : actionIndex - 1;
        array_move(button.actions, actionIndex, newIndex);
        uiBuilder.db.overwriteDataByID(ui.id, ui.data);
        uiManager.open(player, "edit_action", id, index, buttonIndex, newIndex);
    });

    form.button(`§cMove Down\n§7Move this action down`, null, (player)=>{
        let newIndex = actionIndex + 1 >= button.actions.length ? actionIndex : actionIndex + 1;
        array_move(button.actions, actionIndex, newIndex);
        uiBuilder.db.overwriteDataByID(ui.id, ui.data);
        uiManager.open(player, "edit_action", id, index, buttonIndex, newIndex);
    });

    form.button(`§eEdit action\n§7Edit this action`, null, (player)=>{
        let modal = new ModalForm();
        modal.textField("Action", "Type action here...", button.actions[actionIndex]);
        modal.show(player, false, (player, response)=>{
            if(response.canceled || !response.formValues[0]) return uiManager.open(player, "edit_actions", id, index, buttonIndex);

            button.actions[actionIndex] = response.formValues[0];
            uiBuilder.db.overwriteDataByID(ui.id, ui.data);        

            return uiManager.open(player, "edit_actions", id, index, buttonIndex);
        });
    });

    form.button(`§cRemove action\n§7Remove this action up`, null, (player)=>{
        button.actions.splice(actionIndex, 1);
        uiBuilder.db.overwriteDataByID(ui.id, ui.data);
        uiManager.open(player, "edit_actions", id, index, buttonIndex);
    });

    form.show(player, false, ()=>{});
})

uiManager.addUI("edit_actions", "a", (player, id, index, buttonIndex)=>{
    let form = new ActionForm();
    let ui = uiBuilder.db.getByID(id);
    
    // Handle both regular and group buttons
    let button;
    if (typeof buttonIndex === 'number') {
        // Group button
        button = ui.data.buttons[index].buttons[buttonIndex];
    } else {
        // Regular button
        button = ui.data.buttons[index];
    }

    form.button(`§6Back\n§7Click to go back`, null, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
    });

    form.button(`§aAdd Action\n§7[ Click to add action ]`, null, (player)=>{
        uiManager.open(player, "add_action", id, index, buttonIndex);
    });

    form.button(`§d${button.conditionalActions ? "Disable" : "Enable"} Conditional Actions\n§7Conditional`, null, (player)=>{
        if (typeof buttonIndex === 'number') {
            button.conditionalActions = !button.conditionalActions;
        } else {
            uiBuilder.editConditionalAction(id, button.id, !button.conditionalActions);
        }
        uiManager.open(player, "edit_actions", id, index, buttonIndex);
    });

    for(let actionIndex = 0; actionIndex < button.actions.length; actionIndex++) {
        form.button(`${button.actions[actionIndex]}`, null, (player)=>{
            uiManager.open(player, "edit_action", id, index, buttonIndex, actionIndex);
        });
    }

    form.show(player, false, ()=>{});
})