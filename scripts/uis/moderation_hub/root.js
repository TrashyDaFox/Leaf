import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import {
    NUT_UI_ALT,
    NUT_UI_HEADER_BUTTON,
    NUT_UI_TAG,
    NUT_UI_THEMED,
} from "../preset_browser/nutUIConsts";
import { themes } from "../uiBuilder/cherryThemes";

uiManager.addUI(versionData.uiNames.ModerationHub.Root, "", (player) => {
    let form = new ActionForm();
    form.title(
        `${NUT_UI_TAG}${NUT_UI_THEMED}${themes[8][0]}§r§f§lModeration Hub`
    );
    form.button(
        `${NUT_UI_HEADER_BUTTON}§cGo Back\n§7Go back to main settings`,
        `textures/azalea_icons/2`,
        (player) => {
            uiManager.open(player, versionData.uiNames.Config.Misc);
        }
    );
    form.button(
        `§dBans\n§7Manage this servers bans`,
        `textures/leaf_icons/image-107`,
        (player) => {
            uiManager.open(player, versionData.uiNames.ModerationHub.Bans.Root);
        }
    );
    form.button(
        `§eMutes\n§7Manage players mutes`,
        `textures/leaf_icons/image-1023`,
        (player) => {
            uiManager.open(player, versionData.uiNames.ModerationHub.Mute.Root);
        }
    );
    // form.button(
    //     `§6Warns\n§7Manage players warns`,
    //     `textures/leaf_icons/image-0982`,
    //     (player) => {}
    // );
    form.button(
        `§cReports\n§7Manage reports`,
        `textures/leaf_icons/image-068`,
        (player) => {
            uiManager.open(player, versionData.uiNames.Reports.Admin.Dashboard)
        }
    );
    form.show(player, false, (player, response) => {});
    // image-107
});
