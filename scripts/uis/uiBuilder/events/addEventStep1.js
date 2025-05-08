import uiBuilder from "../../../api/uiBuilder";
import eventsData from "../../../data/eventsData";
import { ActionForm } from "../../../lib/form_func";
import uiManager from "../../../uiManager";
import versionData from "../../../versionData";

uiManager.addUI(versionData.uiNames.EventsV2.AddStepSelector, "add", (player)=>{
    let form = new ActionForm();
    form.title("Add new event")
    for(let i = 0;i < eventsData.length;i++) {
        let event = eventsData[i]
        form.button(`§a${event.name}\n§7${event.type == 0 ? "Minecraft Event" : event.type == 1 ? "Leaf Event" : "Unknown Event"}`, null, (player)=>{
            let initOpts = {};
            for(const _ of event.initOptions) {
                initOpts[_.name] = _.type == "toggle" ? false : _.type == "condition" ? "" : ""
            }
            let id = uiBuilder.db.insertDocument({
                type: 10,
                eventType: i,
                actions: [],
                opts: initOpts,
                actions: []
            })
            uiManager.open(player, versionData.uiNames.EventsV2.AddOptionCreator, id)
        })
    }
    form.show(player, false, (player, response)=>{

    })
})