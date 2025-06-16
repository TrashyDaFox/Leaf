import uiBuilder from "../api/uiBuilder";
import { NUT_UI_TAG, NUT_UI_THEMED } from "../uis/preset_browser/nutUIConsts";
import { themes } from "../uis/uiBuilder/cherryThemes";
import { ModalForm } from "./form_func";

export default [
    {
        text: "Cycle Themes",
        icon: "textures/azalea_icons/RainbowPaintBrush",
        requiredTitleTag: NUT_UI_TAG,
        callback(player, ui) {
            let currentTheme = themes
                .slice(1)
                .findIndex((_) => ui.titleText.includes(_[0]));
            ui.title(
                `${ui.titleText.replaceAll(`${NUT_UI_THEMED}`, ``)}${
                    currentTheme > -1
                        ? `${NUT_UI_THEMED}${themes[currentTheme][0]}`
                        : ``
                }`
            );
            ui.show(player, false, () => {});
        },
    },
    {
        text: "Creator: Set UpdatedAt Property\n(Custom UIs Only)",
        callback(player, ui) {
            if (!ui.customFormID) return;
            let modalForm = new ModalForm();
            let form = uiBuilder.db.findFirst({ scriptevent: ui.customFormID });
            modalForm.textField(
                "Timestamp (Unix Timestamp)",
                "yes",
                form.updatedAt.toString(),
                (player) => {}
            );
            modalForm.show(player, false, (player, response) => {
                let index = uiBuilder.db.data.findIndex((_) => _.id == form.id);
                if (index > -1) {
                    uiBuilder.db.data[index].updatedAt = parseInt(
                        response.formValues[0]
                    );
                }
                uiBuilder.db.save();
            });
        },
    },
];
