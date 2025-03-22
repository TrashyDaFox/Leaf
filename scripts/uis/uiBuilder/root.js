import { system, world } from "@minecraft/server";
import icons from "../../api/icons";
import uiBuilder from "../../api/uiBuilder";
import config from "../../versionData";
import http from "../../networkingLibs/currentNetworkingLib";
import uiManager from "../../uiManager";
import moment from '../../lib/moment';
import emojis from '../../api/emojis';
import tabUI from "../../api/tabUI";
import { ActionForm, MessageForm, ModalForm } from "../../lib/form_func";
import './snippetBook'
import './trash'
import '../devmode/root.js'
import { NUT_UI_ALT, NUT_UI_DISABLE_VERTICAL_SIZE_KEY, NUT_UI_HEADER_BUTTON, NUT_UI_LEFT_HALF, NUT_UI_RIGHT_HALF, NUT_UI_TAG, NUT_UI_THEMED } from "../preset_browser/nutUIConsts";
import { themes } from "./cherryThemes";
import './help/main.js'
import { prismarineDb } from "../../lib/prismarinedb.js";
import { formatStr } from "../../api/azaleaFormatting.js";
import configAPI from "../../api/config/configAPI.js";
import './addViewSeparator.js'
import base64 from "../../api/uibuild/base64.js";
import './toast/index.js'
// Create a tab UI for the builder
const builderTabUI = tabUI.create("uiBuilder");

