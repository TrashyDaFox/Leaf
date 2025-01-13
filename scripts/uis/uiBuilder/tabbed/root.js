import { builderTabUI } from '../root';
import uiBuilder from "../../../api/uiBuilder";
import config from "../../../config";
import uiManager from "../../../uiManager";

builderTabUI.registerTab("\uE17E Tab UIs", (player) => {
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
});