import { prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";
import config from '../../versionData'
import { ActionForm } from "../../lib/form_func";
import icons from "../../api/icons";
import { world } from '@minecraft/server'
uiManager.addUI(config.uiNames.RoleEditor.Edit, "edit roles OwO", (player)=>{ // what am i even supposed to add
    let form = new ActionForm();
    form.button("§dDelete role\n§7delete stuff frfr", icons.resolve("loading"), (player)=>{
        let role = "Placeholder Role" // make a system to add the role later ig i think
        prismarineDb.permissions.deleteRole(`${role}`)
    }),
    form.button("§dEdit perms\n§7edit stuff frfr", icons.resolve("loading"), (player)=>{
        uiManager.open(player, config.uiNames.RoleEditor.EditPerms)
    })
    form.button("§dEdit tags\n§7edit stuff frfr", icons.resolve("loading"), (player)=>{
        uiManager.open(player, config.uiNames.RoleEditor.EditTags)
    })
    form.show(player) // i need help, its not wokring the open ui thing
})