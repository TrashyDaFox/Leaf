import scripting from "../../../../api/scripting";
import uiBuilder from "../../../../api/uiBuilder";
import { ActionForm, ModalForm } from "../../../../lib/form_func";
import uiManager from "../../../../uiManager";
import config from '../../../../versionData'

export default {
    extendEditButtons(actionForm, doc) {
        let id = doc.id;
        if (doc.data.type == 8) {
            actionForm.label(
                [
                    `§dScript Name§7: §f${
                        doc.data.scriptName
                            ? doc.data.scriptName
                            : doc.data.uniqueID
                    }`,
                    `§aDescription§7: §f${
                        doc.data.description
                            ? doc.data.description
                            : "No description"
                    }`,
                    `§6Script Author§7: §f${
                        doc.data.author ? doc.data.author : "Unknown"
                    }`,
                    `§vComment§7: §f${
                        doc.data.comment ? doc.data.comment : "No comment"
                    }`,
                ].join("\n§r")
            );
            actionForm.button(
                `§bEdit Unique ID\n§7Edit this scripts identifier`,
                `textures/azalea_icons/other/tag_id`,
                (player) => {
                    let modal = new ModalForm();
                    modal.textField(
                        "New Unique ID",
                        doc.data.uniqueID,
                        doc.data.uniqueID
                    );
                    modal.show(player, false, (player, response) => {
                        if (response.canceled)
                            return uiManager.open(
                                player,
                                config.uiNames.UIBuilderEdit,
                                id
                            );
                        scripting.unregisterScript(doc.data.uniqueID);
                        doc.data.uniqueID = response.formValues[0];
                        uiBuilder.db.overwriteDataByID(doc.id, doc.data);
                        scripting.registerScript(
                            doc.data.uniqueID,
                            uiBuilder.base64Decode(doc.data.code)
                        );
                        return uiManager.open(
                            player,
                            config.uiNames.UIBuilderEdit,
                            id
                        );
                    });
                }
            );
            actionForm.button(
                `${
                    doc.data.disabled ? "§aEnable" : "§cDisable"
                }\n§7Toggle this script`,
                `textures/azalea_icons/other/script_text_${
                    doc.data.disabled ? "checkmark" : "delete"
                }`,
                (player) => {
                    doc.data.disabled = !doc.data.disabled;
                    scripting.unregisterScript(doc.data.uniqueID);
                    if (!doc.data.disabled) {
                        scripting.registerScript(
                            doc.data.uniqueID,
                            uiBuilder.base64Decode(doc.data.code)
                        );
                    }
                    uiBuilder.db.overwriteDataByID(doc.id, doc.data);
                    uiManager.open(player, config.uiNames.UIBuilderEdit, id);
                }
            );
            actionForm.button(
                `§eEdit Code\n§7Edit this scripts code`,
                `textures/azalea_icons/other/script_edit`,
                (player) => {
                    let modal = new ModalForm();
                    modal.title("Code Editor");
                    modal.textField(
                        "Write your code here",
                        "Write your code here",
                        uiBuilder.base64Decode(doc.data.code)
                    );
                    modal.show(player, false, (player, response) => {
                        doc.data.code = uiBuilder.base64Encode(
                            response.formValues[0]
                        );
                        if (!doc.data.disabled)
                            scripting.unregisterScript(doc.data.uniqueID);
                        uiBuilder.db.overwriteDataByID(doc.id, doc.data);
                        if (!doc.data.disabled)
                            scripting.registerScript(
                                doc.data.uniqueID,
                                response.formValues[0]
                            );
                        uiManager.open(
                            player,
                            config.uiNames.UIBuilderEdit,
                            id
                        );
                    });
                }
            );
            actionForm.button(
                `§vReload\n§7Reload this script`,
                `textures/azalea_icons/other/arrow_refresh`,
                (player) => {
                    player.sendMessage("reloading...");
                    scripting.unregisterScript(doc.data.uniqueID);
                    scripting.registerScript(
                        doc.data.uniqueID,
                        uiBuilder.base64Decode(doc.data.code)
                    );
                    uiManager.open(player, config.uiNames.UIBuilderEdit, id);
                }
            );
            // actionForm.button(`§6Package\n§7Package this script`, `textures/azalea_icons/other/package`, (player)=>{

            // })
            actionForm.button(
                `§9Set Info\n§7Set info about this script`,
                `textures/azalea_icons/other/information`,
                (player) => {
                    let modal = new ModalForm();
                    modal.textField(
                        "Script Name",
                        "Name your script",
                        doc.data.scriptName ? doc.data.scriptName : ""
                    );
                    modal.textField(
                        "Script Description",
                        "Write a description",
                        doc.data.description ? doc.data.description : ""
                    );
                    modal.textField(
                        "Script Author",
                        "Write your name",
                        doc.data.author ? doc.data.author : ""
                    );
                    modal.textField(
                        "Comment",
                        "Write extra info",
                        doc.data.comment ? doc.data.comment : ""
                    );
                    modal.show(player, false, (player, response) => {
                        if (response.canceled)
                            return uiManager.open(
                                player,
                                config.uiNames.UIBuilderEdit,
                                id
                            );

                        doc.data.scriptName = response.formValues[0];
                        doc.data.description = response.formValues[1];
                        doc.data.author = response.formValues[2];
                        doc.data.comment = response.formValues[3];

                        uiBuilder.db.overwriteDataByID(doc.id, doc.data);
                        uiManager.open(
                            player,
                            config.uiNames.UIBuilderEdit,
                            id
                        );
                    });
                }
            );
            actionForm.button(
                `§dHooks\n§7View the hooks this script has created`,
                `textures/azalea_icons/other/link`,
                (player) => {
                    let action = new ActionForm();
                    action.title(`Hooks`);
                    let hooks = scripting.hooks.filter(
                        (_) => _.id == doc.data.uniqueID
                    );
                    for (const hook of hooks) {
                        action.label(`§c${hook.type} §7${hook.uniqueID}`);
                    }
                    action.button("Ok", null, (player) => {});
                    action
                        .show(player, false, () => {})
                        .then(() => {
                            uiManager.open(
                                player,
                                config.uiNames.UIBuilderEdit,
                                id
                            );
                        });
                }
            );
            try {
                let globals = scripting.getGlobalPrivileged(
                    doc.data.uniqueID,
                    "editActions"
                );
                if (globals && Array.isArray(globals)) {
                    try {
                        for (const action of globals) {
                            actionForm.button(
                                `§c${action.name}\n§r§7[ Click to Run Script Action ]`,
                                `textures/azalea_icons/other/script_lightning`,
                                (player) => {
                                    action.run(player, () => {
                                        uiManager.open(
                                            player,
                                            config.uiNames.UIBuilderEdit,
                                            id
                                        );
                                    });
                                }
                            );
                        }
                    } catch {}
                }
            } catch {}
        }
    },
};
