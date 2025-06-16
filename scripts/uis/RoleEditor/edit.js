import { prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";
import config from "../../versionData";
import { ActionForm } from "../../lib/form_func";
import icons from "../../api/icons";
import { world } from "@minecraft/server";
import configAPI from "../../api/config/configAPI";
import { NUT_UI_TAG } from "../preset_browser/nutUIConsts";
uiManager.addUI(config.uiNames.RoleEditor.Edit, "edit roles OwO", (player, role) => {
    // what am i even supposed to add
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}§rEdit role: ${role}`)
    let role2 = prismarineDb.permissions.getRole(role).data;
    if((!role2.default && !role2.defaultAdmin)) {
        form.button(
            "§bDelete role\n§7Delete this role",
            icons.resolve("loading"),
            (player) => {
                uiManager.open(player, config.uiNames.Basic.Confirmation, "Are you sure you want to delete this role?", ()=>{
                    prismarineDb.permissions.deleteRole(`${role}`);
                    uiManager.open(player, config.uiNames.RoleEditor.Root)
                }, ()=>{
                    uiManager.open(player, config.uiNames.RoleEditor.Edit, role)
                })
            }
        );
    }
    if(!role2.defaultAdmin) {
        form.button(
            "§aEdit perms\n§7Edit this roles perms",
            icons.resolve("loading"),
            (player) => {
                uiManager.open(player, config.uiNames.RoleEditor.EditPerms, role);
            }
        );
    }
    if(!role2.defaultAdmin && !role2.default) {
        form.divider();
        form.label("§cDanger Zone")
        if(!role2.isAdmin) {
            form.button(
                "§eMake admin role\n§7Make this role an admin role",
                icons.resolve("loading"),
                (player) => {
                    uiManager.open(player, config.uiNames.Basic.Confirmation, `Are you sure you want to make role: ${role} an admin?`, ()=>{
                        prismarineDb.permissions.setAdmin(role, true)
                        uiManager.open(player, config.uiNames.RoleEditor.Edit, role);
                    }, ()=>{
                        uiManager.open(player, config.uiNames.RoleEditor.Edit, role);
                    });
                }
            );
        } else {
            form.button(
                "§cRevoke admin perms\n§7Remove admin perms from this role",
                icons.resolve("loading"),
                (player) => {
                    prismarineDb.permissions.setAdmin(role, false)
                    uiManager.open(player, config.uiNames.RoleEditor.Edit, role);
                }
            );
        }
    }
    // form.button(
    //     "§dEdit tags\n§7edit stuff frfr",
    //     icons.resolve("loading"),
    //     (player) => {
    //         uiManager.open(player, config.uiNames.RoleEditor.EditTags);
    //     }
    // );
    form.show(player); // i need help, its not wokring the open ui thing
});
