import configAPI from "../../api/config/configAPI";
import emojis from "../../api/emojis";
import config from "../../versionData";
import { ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import { prismarineDb } from "../../lib/prismarinedb";
import commandManager from "../../api/commands/commandManager";
import { system } from "@minecraft/server";
import { NUT_UI_MODAL } from "../preset_browser/nutUIConsts";
system.runTimeout(()=>{
    prismarineDb.permissions.GET_RAW_DB().waitLoad().then(()=>{
        let defaultRole = prismarineDb.permissions.getRole("default")
        let oldPerms = prismarineDb.permissions.getPerms("default")
        for(const perm of [
            ...config.permissionList.perms,
            ...commandManager.getCmdPerms()
        ]) {
            if(!oldPerms.hasOwnProperty(perm[1])) {
                oldPerms[perm[1]] = config.permissionList.defaultPermissions.includes(perm[1]) ? true : false;
            }
        }
        // console.warn(JSON.stringify(oldPerms))
        prismarineDb.permissions.setPerms("default", oldPerms)
    })    
},2)
uiManager.addUI(config.uiNames.RoleEditor.EditPerms, "Edit Perms", (player, role) => {
    let modalForm = new ModalForm();
    modalForm.title(`${NUT_UI_MODAL}Edit perms`);
    let rolePerms = prismarineDb.permissions.getPerms(role)
    let permsList = [
        ...config.permissionList.perms,
        ...commandManager.getCmdPerms()
    ]
    for(const perm of permsList) {
        modalForm.toggle(`§f${perm[0]} §7(${perm[1]})`, rolePerms[perm[1]] ? true : false)
    }
    modalForm.show(player, false, (player, response) => {
        if (response.canceled)
            return uiManager.open(player, config.uiNames.RoleEditor.Edit, role);

        for(let i = 0;i < permsList.length;i++) {
            let perm = permsList[i];
            rolePerms[perm[1]] = response.formValues[i]
        }

        prismarineDb.permissions.setPerms(role, rolePerms)

        return uiManager.open(player, config.uiNames.RoleEditor.Edit, role);
    });
});
