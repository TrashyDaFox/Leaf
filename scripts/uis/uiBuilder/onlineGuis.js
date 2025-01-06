import { system } from "@minecraft/server";
import icons from "../../api/icons";
import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import http from "../../networkingLibs/currentNetworkingLib";
import uiManager from "../../uiManager";
import { ModalForm } from "../../lib/prismarinedb";
import uiBuilder from "../../api/uiBuilder";

uiManager.addUI(config.uiNames.OnlineGUIsList, "", (player, data, page = "main") => {
    let form = new ActionForm();
    form.button(`§cBack\n§7Go back`, icons.resolve("leaf/image-1031"), (player) => {
        if (page == "main") uiManager.open(player, config.uiNames.UIBuilderRoot)
        else {
            http.makeRequest({
                method: 'get',
                url: `${config.Endpoint}/guis/list`
            }, (status, data) => {
                system.run(() => {
                    uiManager.open(player, config.uiNames.OnlineGUIsList, data, "main")

                })
            })
        }
    })
    if (page == "main") {
        form.button(`§bSearch\n§7Search Templates`, icons.resolve(`leaf/image-068`), (player) => {
            let modalForm = new ModalForm();
            modalForm.textField("q", "Search Query", "Example Server GUI");
            modalForm.show(player, function(player){
                let query = this.get("q");
                http.makeRequest({
                    method: 'get',
                    url: `${config.Endpoint}/guis/list/search`,
                    params: {
                        q: query
                    }
                }, (status, data) => {
                    system.run(() => {
                        uiManager.open(player, config.uiNames.OnlineGUIsList, data, "query")
    
                    })
                })
            })
        })
        form.button(`§2Featured\n§7Featured Templates`, icons.resolve(`leaf/image-786`), (player) => {
            http.makeRequest({
                method: 'get',
                url: `${config.Endpoint}/guis/list/featured`
            }, (status, data) => {
                system.run(() => {
                    uiManager.open(player, config.uiNames.OnlineGUIsList, data, "featured")

                })
            })
        })

    }
    form.title(`Online GUI Templates §b(${JSON.parse(data).length})`)
    for (const thing of JSON.parse(data)) {
        // world.sendMessage(JSON.stringify(thing.guiData.name, null, 2))
        form.button(`§a${thing.guiData.name}\n§7${thing.publishedBy} §f(v${thing.madeInLeafVersion})`, icons.resolve(thing.guiData.icon ? thing.guiData.icon : thing.guiData.buttons && thing.guiData.buttons.length ? thing.guiData.buttons[0].iconID : ""), (player) => {
            uiBuilder.db.insertDocument(thing.guiData)
 
        })
        // form.button(`§a${thing.guiData.name}`, icons.resolve(thing.guiData.buttons[0].iconID), (player)=>{
        //     uiBuilder.db.insertDocument(thing.guiData)
        // })
    }
    form.show(player, false, (player, response) => {

    })
})