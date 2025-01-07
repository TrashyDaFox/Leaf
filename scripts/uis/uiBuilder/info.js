import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import emojis from '../../api/emojis';

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

    // Info content
    const infoText = [
        "§eLeaf Essentials UI Builder",
        "",
        "§fEnhanced UI Builder Experiment: §aEnabled",
        "§fVersion: §a2.0",
        "",
        "§bMade by TheLegendaryTrashcan"
    ].join("\n");

    form.body(infoText);
    form.show(player, false);
});