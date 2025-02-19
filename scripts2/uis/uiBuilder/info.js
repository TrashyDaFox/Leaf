import { builderTabUI } from './root';
import uiBuilder from "../../api/uiBuilder";
import uiManager from "../../uiManager";
import config from "../../versionData";

builderTabUI.registerTab("\uE17F Info", (player) => {
    const buttons = [{
        text: "§aRaw UI Data",
        callback: (player) => {
            uiManager.open(player, config.uiNames.RawUIData);
        }
    }];

    const infoText = [
        "§eLeaf Essentials UI Builder",
        "",
        "§fEnhanced UI Builder Experiment: §aEnabled",
        "§fVersion: §a2.0",
        "",
        "§bMade by TheLegendaryTrashcan"
    ];

    if(uiBuilder.db.data.length > 0){
        infoText.push("");
        infoText.push("§b----- Debug Info -----");
        infoText.push("");
        infoText.push("§fUIs: §a" + uiBuilder.db.data.length);
        infoText.push("");
        infoText.push("§b----- UI IDs (debug) -----");
        for(const ui of uiBuilder.db.data){
            if(ui.data.type !== 0 && ui.data.type !== 3 && ui.data.type !== 4) continue;
            infoText.push(`§f${ui.data.type == 4 ? ui.data.title : ui.data.name} §r§7: §a${ui.id}`);
        }
    }

    return {
        buttons,
        body: infoText.join("\n§r§f")
    };
});