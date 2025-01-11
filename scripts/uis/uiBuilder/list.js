import config from "../../config";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import emojis from '../../api/emojis';
import uiBuilder from "../../api/uiBuilder";

/**
 * UI Builder Info Screen
 * Shows information about the UI Builder and navigation options
 */
uiManager.addUI(config.uiNames.UIBuilderList, "a", (player, searchQuery, sortMode = "ABC") => {
    const form = new ActionForm();
    
    
    // Navigation buttons with required formatting prefixes
    form.button(`§t§a§b§r§f\uE180 UIs`, null, (player) => {
        uiManager.open(player, config.uiNames.UIBuilderRoot);
    });

    form.button(`§t§a§b§r§f\uE17E Tab UIs`, null, (player) => {
        uiManager.open(player, config.uiNames.UIBuilderTabbed);
    });

    form.button(`§t§a§b§r§f\uE17F Info`, null, (player) => {
        uiManager.open(player, config.uiNames.UIBuilderInfo);
    });

    form.button(`§t§a§b§a§c§t§i§v§e§r§f\uE186 Leaf UIs`, null, (player) => {
        uiManager.open(player, config.uiNames.UIBuilderList);
    });
    let infoText = ["§d* §7= §fThis UI requires data."];
    form.title(`§t§a§b§b§e§d§r§f${searchQuery ? `§e${searchQuery}` : 'UI List'}`);
    let uiList = uiManager.uis.slice().sort((a, b) => a.id.localeCompare(b.id));
    console.log(uiList)
    form.button("§bSearch\n§7Search through the list", null, (player) => {
        let searchQueryForm = new ModalForm();
        searchQueryForm.title("§7Search");
        searchQueryForm.textField("§7Enter the search query", "example: tpa");
        searchQueryForm.show(player, false, (player, response) => {
            if(response.canceled) return uiManager.open(player, config.uiNames.UIBuilderList, searchQuery, sortMode);
            if(response.formValues[0]) {
                uiManager.open(player, config.uiNames.UIBuilderList, response.formValues[0], sortMode);
                return;
            }
            uiManager.open(player, config.uiNames.UIBuilderList, searchQuery, sortMode);
        });
    });
    if(searchQuery) {
        uiList = uiList.filter(ui => ui.id.toLowerCase().replaceAll("_","").includes(searchQuery.toLowerCase().replaceAll("_","")));
    }
    for(const ui of uiList) {
        if(!ui.ui) continue;
        form.button(`§e${ui.ui.length > 1 ? " §d" : ""}${ui.id}\n§7${ui.description ? ui.description : "No Description"}`, null, (player) => {
            if(ui.ui.length > 1) {
                uiManager.open(player, "confirmation", "Are you sure you want to open this UI? It requires data to be passed to it, and might not work if you open it this way.", ()=>{
                    uiManager.open(player, ui.id);
                }, ()=>{
                    uiManager.open(player, config.uiNames.UIBuilderList, searchQuery, sortMode);
                });
            } else {
                uiManager.open(player, ui.id);
            }
        });
    }

    form.body(infoText.join("\n§r§f"));
    form.show(player, false);
});