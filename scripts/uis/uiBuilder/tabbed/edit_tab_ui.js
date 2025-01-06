import { world } from "@minecraft/server";
import config from "../../../config";
import { ActionForm } from "../../../lib/form_func";
import uiManager from "../../../uiManager";
import uiBuilder from "../../../api/uiBuilder";

uiManager.addUI(config.uiNames.UIBuilderTabbedEdit, "dsfv", (player, id)=>{
    let form = new ActionForm();
    form.button(`§cDelete Tabbed UI\n§7Permanently deletes this tab UI`, null, (player)=>{
        uiManager.open(player, config.uiNames.Basic.Confirmation, "Are you sure you want to delete this tabbed UI?", ()=>{
            uiBuilder.deleteTabbedUI(id);
            uiManager.open(player, config.uiNames.UIBuilderTabbed)
        }, ()=>{
            uiManager.open(player, config.uiNames.UIBuilderTabbedEdit, id);
        })
    })
    form.button("§dEdit Tabs\n§7Add/remove tabs", null, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderTabbedEditTabs, id);
    })
    form.show(player, false, ()=>{})
})