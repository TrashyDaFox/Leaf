import zones from "../../api/zones";
import { ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";

function nan0(num2) {
    let num = parseInt(num2)
    if(isNaN(num)) return 0;
    return num;
}

uiManager.addUI(versionData.uiNames.Zones.Add, "Add Zone", (player, id = -1)=>{
    let form = new ModalForm();
    let name = "";
    let priority = 1;
    let x1 = 0;
    let y1 = 0;
    let z1 = 0;
    let x2 = 0;
    let y2 = 0;
    let z2 = 0;
    let doc;
    if(id > -1) {
        doc = zones.zonesDB.getByID(id)
        name = doc.data.name;
        priority = doc.data.priority;
        x1 = doc.data.x1;
        x2 = doc.data.x2;
        y1 = doc.data.y1;
        y2 = doc.data.y2;
        z1 = doc.data.z1;
        z2 = doc.data.z2;
    }
    form.textField("Name", "Type a name", name)
    form.slider("Priority", 1, 64, 1, priority)
    form.textField("Start X", " ", x1.toString())
    form.textField("Start Y", " ", y1.toString())
    form.textField("Start Z", " ", z1.toString())
    form.textField("End X", " ", x2.toString())
    form.textField("End Y", " ", y2.toString())
    form.textField("End Z", " ", z2.toString())
    form.show(player, false, (player, response)=>{
        let x1 = nan0(response.formValues[2])
        let y1 = nan0(response.formValues[3])
        let z1 = nan0(response.formValues[4])
        let x2 = nan0(response.formValues[5])
        let y2 = nan0(response.formValues[6])
        let z2 = nan0(response.formValues[7])
        if(id > -1) {
            priority = response.formValues[1];
            if(zones.zonesDB.findFirst({name: response.formValues[0]}) && response.formValues[0] != name) return;
            name = response.formValues[0];
            doc.data.name = name;
            doc.data.priority = priority;
            doc.data.x1 = x1;
            doc.data.x2 = x2;
            doc.data.y1 = y1;
            doc.data.y2 = y2;
            doc.data.z1 = z1;
            doc.data.z2 = z2;
            zones.zonesDB.overwriteDataByID(doc.id, doc.data)
        } else {
            zones.addZone(response.formValues[0], x1, y1, z1, x2, y2, z2, response.formValues[1], [])
        }
        uiManager.open(player, versionData.uiNames.Zones.Root)
    })
})