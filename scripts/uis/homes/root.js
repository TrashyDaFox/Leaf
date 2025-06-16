import config from "../../versionData.js";
import uiManager from "../../uiManager";
import homes from "../../api/homes";
import "./create";
import "./view";
import "./config.js";
import "./viewShared";
import "./shared.js";
import { ActionForm } from "../../lib/prismarinedb";
import { NUT_UI_TAG } from "../preset_browser/nutUIConsts.js";
import icons from "../../api/icons.js";
import { insertBackButton } from "../sharedUtils/insertBackButton.js";
import configAPI from "../../api/config/configAPI.js";

uiManager.addUI(
    config.uiNames.Homes.Root,
    "Homes Root",
    (player, backButton) => {
        let form = new ActionForm();
        form.title(`${NUT_UI_TAG}§fHomes`);
        insertBackButton(form, backButton);
        form.button(
            "§aCreate Home\n§7Create a home",
            "textures/azalea_icons/1.png",
            (player) => {
                uiManager.open(player, config.uiNames.Homes.Create);
            }
        );
        if (!configAPI.getProperty("AzaleaStyleSharedHomes")) {
            form.button(
                "§aShared Homes\n§7View your shared homes",
                icons.resolve("^textures/items/name_tag"),
                (player) => {
                    uiManager.open(player, config.uiNames.Homes.Shared);
                }
            );
        }
        for (const home of homes.getAllFromPlayer(player)) {
            form.button(
                `§a${home.data.name}\n§7View this home`,
                null,
                (player) => {
                    uiManager.open(player, config.uiNames.Homes.View, home.id);
                }
            );
        }
        form.show(player);
    }
);
