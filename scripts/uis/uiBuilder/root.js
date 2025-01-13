import { system } from "@minecraft/server";
import icons from "../../api/icons";
import uiBuilder from "../../api/uiBuilder";
import config from "../../config";
import http from "../../networkingLibs/currentNetworkingLib";
import uiManager from "../../uiManager";
import moment from '../../lib/moment';
import emojis from '../../api/emojis';
import tabUI from "../../api/tabUI";
import { ActionForm, ModalForm } from "../../lib/form_func";

// Create a tab UI for the builder
const builderTabUI = tabUI.create("uiBuilder");
uiManager.addUI(config.uiNames.UIBuilderFolders, "UI Builder Folders", (player) => {
    let form = new ActionForm();
    form.title(`UI Builder Folders`);
    form.body(`Manage your folders here`);
    form.button(`§aCreate Folder\n§r§7Create a new folder`, null, (player)=>{
        let modalForm = new ModalForm();
        modalForm.title(`Create Folder`);
        modalForm.body(`Enter the name of the folder`);
        modalForm.button(`§aCreate\n§r§7Create the folder`, null, (player, response)=>{
            if(response.canceled || !response.formValues[0]) return uiManager.open(player, config.uiNames.UIBuilderFolders);
             uiBuilder.db.createFolder(player, response.formValues[0]) ;
             uiManager.open(player, config.uiNames.UIBuilderFolders);
         })
        modalForm.show(player, false, ()  => {});
    })
    for(const folder of uiBuilder.db.getFolders()) {
        form.button(`${folder}`, null, (player)=>{
            
        })
    }
    form.show(player, false, () => {});
});
// Main UIs tab
builderTabUI.registerTab("\uE180 UIs", (player) => {
    const buttons = [{
        text: `§aAdd\n§r§7Add a UI`,
        iconPath: `textures/azalea_icons/1`,
        callback: (player) => {
            uiManager.open(player, config.uiNames.UIBuilderAdd);
        }
    }];

    buttons.push({
        text: `§aFolders\n§r§7Manage folders`,
        iconPath: `textures/azalea_icons/1`,
        callback: (player) => {
            uiManager.open(player, config.uiNames.UIBuilderFolders);
        }
    });
    
    // Add browse button if http player is available
    if (http.player) {
        buttons.push({
            text: `§aBrowse\n§r§7Browse global GUIs`,
            iconPath: icons.resolve("leaf/image-806"),
            callback: (player) => {
                http.makeRequest({
                    method: 'get',
                    url: `${config.Endpoint}/guis/list`
                }, (status, data) => {
                    system.run(() => {
                        uiManager.open(player, config.uiNames.OnlineGUIsList, data, "main");
                    });
                });
            }
        });
    }
    
    // Add UI list buttons
    const sortedUIs = uiBuilder.getUIs().sort((a, b) => b.updatedAt - a.updatedAt);
    sortedUIs.forEach(ui => {
        const scriptEventInfo = ui.data.scriptevent.length <= 16 
            ? ` §f| §7${emojis.chat} ${ui.data.scriptevent}` 
            : '';
            
        buttons.push({
            text: `§b${ui.data.name}\n§r§7${emojis.clock} Updated ${moment(ui.updatedAt).fromNow()}${scriptEventInfo}`,
            iconPath: ui.id == 1719775088275 ? `textures/azalea_icons/icontextures/uwu` : ui.data.icon ? icons.resolve(ui.data.icon) : `textures/azalea_icons/ClickyClick`,
            callback: (player) => {
                if(ui.id == 1719775088275) {
                    let form2 = new ActionForm();
                    form2.title(`Nuh uh`);
                    form2.body(`Trashy no no want u to edit this because she is a trashy girl :3`);
                    form2.button("ok", null, (player)=>{
                        uiManager.open(player, config.uiNames.UIBuilderRoot);
                    })
                    form2.show(player, false, () => {});
                } else {
                    uiManager.open(player, config.uiNames.UIBuilderEdit, ui.id);
                }
            }
        });
    });

    return {
        buttons
    };
});

// Update the UI registration to use the tab UI
uiManager.addUI(config.uiNames.UIBuilderRoot, "UI Builder Root", (player) => {
    builderTabUI.open(player);
});

export { builderTabUI };