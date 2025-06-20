import chestUIBuilder from "../../api/chest/chestUIBuilder";
import config from "../../versionData";
import { ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import uiBuilder from "../../api/uiBuilder";

uiManager.addUI(
    config.uiNames.ChestGuiAdd,
    "Chest GUI Add",
    (
        player,
        defaultTitle = "",
        defaultScriptevent = "",
        defaultRows = 3,
        error = null,
        id = null
    ) => {
        let modal = new ModalForm();
        modal.title("Create Chest GUI");
        modal.title(
            error ? `§c${error}` : !id ? "Create Chest GUI" : "Edit Chest GUI"
        );
        modal.textField("Title§c*", "Example Form", defaultTitle);
        modal.textField(
            "Scriptevent§c*",
            `/scriptevent ${config.scripteventNames.open} <scriptevent>`,
            defaultScriptevent
        );
        let rows = [3, 6, 1];
        // modal.slider("Rows§c*§r§f", 1, 10, 1, defaultRows);
        modal.dropdown(
            "Size",
            ["Single", "Double", "1 Row"].map((_) => {
                return { option: _, callback() {} };
            }),
            Math.max(1, rows.indexOf(defaultRows))
        );
        // modal.textField("§c*", `/scriptevent ${config.scripteventNames.open} <scriptevent>`);
        modal.show(player, false, (player, response) => {
            if (!response.formValues[0])
                return uiManager.open(
                    player,
                    config.uiNames.ChestGuiAdd,
                    response.formValues[0],
                    response.formValues[1],
                    response.formValues[2],
                    "Title cant be empty"
                );
            if (!response.formValues[1])
                return uiManager.open(
                    player,
                    config.uiNames.ChestGuiAdd,
                    response.formValues[0],
                    response.formValues[1],
                    response.formValues[2],
                    "Scriptevent cant be empty"
                );
            if (id) {
                let chest = uiBuilder.db.getByID(id);
                if (!chest) return;
                chest.data.rows = rows[response.formValues[2]];
                chest.data.scriptevent = response.formValues[1];
                chest.data.title = response.formValues[0];
                uiBuilder.db.overwriteDataByID(chest.id, chest.data);
                uiManager.open(player, config.uiNames.ChestGuiRoot);
                return;
            }
            uiBuilder.createChestGUI(
                response.formValues[0],
                response.formValues[1],
                rows[response.formValues[2]]
            );
            uiManager.open(player, config.uiNames.ChestGuiRoot);
        });
    }
);
uiManager.addUI(
    config.uiNames.ChestGuiAddAdvanced,
    "Chest GUI Add",
    (
        player,
        defaultTitle = "",
        defaultScriptevent = "",
        defaultRows = 3,
        error = null,
        id = null
    ) => {
        let modal = new ModalForm();
        modal.title("Create Chest GUI");
        modal.title(
            error ? `§c${error}` : !id ? "Create Chest GUI" : "Edit Chest GUI"
        );
        modal.textField("Title§c*", "Example Form", defaultTitle);
        modal.textField(
            "Scriptevent§c*",
            `/scriptevent ${config.scripteventNames.open} <scriptevent>`,
            defaultScriptevent
        );
        modal.slider("Rows§c*§r§f", 1, 10, 1, defaultRows);
        // modal.textField("§c*", `/scriptevent ${config.scripteventNames.open} <scriptevent>`);
        modal.show(player, false, (player, response) => {
            if (!response.formValues[0])
                return uiManager.open(
                    player,
                    config.uiNames.ChestGuiAddAdvanced,
                    response.formValues[0],
                    response.formValues[1],
                    response.formValues[2],
                    "Title cant be empty"
                );
            if (!response.formValues[1])
                return uiManager.open(
                    player,
                    config.uiNames.ChestGuiAddAdvanced,
                    response.formValues[0],
                    response.formValues[1],
                    response.formValues[2],
                    "Scriptevent cant be empty"
                );
            if (id) {
                let chest = uiBuilder.db.getByID(id);
                if (!chest) return;
                chest.data.rows = rows[response.formValues[2]];
                chest.data.scriptevent = response.formValues[1];
                chest.data.title = response.formValues[0];
                uiBuilder.db.overwriteDataByID(chest.id, chest.data);
                uiManager.open(player, config.uiNames.ChestGuiRoot);
                return;
            }
            uiBuilder.createAdvancedChestGUI(
                response.formValues[0],
                response.formValues[1],
                rows[response.formValues[2]]
            );
            uiManager.open(player, config.uiNames.ChestGuiRoot);
        });
    }
);
