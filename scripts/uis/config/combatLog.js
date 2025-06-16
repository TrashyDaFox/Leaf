import configAPI from "../../api/config/configAPI";
import { ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
/*
configAPI.registerProperty("CLog", configAPI.Types.Boolean, true);
configAPI.registerProperty("CLogSecCooldown", configAPI.Types.Number, 10);
configAPI.registerProperty("CLogEnterMessageEnabled", configAPI.Types.Boolean, true);
configAPI.registerProperty("CLogEnterMessage", configAPI.Types.String, "You have entered combat!");
configAPI.registerProperty("CLogExitMessageEnabled", configAPI.Types.Boolean, true);
configAPI.registerProperty("CLogExitMessage", configAPI.Types.String, "You have left combat!");
configAPI.registerProperty("CLogDisableUIs", configAPI.Types.Boolean, true);
configAPI.registerProperty("CLogDisableCommands", configAPI.Types.Boolean, true);
configAPI.registerProperty("CLogKill", configAPI.Types.Boolean, true);
*/
function getNum(str) {
    let num = parseInt(str);
    if (isNaN(num)) return 0;
    return num;
}
uiManager.addUI(versionData.uiNames.CombatLogConfig, "A", (player) => {
    let modalForm = new ModalForm();
    modalForm.title(`Combat Log Config`);
    modalForm.toggle("Enable combat log", configAPI.getProperty("CLog"));
    modalForm.textField(
        "Exit combat cooldown (seconds)",
        "10",
        configAPI.getProperty("CLogSecCooldown").toString()
    );
    modalForm.toggle(
        "Enable enter message",
        configAPI.getProperty("CLogEnterMessageEnabled")
    );
    modalForm.textField(
        "Enter combat message",
        "You have entered combat!",
        configAPI.getProperty("CLogEnterMessage")
    );
    modalForm.toggle(
        "Enable exit message",
        configAPI.getProperty("CLogExitMessageEnabled")
    );
    modalForm.textField(
        "Exit combat message",
        "You have left combat!",
        configAPI.getProperty("CLogExitMessage")
    );
    modalForm.toggle("Disable UIs", configAPI.getProperty("CLogDisableUIs"));
    modalForm.toggle(
        "Disable commands",
        configAPI.getProperty("CLogDisableCommands")
    );
    modalForm.show(player, false, (player, response) => {
        if (response.canceled)
            return uiManager.open(player, versionData.uiNames.Config.Misc);
        configAPI.setProperty("CLog", response.formValues[0]);
        configAPI.setProperty(
            "CLogSecCooldown",
            getNum(response.formValues[1])
        );
        configAPI.setProperty(
            "CLogEnterMessageEnabled",
            response.formValues[2]
        );
        configAPI.setProperty("CLogEnterMessage", response.formValues[3]);
        configAPI.setProperty("CLogExitMessageEnabled", response.formValues[4]);
        configAPI.setProperty("CLogExitMessage", response.formValues[5]);
        configAPI.setProperty("CLogDisableUIs", response.formValues[6]);
        configAPI.setProperty("CLogDisableCommands", response.formValues[7]);

        return uiManager.open(player, versionData.uiNames.Config.Misc);
    });
});
