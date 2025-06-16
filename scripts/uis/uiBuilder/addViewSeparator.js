import uiBuilder from "../../api/uiBuilder";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import { NUT_UI_TAG, NUT_UI_THEMED } from "../preset_browser/nutUIConsts";
import { themes } from "./cherryThemes";

uiManager.addUI(
    versionData.uiNames.UIBuilderAddSeparator,
    "Add Separator",
    (player, id, index = -1, data = {}) => {
        let ui = uiBuilder.db.getByID(id);
        if (!data.type) data.type = "separator";
        if (!data.clearViewIDs) data.clearViewIDs = [];
        if (!data.id) data.id = Date.now();
        if (index >= 0) {
            data = ui.data.buttons[index];
        }
        let form = new ActionForm();
        let themID = ui.data.theme ? ui.data.theme : 0;
        let themString =
            themID > 0
                ? `${NUT_UI_THEMED}${themes[themID] ? themes[themID][0] : ""}`
                : ``;

        form.title(
            `${NUT_UI_TAG}${themString}§r${
                index >= 0 ? "Edit" : "Add"
            } Separator`
        );
        form.button(
            `§eSet Properties§c*\n§7Sets the label & condition`,
            null,
            (player) => {
                let modal = new ModalForm();
                modal.title("Label");
                modal.textField(
                    "Label Text",
                    data.label ? data.label : "(None)",
                    data.label ? data.label : ""
                );
                modal.textField(
                    "Condition",
                    data.condition ? data.condition : "(None)",
                    data.condition ? data.condition : ""
                );
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.UIBuilderAddSeparator,
                            id,
                            index,
                            data
                        );
                    data.label = response.formValues[0];
                    data.condition = response.formValues[1];
                    return uiManager.open(
                        player,
                        versionData.uiNames.UIBuilderAddSeparator,
                        id,
                        index,
                        data
                    );
                });
            }
        );
        let clearModes = ["NONE", "ALL", "VIEW", "NOTDEFAULT"];
        let clearMode = data.clearMode ? data.clearMode : 0;
        form.button(
            `§dClear Mode\n§7Current: ${clearModes[clearMode]}`,
            null,
            (player) => {
                data.clearMode = (clearMode + 1) % 4;
                return uiManager.open(
                    player,
                    versionData.uiNames.UIBuilderAddSeparator,
                    id,
                    index,
                    data
                );
            }
        );
        if (clearMode == 2) {
            form.button(
                `§bSet Clear Views\n§7Set views to clear`,
                null,
                (player) => {
                    let views = [];
                    for (const button of ui.data.buttons) {
                        if (!views.length && button.type != "separator") {
                            views.push({ name: "Default View", id: -1 });
                        }
                        if (button.type == "separator") {
                            views.push({ name: button.label, id: button.id });
                        }
                    }
                    if (!views.length) {
                        views.push({ name: "Default View", id: -1 });
                    }
                    let modal = new ModalForm();
                    for (const view of views) {
                        modal.toggle(
                            `${view.name}`,
                            data.clearViewIDs.includes(view.id)
                        );
                    }
                    modal.show(player, false, (player, response) => {
                        if (response.canceled)
                            return uiManager.open(
                                player,
                                versionData.uiNames.UIBuilderAddSeparator,
                                id,
                                index,
                                data
                            );
                        data.clearViewIDs = [];
                        for (let i = 0; i < response.formValues.length; i++) {
                            if (response.formValues[i])
                                data.clearViewIDs.push(views[i].id);
                        }
                        return uiManager.open(
                            player,
                            versionData.uiNames.UIBuilderAddSeparator,
                            id,
                            index,
                            data
                        );
                    });
                }
            );
        }
        if (data.label && data.condition) {
            form.button(
                `§b${index >= 0 ? "Save" : "Create"}\n§7${
                    index >= 0 ? "Save the separator" : "Create the separator"
                }`,
                `textures/azalea_icons/${index >= 0 ? "Save" : "1"}`,
                (player) => {
                    if (index >= 0) {
                        ui.data.buttons[index] = data;
                        uiBuilder.db.overwriteDataByID(ui.id, ui.data);
                    } else {
                        ui.data.buttons.push(data);
                        uiBuilder.db.overwriteDataByID(ui.id, ui.data);
                    }
                    return uiManager.open(
                        player,
                        versionData.uiNames.UIBuilderEditButtons,
                        id
                    );
                }
            );
        }

        form.show(player, false, () => {});
    }
);
