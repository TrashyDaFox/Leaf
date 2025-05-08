import ranks from "../../api/ranks";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import { NUT_UI_TAG } from "../preset_browser/nutUIConsts";

uiManager.addUI(versionData.uiNames.ChatRanks.Ranks.Edit, '', (player)=>{
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}§rEdit Ranks`)
    form.button(`§aAdd Rank\n§7Create a rank`, `textures/azalea_icons/1`, (player)=>{
        uiManager.open(player, versionData.uiNames.ChatRanks.Ranks.AddRank)
    })
    for(const rank of ranks.getRanks()) {
        form.button(`§f${rank.name}\n§r§7${rank.tag} §r§f| §7Priority: ${rank.priority}`, null, (player)=>{
            let form2 = new ActionForm();
            form2.title(`${NUT_UI_TAG}§rEdit Rank`)
            form2.button(`§cDelete\n§7Delete this rank`, `textures/azalea_icons/Delete`, (player)=>{
                uiManager.open(player, versionData.uiNames.Basic.Confirmation, "Are you sure you want to delete this rank?", ()=>{
                    ranks.deleteRank(rank.tag)
                    uiManager.open(player, versionData.uiNames.ChatRanks.Ranks.Edit)
                }, ()=>{
                    uiManager.open(player, versionData.uiNames.ChatRanks.Ranks.Edit)
                })
            })
            form2.button(`§eEdit\n§7Edit this rank`, `textures/azalea_icons/Pencil`, (player)=>{
                uiManager.open(player, versionData.uiNames.ChatRanks.Ranks.AddRank, rank.tag)
            })
            form2.show(player, false, ()=>{})
        })
    }
    form.show(player, false, ()=>{})
})