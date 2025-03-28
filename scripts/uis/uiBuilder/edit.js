import { system, world } from "@minecraft/server";
import icons from "../../api/icons";
import uiBuilder from "../../api/uiBuilder";
import config from "../../versionData"
import { ActionForm, ModalForm } from "../../lib/form_func";
import http from "../../networkingLibs/currentNetworkingLib";
import uiManager from "../../uiManager";
import { formatStr } from "../../api/azaleaFormatting";
import { themes } from "./cherryThemes";
import './editCherryTheme';
import { NUT_UI_ALT, NUT_UI_DISABLE_VERTICAL_SIZE_KEY, NUT_UI_HEADER_BUTTON, NUT_UI_LEFT_HALF, NUT_UI_PAPERDOLL, NUT_UI_RIGHT_HALF, NUT_UI_TAG, NUT_UI_THEMED } from "../preset_browser/nutUIConsts";
import configAPI from "../../api/config/configAPI";
import sidebarEditor from "../../api/sidebarEditor";
uiManager.addUI(config.uiNames.UIBuilderEdit, "UI Builder Edit", (player, id)=>{
    try {
        // let snippetBook = uiBuilder.getSnippetBook()

        if(id == 1719775088275) return;
        let doc = uiBuilder.db.getByID(id);
        if(!doc) return;
        if(doc.data.type == 5) {
            return uiManager.open(player, config.uiNames.Config.Misc)
        }        let actionForm = new ActionForm();
        let themID = doc.data.layout == 4 ? doc.data.theme ? doc.data.theme : 0 : 0;
        let themString = themID > 0 ? `${NUT_UI_THEMED}${themes[themID][0]}` : ``;
        let themString2 = themID > 0 ? `${NUT_UI_ALT}${themes[themID][0]}` : `${NUT_UI_ALT}`;
        actionForm.title(`${doc.data.layout == 4 && doc.data.paperdoll ? NUT_UI_PAPERDOLL : ``}${NUT_UI_TAG}${themString}§rEditing "§b${(doc.data.type == 4 ? doc.data.title : doc.data.name).replace('§g§r§i§d§u§i','').replace('§c§h§e§s§t','')}§r"`);
        actionForm.button(`${NUT_UI_HEADER_BUTTON}§6Back\n§7Go back`, `textures/azalea_icons/2`, (player)=>{
            uiManager.open(player, config.uiNames.UIBuilderRoot);
        })
        if(doc.data.type == 3) {
            actionForm.button(`§aEdit form\n§7Edit extra form properties`, `textures/azalea_icons/GUIMaker/ModalsV2/edit model form`, (player)=>{
                uiManager.open(player, config.uiNames.Modal.Add, doc.data.name, doc.data.scriptevent, "", id)
            })
            actionForm.button(`§dEdit controls\n§7Edit contents of this form`, `textures/azalea_icons/GUIMaker/ModalsV2/Edit controls`, (player)=>{
                uiManager.open(player, config.uiNames.Modal.EditControls, id)
            })
        }
        if(doc.data.type == 7) {
            actionForm.button(`§cEdit Lines\n§7Edit the lines of this UI`, null, (player)=>{
                uiManager.open(player, config.uiNames.SidebarEditorEdit, doc.data.name)
            })
            actionForm.button(`§cMake Default\n§7Make this the default sidebar`, null, (player)=>{
                for(const data of uiBuilder.db.data) {
                    if(data.data.type != 7) continue;

                    data.data.isDefaultSidebar = false;
                    uiBuilder.db.save();
                }

                doc.data.isDefaultSidebar = true;
                uiBuilder.db.overwriteDataByID(doc.id, doc.data)
                uiManager.open(player, config.uiNames.UIBuilderEdit, id)
            })
        }
        if(doc.data.type == 0) {
            actionForm.button(`§aEdit Buttons\n§7[ Click to View ]`, `textures/azalea_icons/EditUi`, (player)=>{
                uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
            });
            actionForm.button(`§dEdit Form\n§7Edit form name, and more`, `textures/azalea_icons/Extra UI settings`, (player)=>{
                uiManager.open(player, config.uiNames.UIBuilderAdd, doc.data.name, doc.data.body, doc.data.scriptevent, undefined, doc.id);
            });
        }
        if(doc.data.type == 4) {
            actionForm.button(`§bEdit Items`, `textures/azalea_icons/icontextures/nether_star`, (player)=>{
                uiManager.open(player, config.uiNames.ChestGuiEditItems, id)
            })
            actionForm.button(`§eEdit Form`, `textures/azalea_icons/Extra UI settings`, (player)=>{
                let chest = doc;
                if(chest.data.advanced) {
                    //player, defaultTitle = "", defaultScriptevent = "", defaultRows = 3, error = null, id = null
                    uiManager.open(player, config.uiNames.ChestGuiAddAdvanced, chest.data.title, chest.data.scriptevent, chest.data.rows, null, chest.id);
                }
                uiManager.open(player, config.uiNames.ChestGuiAdd, chest.data.title, chest.data.scriptevent, chest.data.rows, null, chest.id);
        
            })
        }
        if(doc.data.type == 6) {
            actionForm.button(`§eEdit General\n§7Edit general settings of this notification`, null, (player)=>{
                uiManager.open(player, config.uiNames.ToastBuilderAdd, id)
            })
            actionForm.button(`§6Set Body\n§7Set body text of this notification`, null, (player)=>{
                let modalForm = new ModalForm();
                modalForm.title("Code Editor")
                modalForm.textField("C", "Body text (leave empty for no body text)", doc.data.body ? doc.data.body : "")
                modalForm.show(player, false, (player, response)=>{
                    if(response.canceled) return uiManager.open(player, config.uiNames.UIBuilderEdit, id)
                    doc.data.body = response.formValues[0]
                    uiBuilder.db.overwriteDataByID(doc.id, doc.data)
                    uiManager.open(player, config.uiNames.UIBuilderEdit, id)
                })
            })
            actionForm.button(`§dSet icon\n§7Set icon of this notification`, doc.data.icon ? icons.resolve(doc.data.icon) : null, (player)=>{
                uiManager.open(player, config.uiNames.IconViewer, 0, (player, iconID)=>{
                    if(iconID != null) {
                        doc.data.icon = iconID;
                        uiBuilder.db.overwriteDataByID(doc.id, doc.data)
                    }
                    uiManager.open(player, config.uiNames.UIBuilderEdit, id)
                })
            })
            actionForm.button(`§aPreivew\n§7Preview the notification`, null, (player)=>{
                player.runCommand(`scriptevent leaf:open ${doc.data.scriptevent}`)
                uiManager.open(player, config.uiNames.UIBuilderEdit, id)
            })
        }
        if(doc.data.layout == 4) {
            actionForm.button(`${formatStr("{{gay \"Edit Theme\"}}")}\n§7Current Theme: ${themes[themID] ? themes[themID][1] : "Unknown"}`, `textures/azalea_icons/RainbowPaintBrush`, (player)=>{
                uiManager.open(player, "edit_cherry_theme", doc.id);
            }); 
            actionForm.button(`${NUT_UI_RIGHT_HALF}${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}${!doc.data.paperdoll ? themString2 : ``}§r§fPaperdoll\nOFF`, null, (player)=>{
                doc.data.paperdoll = false;
                uiBuilder.db.overwriteDataByID(doc.id, doc.data)
                uiManager.open(player, config.uiNames.UIBuilderEdit, id);
            }); 
            actionForm.button(`${NUT_UI_LEFT_HALF}${doc.data.paperdoll ? themString2 : ``}§r§fPaperdoll\nON`, null, (player)=>{
                doc.data.paperdoll = true;
                uiBuilder.db.overwriteDataByID(doc.id, doc.data)
                uiManager.open(player, config.uiNames.UIBuilderEdit, id);
            }); 
    
        }
        if(configAPI.getProperty("CLogDisableUIs") && configAPI.getProperty("CLog")) {
            actionForm.button(`${doc.data.clog_allow ? `§cDisallow in combat` : `§aAllow in combat`}\n§7Change if this UI is allowed in combat`, null, (player)=>{
                doc.data.clog_allow = !doc.data.clog_allow;
                uiBuilder.db.overwriteDataByID(doc.id, doc.data)
                uiManager.open(player, config.uiNames.UIBuilderEdit, id);
                
            })
        }
        actionForm.button(`${NUT_UI_RIGHT_HALF}${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}§r§nExport\n§7Get the UI code`, `textures/azalea_icons/export`, (player)=>{
            let modal = new ModalForm();
            modal.title("Code Editor");
            modal.textField("Code", "Code", JSON.stringify(uiBuilder.db.getByID(id).data, null, 2));
            modal.show(player, false, ()=>{
                uiManager.open(player, config.uiNames.UIBuilderEdit, id);
            })
        })
        actionForm.button(`${NUT_UI_LEFT_HALF}§r§vTemplate\n§7Export as template`, null, (player)=>{
            let modal = new ModalForm();
            modal.title("Code Editor");
            modal.textField("Code", "Code", JSON.stringify(uiBuilder.exportUI(id), null, 2));
            modal.show(player, false, ()=>{
                uiManager.open(player, config.uiNames.UIBuilderEdit, id);
            })
        })
        if(doc.data.folder && uiBuilder.db.getByID(doc.data.folder)) {
            actionForm.button(`§cRemove From Folder\n§7Remove this UI from the folder`, `textures/azalea_icons/Delete`, (player)=>{
                doc.data.folder = null;
                uiBuilder.db.overwriteDataByID(doc.id, doc.data)
                uiManager.open(player, config.uiNames.UIBuilderRoot)
            })
        }
        actionForm.button(`${NUT_UI_HEADER_BUTTON}§r§2${doc.data.pinned ? "Unpin" : "Pin"} UI\n§7${doc.data.pinned ? "Unpin" : "Pin"} this UI`, doc.data.pinned ? `textures/azalea_icons/10` : `textures/azalea_icons/10-2`, (player)=>{
            uiBuilder.setPinned(id, !doc.data.pinned);
            return uiManager.open(player, config.uiNames.UIBuilderEdit, id);
        })
        actionForm.button(`${NUT_UI_HEADER_BUTTON}§r§uSet icon\n§7Set icon for this UI`, doc.data.icon ? icons.resolve(doc.data.icon) : `textures/azalea_icons/ClickyClick`, (player)=>{
            uiManager.open(player, config.uiNames.IconViewer, 0, (player, iconID)=>{
                doc.data.icon = iconID;
                uiBuilder.db.overwriteDataByID(doc.id, doc.data);
                return uiManager.open(player, config.uiNames.UIBuilderEdit, id);
            });
        })
        actionForm.button(`${NUT_UI_HEADER_BUTTON}§r§bTag Opener ${doc.data.useTagOpener ? "§7(§aEnabled§7)" : "§7(§cDisabled§7)"}\n§7Toggle if this UI is opened by a tag`, doc.data.useTagOpener ? icons.resolve("azalea/name_tag") : icons.resolve("azalea/wand_01"), (player)=>{
            uiBuilder.toggleUseTagOpener(id);
            return uiManager.open(player, config.uiNames.UIBuilderEdit, id);
        })
        actionForm.button(`§3Duplicate\n§7Duplicate this UI`, `textures/azalea_icons/UI Copy and paste`, (player)=>{
            if(doc.data.type == 7) {
                let modal = new ModalForm();
                modal.textField("New Name", "Name", "", ()=>{}, "Name for the cloned sidebar")
                modal.show(player, false, (player, response)=>{
                    if(response.canceled) return uiManager.open(player, config.uiNames.UIBuilderEdit, id)
                    sidebarEditor.duplicateSidebar(doc.data.name, response.formValues[0])
                    return uiManager.open(player, config.uiNames.UIBuilderRoot)
                })
                return;
            }
            uiBuilder.duplicateUI(id);
            return uiManager.open(player, config.uiNames.UIBuilderRoot);
        })
        if(http.player) {
            actionForm.label("Leaf Network")
            let published = doc.data.accessToken ? true : false
            if(published) {
                actionForm.button(`§cDelete from Servers\n§7Delete this UI from leaf servers`, `textures/azalea_icons/Delete`, player=>{
                    uiManager.open(player, config.uiNames.MCBEToolsAuth, (token)=>{
                        uiManager.open(player, config.uiNames.Basic.Confirmation, "Are you sure you want to remove this GUI from the public GUI list?", ()=>{
                            http.makeRequest({
                                method: "post",
                                url: `${config.Endpoint}/remove-ui/${doc.data.accessToken}`,
                                headers: {
                                    Authorization: token
                                }
                            }, (status, data)=>{
                                if(data.startsWith(".ERR:")) return player.error(data.substring(5))
                                doc.data.accessToken = "";
                                uiBuilder.db.overwriteDataByID(doc.id, doc.data)
                                uiManager.open(player, config.uiNames.UIBuilderEdit, id)
                            })
                        }, ()=>{
                            uiManager.open(player, config.uiNames.UIBuilderEdit, id)

                        })
                    })
                })
            }
            actionForm.button(`§d${published ? "Update" : "Publish"}\n§7${published ? "Ppublish" : "Publish"} this UI ${published ? "to" : "to"} the leaf servers`, icons.resolve("Packs/Asteroid/global"), (player)=>{
                uiManager.open(player, config.uiNames.MCBEToolsAuth, (token)=>{
                    http.makeRequest({
                        method: 'post',
                        url: `${config.Endpoint}/post-gui`,
                        data: {
                            GuiType: "LIST",
                            PublishedByToken: token,      
                            GuiData: doc.data
                        }
                    }, (status, data)=>{
                        system.run(()=>{
                            if(status == 200) {
                                if(data.startsWith('.ERR:')) return player.error(data.substring(5))
                                doc.data.accessToken = data;
                                uiBuilder.db.overwriteDataByID(doc.id, doc.data)
                            }
                            uiManager.open(player, config.uiNames.UIBuilderEdit, id)
        
                        })
    
                    })    
                })
                return;
                if(published) {
                    uiManager.open(player, config.uiNames.UIBuilderEdit, id)
                } else {
                }
            })
        }
        if(doc.data.original) {
            actionForm.button(`§6Revert\n§7Revert this UI to its original state`, `textures/azalea_icons/Delete`, (player)=>{
                doc.data = {
                    ...doc.data.original,
                    ...doc
                }
                uiBuilder.db.overwriteDataByID(doc.id, doc.data)
                uiManager.open(player, config.uiNames.UIBuilderEdit, id)
            })
        }
        // actionForm.label("§cDANGER ZONE")
        actionForm.button(`§cDelete\n§7Delete this UI`, `textures/azalea_icons/SidebarTrash`, player=>{
            uiManager.open(player, config.uiNames.Basic.Confirmation, "Are you sure you want to delete this GUI?", ()=>{
                uiBuilder.db.trashDocumentByID(doc.id)
                return uiManager.open(player, config.uiNames.UIBuilderRoot)    
            }, ()=>{
                return uiManager.open(player, config.uiNames.UIBuilderEdit, id);
            });
        })
        function verifyPin(stored, inputed) {
            if(!inputed) return false;
            if(stored.length != inputed.length) return false;
            let val = true;
            for(let i = 0; i < stored.length;i++) {
                if(stored[i] != inputed[i]) {
                    val = false;
                    break;
                }
            }
            return val;
        }
        if(doc.data.pin && doc.data.pin.length) {
            actionForm.button(`§cRemove Pin\n§7Remove the pin for this UI`, `textures/items/lock`, player=>{
                uiManager.open(player, config.uiNames.Basic.PinCode, [], (inputs)=>{
                    if(verifyPin(doc.data.pin, inputs)) {
                        doc.data.pin = null;
                        doc.data.pinSetBy = null
                        uiBuilder.db.overwriteDataByID(doc.id, doc.data)                
                    }
                    uiManager.open(player, config.uiNames.UIBuilderEdit, id)
                })
            })
        } else {
            actionForm.button(`§eSet Pin\n§7Set a pin for this UI for other players`, `textures/items/lock`, player=>{
                uiManager.open(player, config.uiNames.Basic.PinCode, [], (inputs)=>{
                    if(inputs) {
                        doc.data.pin = inputs;
                        doc.data.pinSetBy = player.id
                        uiBuilder.db.overwriteDataByID(doc.id, doc.data)    
                    }
                    uiManager.open(player, config.uiNames.UIBuilderEdit, id)
                })
            })
        
        }
        if(doc.data.pin && doc.data.pin.length && player.id != doc.data.pinSetBy && !doc.data.internal) {
            uiManager.open(player, config.uiNames.Basic.PinCode, [], (inputs)=>{
                if(verifyPin(doc.data.pin, inputs)) {
                    actionForm.show(player, false, (player, response)=>{
    
                    })
                } else {
                    player.error("Incorrect PIN")
                    uiManager.open(player, config.uiNames.UIBuilderRoot)
                }
            })
        
        } else {
            actionForm.show(player, false, (player, response)=>{
    
            })
        
        }
    } catch(e) {
        player.error(`Failed to open edit interface: ${e}`)
    }
});