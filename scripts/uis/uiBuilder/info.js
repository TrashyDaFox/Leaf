import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import emojis from '../../api/emojis'

uiManager.addUI(config.uiNames.UIBuilderInfo, "a", (player)=>{
    let form = new ActionForm();
    form.title("§t§a§b§b§e§d§r§fInfo")
    form.button(`§t§a§b§r§f\uE180 UIs`, null, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderRoot)
    })
    // form.button(`§t§a§b§r§f${emojis.axolotl_bucket} Presets`, null, (player)=>{

    // })
    form.button(`§t§a§b§r§f\uE17E Tab UIs`, null, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderTabbed)

    })
    form.button(`§t§a§b§a§c§t§i§v§e§r§f\uE17F Info`, null, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderInfo)
    })
    form.body("§eLeaf Essentials UI Builder\n\n§fEnhanced UI Builder Experiment: §aEnabled\n§fVersion: §a2.0\n\n§bMade by TheLegendaryTrashcan")
    form.show(player, false, (player, response)=>{

    })
})