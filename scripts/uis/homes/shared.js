import config from "../../versionData";
import uiManager from "../../uiManager";
import {
    NUT_UI_HEADER_BUTTON,
    NUT_UI_TAG,
} from "../preset_browser/nutUIConsts.js";
import homes from "../../api/homes";
import { ActionForm } from "../../lib/prismarinedb";

uiManager.addUI(config.uiNames.Homes.Shared, "Homes Root", (player) => {
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}§r§f` + "Homes");
    form.button(
        `${NUT_UI_HEADER_BUTTON}§cBack\n§7Go back to homes root`,
        "textures/azalea_icons/2.png",
        (player) => {
            uiManager.open(player, config.uiNames.Homes.Root);
        }
    );
    for (const home of homes.getSharedHomes(player)) {
        form.button(`§a${home.data.name}\n§7View this home`, null, (player) => {
            uiManager.open(player, config.uiNames.Homes.ViewShared, home.id);
        });
    }
    form.show(player);
});
