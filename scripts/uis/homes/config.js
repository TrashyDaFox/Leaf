import configAPI from "../../api/config/configAPI";
import homes from "../../api/homes";
import { ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";

uiManager.addUI(versionData.uiNames.Homes.Config, "MEOW MRRP", (player)=>{
    let modalForm = new ModalForm();
    modalForm.title("Homes Config")
    modalForm.slider("Home Limit", 1, 32, 1, configAPI.getProperty("HomesLimit"))
    modalForm.toggle("Azalea Style Shared Homes", configAPI.getProperty("AzaleaStyleSharedHomes"), ()=>{}, `&7When &aenabled&7, shared homes appear in one list as &aOWNER &7/ &aHOME_NAME&7.\n&7When &cdisabled&7, they go in a separate &9Shared Homes&7 menu.`.replaceAll('&', '§'))
    modalForm.show(player, false, (player, response)=>{
        if(response.canceled) return uiManager.open(player, versionData.uiNames.Config.Misc)
        configAPI.setProperty("HomesLimit", response.formValues[0])
        configAPI.setProperty("AzaleaStyleSharedHomes", response.formValues[1])
        return uiManager.open(player, versionData.uiNames.Config.Misc)
    })
})