import icons from "../../api/icons";
import uiBuilder from "../../api/uiBuilder";
import config from "../../config";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

/**
 * UI for adding or editing a button
 * @param {Player} player - The player viewing the form
 * @param {string} id - The UI ID
 * @param {number} index - Button index (-1 for new button)
 * @param {Object} data2 - Button data
 * @param {boolean} initial - Whether this is the initial form load
 */
uiManager.addUI(config.uiNames.UIBuilderAddButton, "Add a button", (player, id, index = -1, data2, initial = true) => {
    if(id == 1719775088275) return;
    const form = new ActionForm();
    const ui = uiBuilder.db.getByID(id);
    const data = data2 || {};

    // Load existing button data if editing
    if (initial && index > -1) {
        const button = ui.data.buttons[index];
        data.text = button.text;
        data.subtext = button.subtext;
        data.action = button.actions ? button.actions[0] : button.action;
        data.iconID = button.iconID;
        data.requiredTag = button.requiredTag;
    }

    // Back button
    form.button("§cBack\n§7Go back", null, (player) => {
        uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
    });

    // Icon selector
    form.button(
        "§aSet Icon\n§7Set the icon",
        data.iconID ? icons.resolve(data.iconID) : null,
        (player) => {
            uiManager.open(player, config.uiNames.IconViewer, 0, (player, iconID) => {
                if (iconID != null) data.iconID = iconID;
                return uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
            });
        }
    );

    // Display settings
    form.button(
        `§dSet display ${!data.text ? " §c*" : ""}\n§7Set the display of the button`,
        null,
        (player) => {
            const displayForm = new ModalForm();
            displayForm.textField("Text§c*", "Text on the button", data.text);
            displayForm.textField("Subtext", "Subtext on the button", data.subtext);
            displayForm.textField("Required Tag", "Tag required to use button", data.requiredTag);

            displayForm.show(player, false, (player, response) => {
                if (response.canceled) return uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
                
                data.text = response.formValues[0];
                data.subtext = response.formValues[1];
                data.requiredTag = response.formValues[2];
                
                uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
            });
        }
    );

    // Action setting (only for new buttons)
    if (index == -1) {
        form.button(
            `§6Set action ${!data.action ? " §c*" : ""}\n§7Set the action of the button`,
            null,
            (player) => {
                const actionForm = new ModalForm();
                actionForm.textField("Action§c*", "Command when button clicked", data.action);
                
                actionForm.show(player, false, (player, response) => {
                    if (response.canceled) return uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
                    
                    data.action = response.formValues[0];
                    uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
                });
            }
        );
    }

    // Create/Edit button (only shown when required fields are filled)
    if (data.text && data.action) {
        const isEditing = index > -1;
        form.button(
            `§a${isEditing ? "Edit" : "Create"} button\n§7Click me to ${isEditing ? "edit" : "create"}`,
            null,
            (player) => {
                if (isEditing) {
                    const ui = uiBuilder.db.getByID(id);
                    ui.data.buttons[index] = {
                        text: data.text,
                        subtext: data.subtext,
                        requiredTag: data.requiredTag,
                        iconID: data.iconID,
                        actions: [data.action]
                    };
                    uiBuilder.db.overwriteDataByID(id, ui.data);
                } else {
                    uiBuilder.addButtonToUI(id, data.text, data.subtext, data.action, data.iconID, data.requiredTag);
                }
                uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
            }
        );
    }

    form.show(player, false, () => {});
});