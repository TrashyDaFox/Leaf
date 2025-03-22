import { system, world } from "@minecraft/server";
import { ModalForm } from "../lib/form_func";
import http from "../networkingLibs/currentNetworkingLib";
import uiManager from "../uiManager";
import versionData from "../versionData";
system.afterEvents.scriptEventReceive.subscribe(e=>{
    if(e.id == "mcbetools:logout") {
        e.sourceEntity.setDynamicProperty("MCBEToolsToken", "")
    }
})
uiManager.addUI(versionData.uiNames.MCBEToolsAuth, "Asd", (player, tokenCallback, step = 0, email, password)=>{
    system.run(()=>{
        if(step == 0) {
            if(player.getDynamicProperty("MCBEToolsToken")) return tokenCallback(player.getDynamicProperty("MCBEToolsToken"))
            let form = new ModalForm();
            form.title("Log into MCBETools")
            form.textField("Create an account at https://mcbetools.com\n\nEmail", "Email")
            form.textField("Password", "Password")
            form.show(player, false, (player, response)=>{
                if(response.canceled) return;
                http.makeRequest({
                    method: "post",
                    url: `${versionData.Endpoint}/login`,
                    data: {
                        email: response.formValues[0],
                        password: response.formValues[1],
                    }
                }, (status, res)=>{
                    // world.sendMessage(status)
                    let data = JSON.parse(res);
                    if(!data.error) {
                        player.setDynamicProperty("MCBEToolsToken", data.token)
                        tokenCallback(data.token)
                        return;
                    }
                    if(data.errorCode == 5) {
                        uiManager.open(player, versionData.uiNames.MCBEToolsAuth, tokenCallback, 1, response.formValues[0], response.formValues[1])
                    } else if(data.error) {
                        player.error(data.message)
                        uiManager.open(player, versionData.uiNames.MCBEToolsAuth, tokenCallback, step, email, password)
                    }
                    // world.sendMessage(res)
                })
        
            })
        }
        if(step == 1) {
            let form = new ModalForm();
            form.title("§r2FA")
            form.textField("2FA Code", "123456")
            form.show(player, false, (player, response)=>{
                if(response.canceled) return;
                http.makeRequest({
                    method: "post",
                    url: `${versionData.Endpoint}/login`,
                    data: {
                        email: email,
                        password: password,
                        totptoken: response.formValues[0]
                    }
                }, (status, res)=>{
                    // world.sendMessage(status)
                    let data = JSON.parse(res);
                    if(!data.error) {
                        player.setDynamicProperty("MCBEToolsToken", data.token)
                        tokenCallback(data.token)
                        return;
                    }
                    if(data.errorCode == 5) {
                        uiManager.open(player, versionData.uiNames.MCBEToolsAuth,tokenCallback, 1, response.formValues[0], response.formValues[1])
                    } else if(data.error) {
                        player.error(data.message)
                        uiManager.open(player, versionData.uiNames.MCBEToolsAuth, tokenCallback, step, email, password)
                    }
                    // world.sendMessage(res)
                })
        
            })
        }
    })

})