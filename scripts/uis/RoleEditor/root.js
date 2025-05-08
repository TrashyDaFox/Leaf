import { prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";
import config from '../../versionData'
import { ActionForm } from "../../lib/form_func";
import icons from "../../api/icons";
import { world } from '@minecraft/server'
import { NUT_UI_TAG } from "../preset_browser/nutUIConsts";
// prismarineDb.permissions.createRole
// prismarineDb.permissions.getPerms
// prismarineDb.permissions.deleteRole
uiManager.addUI(config.uiNames.RoleEditor.Root, "roles OwO", (player)=>{ // what am i even supposed to add
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}§rRole Editor`)
    form.button(`§aAdd Role\n§7Add a role`, null, (player)=>{

    })
    form.show(player)
})