import uiManager from '../../../uiManager';
import config from '../../../config';
import { ActionForm } from "../../../lib/form_func";
import emojis from '../../../api/emojis'
import uiBuilder from '../../../api/uiBuilder';

uiManager.addUI(config.uiNames.UIBuilderTabbed, "Tabbed UIs", (player)=>{
    let form = new ActionForm();
    form.title("§t§a§b§b§e§d§r§fTab UIs");
    form.button(`§t§a§b§r§f\uE180 UIs`, null, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderRoot)
    })
    // form.button(`§t§a§b§r§f${emojis.axolotl_bucket} Presets`, null, (player)=>{

    // })
    form.button(`§t§a§b§a§c§t§i§v§e§r§f\uE17E Tab UIs`, null, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderTabbed)

    })
    form.button(`§t§a§b§r§f\uE17F Info`, null, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderInfo)
    })

    form.button(`§6Create Tabbed UI\n§7Creates a UI with tabs`, `textures/azalea_icons/1`, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderTabbedCreate)
    })
    form.button(`§dGuide\n§7Learn how to use this`, `textures/azalea_icons/AdvancedGUIs`, (player)=>{

    })
    for(const tabUI of uiBuilder.getTabbedUIs()) {
        form.button(`§a${tabUI.data.title}\n§7${tabUI.data.tabs.length} Tab(s)`, null, (player)=>{
            uiManager.open(player, config.uiNames.UIBuilderTabbedEdit, tabUI.id)
        })
    }
    form.show(player, false, ()=>{})
})