import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.Crates.Root, "Crates Root", (player)=>{
    let form = new ActionForm();
    form.title(`§g§r§i§d§u§i§r§9Crates`);
    form.button(`§aNew Crate`, `textures/azalea_icons/1`, (player)=>{

    });
    form.show(player, false, ()=>{
        
    })
})