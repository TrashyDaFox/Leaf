import { prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";
import config from "../../versionData";
import { ActionForm, ModalForm } from "../../lib/form_func";
import icons from "../../api/icons";
import { world } from "@minecraft/server";
import versionData from "../../versionData";
uiManager.addUI(config.uiNames.RoleEditor.Add, "edit roles OwO", (player) => {
    let modal = new ModalForm();
    modal.title(`Create Role`)
    modal.textField("Role Tag", "Set this role tag", "")
    modal.show(player, false, (player, response)=>{
        if(response.canceled || !response.formValues[0]) return uiManager.open(player, versionData.uiNames.RoleEditor.Root)
        prismarineDb.permissions.createRole(response.formValues[0])
        return uiManager.open(player, versionData.uiNames.RoleEditor.Root)
    })
});