let folderColors = [
    {
        name: "Normal",
        texturePath: "textures/azalea_icons/Folders/FolderNormal"
    },
    {
        name: "White",
        // texturePath: "textures/folders/rainbow"
        texturePath: "textures/azalea_icons/Folders/FolderWhite"
    },
    {
        name: "Pink",
        texturePath: "textures/azalea_icons/Folders/FolderPink"
    },
    {
        name: "Blue",
        texturePath: "textures/azalea_icons/Folders/FolderBlue"
    },
    {
        name: "Cherry",
        texturePath: "textures/azalea_icons/Folders/FolderCherry"
    },
    {
        name: "Green",
        texturePath: "textures/azalea_icons/Folders/FolderGreen"
    }
]
uiManager.addUI(config.uiNames.UIBuilderFolders, "UI Builder Folders", (player) => {
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}§rFolders`)
    form.button(`§aNew Folder\n§7Create a new folder`, `textures/azalea_icons/1`, (player)=>{

    })
    form.show(player, false, (player, response)=>{})
    return;
    // world.sendMessage(JSON.stringify(prismarineDb.economy.getCurrency("default")))
    // let form = new ActionForm();
    // form.title(`UI Builder Folders`);
    // form.body(`Manage your folders here`);
    // form.button(`§aCreate Folder\n§r§7Create a new folder`, null, (player)=>{
    //     let modalForm = new ModalForm();
    //     modalForm.title(`Create Folder`);
    //     modalForm.textField("Folder Name", "Example: Utility UIs")
    //     modalForm.show(player, false, (player, response)  => {
    //         if(response.canceled || !response.formValues[0]) return uiManager.open(player, config.uiNames.UIBuilderFolders);
    //         uiBuilder.db.createFolder(response.formValues[0]);
    //         uiManager.open(player, config.uiNames.UIBuilderFolders);
    //     });
    // })
    // for(const folder of uiBuilder.db.getFolders()) {
    //     let folder2 = uiBuilder.db.folders.find(_=>_.name == folder);
    //     form.button(`${folder}`, folder2.color ? folderColors.find(_=>_.name == folder2.color) ? folderColors.find(_=>_.name == folder2.color).texturePath : "textures/azalea_icons/Folders/FolderNormal" : "textures/azalea_icons/Folders/FolderNormal", (player)=>{
    //         let actionForm = new ActionForm();
    //         actionForm.title(`${folder}`);
    //         actionForm.body(`Manage your folder here`);
    //         actionForm.button(`§aDelete Folder\n§r§7Delete the folder`, null, (player)=>{
    //             uiBuilder.db.deleteFolder(folder);
    //             uiManager.open(player, config.uiNames.UIBuilderFolders);
    //         })
    //         let uis = uiBuilder.db.getFolderDocuments(folder)
    //         if(uis.length) {
    //             actionForm.button(`§eExport`, null, (player)=>{
    //                 let data = {
    //                     version: '1.0',
    //                     exportSource: 'folder',
    //                     data: uis[0].data,
    //                     dependencies: uis.map(_=>_.data).slice(1)
    //                 }
    //                 let modal = new ModalForm();
    //                 modal.title('Code Editor')
    //                 modal.textField("Contents", "Contents", `${JSON.stringify(data)}`)
    //                 modal.show(player, false, (player, response)=>{
    //                     uiManager.open(player, config.uiNames.UIBuilderFolders)
    //                 })
    //             })
    //         }
    //         actionForm.button("§dEdit UIs\n§r§7Edit the UIs in the folder", null, (player)=>{
    //             let modalForm = new ModalForm();
    //             modalForm.title(`Edit UIs`);
    //             let uis = uiBuilder.getAllUIs();
    //             uis = uis.sort((a, b) => b.updatedAt - a.updatedAt);
    //             let dropdown = uis.map(ui => {
    //                 return {
    //                     name: ui.data.type == 4 ? ui.data.title : ui.data.name,
    //                     id: ui.id
    //                 }
    //             });
    //             let docs = uiBuilder.db.getFolderDocuments(folder);
    //             for(const ui of dropdown) {
    //                 modalForm.toggle(`${ui.name}`, docs.find(doc => doc.id == ui.id) ? true : false)
    //             }
    //             // modalForm.textField("UI Name", "Example: Utility UIs")
    //             modalForm.show(player, false, (player, response) => {
    //                 // if(response.canceled || !response.formValues[0]) return uiManager.open(player, config.uiNames.UIBuilderFolders);
    //                 // uiBuilder.db.add(folder, response.formValues[0]);
    //                 // uiManager.open(player, config.uiNames.UIBuilderFolders);

    //                 uiBuilder.db.folders.find(_=>_.name == folder).documentIDs = response.formValues.map((tf, i)=>response.formValues[i] ? dropdown[i].id : null).filter(id=>id)
    //                 uiBuilder.db.saveFolders();
    //                 uiManager.open(player, config.uiNames.UIBuilderFolders);
    //             });
    //         })
    //         actionForm.button(`§aChange Folder Color\n§r§7Change the folder color`, null, (player)=>{
    //             let newActionForm = new ActionForm();
    //             newActionForm.title(`Change Folder Color`);
    //             newActionForm.body(`Change the folder color`);
    //             for(const color of folderColors) {
    //                 newActionForm.button(`${color.name}`, color.texturePath, (player)=>{
    //                     uiBuilder.db.folders.find(_=>_.name == folder).color = color.name;
    //                     uiBuilder.db.saveFolders();
    //                     uiManager.open(player, config.uiNames.UIBuilderFolders);
    //                 })
    //             }
    //             newActionForm.show(player, false, () => {});
    //         });
    //         actionForm.show(player, false, () => {});
    //     })
    // }
    // form.show(player, false, () => {});
});
uiManager.addUI(config.uiNames.UIBuilderAddSubmenu, "IAl", (player)=>{
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}§rAdd a UI`)
    form.button(`${NUT_UI_HEADER_BUTTON}§r§c§lBack\n§r§7Go back to the main UI view`, `textures/azalea_icons/2`, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderRoot)
    })
    form.button(`§aAction Form\n§7Main UI type, recommended for buttons`, null, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderAdd)
    })
    form.button(`§bModal Form\n§7Advanced UI type`, null, (player)=>{
        uiManager.open(player, config.uiNames.Modal.Add)
    })
    form.button(`${NUT_UI_RIGHT_HALF}${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}§r§eChest UI\n§7Chest UI type`, null, (player)=>{
        uiManager.open(player, config.uiNames.ChestGuiAdd)
    })
    form.button(`${NUT_UI_LEFT_HALF}§r§6Adv. Chest UI\n§7Advanced Chest UI`, null, (player)=>{
        uiManager.open(player, config.uiNames.ChestGuiAddAdvanced)
    })
    form.button(`§5Folder\n§7Organize your UIs`, null, (player)=>{
        let modalForm = new ModalForm()
        modalForm.textField("Name", "Name")
        modalForm.show(player, false, (player, response)=>{
            if(response.canceled) return uiManager.open(player, config.uiNames.UIBuilderRoot)
            uiBuilder.createFolder(response.formValues[0])
            return uiManager.open(player, config.uiNames.UIBuilderRoot)
        })
    })
    form.button(`§dToast\n§7Create a customizable notification`, null, (player)=>{
        uiManager.open(player, config.uiNames.ToastBuilderAdd)
    })

    form.show(player, false, ()=>{})
})
uiManager.addUI(config.uiNames.UIBuilderFoldersView, "UI Builder Folders View", (player, folder) => {
    let form = new ActionForm();
    form.title(`${folder}`);
    form.button(`§cBack`, null, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderRoot);
    })
    for(const ui of uiBuilder.getAllUIs()) {
        if(uiBuilder.db.getFolderDocuments(folder).find(_=>_.id == ui.id)) {
            form.button(`§b${ui.data.name}\n§r§7${emojis.clock} Updated ${moment(ui.updatedAt).fromNow()}`, ui.data.icon ? icons.resolve(ui.data.icon) : ui.data.layout  == 4 ? `textures/azalea_icons/DevSettingsClickyClick` : `textures/azalea_icons/ClickyClick`, (player)=>{
                uiManager.open(player, config.uiNames.UIBuilderEdit, ui.id);
            })
        }
    }
    form.show(player, false, () => {});
});
function getIcon(ui) {
    return ui.id == 1719775088275 ? `textures/azalea_icons/icontextures/uwu`
        : ui.data.icon ? icons.resolve(ui.data.icon)
        : ui.data.internal ? `textures/azalea_icons/LeafyClickOwO`
        : ui.data.layout == 4 ? `textures/azalea_icons/DevSettingsClickyClick`
        : ui.data.type == 6 ? `textures/ui/infobulb`
        : ui.data.type == 4 ? `textures/azalea_icons/ChestIcons/Chest${ui.data.rows ? ui.data.rows : 3}`
        : `textures/azalea_icons/ClickyClick`
}
function getBtnText(ui) {
    return `${ui.data.internal ? `§l§e§f§1§r§a` : ui.data.layout == 4 ? "§c§h§e§1§r§c" : "§e"}${ui.data.type == 4 ? ui.data.title : ui.data.name}${ui.data.type == 6 ? " §r§7[§fTOAST§7] " : ""}${ui.data.pinned && !ui.data.internal ? ` \uE174` : ''}\n§r§7${emojis.clock} Updated ${moment(ui.updatedAt).fromNow()}`
}

