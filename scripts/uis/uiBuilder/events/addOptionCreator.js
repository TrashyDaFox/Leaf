import uiBuilder from "../../../api/uiBuilder";
import eventsData from "../../../data/eventsData";
import { ModalForm } from "../../../lib/form_func";
import uiManager from "../../../uiManager";
import versionData from "../../../versionData";

uiManager.addUI(versionData.uiNames.EventsV2.AddOptionCreator, "", (player, id)=>{
    let modalForm = new ModalForm();
    let doc = uiBuilder.db.getByID(id);
    let event = eventsData[doc.data.eventType];
    for(const opt of event.initOptions) {
        if(opt.type == "toggle") {
            modalForm.toggle(opt.display, doc.data.opts[opt.name] ? true : false)
        } else {
            modalForm.textField(opt.display, " ", doc.data.opts[opt.name] ? doc.data.opts[opt.name] : "")
        }
    }
    modalForm.show(player, false, (player, response)=>{
        for(let i = 0;i < response.formValues.length;i++) {
            doc.data.opts[event.initOptions[i].name] = response.formValues[i]
        }
        uiManager.open(player, versionData.uiNames.UIBuilderEdit, id)
        uiBuilder.db.overwriteDataByID(doc.id, doc.data)
    })
})