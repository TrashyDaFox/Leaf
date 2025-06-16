import uiBuilder from "../../api/uiBuilder";
import config from "../../versionData";
import { ActionForm, ModalForm } from "../../lib/form_func";
import { ModalFormData } from "@minecraft/server-ui";
import uiManager from "../../uiManager";
import {
    NUT_UI_DISABLE_VERTICAL_SIZE_KEY,
    NUT_UI_HEADER_BUTTON,
    NUT_UI_LEFT_HALF,
    NUT_UI_RIGHT_HALF,
    NUT_UI_TAG,
} from "../preset_browser/nutUIConsts";
import { world } from "@minecraft/server";
import { array_move } from "../../api/utils/array_move";

uiManager.addUI(
    config.uiNames.UIBuilderEditButton,
    "Edit Button",
    (player, id, index, buttonIndex) => {
        if (id == 1719775088275) return;
        let actionForm = new ActionForm();
        let ui = uiBuilder.db.getByID(id);

        // Handle buttons in groups
        let button;
        let isGroupButton = typeof buttonIndex === "number";
        if (isGroupButton) {
            // Button is in a group
            button = ui.data.buttons[index]?.buttons[buttonIndex];
            if (!button) {
                // console.warn(
                    // `Failed to find group button at group ${index}, button ${buttonIndex}`
                // );
                return uiManager.open(
                    player,
                    config.uiNames.UIBuilderEditButtons,
                    id
                );
            }
        } else {
            // Regular button
            button = ui.data.buttons[index];
            if (!button) {
                // console.warn(`Failed to find button at index ${index}`);
                return uiManager.open(
                    player,
                    config.uiNames.UIBuilderEditButtons,
                    id
                );
            }
        }
        actionForm.title(
            `${NUT_UI_TAG}§rEditing ${button.type ? button.type : "button"}`
        );
        // world.sendMessage(JSON.stringify(button))
        actionForm.button(
            `${NUT_UI_HEADER_BUTTON}§r§cBack\n§7Go back`,
            `textures/azalea_icons/2`,
            (player) => {
                uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
            }
        );
        if (button.type == "separator") {
            actionForm.button(
                `§eEdit Properties\n§7Opens the edit menu`,
                `textures/azalea_icons/other/properties_edit`,
                (player) => {
                    uiManager.open(
                        player,
                        config.uiNames.UIBuilderAddSeparator,
                        id,
                        index
                    );
                }
            );
        }

        if (
            button.type != "header" &&
            button.type != "label" &&
            button.type != "divider" &&
            button.type != "separator"
        ) {
            actionForm.button(
                `§eEdit Properties\n§7Opens the edit menu`,
                `textures/azalea_icons/other/properties_edit`,
                (player) => {
                    let doc = uiBuilder.db.getByID(id);
                    if (!doc) return;

                    // Pass both indices for group buttons
                    if (isGroupButton) {
                        uiManager.open(
                            player,
                            config.uiNames.UIBuilderAddButton,
                            id,
                            index,
                            {
                                isGroupButton: true,
                                buttonIndex: buttonIndex,
                                ...button,
                            }
                        );
                    } else {
                        uiManager.open(
                            player,
                            config.uiNames.UIBuilderAddButton,
                            id,
                            index
                        );
                    }
                }
            );

            actionForm.button(
                `§uEdit Actions\n§7Edit the actions`,
                `textures/azalea_icons/other/script_edit`,
                (player) => {
                    uiManager.open(
                        player,
                        "edit_actions",
                        id,
                        index,
                        buttonIndex
                    );
                }
            );

            actionForm.button(
                `§aDuplicate\n§7Create a copy`,
                `textures/azalea_icons/other/node_copy`,
                (player) => {
                    // Create deep copy of the button
                    const buttonCopy = JSON.parse(JSON.stringify(button));
                    buttonCopy.id = Date.now();
                    // Insert copy after current button
                    let doc = uiBuilder.db.getByID(id);
                    doc.data.buttons.splice(index + 1, 0, buttonCopy);
                    uiBuilder.db.overwriteDataByID(id, doc.data);
                    uiManager.open(
                        player,
                        config.uiNames.UIBuilderEditButtons,
                        id
                    );
                }
            );
        }

        actionForm.button(
            `${NUT_UI_RIGHT_HALF}${
                index != 0 ? `` : `§p§3§0`
            }${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}§r§aMove Up`,
            `textures/azalea_icons/other/arrow_raise`,
            (player) => {
                if (index != 0) {
                    uiBuilder.moveButtonInUI(id, "up", index);
                    uiManager.open(
                        player,
                        config.uiNames.UIBuilderEditButtons,
                        id
                    );
                }
            }
        );
        actionForm.button(
            `${NUT_UI_LEFT_HALF}${
                index != ui.data.buttons.length ? `` : `§p§3§0`
            }§r§6Move Down`,
            `textures/azalea_icons/other/arrow_lower`,
            (player) => {
                if (index != ui.data.buttons.length) {
                    uiBuilder.moveButtonInUI(id, "down", index);
                    uiManager.open(
                        player,
                        config.uiNames.UIBuilderEditButtons,
                        id
                    );
                }
            }
        );
        actionForm.button(
            `${NUT_UI_RIGHT_HALF}${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}${
                index == 0 ? "§p§3§0" : ""
            }§r§aMove To Top`,
            `textures/azalea_icons/other/arrow_up`,
            (player) => {
                if (index == 0) return;
                for (let i = 0; i < ui.data.buttons.length + 1; i++) {
                    index = uiBuilder.moveButtonInUI(id, "up", index);
                }
                uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
            }
        );
        actionForm.button(
            `${NUT_UI_LEFT_HALF}${
                index != ui.data.buttons.length - 1 ? `` : `§p§3§0`
            }§r§6Move To Bottom`,
            `textures/azalea_icons/other/arrow_down`,
            (player) => {
                if (index != ui.data.buttons.length - 1) {
                    for (let i = 0; i < ui.data.buttons.length + 1; i++) {
                        index = uiBuilder.moveButtonInUI(id, "down", index);
                    }
                    uiManager.open(
                        player,
                        config.uiNames.UIBuilderEditButtons,
                        id
                    );
                }
            }
        );
        actionForm.button(
            `§r§aMove Position`,
            `textures/azalea_icons/other/arrow_up_down`,
            (player) => {
                let modal = new ModalForm();
                modal.slider(
                    `New Position (Current: ${index + 1})`,
                    1,
                    ui.data.buttons.length,
                    1,
                    index + 1
                );
                modal.show(player, false, (player, response) => {
                    if (response.canceled) {
                        uiManager.open(
                            player,
                            config.uiNames.UIBuilderEditButton,
                            id,
                            index,
                            buttonIndex
                        );
                        return;
                    }
                    // for(let i = 0; i < ui.data.buttons.length + 1;i++) {
                    // index =uiBuilder.moveButtonInUI(id, "down", index);
                    // }
                    array_move(
                        ui.data.buttons,
                        index,
                        response.formValues[0] - 1
                    );
                    uiBuilder.db.overwriteDataByID(ui.id, ui.data);
                    uiManager.open(
                        player,
                        config.uiNames.UIBuilderEditButtons,
                        id
                    );
                });
            }
        );
        if (button.type == "header" || button.type == "label") {
            actionForm.button(
                `§eEdit Text\n§7Edit the ${button.type}`,
                null,
                (player) => {
                    let modal = new ModalForm();
                    modal.title("Edit Text");
                    modal.textField(
                        "Text",
                        "Sample Text",
                        button.text ? button.text : ""
                    );
                    modal.show(player, false, (player, response) => {
                        if (response.canceled)
                            return uiManager.open(
                                player,
                                config.uiNames.UIBuilderEditButton,
                                id,
                                index
                            );
                        button.text = response.formValues[0];
                        let form = uiBuilder.db.getByID(id);
                        form.data.buttons[index] = button;
                        uiBuilder.db.overwriteDataByID(form.id, form.data);
                        return uiManager.open(
                            player,
                            config.uiNames.UIBuilderEditButton,
                            id,
                            index
                        );
                    });
                }
            );
        }
        actionForm.button(
            `§c§h§e§1§r§cDelete\n§7Deletes the button`,
            `textures/azalea_icons/Delete`,
            (player) => {
                uiManager.open(
                    player,
                    config.uiNames.Basic.Confirmation,
                    "Are you sure you want to delete this button?",
                    () => {
                        let doc = uiBuilder.db.getByID(id);
                        if (!doc) return;

                        if (isGroupButton) {
                            // Delete button from group
                            let group = doc.data.buttons[index];
                            if (group && group.buttons) {
                                group.buttons = group.buttons.filter(
                                    (_, i) => i !== buttonIndex
                                );
                                uiBuilder.db.overwriteDataByID(id, doc.data);
                            }
                        } else {
                            // Delete regular button
                            doc.data.buttons = doc.data.buttons.filter(
                                (_, i) => i !== index
                            );
                            uiBuilder.db.overwriteDataByID(id, doc.data);
                        }

                        uiManager.open(
                            player,
                            config.uiNames.UIBuilderEditButtons,
                            id
                        );
                    },
                    () => {
                        uiManager.open(
                            player,
                            config.uiNames.UIBuilderEditButton,
                            id,
                            index,
                            buttonIndex
                        );
                    }
                );
            }
        );

        if (
            button.type != "header" &&
            button.type != "label" &&
            button.type != "divider" &&
            button.type != "separator"
        ) {
            actionForm.button(
                `§dEdit Meta (Advanced)\n§7More features`,
                `textures/azalea_icons/ExtIcon`,
                (player) => {
                    let form = new ModalForm();
                    form.title("Edit Meta");
                    form.textField(
                        "Meta",
                        "Meta here...",
                        button.meta ? button.meta : ""
                    );
                    form.show(player, false, (player, response) => {}).then(
                        (res) => {
                            if (res.canceled)
                                return uiManager.open(
                                    player,
                                    config.uiNames.UIBuilderEditButton,
                                    id,
                                    index
                                );
                            uiBuilder.editButtonMeta(
                                id,
                                button.id,
                                res.formValues[0]
                            );
                            uiManager.open(
                                player,
                                config.uiNames.UIBuilderEditButton,
                                id,
                                index
                            );
                        }
                    );
                }
            );
            actionForm.button(
                `§bEdit Icon Overrides\n§7Legacy Feature`,
                `textures/azalea_icons/DevSettings2`,
                (player) => {
                    uiManager.open(player, "edit_icon_overrides", id, index);
                }
            );
        }
        actionForm.show(player, false, () => {});
    }
);