function handleImportingFlow(player, data2) {
    try {
        let dat = typeof data2 == "object" ? data2 : JSON.parse(data2)
        if(!dat.version) {
            if(dat.id && dat.updatedAt && dat.createdAt && dat.data) { // for compatibility with v3.0-beta UIs
                let data = dat.data;
                if(data.scriptevent) {
                    if(uiBuilder.db.findFirst({scriptevent: data.scriptevent})) {
                        uiManager.open(player, config.uiNames.Basic.Confirmation, `This UI already exists on your world. Are you sure you want to import this UI?`, ()=>{
                            uiBuilder.db.insertDocument({...data, importedBy: player.id, imported: true})
                            return uiManager.open(player, config.uiNames.UIBuilderRoot)
                        }, ()=>{
                            return uiManager.open(player, config.uiNames.UIBuilderRoot)
                        })    
                    } else {
                        uiBuilder.db.insertDocument({...data, importedBy: player.id, imported: true})
                        return uiManager.open(player, config.uiNames.UIBuilderRoot)
                    }
                } else {
                    player.error("Invalid UI data")
                    return uiManager.open(player, config.uiNames.UIBuilderRoot)

                }

                return;
            }
            if(dat.scriptevent) {
                if(uiBuilder.db.findFirst({scriptevent: dat.scriptevent})) {
                    uiManager.open(player, config.uiNames.Basic.Confirmation, `This UI already exists on your world. Are you sure you want to import this UI?`, ()=>{
                        uiBuilder.db.insertDocument({...dat, importedBy: player.id, imported: true})
                        return uiManager.open(player, config.uiNames.UIBuilderRoot)
                    }, ()=>{
                        return uiManager.open(player, config.uiNames.UIBuilderRoot)
                    })    
                } else {
                    uiBuilder.db.insertDocument({...dat, importedBy: player.id, imported: true})
                    return uiManager.open(player, config.uiNames.UIBuilderRoot)
                }
            } else {
                player.error("Invalid UI data")
                return uiManager.open(player, config.uiNames.UIBuilderRoot)
            }
            return;
        }
        let clashing = uiBuilder.db.findFirst({scriptevent: dat.ui.scriptevent}) ? [dat.ui.scriptevent] : [];
        if(dat.dependencies && dat.dependencies.length) {
            for(const dep of dat.dependencies) {
                if(uiBuilder.db.findFirst({scriptevent: dep.scriptevent})) {
                    clashing.push(dep.scriptevent)
                }
            }
        }
        let showWarning = false;
        let warningMessage = []
        if(clashing.length) {
            let types = {
                action: 0,
                modal: 0,
                chest: 0
            };
            let typeMap = new Map([[0,"action"],[1,"action"],[3,"modal"],[4,"chest"]])
            for(const clash of clashing) {
                let ui = uiBuilder.db.findFirst({scriptevent: clash});
                if(!typeMap.has(ui.data.type)) continue;
                types[typeMap.get(ui.data.type)] = types[typeMap.get(ui.data.type)] + 1 
            }
            warningMessage.push(`§aThere are §e${clashing.length} §aclashing UI scriptevent(s): §7${clashing.join('§r§f, §7')}`)
            warningMessage.push(`§bChest: §f${types.chest}`)
            warningMessage.push(`§aAction: §f${types.action}`)
            warningMessage.push(`§cModal: §f${types.modal}`)
            warningMessage.push(`\n`)
        }
        if(dat.dependencies && dat.dependencies.length) {
            let typeMap = new Map([[0,"action"],[1,"action"],[3,"modal"],[4,"chest"]])
            warningMessage.push(`This UI has multiple dependencies!`)
            for(const dep of dat.dependencies) {
                warningMessage.push(`§a${dep.type == 4 ? dep.title : dep.name} §6(${typeMap.get(dep.type)})`)
            }
            warningMessage.push('\n')
        }
        if(warningMessage.length) {
            warningMessage.push("Are you sure you want to continue?");
            let messageForm = new MessageForm();
            messageForm.title("Continue?");
            messageForm.body(warningMessage.join('\n§r'))
            messageForm.button1("No", (player)=>{
                uiBuilder.importUI(dat)
                uiManager.open(player, config.uiNames.UIBuilderRwwoot);
            })
            messageForm.button2("Yes", (player)=>{
                uiManager.open(player, config.uiNames.UIBuilderRoot);
            })
            messageForm.show(player, false, (player, response)=>{

            })
            return;
        }
        uiBuilder.importUI(dat);
        uiManager.open(player, config.uiNames.UIBuilderRoot);
    } catch(e) {
        player.error("Failed to import UI");
        player.error(`${e}`)
        uiManager.open(player, config.uiNames.UIBuilderRoot);
    }

}

