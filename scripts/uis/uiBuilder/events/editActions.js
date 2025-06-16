import uiBuilder from "../../../api/uiBuilder";
import eventsData from "../../../data/eventsData";
import { ActionForm } from "../../../lib/form_func";
import uiManager from "../../../uiManager";
import versionData from "../../../versionData";
import { NUT_UI_TAG } from "../../preset_browser/nutUIConsts";

uiManager.addUI(versionData.uiNames.EventsV2.EditActions, "", (player, id) => {
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}§rEdit Tags`);
    let doc = uiBuilder.db.getByID(id);
    form.button(`Add New Action`, `textures/azalea_icons/1`, (player) => {
        uiManager.open(
            player,
            versionData.uiNames.EventsV2.AddActionTypeSelector,
            doc.data.eventType,
            id
        );
    });
    for (let i = 0; i < doc.data.actions.length; i++) {
        let action = doc.data.actions[i];
        form.button(
            `§b${action.label ? action.label : `Event ${i + 1}`}\n§r§7${
                eventsData[doc.data.eventType].actionTypes[action.type].name
            }`,
            null,
            (player) => {
                uiManager.open(
                    player,
                    versionData.uiNames.EventsV2.EditAction,
                    id,
                    i
                );
            }
        );
    }
    form.show(player, false, (player, response) => {});
});
