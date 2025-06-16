import uiBuilder from "../../../api/uiBuilder";
import { array_move } from "../../../api/utils/array_move";
import { ActionForm, ModalForm } from "../../../lib/form_func";
import uiManager from "../../../uiManager";
import versionData from "../../../versionData";

uiManager.addUI(
    versionData.uiNames.InviteManager.EditActions,
    "",
    (player, id, key) => {
        let doc = uiBuilder.db.getByID(id);
        if (!doc.data[key]) doc.data[key] = [];
        let actionForm = new ActionForm();
        actionForm.title(key);
        actionForm.button(
            `§aAdd Action\n§7Add a new action`,
            `textures/azalea_icons/1`,
            (player) => {
                let modalForm = new ModalForm();
                modalForm.textField("Action", "Example: /say hi", "");
                modalForm.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.InviteManager.EditActions,
                            id,
                            key
                        );
                    doc.data[key].push(response.formValues[0]);
                    uiBuilder.db.overwriteDataByID(doc.id, doc.data);
                    uiManager.open(
                        player,
                        versionData.uiNames.InviteManager.EditActions,
                        id,
                        key
                    );
                });
            }
        );
        for (let i = 0; i < doc.data[key].length; i++) {
            let action = doc.data[key][i];
            actionForm.button(`${action}`, null, (player) => {
                let testForm = new ActionForm();
                testForm.button(`Edit Action`, null, (player) => {
                    let modalForm = new ModalForm();
                    modalForm.textField(
                        "Action",
                        "Example: /say hi",
                        doc.data[key][i]
                    );
                    modalForm.show(player, false, (player, response) => {
                        if (response.canceled)
                            return uiManager.open(
                                player,
                                versionData.uiNames.InviteManager.EditActions,
                                id,
                                key
                            );
                        doc.data[key][i] = response.formValues[0];
                        uiBuilder.db.overwriteDataByID(doc.id, doc.data);
                        uiManager.open(
                            player,
                            versionData.uiNames.InviteManager.EditActions,
                            id,
                            key
                        );
                    });
                });
                testForm.button(
                    `Move Up`,
                    `textures/azalea_icons/Up`,
                    (player) => {
                        array_move(doc.data[key], i, i - 1 < 0 ? 0 : i - 1);
                        uiBuilder.db.overwriteDataByID(doc.id, doc.data);
                        uiManager.open(
                            player,
                            versionData.uiNames.InviteManager.EditActions,
                            id,
                            key
                        );
                    }
                );
                testForm.button(
                    `Move Down`,
                    `textures/azalea_icons/Down`,
                    (player) => {
                        array_move(
                            doc.data[key],
                            i,
                            i + 1 >= doc.data[key].length
                                ? doc.data[key].length - 1
                                : i + 1
                        );
                        uiBuilder.db.overwriteDataByID(doc.id, doc.data);
                        uiManager.open(
                            player,
                            versionData.uiNames.InviteManager.EditActions,
                            id,
                            key
                        );
                    }
                );
                testForm.button(
                    `Delete`,
                    `textures/azalea_icons/Delete`,
                    (player) => {
                        doc.data[key].splice(i, 1);
                        uiBuilder.db.overwriteDataByID(doc.id, doc.data);
                        uiManager.open(
                            player,
                            versionData.uiNames.InviteManager.EditActions,
                            id,
                            key
                        );
                    }
                );
                testForm.show(player, false, (player, response) => {});
            });
        }
        actionForm.show(player, false, (player, response) => {});
    }
);
