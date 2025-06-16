import icons from "../../api/icons";
import uiBuilder from "../../api/uiBuilder";
import { array_move } from "../../api/utils/array_move";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";

uiManager.addUI(
    "add_icon_override",
    "a",
    (
        player,
        uiID,
        buttonIndex,
        overrideIndex = -1,
        iconID = "",
        overrideCondition = "",
        overrideText = "",
        overrideSubtext = ""
    ) => {
        let ui = uiBuilder.db.getByID(uiID);
        let button = ui.data.buttons[buttonIndex];
        if (overrideIndex > -1 && !iconID && !overrideCondition) {
            iconID = button.iconOverrides[overrideIndex].iconID;
            overrideCondition = button.iconOverrides[overrideIndex].condition;
        }
        let form = new ActionForm();
        form.button(`§7Back`, null, (player) => {
            uiManager.open(player, "edit_icon_overrides", uiID, buttonIndex);
        });
        form.button(
            `§dSet Icon\n§7Sets an icon`,
            icons.resolve(iconID),
            (player) => {
                uiManager.open(
                    player,
                    versionData.uiNames.IconViewer,
                    0,
                    (player, iconID2) => {
                        if (iconID2 != null) iconID = iconID2;
                        uiManager.open(
                            player,
                            "add_icon_override",
                            uiID,
                            buttonIndex,
                            overrideIndex,
                            iconID,
                            overrideCondition
                        );
                    }
                );
            }
        );
        form.button(`§bSet Condition\n§7Set a required tag`, null, (player) => {
            let modal = new ModalForm();
            modal.textField(
                "Condition",
                "Write a condition, usually a tag",
                overrideCondition
            );
            modal.show(player, false, (player, response) => {
                if (response.canceled)
                    return uiManager.open(
                        player,
                        "add_icon_override",
                        uiID,
                        buttonIndex,
                        overrideIndex,
                        iconID,
                        overrideCondition
                    );

                overrideCondition = response.formValues[0];

                return uiManager.open(
                    player,
                    "add_icon_override",
                    uiID,
                    buttonIndex,
                    overrideIndex,
                    iconID,
                    overrideCondition
                );
            });
        });
        if (iconID && overrideCondition) {
            form.button(
                `§a${
                    overrideIndex == -1 ? "Create" : "Edit"
                }\n§7Create the override`,
                null,
                (player) => {
                    uiBuilder.addIconOverride(
                        uiID,
                        button.id,
                        iconID,
                        overrideCondition,
                        overrideIndex
                    );
                    uiManager.open(
                        player,
                        "edit_icon_overrides",
                        uiID,
                        buttonIndex
                    );
                }
            );
        }
        form.show(player, false, () => {});
    }
);

uiManager.addUI(
    "edit_icon_override",
    "a",
    (player, uiID, buttonIndex, overrideIndex) => {
        let ui = uiBuilder.db.getByID(uiID);
        let button = ui.data.buttons[buttonIndex];
        let form = new ActionForm();
        form.button(`§7Back`, null, (player) => {
            uiManager.open(player, "edit_icon_overrides", uiID, buttonIndex);
        });
        form.button(`§eEdit\n§7Edit the override`, null, (player) => {
            uiManager.open(
                player,
                "add_icon_override",
                uiID,
                buttonIndex,
                overrideIndex
            );
        });
        form.button(`§bMove Up`, `textures/azalea_icons/Up`, (player) => {
            array_move(
                button.iconOverrides,
                overrideIndex,
                overrideIndex - 1 < 0 ? overrideIndex : overrideIndex - 1
            );
            uiBuilder.db.overwriteDataByID(ui.id, ui.data);
            uiManager.open(player, "edit_icon_overrides", uiID, buttonIndex);
        });
        form.button(`§bMove Down`, `textures/azalea_icons/Down`, (player) => {
            array_move(
                button.iconOverrides,
                overrideIndex,
                overrideIndex + 1 >= button.iconOverrides.length
                    ? overrideIndex
                    : overrideIndex + 1
            );
            uiBuilder.db.overwriteDataByID(ui.id, ui.data);
            uiManager.open(player, "edit_icon_overrides", uiID, buttonIndex);
        });
        form.button(`§cDelete\n§7Delete the override`, null, (player) => {
            button.iconOverrides.splice(overrideIndex, 1);
            uiBuilder.db.overwriteDataByID(ui.id, ui.data);
            uiManager.open(player, "edit_icon_overrides", uiID, buttonIndex);
        });
        form.show(player, false, (player, response) => {});
    }
);

uiManager.addUI("edit_icon_overrides", "yes", (player, id, buttonIndex) => {
    let doc = uiBuilder.db.getByID(id);
    let button = doc.data.buttons[buttonIndex];
    let form = new ActionForm();
    form.button(`§7Back`, null, (player) => {
        uiManager.open(
            player,
            versionData.uiNames.UIBuilderEditButton,
            id,
            buttonIndex
        );
    });
    form.button(`§aAdd new override\n§7Adds new override`, null, (player) => {
        uiManager.open(player, "add_icon_override", id, buttonIndex);
    });
    for (let i = 0; i < button.iconOverrides.length; i++) {
        let override = button.iconOverrides[i];
        form.button(
            `§a${override.iconID}\n§r§7${override.condition}`,
            icons.resolve(override.iconID),
            (player) => {
                uiManager.open(
                    player,
                    "edit_icon_override",
                    id,
                    buttonIndex,
                    i
                );
            }
        );
    }
    form.show(player, false, (player, response) => {});
});
