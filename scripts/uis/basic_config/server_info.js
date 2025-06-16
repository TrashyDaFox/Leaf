import configAPI from "../../api/config/configAPI";
import { ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import { NUT_UI_MODAL } from "../preset_browser/nutUIConsts";

configAPI.registerProperty("ServerName", configAPI.Types.String, "");

uiManager.addUI(versionData.uiNames.ServerInfo, "", (player) => {
    let modal = new ModalForm();
    modal.title(`${NUT_UI_MODAL}§r§fServer Info`);
    modal.textField(
        `Server Name`,
        `Type your server name`,
        configAPI.getProperty("ServerName")
    );
    modal.submitButton("Save");
    modal.show(player, false, (player, response) => {
        if (response.canceled)
            return uiManager.open(player, versionData.uiNames.ConfigMain);
        configAPI.setProperty("ServerName", response.formValues[0]);
        uiManager.open(player, versionData.uiNames.ConfigMain);
    });
});
