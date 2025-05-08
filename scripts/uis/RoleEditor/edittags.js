import configAPI from "../../api/config/configAPI";
import emojis from "../../api/emojis";
import config from "../../versionData";
import { ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

// configAPI.registerProperty("Clans", configAPI.Types.Boolean, true);
// configAPI.registerProperty("LandClaims", configAPI.Types.Boolean, true);
// configAPI.registerProperty("Generators", configAPI.Types.Boolean, false);
// configAPI.registerProperty("Shops", configAPI.Types.Boolean, true);
// configAPI.registerProperty("PlayerShops", configAPI.Types.Boolean, true);
// configAPI.registerProperty("ExtendedUIBuilder", configAPI.Types.Boolean, false);
// configAPI.registerProperty("ExperimentalChatRankFormatting", configAPI.Types.Boolean, false);
// configAPI.registerProperty("Chatranks", configAPI.Types.Boolean, true);
// configAPI.registerProperty("DevMode", configAPI.Types.Boolean, false);
uiManager.addUI(config.uiNames.RoleEditor.EditTags, "Edit Tags", (player)=>{
    let modalForm = new ModalForm();
    modalForm.title("Edit tags");
    modalForm.toggle("example")
    modalForm.toggle("example")
    modalForm.toggle(`§aexample ${emojis.potion48}`)
    modalForm.toggle("example")
    modalForm.toggle("example")
    modalForm.toggle(`§aexample ${emojis.potion48}`)
    modalForm.toggle(`§aexample ${emojis.potion48}`)
    modalForm.toggle(`example`)
    modalForm.toggle(`§bexample ${emojis.potion49}`)
    modalForm.show(player, false, (player, response)=>{
        if(response.canceled) return uiManager.open(player, config.uiNames.RoleEditor.Edit);
        
        return uiManager.open(player, config.uiNames.RoleEditor.Edit);
    })
})