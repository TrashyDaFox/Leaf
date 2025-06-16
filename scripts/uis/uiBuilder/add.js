// Added in v0.1
import translation from "../../api/translation";
import uiBuilder from "../../api/uiBuilder";
import config from "../../versionData";
import { ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import { NUT_UI_MODAL } from "../preset_browser/nutUIConsts";
// hey daddy i wanna turn myself into a vegetable
uiManager.addUI(
    config.uiNames.UIBuilderAdd,
    "Add a UI",
    (
        player,
        defaultTitle = undefined,
        defaultBody = undefined,
        defaultScriptevent = undefined,
        error = undefined,
        id = undefined
    ) => {
        if (id == 1719775088275) return;
        let modalForm = new ModalForm();
        modalForm.title(
            `${NUT_UI_MODAL}${
                error
                    ? `§c${error}`
                    : id
                    ? "Edit UI"
                    : translation.getTranslation(player, "uibuilder.createui")
            }`
        );
        modalForm.textField(
            `${translation.getTranslation(player, "uibuilder.title")}§c*`,
            translation.getTranslation(player, "uibuilder.titleplaceholder"),
            defaultTitle
        );
        modalForm.textField(
            translation.getTranslation(player, "uibuilder.body"),
            translation.getTranslation(player, "uibuilder.bodyplaceholder"),
            defaultBody
        );
        modalForm.textField(
            `${translation.getTranslation(player, "uibuilder.scriptevent")}§c*`,
            `example-ui`,
            defaultScriptevent,
            () => {},
            "A unique ID is what is used to open your UI. We recommend not having spaces. To open, do: §e/scriptevent leaf:open §aunique-id§f."
        );
        let ui2;
        if (id) {
            ui2 = uiBuilder.db.getByID(id);
        }
        modalForm.textField(
            `After Cancel Action`,
            "Command to run if player closes UI",
            ui2 ? (ui2.data.cancel ? ui2.data.cancel : "") : ""
        );
        modalForm.dropdown(
            `UI Layout`,
            [
                {
                    option: "§eNormal",
                    callback() {},
                },
                {
                    option: "§6Grid UI",
                    callback() {},
                },
                {
                    option: "§uFullscreen UI",
                    callback() {},
                },
                {
                    option: "§dNormal (with player model)",
                    callback() {},
                },
                {
                    option: "§cCherryUI (Recommended)",
                    callback() {},
                },
                {
                    option: "§4Dropdown",
                    callback() {},
                },
            ],
            ui2 ? (ui2.data.layout ? ui2.data.layout : 0) : 4
        );
        modalForm.divider();
        // modalForm.toggle("Use2 simplified UI builder", ui2 && ui2.data.simplify ? true : false)
        modalForm.submitButton(
            id
                ? "Edit UI"
                : translation.getTranslation(player, "uibuilder.createui")
        );
        modalForm.show(player, false, (player, response) => {
            if (!response.formValues[0])
                return uiManager.open(
                    player,
                    config.uiNames.UIBuilderAdd,
                    response.formValues[0],
                    response.formValues[1],
                    response.formValues[2],
                    translation.getTranslation(
                        player,
                        "uibuilder.errors.titleundefined"
                    )
                );
            if (!response.formValues[2])
                return uiManager.open(
                    player,
                    config.uiNames.UIBuilderAdd,
                    response.formValues[0],
                    response.formValues[1],
                    response.formValues[2],
                    translation.getTranslation(
                        player,
                        "uibuilder.errors.scripteventundefined"
                    )
                );
            if (id) {
                let ui = uiBuilder.db.getByID(id);
                if (!ui) return;
                ui.data.name = response.formValues[0];
                ui.data.body = response.formValues[1];
                ui.data.scriptevent = response.formValues[2];
                ui.data.cancel = response.formValues[3];
                ui.data.layout = response.formValues[4];
                // ui.data.simplify = response.formValues[5];
                uiBuilder.db.overwriteDataByID(id, ui.data);
                uiManager.open(player, config.uiNames.UIBuilderRoot);
                return;
            }
            uiBuilder.createUI(
                response.formValues[0],
                response.formValues[1],
                "normal",
                response.formValues[2],
                response.formValues[4],
                {
                    cancel: response.formValues[3],
                    // simplify: response.formValues[5]
                }
            );
            uiManager.open(player, config.uiNames.UIBuilderRoot);
        });
    }
);