uiManager.addUI(config.uiNames.ImportUI, "Import a UI", (player, data = null)=>{
    if(data) return handleImportingFlow(player, data)
    let modal = new ModalForm();
    modal.title("Code Editor");
    modal.textField("Code", "Code");
    modal.show(player, false, (player, response) => {
        if(response.canceled || !response.formValues[0]) {
            player.error("Canceled importing.")
            uiManager.open(player, config.uiNames.UIBuilderRoot)
        }
        handleImportingFlow(player, response.formValues[0])
    });

})
uiManager.addUI(config.uiNames.UIBuilderFolder, "yes", (player, folder)=>{
    let form = new ActionForm();
    let folderData = uiBuilder.db.getByID(folder);
    form.title(`${NUT_UI_TAG}§r${folderData.data.name}`)
    form.button(`${NUT_UI_HEADER_BUTTON}§r§cGo back`, `textures/azalea_icons/2`, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderRoot)
    })
    form.button(`${NUT_UI_RIGHT_HALF}${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}§r§aAdd UI\n§7Add a UI to the folder`, null, (player)=>{
        let newForm = new ActionForm();
        newForm.title(`${NUT_UI_TAG}§rAdd UI To Folder`)
        newForm.button(`${NUT_UI_HEADER_BUTTON}§r§cGo back`, `textures/azalea_icons/2`, (player)=>{
            uiManager.open(player, config.uiNames.UIBuilderFolder, folder)
        })
        const sortedUIs = uiBuilder.getAllUIs().sort((a, b) => {
            const aValue = a.data.pinned || false;
            const bValue = b.data.pinned || false;
            if (aValue !== bValue) {
                return bValue ? 1 : -1;
            }
            return b.updatedAt - a.updatedAt;
        }).filter(_=>!_.data.internal);
        for(const ui of sortedUIs) {
            newForm.button(getBtnText(ui), getIcon(ui), (player)=>{
                uiBuilder.setFolder(ui.id, folderData.data.name);
                uiManager.open(player, config.uiNames.UIBuilderFolder, folder)
            })
        }
        newForm.show(player, false, (player, response)=>{

        })
    })
    form.button(`${NUT_UI_LEFT_HALF}§r§eSet Icon\n§7Set the icon`, getIcon(folderData), (player)=>{
        uiManager.open(player, config.uiNames.IconViewer, 0, (player, iconID)=>{
            if(iconID !== null) {
                folderData.data.icon = iconID;
                uiBuilder.db.overwriteDataByID(folderData.id, folderData.data)
            }
            uiManager.open(player, config.uiNames.UIBuilderFolder, folder)
        })
    })
    form.button(`§vExport Folder\n§7Get code for all UIs in this folder`, null, (player)=>{
        let uis = uiBuilder.db.findDocuments({folder});
        let data = {version: '1.0', timestamp: Date.now(), exportSource: 'folder', data: uis[0].data, dependencies: uis.slice(1).map(_=>_.data)};
        let modalForm = new ModalForm();
        modalForm.title(`Code Editor`);
        modalForm.textField("yes", "Code", JSON.stringify(data))
        modalForm.show(player, false, (player, response)=>{
            uiManager.open(player, config.uiNames.UIBuilderFolder, folder)
        })
    })
    let sortedUIs = uiBuilder.getAllUIs().sort((a, b) => {
        const aValue = a.data.pinned || false;
        const bValue = b.data.pinned || false;
        if (aValue !== bValue) {
            return bValue ? 1 : -1;
        }
        return b.updatedAt - a.updatedAt;
    }).filter(_=>!_.data.internal);
    sortedUIs = sortedUIs.filter(_=>_.data.folder == folder);
    for(const ui of sortedUIs) {
        form.button(getBtnText(ui), getIcon(ui), (player)=>{
            uiManager.open(player, config.uiNames.UIBuilderEdit, ui.id)
        })
    }
    form.button(`§cDelete\n§7Delete this folder`, null, (player)=>{
        uiManager.open(player, config.uiNames.Basic.Confirmation, "Are you sure you want to delete this folder?", ()=>{
            uiBuilder.db.deleteDocumentByID(folder);
            uiManager.open(player, config.uiNames.UIBuilderRoot)    
        }, ()=>{
            uiManager.open(player, config.uiNames.UIBuilderFolder, folder)    
        })
    })
    form.show(player, false, (player, response)=>{})
})
uiManager.addUI(config.uiNames.UIBuilderLeaf, "a", player=>{
    let root = new ActionForm();
    root.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[5][0]}§rEdit Leaf GUIs`)
    let uis = uiBuilder.db.findDocuments({internal: true});
    root.button(`${NUT_UI_HEADER_BUTTON}§r§cGo Back\n§7Go back fr`, `textures/azalea_icons/2`, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderRoot)
    })
    for(const ui of uis) {
        root.button(getBtnText(ui), getIcon(ui), (player)=>{
            uiManager.open(player, config.uiNames.UIBuilderEdit, ui.id)
        })
    }
    root.show(player, false, (player, response)=>{})
})
// Main UIs tab
let showUI = (player) => {
    const buttons = [{
        text: `§aAdd\n§r§7Add a UI`,
        iconPath: `textures/azalea_icons/1`,
        callback: (player) => {
            uiManager.open(player, config.uiNames.UIBuilderAddSubmenu);
        }
    }];
    buttons.push({
        text: `§l§e§f§1§r§aLeaf GUIs\n§7Edit internal leaf UIs`,
        iconPath: `textures/azalea_icons/LeafyClickOwO`,
        callback: player => {
            uiManager.open(player, config.uiNames.UIBuilderLeaf)
        }
    })
    if (http.player) {
        buttons.push({
            text: `§aBrowse\n§r§7Browse global GUIs`,
            iconPath: icons.resolve("Packs/Asteroid/global"),
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
    if(configAPI.getProperty("DevMode")) {
        buttons.push({
            text: `§cDev: Switch CTX`,
            iconPath: `textures/update_pings_icons/main-settings/extraTools`,
            callback: (player)=>{
                let modal = new ModalForm();
                modal.title("UI Builder: Switch CTX")
                modal.textField("Table Name", "Yes", uiBuilder.db.table)
                modal.show(player, false, (player, response)=>{
                    if(response.canceled || !response.formValues[0]) return uiManager.open(player, config.uiNames.UIBuilderRoot)

                    uiBuilder.db.switchTable(response.formValues[0]).then(()=>{
                        return uiManager.open(player, config.uiNames.UIBuilderRoot)

                    })

                })
            }
        })
    }
    // buttons.push({
    //     text: `§aFolders\n§r§7Manage folders`,
    //     iconPath: `textures/azalea_icons/Folders/FolderNormal`,
    //     callback: (player) => {
    //         uiManager.open(player, config.uiNames.UIBuilderFolders);
    //     }
    // });

    for(const folder of uiBuilder.db.findDocuments({type: 2})) {
        buttons.push({
            text: `§d${folder.data.name}\n§7Click to open folder`,
            iconPath: getIcon(folder),
            callback: (player) => {
                uiManager.open(player, config.uiNames.UIBuilderFolder, folder.id)
            }
        })
        continue;
        let folder2 = uiBuilder.db.folders.find(_=>_.name == folder);
        buttons.push({
            text: `§a${folder}\n§r§7Manage folder`,
            iconPath: folder2.color ? folderColors.find(_=>_.name == folder2.color) ? folderColors.find(_=>_.name == folder2.color).texturePath : "textures/azalea_icons/Folders/rainbow" : "textures/azalea_icons/Folders/rainbow",
            callback: (player) => {
                uiManager.open(player, config.uiNames.UIBuilderFoldersView, folder);
            }
        });
    }
    
    // Add browse button if http player is available
    
    
    // Add UI list buttons
    // const sortedUIs = uiBuilder.getUIs().sort((a, b) => b.updatedAt - a.updatedAt);
    const sortedUIs = uiBuilder.getAllUIs().sort((a, b) => {
        const aValue = a.data.pinned || false;
        const bValue = b.data.pinned || false;
        if (aValue !== bValue) {
            return bValue ? 1 : -1;
        }
        return b.updatedAt - a.updatedAt;
    }).filter(_=>!_.data.internal);
    // sortedUIs.push(...uiBuilder.getModalUIs())
    sortedUIs.forEach(ui => {
        if(ui.data.folder && uiBuilder.db.getByID(ui.data.folder)) return;
        // const scriptEventInfo = ui.data.scriptevent.length <= 16 && !ui.data.pinned
        //     ? ` §f| §7${emojis.chat} ${ui.data.scriptevent}` 
        //     : '';
        // const scriptEventInfo = ` §r§f${formatStr("<dra>")} §r${ui.data.type == 0 ? ui.data.layout == 4 ? "§cCherryUI" : "§aAction" : ui.data.type == 3 ? "§dModal" : ui.data.type == 4 ? "§6Chest" : "§7Unknown"}`
        const scriptEventInfo = '';
        buttons.push({
            text: getBtnText(ui),
            iconPath: getIcon(ui),
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

    buttons.push({
        text: `${NUT_UI_RIGHT_HALF}${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}§r§aImport\n§r§7Import a UI`,
        iconPath: `textures/azalea_icons/import`,
        callback: (player) => {
            uiManager.open(player, config.uiNames.ImportUI)
        }
    });
    buttons.push({
        text: `${NUT_UI_LEFT_HALF}§r§6Trash\n§r§7View trash`,
        iconPath: `textures/azalea_icons/SidebarTrash`,
        callback: (player) => {
            uiManager.open(player, config.uiNames.UIBuilderTrash)
        }
    });

    return {
        buttons
    };
};

// Update the UI registration to use the tab UI
uiManager.addUI(config.uiNames.UIBuilderRoot, "UI Builder Root", (player) => {
    let form = new ActionForm();
    form.button(`${NUT_UI_HEADER_BUTTON}§r§cGo Back\n§7Go back to main settings`, `textures/azalea_icons/2`, player => uiManager.open(player, config.uiNames.ConfigRoot))
    form.button(`${NUT_UI_RIGHT_HALF}${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}${NUT_UI_ALT}${themes[0][0]}§rMy UIs`, null, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderRoot)
    })
    form.button(`${NUT_UI_LEFT_HALF}${themes[0][0]}§rTab UIs`, null, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderTabbed)
    })
    form.title(`${NUT_UI_TAG}${themes[0][0]}§rUI Builder`)
    let { buttons } = showUI(player);
    for(const button of buttons) {
        form.button(button.text, button.iconPath, button.callback)
    }
    form.show(player, false, (player, response)=>{

    })
    // builderTabUI.open(player);
});

export { builderTabUI };