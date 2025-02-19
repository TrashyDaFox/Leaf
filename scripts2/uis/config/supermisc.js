import configAPI from "../../api/config/configAPI";
import config from "../../versionData";
import { ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

configAPI.registerProperty("disable_entity_property_editor_on_player_bugfix", configAPI.Types.Boolean, false);
configAPI.registerProperty("enable_leaf_dev_server_features", configAPI.Types.Boolean, false);
configAPI.registerProperty("leaf_dev_server_features_password", configAPI.Types.String, "1234");
uiManager.addUI(config.uiNames.SuperMisc, "Super Misc", (player)=>{
    let form = new ModalForm();
    form.toggle("Disable Entity Property Editor on Player Bugfix (Legacy Toggle)", configAPI.getProperty("disable_entity_property_editor_on_player_bugfix"));
    form.toggle("Enable Leaf Dev Server Features", configAPI.getProperty("enable_leaf_dev_server_features"));
    form.show(player, false, (player, response)=>{
        if(response.canceled) return uiManager.open(player, config.uiNames.Config.Misc);
        configAPI.setProperty("disable_entity_property_editor_on_player_bugfix", response.formValues[0]);
        if(response.formValues[1] && !configAPI.getProperty("enable_leaf_dev_server_features")) {
            let form2 = new ModalForm();
            form2.textField("Enter the password to disable Leaf Dev Server Features", "this will be used to disable later");
            form2.show(player, false, (player, response2)=>{
                if(response2.canceled) return uiManager.open(player, config.uiNames.Config.Misc);
                configAPI.setProperty("enable_leaf_dev_server_features", true);
                configAPI.setProperty("leaf_dev_server_features_password", response2.formValues[0]);
                uiManager.open(player, config.uiNames.Config.Misc);
            })
            return;
        } else if(!response.formValues[1] && configAPI.getProperty("enable_leaf_dev_server_features")) {
            let form2 = new ModalForm();
            form2.textField("Enter the password to disable Leaf Dev Server Features", "this will be used to disable later");
            form2.show(player, false, (player, response2)=>{
                if(response2.canceled) return uiManager.open(player, config.uiNames.Config.Misc);
                if(response2.formValues[0] !== configAPI.getProperty("leaf_dev_server_features_password")) {
                    player.sendMessage("§cIncorrect password");
                    return uiManager.open(player, config.uiNames.Config.Misc)
                };
                configAPI.setProperty("enable_leaf_dev_server_features", false);
                uiManager.open(player, config.uiNames.Config.Misc);
            })
            return;
        }
        uiManager.open(player, config.uiNames.Config.Misc);
    })
})