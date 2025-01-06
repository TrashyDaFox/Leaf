// Added in v0.1
import { system, world } from "@minecraft/server";
import icons from "../../api/icons";
import uiBuilder from "../../api/uiBuilder";
import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import http from "../../networkingLibs/currentNetworkingLib";
import uiManager from "../../uiManager";
import moment from '../../lib/moment'
import emojis from '../../api/emojis'
import { ChestFormData } from "../../lib/chestUI"
uiManager.addUI(config.uiNames.UIBuilderRoot, "UI Builder Root", (player)=>{
    let form = new ActionForm();
    form.title("§t§a§b§b§e§d§r§fUIs");
    form.button(`§t§a§b§a§c§t§i§v§e§r§f\uE180 UIs`, null, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderRoot)
    })
    // form.button(`§t§a§b§r§f${emojis.axolotl_bucket} Presets`, null, (player)=>{

    // })
    form.button(`§t§a§b§r§f\uE17E Tab UIs`, null, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderTabbed)

    })
    form.button(`§t§a§b§r§f\uE17F Info`, null, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderInfo)
    })
    form.button(`§aAdd\n§r§7Add a UI`, `textures/azalea_icons/1`, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderAdd);
    })
    form.button(`§6Folders\n§7Organize your UIs`, `textures/azalea_icons/Logs`, player=>{

    })
    // form.button(`§6Create Category\n§r§7Create a folder for your UIs`, icons.resolve("^textures/items/name_tag"), (player)=>{
    //     uiManager.open(player, config.uiNames.UIBuilderAdd);
    // })
    // form.button(`§2Leaf GUIs\n§r§7Edit some built-in GUIs in leaf`, icons.resolve("leaf/image-0884"), (player)=>{
    //     uiManager.open(player, config.uiNames.UIBuilderAdd);
    // })
    // form.button(`§6Search\n§r§7Search your UIs`, icons.resolve("Packs/Asteroid/spyglass_flat"), (player)=>{
    //     uiManager.open(player, config.uiNames.UIBuilderSearch);
    // })
    if(http.player) {
        form.button(`§aBrowse\n§r§7Browse global GUIs`, icons.resolve("leaf/image-806"), (player)=>{
            http.makeRequest({
                method: 'get',
                url: `${config.Endpoint}/guis/list`
            }, (status, data)=>{
                system.run(()=>{
                    uiManager.open(player, config.uiNames.OnlineGUIsList, data, "main")
                })
            })
        })
    }
    for(const ui of uiBuilder.getUIs().sort((a,b)=>b.updatedAt-a.updatedAt)) {
        form.button(`§b${ui.data.name}\n§r§7${emojis.clock} Updated ${moment(ui.updatedAt).fromNow()}${ui.data.scriptevent.length <= 16 ? ` §f| §7${emojis.chat} ${ui.data.scriptevent}` : ``}`, `textures/azalea_icons/ClickyClick`, (player)=>{
            uiManager.open(player, config.uiNames.UIBuilderEdit, ui.id)
        })
    }
    form.show(player, false, ()=>{})
    // let chestForm = new ChestFormData("45");
    // for(let i = 0;i < 9;i++) {
    //     chestForm.button(i, "§c§lX", [], `textures/blocks/glass_gray`);
    // }
    // for(let i = 36;i < 45;i++) {
    //     chestForm.button(i, "§c§lX", [], `textures/blocks/glass_gray`);
    // }

    // chestForm.show(player)
    // let actionForm = new ActionForm();
    // actionForm.title("§f§u§l§l§s§c§r§e§e§n§r§cGUIs");
    // actionForm.button("§a§lAdd a form\n§7Create a UI", icons.resolve("leaf/image-740"), (player)=>{

    // })
})