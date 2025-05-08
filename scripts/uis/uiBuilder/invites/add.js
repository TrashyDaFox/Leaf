import uiBuilder from "../../../api/uiBuilder";
import { ModalForm } from "../../../lib/form_func";
import uiManager from "../../../uiManager";
import versionData from "../../../versionData";

uiManager.addUI(versionData.uiNames.InviteManager.Add, "", (player, id = -1)=>{
    let doc = id > -1 ? uiBuilder.db.getByID(id) : null;
    let modal = new ModalForm();
    modal.title("Add Invite")
    modal.textField("Unique ID", "A unique ID for your invite", doc ? doc.data.identifier : "")
    modal.textField("Expiration Time (in ticks)", "", doc ? doc.data.expirationTime.toString() : "1200")
    modal.show(player, false, (player, response)=>{
        let int = parseInt(response.formValues[1])
        let exp = isNaN(int) ? 0 : int
        if(doc) {
            doc.data.identifier = response.formValues[0];
            doc.data.expirationTime = exp;
        } else {
            uiBuilder.createNewInvite(response.formValues[0], exp)
        }
    })
})