import { prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";
import config from '../../config'
import { ActionForm } from "../../lib/form_func";
import icons from "../../api/icons";
import { world } from '@minecraft/server'
uiManager.addUI(config.uiNames.RoleEditor.Add, "edit roles OwO", (player)=>{ // what am i even supposed to add
    let form = new ActionForm();
    form.button("§dAdd role", icons.resolve("loading"), (player)=>{
        let role = "Placeholder Role"
        prismarineDb.permissions.createRole("Placeholder Role")
    }),
    form.button("§dAdd admin role", icons.resolve("loading"), (player)=>{
        let adminRole = "Placeholder Admin Role"
        prismarineDb.permissions.createRole(`${adminRole}`)
        prismarineDb.permissions.setAdmin(`${adminRole}`, true)
    }),
    form.show(player) 
})