import configAPI from "../../api/config/configAPI";
import { ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import config from "../../config";

uiManager.addUI(config.uiNames.Config.ChatrankFormat, "Chat rank format editor", (player)=>{
    let modalForm = new ModalForm();
    modalForm.title("Code Editor");
    modalForm.textField("Chat rank format", "Type a chat rank format here", configAPI.getProperty("chatformat"));
    modalForm.show(player, false, (player, response)=>{
        if(response.canceled) return uiManager.open(player, config.uiNames.ConfigRoot)
        configAPI.setProperty("chatformat", response.formValues[0]);
        uiManager.open(player, config.uiNames.ConfigRoot)
    })
})