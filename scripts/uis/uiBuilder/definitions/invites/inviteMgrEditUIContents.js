import uiManager from "../../../../uiManager";
import versionData from "../../../../versionData";

export default {
    extendEditButtons(actionForm, doc) {
        let id = doc.id;
        if (doc.data.type == 11) {
            actionForm.button(`§bEdit General\n§7Edit expiration and unique id`, `textures/azalea_icons/other/pencil`, (player)=>{
                uiManager.open(
                    player,
                    versionData.uiNames.InviteManager.Add,
                    doc.id
                )
            })
            actionForm.button(
                `§cEdit Deny Actions\n§7Edit actions when receiver declines`,
                `textures/azalea_icons/other/delete`,
                (player) => {
                    uiManager.open(
                        player,
                        versionData.uiNames.InviteManager.EditActions,
                        doc.id,
                        "denyActions"
                    );
                }
            );
            actionForm.button(
                `§aEdit Accept Actions\n§7Edit actions when receiver accepts`,
                `textures/azalea_icons/other/accept`,
                (player) => {
                    uiManager.open(
                        player,
                        versionData.uiNames.InviteManager.EditActions,
                        doc.id,
                        "acceptActions"
                    );
                }
            );
            actionForm.button(
                `§6Edit Expiration Actions\n§7Edit actions when invite expires`,
                `textures/azalea_icons/other/clock`,
                (player) => {
                    uiManager.open(
                        player,
                        versionData.uiNames.InviteManager.EditActions,
                        doc.id,
                        "expireActions"
                    );
                }
            );
            actionForm.button(
                `§bEdit Send Actions\n§7Edit actions when invite is sent`,
                `textures/azalea_icons/other/platform`,
                (player) => {
                    uiManager.open(
                        player,
                        versionData.uiNames.InviteManager.EditActions,
                        doc.id,
                        "sendActions"
                    );
                }
            );
        }
    },
};
