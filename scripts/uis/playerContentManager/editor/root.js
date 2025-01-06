import playerContentManager from "../../../api/v2/playerContentManager";
import config from "../../../config";
import { ActionForm } from "../../../lib/form_func";
import uiManager from "../../../uiManager";

uiManager.addUI(config.uiNames.PlayerContentManager.Root, "PCM Root", (player)=>{
    let form = new ActionForm();
    form.button("Add Content Dump", null, (player)=>{

    });
    for(const dump of playerContentManager.getContentDumps()) {
        form.button(`${dump.data.name}`, null, (player)=>{

        })
    }
    form.show(player, false, ()=>{})
})