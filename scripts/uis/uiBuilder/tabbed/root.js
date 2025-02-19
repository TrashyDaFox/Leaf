import { builderTabUI } from '../root';
import uiBuilder from "../../../api/uiBuilder";
import config from "../../../versionData";
import uiManager from "../../../uiManager";
import { themes } from '../cherryThemes';
// import { NUT_UI_DISABLE_VERTICAL_SIZE_KEY, NUT_UI_HEADER_BUTTON, NUT_UI_LEFT_HALF, NUT_UI_RIGHT_HALF } from '../../preset_browser/nutUIConsts';
import { NUT_UI_ALT, NUT_UI_DISABLE_VERTICAL_SIZE_KEY, NUT_UI_HEADER_BUTTON, NUT_UI_LEFT_HALF, NUT_UI_RIGHT_HALF, NUT_UI_TAG, NUT_UI_THEMED } from "../../preset_browser/nutUIConsts";
import { ActionForm } from '../../../lib/form_func';
import { system, world } from "@minecraft/server";
// import icons from "../../../api/icons";
// import uiBuilder from "../../api/uiBuilder";
// import config from "../../versionData";
// import http from "../../networkingLibs/currentNetworkingLib";
// import uiManager from "../../uiManager";
// import moment from '../../lib/moment';
// import emojis from '../../api/emojis';
// import tabUI from "../../api/tabUI";
// import { MessageForm, ModalForm } from "../../lib/form_func";
// import './snippetBook'
// import { NUT_UI_ALT, NUT_UI_DISABLE_VERTICAL_SIZE_KEY, NUT_UI_HEADER_BUTTON, NUT_UI_LEFT_HALF, NUT_UI_RIGHT_HALF, NUT_UI_TAG, NUT_UI_THEMED } from "../preset_browser/nutUIConsts";
// import { themes } from "./cherryThemes";
let showUI = (player) => {
    const buttons = [{
        text: `§6Create Tabbed UI\n§7Creates a UI with tabs`,
        iconPath: `textures/azalea_icons/1`,
        callback: (player) => {
            uiManager.open(player, config.uiNames.UIBuilderTabbedCreate);
        }
    }];

    for(const tabUI of uiBuilder.getTabbedUIs()) {
        buttons.push({
            text: `§a${tabUI.data.title}\n§7${tabUI.data.tabs.length} Tab(s)`,
            callback: (player) => {
                uiManager.open(player, config.uiNames.UIBuilderTabbedEdit, tabUI.id);
            }
        });
    }

    return {
        buttons,
        body: "§bTIP: To open tab UIs, do §e/scriptevent leaf:open_tabbed <tab ui>"
    };
}

uiManager.addUI(config.uiNames.UIBuilderTabbed, "a", (player)=>{
    let form = new ActionForm();
    form.button(`${NUT_UI_HEADER_BUTTON}§r§cGo Back\n§7Go back to main settings`, `textures/azalea_icons/2`, player => uiManager.open(player, config.uiNames.ConfigRoot))
    form.button(`${NUT_UI_RIGHT_HALF}${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}§rMy UIs`, null, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderRoot)
    })
    form.button(`${NUT_UI_LEFT_HALF}${NUT_UI_ALT}${themes[8][0]}§rTab UIs`, null, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderTabbed)
    })
    form.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[8][0]}§rUI Builder`)
    let { buttons, body } = showUI(player);
    form.body(body)
    for(const button of buttons) {
        form.button(button.text, button.iconPath, button.callback)
    }
    form.show(player, false, (player, response)=>{

    })
})