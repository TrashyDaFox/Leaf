import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import emojis from '../../api/emojis';
import uiBuilder from "../../api/uiBuilder";

/**
 * UI Builder Info Screen
 * Shows information about the UI Builder and navigation options
 */
uiManager.addUI(config.uiNames.UIBuilderInfo, "a", (player) => {
    const form = new ActionForm();
    
    // Set title with required formatting
    form.title("§t§a§b§b§e§d§r§fUI Builder Info");
    
    // Navigation buttons with required formatting prefixes
    form.button(`§t§a§b§r§f\uE180 UIs`, null, (player) => {
        uiManager.open(player, config.uiNames.UIBuilderRoot);
    });

    form.button(`§t§a§b§r§f\uE17E Tab UIs`, null, (player) => {
        uiManager.open(player, config.uiNames.UIBuilderTabbed);
    });

    form.button(`§t§a§b§a§c§t§i§v§e§r§f\uE17F Info`, null, (player) => {
        uiManager.open(player, config.uiNames.UIBuilderInfo);
    });

    form.button(`§t§a§b§r§f\uE186 Leaf UIs`, null, (player) => {
        uiManager.open(player, config.uiNames.UIBuilderList);
    });

    // Info content
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
            if(ui.data.type !== 0) continue;
            infoText.push(`§f${ui.data.name} §r§7: §a${ui.id}`);
        }
    }

    form.button("§aRaw UI Data", null, (player)=>{
        uiManager.open(player, config.uiNames.RawUIData);
    })

    form.body(infoText.join("\n§r§f"));
    form.show(player, false);
});