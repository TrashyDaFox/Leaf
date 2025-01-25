import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.Modal.Root, "rexy is bad", player=>{
    let form = new ActionForm();
    form.title("Modal Forms");
    form.button("New Modal Form", null, (player)=>{
        uiManager.open(player, config.uiNames.Modal.Add)
    })
    form.show(player, false, (player, response)=>{

    })
})