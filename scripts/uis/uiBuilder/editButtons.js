import { formatStr } from "../../api/azaleaFormatting";
import icons from "../../api/icons";
import uiBuilder from "../../api/uiBuilder";
import config from "../../versionData";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import { world } from "@minecraft/server";
import { NUT_UI_ALT, NUT_UI_HEADER_BUTTON, NUT_UI_PAPERDOLL, NUT_UI_TAG, NUT_UI_THEMED } from "../preset_browser/nutUIConsts";
import { themes } from "./cherryThemes";
import { ActionFormData } from "@minecraft/server-ui";

uiManager.addUI(config.uiNames.UIBuilderEditButtons, "Edit Buttons in a UI", (player, id, multiselect = [], selectingButton = false, response)=>{
    if(id == 1719775088275) return;
    let form = uiBuilder.db.getByID(id);
    let actionForm = new ActionForm();
    let pre = `§r`;
    let snippetBook = uiBuilder.getSnippetBook();
    let nutUIPreview = !player.hasTag("nut-ui-preview-disable")
    if(form.data.layout == 1) pre = `§g§r§i§d§u§i§r`;
    if(form.data.layout == 2) pre = `§f§u§l§l§s§c§r§e§e§n§r`;
    if(form.data.layout == 3) pre = `§t§e§s§t§r`;
    let themID = form.data.theme ? form.data.theme : 0;
    let themString = themID > 0 ? `${NUT_UI_THEMED}${themes[themID] ? themes[themID][0] : ""}` : ``;
    let nutUIAlt = themID > 0 ? `${NUT_UI_ALT}${themes[themID] ? themes[themID][0] : ""}` : `${NUT_UI_ALT}`
    if(form.data.layout == 4 && nutUIPreview) pre = `§f§0§0${themString}§r`
    actionForm.title(`${form.data.layout == 4 && form.data.paperdoll ? NUT_UI_PAPERDOLL : ``}${pre}${form.data.name}`)
    let multiselectMode = player.hasTag("ui-builder-multiselect") && !selectingButton;
    // nutUIText = `${button.disabled ? "§e(DISABLED) " : ""}${button.nutUIAlt ? "§a§l§t§b§t§n" : ""}${button.nutUIHalf == 2 ? "§p§1§2" : button.nutUIHalf == 1 ? "§p§2§2" : button.nutUIHalf == 3 ? "§p§2§2§p§2§1" : button.nutUIHalf == 4 ? "§p§2§1§p§1§2" : button.nutUIHalf == 5 ? "§p§1§1§p§1§2" : ""}${button.nutUIHeaderButton ? "§p§4§0" : ""}${button.nutUINoSizeKey ? "§p§0§0" : ""}`;

    actionForm.button(`${multiselectMode ? "" : form.data.layout == 4 && nutUIPreview ? "§p§0§0§p§2§2§r" : ""}§nBack`, `textures/azalea_icons/2`, (player)=>{
        if(selectingButton) {
            return response(null)
        }
        uiManager.open(player, config.uiNames.UIBuilderEdit, id)
    })
    if(multiselectMode && multiselect.length) {
        actionForm.button(`§cDelete ${multiselect.length} button${multiselect.length > 1 ? "s" : ""}\n§7Deletes all selected buttons`, `textures/azalea_icons/Delete`, (player)=>{
            uiManager.open(player, config.uiNames.Basic.Confirmation, `Are you sure you want to delete ${multiselect.length} button${multiselect.length > 1 ? "s" : ""}?`, ()=>{
                form.data.buttons = form.data.buttons.filter(_=>!multiselect.includes(_.id))
                uiManager.open(player, config.uiNames.UIBuilderEditButtons, id)
            }, ()=>{
                uiManager.open(player, config.uiNames.UIBuilderEditButtons, id, multiselect)
            })
        })
    }
    if(!multiselectMode) {
        if(form.data.layout == 4 || form.data.layout == 1) {
            actionForm.button(`${form.data.layout == 4 && nutUIPreview ? "§p§1§2§r" : ""}§dPreview ${nutUIPreview ? "OFF" : "ON"}\n§7[ Click to Toggle ]`, `textures/ui/icon_preview`, (player)=>{
                if(player.hasTag("nut-ui-preview-disable")) {
                    player.removeTag("nut-ui-preview-disable")
                } else {
                    player.addTag("nut-ui-preview-disable")
                }
                uiManager.open(player, config.uiNames.UIBuilderEditButtons, id, multiselect, selectingButton, response)
            })
        }
        if(!selectingButton) {
            actionForm.button(`§aAdd Element\n§7Add button, header, or label`, `textures/azalea_icons/1`, (player)=>{
                let addMenu = new ActionForm();
                addMenu.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[3][0]}§rAdd Element`);
                
                addMenu.button(`${NUT_UI_HEADER_BUTTON}§cBack\n§7Return to buttons`, "textures/azalea_icons/2", (player)=>{
                    uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                });
        
                addMenu.button("§aAdd Button\n§7Interactive button", "textures/azalea_icons/add_button", (player)=>{
                    uiManager.open(player, config.uiNames.UIBuilderAddButton, id);
                });
        
                addMenu.button("§dAdd Button Group\n§7Group of buttons", "textures/azalea_icons/add_button", (player)=>{
                    let modal = new ModalForm();
                    modal.title("Create Button Group");
                    
                    if(form.data.layout === 4) {
                        modal.toggle("Button Row (max 3 buttons)", false);
                        modal.show(player, false, (player, response)=>{
                            if(response.canceled) return uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                            
                            uiBuilder.addButtonGroupToUI(id, form.data.layout === 4 ? response.formValues[0] : false);
                            uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                        });
        
                    } else {
                        uiBuilder.addButtonGroupToUI(id, false);
                        uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                    }
                    
                });
                let form2 = new ActionFormData();
                if(form2.divider && form2.header && form2.label) {
                    addMenu.button("§bAdd Header\n§7Large text display", "textures/azalea_icons/add_header", (player)=>{
                        let modal = new ModalForm();
                        modal.textField("Header Text", "Enter header text", "");
                        modal.show(player, false, (player, response)=>{
                            if(response.canceled) return uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                            if(!response.formValues[0]) return uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                            
                            uiBuilder.addButtonToUI(id, response.formValues[0], null, "", "", "", {
                                type: "header",
                                text: response.formValues[0]
                            });
                            uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                        });
                    });
                    addMenu.button("§eAdd Label\n§7Regular text display", "textures/azalea_icons/add_label", (player)=>{
                        let modal = new ModalForm();
                        modal.textField("Label Text", "Enter label text", "");
                        modal.show(player, false, (player, response)=>{
                            if(response.canceled) return uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                            if(!response.formValues[0]) return uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                            
                            uiBuilder.addButtonToUI(id, response.formValues[0], null, "", "", "", {
                                type: "label",
                                text: response.formValues[0]
                            });
                            uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                        });
                    });
            
                    addMenu.button("§vAdd Divider\n§7Separator Line", "textures/items/add_divider", (player)=>{
                        uiBuilder.addButtonToUI(id, " ", null, "", "", "", {
                            type: "divider",
                        });
                        uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                    });
    
                }
                if(id != snippetBook.id) {
                    addMenu.button("§cAdd From Snippet Book\n§7Snippet book component", icons.resolve(`leaf/image-0876`), (player)=>{
                        uiManager.open(player, config.uiNames.UIBuilderEditButtons, snippetBook.id, [], true, (snID)=>{
                            if(snID != null) {
                                uiBuilder.addButtonToUI(id, " ", null, "", "", "", {
                                    ...snippetBook.data.buttons.find(_=>_.id == snID)
                                })
                            }
                            uiManager.open(player, config.uiNames.UIBuilderEditButtons, id)
                        })
                    })
        
                }
    
                addMenu.show(player, false, ()=>{});
            });
    
        }
    
    }
    if(!selectingButton) {
        actionForm.button(`§aMultiselect ${multiselectMode ? "OFF" : "ON"}\n§7Do stuff`, `textures/ui/multiselection`, (player)=>{
            if(multiselectMode) {
                player.removeTag("ui-builder-multiselect")
            } else {
                player.addTag("ui-builder-multiselect")
            }
            uiManager.open(player, config.uiNames.UIBuilderEditButtons, id)
        })
    
    }
    if(!nutUIPreview && form.data.layout == 4) {
        // actionForm.button(`§p§4§0§r§f§aPreview Mode OFF\n§7This will give you a raw view of your UI.`, `textures/ui/icon_preview`)
    }
    // Add Button section with submenu

    if(form.data.layout == 0) actionForm.divider()
    /*
        "$key": "§p§4§0",
"$BUTTON_SIZER_left_third": "§p§1§1",
	"$BUTTON_SIZER_right_third": "§p§2§1",
	"$BUTTON_SIZER_left_half": "§p§1§2",
	"$BUTTON_SIZER_right_half": "§p§2§2",
	"$VERTICAL_PROCESSING_no_height_key": "§p§0§0",
    */
    // List existing buttons/headers/labels
    for(let index = 0;index < form.data.buttons.length;index++) {
        let button = form.data.buttons[index];
        // let isSnippetBook = false;
        // if(button.type == "snippetbook") {
        //     button = snippetBook.buttons.find(_=>_.id == button.snippetBookID)
        //     if(!button) continue;
        //     isSnippetBook = true;
        // }
        
        if(button.type === "group") {
            let isButtonRow = form.data.layout === 4 && button.buttonRow;
            let groupText = isButtonRow ? "§eButton Row" : "§eButton Group";
            const groupIndex = index;
            let buttonCount = button.buttons.length;
            
            actionForm.button(
                `${groupText}\n§7${buttonCount} button${buttonCount !== 1 ? "s" : ""}`,
                "textures/azalea_icons/ClickyClick",
                (player)=>{
                    if(selectingButton) return response(button.id)
                    let groupMenu = new ActionForm();
                    groupMenu.title(isButtonRow ? "Edit Button Row" : "Edit Button Group");
                    
                    groupMenu.button("§cBack\n§7Return to buttons", "textures/azalea_icons/2", (player)=>{
                        uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                    });
                    
                    groupMenu.button("§dPreview\n§7See how it looks", "textures/ui/icon_preview", (player)=>{
                        let previewForm = new ActionForm();
                        previewForm.title(`${pre}${form.data.name}`);
                        
                        for(const groupButton of button.buttons) {
                            let nutUIText = "";
                            if(form.data.layout === 4 && nutUIPreview) {
                                // Base NUT UI formatting
                                nutUIText = `${groupButton.disabled ? "§p§3§0" : ""}${groupButton.nutUIAlt || (groupButton.nutUIColorCondition ? this.playerIsAllowed(player, groupButton.nutUIColorCondition) : false) ? "§a§l§t§b§t§n" : ""}`;
                                
                                if(button.buttonRow) {
                                    // Button Row formatting (max 3 buttons)
                                    switch(button.buttons.length) {
                                        case 1:
                                            nutUIText += "§p§0§0"; // Whole width
                                            break;
                                        case 2:
                                            if(index === 0) {
                                                nutUIText += "§p§2§2§p§0§0"; // Left half with no vertical size key
                                            } else {
                                                nutUIText += "§p§1§2"; // Right half
                                            }
                                            break;
                                        case 3:
                                            if(index === 0) {
                                                nutUIText += "§p§2§2§p§2§1§p§0§0"; // Left third with no vertical size key
                                            } else if(index === 1) {
                                                nutUIText += "§p§2§1§p§1§2§p§0§0"; // Middle third with no vertical size key
                                            } else {
                                                nutUIText += "§p§1§1§p§1§2"; // Right third
                                            }
                                            break;
                                    }
                                } else {
                                    nutUIText += "§p§0§0"; // Full width for each button
                                }

                                if(groupButton.nutUIHeaderButton) {
                                    nutUIText += "§p§4§0";
                                }
                            }

                            previewForm.button(
                                `${form.data.layout == 4 && nutUIPreview ? `${nutUIText}§r§f` : ""}${groupButton.text}${groupButton.subtext ? `\n§7${groupButton.subtext}` : ""}`,
                                groupButton.iconID ? icons.resolve(groupButton.iconID) : null,
                                ()=>{}
                            );
                        }
                        
                        previewForm.show(player, false, ()=>{
                            uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                        });
                    });
                    
                    if(form.data.layout === 4) {
                        groupMenu.button(
                            `§6Button Row: ${button.buttonRow ? "ON" : "OFF"}\n§7Max 3 buttons per row`,
                            null,
                            (player)=>{
                                button.buttonRow = !button.buttonRow;
                                uiBuilder.db.overwriteDataByID(id, form.data);
                                uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                            }
                        );
                    }

                    if(!button.buttonRow || button.buttons.length < 3) {
                        groupMenu.button("§aAdd Button\n§7Add to group", "textures/azalea_icons/add_button", (player)=>{
                            uiManager.open(player, config.uiNames.UIBuilderAddButton, id, -1, {
                                parentGroup: groupIndex,
                                displayOverrides: [],
                                iconOverrides: [],
                                actions: []
                            });
                        });
                    }

                    for(let i = 0; i < button.buttons.length; i++) {
                        let groupButton = button.buttons[i];
                        let moveText = isButtonRow ? 
                            `§r${groupButton.text}` :
                            `§r${groupButton.text}`;
                        
                        groupMenu.button(
                            `${moveText}${groupButton.subtext ? `\n§7${groupButton.subtext}` : ""}`,
                            groupButton.iconID ? icons.resolve(groupButton.iconID) : null,
                            (player)=>{
                                let buttonMenu = new ActionForm();
                                buttonMenu.title("Button Options");
                                
                                buttonMenu.button("§cBack", "textures/azalea_icons/2", (player)=>{
                                    uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                                });
                                
                                buttonMenu.button("§eEdit Button", "textures/azalea_icons/edit", (player)=>{
                                    uiManager.open(player, config.uiNames.UIBuilderAddButton, id, groupIndex, {
                                        isGroupButton: true,
                                        buttonIndex: i,
                                        ...groupButton
                                    });
                                });
                                
                                // Add edit actions button
                                buttonMenu.button(`§uEdit Actions\n§7Edit the actions`, `textures/azalea_icons/action edit`, (player)=>{
                                    // Initialize actions array if it doesn't exist
                                    if (!groupButton.actions) {
                                        groupButton.actions = groupButton.action ? [groupButton.action] : [];
                                        uiBuilder.db.overwriteDataByID(id, form.data);
                                    }
                                    
                                    uiManager.open(player, "edit_actions", id, groupIndex, i);
                                });
                                
                                if(i > 0) {
                                    buttonMenu.button(
                                        isButtonRow ? "§aMove Left" : "§aMove Up",
                                        isButtonRow ? "textures/azalea_icons/left_arrow" : "textures/azalea_icons/up_arrow",
                                        (player)=>{
                                            // Store current button
                                            const currentButton = button.buttons[i];
                                            // Store previous button
                                            const prevButton = button.buttons[i - 1];
                                            // Swap positions
                                            button.buttons[i - 1] = currentButton;
                                            button.buttons[i] = prevButton;
                                            // Save changes
                                            uiBuilder.db.overwriteDataByID(id, form.data);
                                            uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                                        }
                                    );
                                }
                                
                                if(i < button.buttons.length - 1) {
                                    buttonMenu.button(
                                        isButtonRow ? "§6Move Right" : "§6Move Down", 
                                        isButtonRow ? "textures/azalea_icons/right_arrow" : "textures/azalea_icons/down_arrow",
                                        (player)=>{
                                            // Store current button
                                            const currentButton = button.buttons[i];
                                            // Store next button
                                            const nextButton = button.buttons[i + 1];
                                            // Swap positions
                                            button.buttons[i + 1] = currentButton;
                                            button.buttons[i] = nextButton;
                                            // Save changes
                                            uiBuilder.db.overwriteDataByID(id, form.data);
                                            uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                                        }
                                    );
                                }
                                
                                buttonMenu.button("§cDelete Button", "textures/azalea_icons/Delete", (player)=>{
                                    // Remove button at specific index
                                    button.buttons.splice(i, 1);
                                    // Save changes
                                    uiBuilder.db.overwriteDataByID(id, form.data);
                                    uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                                });
                                
                                buttonMenu.show(player, false, ()=>{});
                            }
                        );
                    }

                    if(groupIndex > 0) {
                        groupMenu.button(
                            "§aMove Up\n§7Move group up",
                            "textures/azalea_icons/up_arrow",
                            (player)=>{
                                uiBuilder.moveButtonInUI(id, "up", groupIndex);
                                uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                            }
                        );
                    }

                    if(groupIndex < form.data.buttons.length - 1) {
                        groupMenu.button(
                            "§6Move Down\n§7Move group down",
                            "textures/azalea_icons/down_arrow",
                            (player)=>{
                                uiBuilder.moveButtonInUI(id, "down", groupIndex);
                                uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                            }
                        );
                    }

                    groupMenu.button(
                        "§aDuplicate Group\n§7Create a copy",
                        "textures/azalea_icons/copy",
                        (player)=>{
                            // Create deep copy of the group
                            const groupCopy = JSON.parse(JSON.stringify(button));
                            
                            // Insert copy after current group
                            form.data.buttons.splice(groupIndex + 1, 0, groupCopy);
                            uiBuilder.db.overwriteDataByID(id, form.data);
                            uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                        }
                    );

                    groupMenu.button(
                        "§cDelete Group\n§7Remove entire group",
                        "textures/azalea_icons/Delete",
                        (player)=>{
                            uiManager.open(player, config.uiNames.Basic.Confirmation,
                                "Are you sure you want to delete this group?",
                                ()=>{
                                    form.data.buttons.splice(groupIndex, 1);
                                    uiBuilder.db.overwriteDataByID(id, form.data);
                                    uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                                },
                                ()=>{
                                    uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                                }
                            );
                        }
                    );

                    groupMenu.show(player, false, ()=>{});
                }
            );
            continue;
        }

        let nutUIText = "";
        try {
            nutUIText = `${button.disabled ? "§e(DISABLED) " : ""}${button.nutUIAlt ? nutUIAlt : ""}${button.nutUIHalf == 2 ? "§p§1§2" : button.nutUIHalf == 1 ? "§p§2§2" : button.nutUIHalf == 3 ? "§p§2§2§p§2§1" : button.nutUIHalf == 4 ? "§p§2§1§p§1§2" : button.nutUIHalf == 5 ? "§p§1§1§p§1§2" : ""}${button.nutUIHeaderButton ? "§p§4§0" : ""}${button.nutUINoSizeKey ? "§p§0§0" : ""}`;
        } catch(e) {
            player.sendMessage(`Failed to load NUT UI DATA: ${e}`)
        }
        let displayText = button.type === "header" ? `§b[Header] ${button.text}` :
                         button.type === "label" ? `§e[Label] ${button.text}` :
                         button.type == "divider" ? `§vDivider` :
                         formatStr(`${form.data.layout == 4 && nutUIPreview ? `${nutUIText}§r§f` : ""}${button.text}${button.subtext ? `\n§r§7${button.subtext}` : ``}`, player);
        
        actionForm.button(displayText, multiselectMode ? multiselect.includes(button.id) ? "textures/ui/checkbox_check" : "textures/ui/checkbox_space" : button.iconID ? icons.resolve(button.iconID) : null, (player)=>{
            if(multiselectMode) {
                if(multiselect.includes(button.id)) {
                    multiselect = multiselect.filter(_=>_ != button.id)
                } else {
                    multiselect.push(button.id)
                }
                uiManager.open(player, config.uiNames.UIBuilderEditButtons, id, multiselect)
                return;
            }
            if(button.type === "header" || button.type === "label") {
                if(selectingButton) return response(button.id)

                // let modal = new ModalForm();
                // modal.textField(`${button.type === "header" ? "Header" : "Label"} Text`, "Enter text", button.text);
                // modal.show(player, false, (player, response)=>{
                //     if(response.canceled) return uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                //     if(!response.formValues[0]) return uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                    
                //     form.data.buttons[index].text = response.formValues[0];
                //     uiBuilder.db.overwriteDataByID(id, form.data);
                //     uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                // });
                uiManager.open(player, config.uiNames.UIBuilderEditButton, id, index);
            } else {
                if(selectingButton) return response(button.id)
                uiManager.open(player, config.uiNames.UIBuilderEditButton, id, index);
            }
        });
    }

    actionForm.show(player, false, (player, response)=>{});
}); 