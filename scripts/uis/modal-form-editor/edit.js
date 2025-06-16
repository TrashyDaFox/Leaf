import { world } from "@minecraft/server";
import uiBuilder from "../../api/uiBuilder";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";

uiManager.addUI(
    versionData.uiNames.Modal.Edit,
    "Edit modal form",
    (player, id) => {
        let form = new ActionForm();
        let ui = uiBuilder.getByID(id);
        form.title(`Editing ${ui.data.name}`);
        form.button(
            `§aEdit form\n§7Edit extra form properties`,
            `textures/azalea_icons/GUIMaker/ModalsV2/edit model form`,
            (player) => {
                uiManager.open(
                    player,
                    versionData.uiNames.Modal.Add,
                    ui.data.name,
                    ui.data.scriptevent,
                    "",
                    ui.id
                );
            }
        );
        form.button(
            `§dEdit controls\n§7Edit contents of this form`,
            `textures/azalea_icons/GUIMaker/ModalsV2/Edit controls`,
            (player) => {
                uiManager.open(
                    player,
                    versionData.uiNames.Modal.EditControls,
                    id
                );
            }
        );
        form.button(
            `§nExport\n§7Get the code for this UI`,
            `textures/azalea_icons/export`,
            (player) => {
                let modal = new ModalForm();
                modal.title("Code Editor");
                modal.textField(
                    "Code",
                    "Code",
                    JSON.stringify(uiBuilder.exportUI(id), null, 2)
                );
                modal.show(player, false, () => {
                    uiManager.open(player, versionData.uiNames.Modal.Root, id);
                });
            }
        );
        form.button(
            `§cDelete\n§7Delete this form`,
            `textures/azalea_icons/Delete`,
            (player) => {
                uiManager.open(
                    player,
                    versionData.uiNames.Basic.Confirmation,
                    "Are you sure you want to delete this modal UI?",
                    () => {
                        uiBuilder.db.deleteDocumentByID(id);
                        uiManager.open(player, versionData.uiNames.Modal.Root);
                    },
                    () => {
                        uiManager.open(player, versionData.uiNames.Modal.Root);
                    }
                );
            }
        );
        form.show(player, false, (player, response) => {});
    }
);
