import { prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";
import config from "../../versionData";
import { ActionForm } from "../../lib/form_func";
import icons from "../../api/icons";
import { world } from "@minecraft/server";
import { NUT_UI_TAG } from "../preset_browser/nutUIConsts";
import { MessageFormData } from "@minecraft/server-ui";
// prismarineDb.permissions.createRole
// prismarineDb.permissions.getPerms
// prismarineDb.permissions.deleteRole
uiManager.addUI(config.uiNames.RoleEditor.Root, "roles OwO", (player) => {
    // what am i even supposed to add
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}§rRole Editor`);
    form.button(`§aAdd Role\n§7Add a role`, null, (player) => {
        uiManager.open(player, config.uiNames.RoleEditor.Add)
    });
    for(const role of prismarineDb.permissions.getRoles()) {
        form.button(`§b${role.tag}\n§7${role.default ? "Default Role" : role.defaultAdmin ? "Default Admin Role" : role.isAdmin ? "Admin Role" : "Normal Role"}`, null, (player)=>{
            if(role.defaultAdmin) {
                new MessageFormData().title("Cant edit").body("Leaf does not allow editing the default admin role.").button1("Back").button2("Back").show(player).then(()=>{
                    uiManager.open(player, config.uiNames.RoleEditor.Root)
                })
                return;
            }
            uiManager.open(player, config.uiNames.RoleEditor.Edit, role.tag)
        })
    }
    form.show(player);
});
