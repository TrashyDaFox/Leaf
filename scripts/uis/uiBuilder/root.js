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

let folderColors = [
    {
        name: "White",
        texturePath: "textures/folders/white"
    },
    {
        name: "Rainbow",
        texturePath: "textures/folders/rainbow"
    },
    {
        name: "Light Gray",
        texturePath: "textures/folders/light-gray"
    },
    {
        name: "Dark Gray",
        texturePath: "textures/folders/dark-gray"
    },
    {
        name: "Black",
        texturePath: "textures/folders/black"
    },
    {
        name: "Brown",
        texturePath: "textures/folders/brown"
    },
    {
        name: "Red",
        texturePath: "textures/folders/red"
    },
    {
        name: "Green",
        texturePath: "textures/folders/green"
    },
    {
        name: "Blue",
        texturePath: "textures/folders/blue"
    },
    {
        name: "Yellow",
        texturePath: "textures/folders/yellow"
    },
    {
        name: "Orange",
        texturePath: "textures/folders/orange"
    },
    {
        name: "Pink",
        texturePath: "textures/folders/pink"
    },
    {
        name: "Purple",
        texturePath: "textures/folders/purple"
    },
    {
        name: "Light Blue",
        texturePath: "textures/folders/light-blue"
    },
    {
        name: "Cyan",
        texturePath: "textures/folders/cyan"
    },
    {
        name: "Magenta",
        texturePath: "textures/folders/magenta"
    },
    {
        name: "Lime",
        texturePath: "textures/folders/lime"
    }
]

uiManager.addUI(config.uiNames.UIBuilderFolders, "UI Builder Folders", (player) => {
    let form = new ActionForm();
    form.title(`UI Builder Folders`);
    form.body(`Manage your folders here`);
    form.button(`§aCreate Folder\n§r§7Create a new folder`, null, (player)=>{
        let modalForm = new ModalForm();
        modalForm.title(`Create Folder`);
        modalForm.textField("Folder Name", "Example: Utility UIs")
        modalForm.show(player, false, (player, response)  => {
            if(response.canceled || !response.formValues[0]) return uiManager.open(player, config.uiNames.UIBuilderFolders);
            uiBuilder.db.createFolder(response.formValues[0]);
            uiManager.open(player, config.uiNames.UIBuilderFolders);
        });
    })
    for(const folder of uiBuilder.db.getFolders()) {
        let folder2 = uiBuilder.db.folders.find(_=>_.name == folder);
        form.button(`${folder}`, folder2.color ? folderColors.find(_=>_.name == folder2.color) ? folderColors.find(_=>_.name == folder2.color).texturePath : "textures/folders/rainbow" : "textures/folders/rainbow", (player)=>{
            let actionForm = new ActionForm();
            actionForm.title(`${folder}`);
            actionForm.body(`Manage your folder here`);
            actionForm.button(`§aDelete Folder\n§r§7Delete the folder`, null, (player)=>{
                uiBuilder.db.deleteFolder(folder);
                uiManager.open(player, config.uiNames.UIBuilderFolders);
            })
            actionForm.button("Edit UIs\n§r§7Edit the UIs in the folder", null, (player)=>{
                let modalForm = new ModalForm();
                modalForm.title(`Edit UIs`);
                let uis = uiBuilder.getUIs();
                uis = uis.sort((a, b) => b.updatedAt - a.updatedAt);
                let dropdown = uis.map(ui => {
                    return {
                        name: ui.data.name,
                        id: ui.id
                    }
                });
                let docs = uiBuilder.db.getFolderDocuments(folder);
                for(const ui of dropdown) {
                    modalForm.toggle(`${ui.name}`, docs.find(doc => doc.id == ui.id) ? true : false)
                }
                // modalForm.textField("UI Name", "Example: Utility UIs")
                modalForm.show(player, false, (player, response) => {
                    // if(response.canceled || !response.formValues[0]) return uiManager.open(player, config.uiNames.UIBuilderFolders);
                    // uiBuilder.db.add(folder, response.formValues[0]);
                    // uiManager.open(player, config.uiNames.UIBuilderFolders);

                    uiBuilder.db.folders.find(_=>_.name == folder).documentIDs = response.formValues.map((tf, i)=>response.formValues[i] ? dropdown[i].id : null).filter(id=>id)
                    uiBuilder.db.saveFolders();
                    uiManager.open(player, config.uiNames.UIBuilderFolders);
                });
            })
            actionForm.button(`§aChange Folder Color\n§r§7Change the folder color`, null, (player)=>{
                let newActionForm = new ActionForm();
                newActionForm.title(`Change Folder Color`);
                newActionForm.body(`Change the folder color`);
                for(const color of folderColors) {
                    newActionForm.button(`${color.name}`, color.texturePath, (player)=>{
                        uiBuilder.db.folders.find(_=>_.name == folder).color = color.name;
                        uiBuilder.db.saveFolders();
                        uiManager.open(player, config.uiNames.UIBuilderFolders);
                    })
                }
                newActionForm.show(player, false, () => {});
            });
            actionForm.show(player, false, () => {});
        })
    }
    form.show(player, false, () => {});
});
uiManager.addUI(config.uiNames.UIBuilderFoldersView, "UI Builder Folders View", (player, folder) => {
    let form = new ActionForm();
    form.title(`${folder}`);
    form.button(`§cBack`, null, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderRoot);
    })
    for(const ui of uiBuilder.getUIs()) {
        if(uiBuilder.db.getFolderDocuments(folder).find(_=>_.id == ui.id)) {
            form.button(`§b${ui.data.name}\n§r§7${emojis.clock} Updated ${moment(ui.updatedAt).fromNow()}`, ui.data.icon ? icons.resolve(ui.data.icon) : `textures/azalea_icons/ClickyClick`, (player)=>{
                uiManager.open(player, config.uiNames.UIBuilderEdit, ui.id);
            })
        }
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
        iconPath: `textures/folders/rainbow`,
        callback: (player) => {
            uiManager.open(player, config.uiNames.UIBuilderFolders);
        }
    });

    for(const folder of uiBuilder.db.getFolders()) {
        let folder2 = uiBuilder.db.folders.find(_=>_.name == folder);
        buttons.push({
            text: `§a${folder}\n§r§7Manage folder`,
            iconPath: folder2.color ? folderColors.find(_=>_.name == folder2.color) ? folderColors.find(_=>_.name == folder2.color).texturePath : "textures/folders/rainbow" : "textures/folders/rainbow",
            callback: (player) => {
                uiManager.open(player, config.uiNames.UIBuilderFoldersView, folder);
            }
        });
    }
    
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
    // const sortedUIs = uiBuilder.getUIs().sort((a, b) => b.updatedAt - a.updatedAt);
    const sortedUIs = uiBuilder.getUIs().sort((a, b) => {
        const aValue = a.data.pinned || false;
        const bValue = b.data.pinned || false;
        if (aValue !== bValue) {
            return bValue ? 1 : -1;
        }
        return b.updatedAt - a.updatedAt;
    });
    sortedUIs.forEach(ui => {
        const scriptEventInfo = ui.data.scriptevent.length <= 16 && !ui.data.pinned
            ? ` §f| §7${emojis.chat} ${ui.data.scriptevent}` 
            : '';
            
        buttons.push({
            text: `§b${ui.data.name}${ui.data.pinned ? ` §r§f| \uE174` : ''}\n§r§7${emojis.clock} Updated ${moment(ui.updatedAt).fromNow()}${scriptEventInfo}`,
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