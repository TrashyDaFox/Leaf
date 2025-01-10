import { system, world } from "@minecraft/server";
import icons from "../../api/icons";
import uiBuilder from "../../api/uiBuilder";
import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import http from "../../networkingLibs/currentNetworkingLib";
import uiManager from "../../uiManager";
import moment from '../../lib/moment';
import emojis from '../../api/emojis';

const NAVIGATION_BUTTONS = [
    {
        text: `§t§a§b§a§c§t§i§v§e§r§f\uE180 UIs`,
        icon: null,
        action: (player) => uiManager.open(player, config.uiNames.UIBuilderRoot)
    },
    {
        text: `§t§a§b§r§f\uE17E Tab UIs`,
        icon: null,
        action: (player) => uiManager.open(player, config.uiNames.UIBuilderTabbed)
    },
    {
        text: `§t§a§b§r§f\uE17F Info`,
        icon: null,
        action: (player) => uiManager.open(player, config.uiNames.UIBuilderInfo)
    },
    {
        text: `§aAdd\n§r§7Add a UI`,
        icon: `textures/azalea_icons/1`,
        action: (player) => uiManager.open(player, config.uiNames.UIBuilderAdd)
    }
];

uiManager.addUI(config.uiNames.UIBuilderRoot, "UI Builder Root", (player) => {
    const form = new ActionForm();
    form.title("§t§a§b§b§e§d§r§fUIs");

    // Add navigation buttons
    NAVIGATION_BUTTONS.forEach(button => {
        form.button(button.text, button.icon, button.action);
    });

    // Add browse button if http player is available
    if (http.player) {
        form.button(
            `§aBrowse\n§r§7Browse global GUIs`, 
            icons.resolve("leaf/image-806"), 
            (player) => {
                http.makeRequest({
                    method: 'get',
                    url: `${config.Endpoint}/guis/list`
                }, (status, data) => {
                    system.run(() => {
                        uiManager.open(player, config.uiNames.OnlineGUIsList, data, "main");
                    });
                });
            }
        );
    }

    // Add UI list buttons
    const sortedUIs = uiBuilder.getUIs().sort((a, b) => b.updatedAt - a.updatedAt);
    sortedUIs.forEach(ui => {
        const scriptEventInfo = ui.data.scriptevent.length <= 16 
            ? ` §f| §7${emojis.chat} ${ui.data.scriptevent}` 
            : '';
            
        form.button(
            `§b${ui.data.name}\n§r§7${emojis.clock} Updated ${moment(ui.updatedAt).fromNow()}${scriptEventInfo}`,
            ui.data.icon ? icons.resolve(ui.data.icon) : `textures/azalea_icons/ClickyClick`,
            (player) => uiManager.open(player, config.uiNames.UIBuilderEdit, ui.id)
        );
    });

    form.show(player, false, () => {});
});