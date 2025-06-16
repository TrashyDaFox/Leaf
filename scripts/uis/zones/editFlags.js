import zones from "../../api/zones";
import { ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";

// wow gotta love how i coded this in a way where people have like no customization at all and i cant fix it its really nice

uiManager.addUI(
    versionData.uiNames.Zones.EditFlags,
    "Edit Flags",
    (player, id) => {
        let zone = zones.zonesDB.getByID(id);
        let modal = new ModalForm();
        modal.title(`Editing Flags: ${zone.data.name}`);
        for (const flag of zones.flags) {
            modal.toggle(flag, zone.data.flags.includes(flag));
        }
        modal.show(player, false, (player, response) => {
            let newFlags = [];
            for (let i = 0; i < zones.flags.length; i++) {
                if (response.formValues[i]) newFlags.push(zones.flags[i]);
            }
            zones.editFlags(zone.data.name, newFlags);
            uiManager.open(player, versionData.uiNames.Zones.Edit, id);
        });
    }
);
