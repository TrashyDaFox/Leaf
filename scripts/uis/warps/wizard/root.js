import { ActionForm } from "../../../lib/form_func";
import uiManager from "../../../uiManager";
import versionData from "../../../versionData";
import { NUT_UI_TAG, NUT_UI_THEMED } from "../../preset_browser/nutUIConsts";
import { insertBackButton } from "../../sharedUtils/insertBackButton";
import { themes } from "../../uiBuilder/cherryThemes";

// naming this wizard cuz it sounds way cooler than "setup" smh

uiManager.addUI(
    versionData.uiNames.Warps.Wizard.Root,
    "meow mrrp nya mrrp",
    (player) => {
        let form = new ActionForm();
        form.title(
            `${NUT_UI_TAG}${NUT_UI_THEMED}${themes[43][0]}§r§fWarps Wizard`
        );
        form.label(`How do you want to choose the location of the warp?`);
        insertBackButton(
            form,
            "/scriptevent leafgui:ui_builder_create_ui_selector"
        );
        form.button(
            `§aAutomatic\n§7Use your current location`,
            `textures/azalea_icons/other/location_character`,
            (player) => {
                uiManager.open(
                    player,
                    versionData.uiNames.Warps.Wizard.Automatic
                );
            }
        );
        form.button(
            `§bManual\n§7Manually input coordinates`,
            `textures/azalea_icons/other/location_hand`,
            (player) => {
                uiManager.open(player, versionData.uiNames.Warps.Wizard.Manual);
            }
        );
        form.label(`§0You found me! :D`);
        form.show(player, false, () => {});
    }
);
