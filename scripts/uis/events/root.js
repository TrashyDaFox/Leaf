import events from '../../api/events';
import config from '../../config';
import { ActionForm, ModalForm } from '../../lib/form_func';
import uiManager from '../../uiManager';
uiManager.addUI(config.uiNames.Events.EventsAdd, "A", (player, data = {})=>{
    if(data.id || data.type) {
        let type = data.type;
        if(data.id) {
            let doc = events.eventsDb.getByID(data.id);
            data = {...data, ...doc.data};
            type = doc.data.type;
        }
        if(type == "KILL") {
            let modalForm = new ModalForm();
            modalForm.textField("Comment§c* - Display name for this command", "/say hi", data.comment ? data.comment : undefined);
            modalForm.textField("Command - Command to run on the player who was killed", "/say hi", data.command ? data.command : undefined);
            modalForm.textField("Self Command - Command to run on the player who killed another player", "/say hi", data.commandSelf ? data.commandSelf : undefined);
            modalForm.show(player, false, (player, response)=>{
                if(!response.formValues[0]) return;
                if(data.id) {
                    let doc = events.eventsDb.getByID(data.id);
                    doc.data.comment = response.formValues[0];
                    doc.data.command = response.formValues[1];
                    doc.data.commandSelf = response.formValues[2];
                    events.eventsDb.overwriteDataByID(doc.id, doc.data);
                } else {
                    events.addKillEvent(response.formValues[0], response.formValues[1], response.formValues[2]);
                }
                uiManager.open(player, config.uiNames.Events.EventsRoot)
            })
        } else if(type == "DEATH") {
            let modalForm = new ModalForm();
            modalForm.textField("Comment§c* - Display name for this command", "/say hi", data.comment ? data.comment : undefined);
            modalForm.textField("Command - Command to run on the player who was killed", "/say hi", data.command ? data.command : undefined);
            modalForm.show(player, false, (player, response)=>{
                if(!response.formValues[0]) return;
                if(data.id) {
                    let doc = events.eventsDb.getByID(data.id);
                    doc.data.comment = response.formValues[0];
                    doc.data.command = response.formValues[1];
                    events.eventsDb.overwriteDataByID(doc.id, doc.data);
                } else {
                    events.addDeathEvent(response.formValues[0], response.formValues[1]);

                }
                uiManager.open(player, config.uiNames.Events.EventsRoot)
            })
        }
    } else {
        let form = new ActionForm();
        form.button("Kill Event", null, (player)=>{
            data.type = "KILL";
            uiManager.open(player, config.uiNames.Events.EventsAdd, data);
        })
        form.button("Death Event", null, (player)=>{
            data.type = "DEATH";
            uiManager.open(player, config.uiNames.Events.EventsAdd, data);
        })
        form.show(player, false, (player, response)=>{

        })
    }
})
uiManager.addUI(config.uiNames.Events.EventsRoot, "Events Root", (player)=>{
    let form = new ActionForm();
    form.button(`§2Add Event\n§7Add an event`, null, (player)=>{
        uiManager.open(player, config.uiNames.Events.EventsAdd, {})
    })
    for(const event of events.eventsDb.data) {
        form.button(`§b${event.data.comment}\n§7${event.data.type == "KILL" ? "Kill Event" : "Death Event"}`, null, (player)=>{
            uiManager.open(player, config.uiNames.Events.EventsAdd, {id: event.id})
        })
    }
    form.show(player, false, (player, response)=>{

    })
})