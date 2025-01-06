import { prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";
import config from '../../config'
import { ActionForm } from "../../lib/form_func";
import icons from "../../api/icons";
import { world } from '@minecraft/server'
// prismarineDb.permissions.createRole
// prismarineDb.permissions.getPerms
// prismarineDb.permissions.deleteRole
uiManager.addUI(config.uiNames.RoleEditor.Root, "roles OwO", (player)=>{ // what am i even supposed to add
    let form = new ActionForm();
    form.button("§dAdd roles", icons.resolve("loading"), (player)=>{
        uiManager.open(player, config.uiNames.RoleEditor.Add)
    }),
    form.button("§dEdit roles", icons.resolve("loading"), (player)=>{
        uiManager.open(player, config.uiNames.RoleEditor.Edit) 
    })
    form.show(player)
})