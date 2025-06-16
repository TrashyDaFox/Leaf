import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import { NUT_UI_TAG, NUT_UI_THEMED } from "../preset_browser/nutUIConsts";
import { themes } from "../uiBuilder/cherryThemes";

uiManager.addUI(versionData.uiNames.DevHub, "Developer Hub", (player) => {
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[4][0]}§rDev Hub`);
    if (player.hasTag("leaf:debug-modeOwOUwUKawaii :3 Nya~~~")) {
        form.button(`Disable debug tools for all UIs`, null, (player) => {
            player.removeTag("leaf:debug-modeOwOUwUKawaii :3 Nya~~~");
            uiManager.open(player, versionData.uiNames.DevHub);
        });
    } else {
        form.button(`Enable debug tools for all UIs`, null, (player) => {
            player.addTag("leaf:debug-modeOwOUwUKawaii :3 Nya~~~");
            uiManager.open(player, versionData.uiNames.DevHub);
        });
    }
    form.show(player, false, (player, response) => {});
});
