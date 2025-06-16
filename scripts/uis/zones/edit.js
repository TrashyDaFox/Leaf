import zones from "../../api/zones";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import {
    NUT_UI_HEADER_BUTTON,
    NUT_UI_TAG,
} from "../preset_browser/nutUIConsts";

uiManager.addUI(versionData.uiNames.Zones.Edit, "A", (player, id) => {
    let zone = zones.zonesDB.getByID(id);
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}§rEdit Zone: ${zone.data.name}`);
    form.button(
        `${NUT_UI_HEADER_BUTTON}§r§cBack`,
        `textures/azalea_icons/2`,
        (player) => {
            uiManager.open(player, versionData.uiNames.Zones.Root);
        }
    );
    form.button(
        `§eEdit Properites\n§7Edit area and priority`,
        null,
        (player) => {
            uiManager.open(player, versionData.uiNames.Zones.Add, id);
        }
    );
    form.button(`§dEdit Flags\n§7Edit this zones flags`, null, (player) => {
        uiManager.open(player, versionData.uiNames.Zones.EditFlags, id);
    });
    form.button(
        `§cDelete\n§7Delete this zone`,
        `textures/azalea_icons/Delete`,
        (player) => {
            uiManager.open(
                player,
                versionData.uiNames.Basic.Confirmation,
                "Are you sure you want to delete this zone?",
                () => {
                    zones.zonesDB.deleteDocumentByID(id);
                    uiManager.open(player, versionData.uiNames.Zones.Root);
                },
                () => {
                    uiManager.open(player, versionData.uiNames.Zones.Edit, id);
                }
            );
        }
    );
    form.show(player, false, (player, response) => {});
});
