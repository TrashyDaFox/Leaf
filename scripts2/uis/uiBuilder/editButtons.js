import { formatStr } from "../../api/azaleaFormatting";
import icons from "../../api/icons";
import uiBuilder from "../../api/uiBuilder";
import config from "../../versionData";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.UIBuilderEditButtons, "Edit Buttons in a UI", (player, id, multiselect = [])=>{
    if(id == 1719775088275) return;
    let form = uiBuilder.db.getByID(id);
    let actionForm = new ActionForm();
    let pre = `§r`;

    let nutUIPreview = !player.hasTag("nut-ui-preview-disable")
    if(form.data.layout == 1) pre = `§g§r§i§d§u§i§r`;
    if(form.data.layout == 2) pre = `§f§u§l§l§s§c§r§e§e§n§r`;
    if(form.data.layout == 3) pre = `§t§e§s§t§r`;
    if(form.data.layout == 4 && nutUIPreview) pre = `§f§0§0§r`
    actionForm.title(`${pre}${form.data.name}`)
    let multiselectMode = player.hasTag("ui-builder-multiselect")
    // nutUIText = `${button.disabled ? "§e(DISABLED) " : ""}${button.nutUIAlt ? "§a§l§t§b§t§n" : ""}${button.nutUIHalf == 2 ? "§p§1§2" : button.nutUIHalf == 1 ? "§p§2§2" : button.nutUIHalf == 3 ? "§p§2§2§p§2§1" : button.nutUIHalf == 4 ? "§p§2§1§p§1§2" : button.nutUIHalf == 5 ? "§p§1§1§p§1§2" : ""}${button.nutUIHeaderButton ? "§p§4§0" : ""}${button.nutUINoSizeKey ? "§p§0§0" : ""}`;

    actionForm.button(`${multiselectMode ? "" : form.data.layout == 4 && nutUIPreview ? "§p§0§0§p§2§2§r" : ""}§nBack`, `textures/azalea_icons/2`, (player)=>{
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
                uiManager.open(player, config.uiNames.UIBuilderEditButtons, id)
            })
        }
        actionForm.button(`§aAdd Element\n§7Add button, header, or label`, `textures/azalea_icons/1`, (player)=>{
            let addMenu = new ActionForm();
            addMenu.title("Add Element");
            
            addMenu.button("§cBack\n§7Return to buttons", "textures/azalea_icons/2", (player)=>{
                uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
            });
    
            addMenu.button("§aAdd Button\n§7Interactive button", "textures/azalea_icons/add_button", (player)=>{
                uiManager.open(player, config.uiNames.UIBuilderAddButton, id);
            });
    
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
    
            addMenu.show(player, false, ()=>{});
        });
    
    }
    actionForm.button(`§aMultiselect ${multiselectMode ? "OFF" : "ON"}\n§7Do stuff`, `textures/ui/multiselection`, (player)=>{
        if(multiselectMode) {
            player.removeTag("ui-builder-multiselect")
        } else {
            player.addTag("ui-builder-multiselect")
        }
        uiManager.open(player, config.uiNames.UIBuilderEditButtons, id)
    })
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
        let nutUIText = "";
        try {
            nutUIText = `${button.disabled ? "§e(DISABLED) " : ""}${button.nutUIAlt ? "§a§l§t§b§t§n" : ""}${button.nutUIHalf == 2 ? "§p§1§2" : button.nutUIHalf == 1 ? "§p§2§2" : button.nutUIHalf == 3 ? "§p§2§2§p§2§1" : button.nutUIHalf == 4 ? "§p§2§1§p§1§2" : button.nutUIHalf == 5 ? "§p§1§1§p§1§2" : ""}${button.nutUIHeaderButton ? "§p§4§0" : ""}${button.nutUINoSizeKey ? "§p§0§0" : ""}`;
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
                uiManager.open(player, config.uiNames.UIBuilderEditButton, id, index);
            }
        });
    }

    actionForm.show(player, false, (player, response)=>{});
}); 