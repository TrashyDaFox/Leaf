import chestUIBuilder from "../../api/chest/chestUIBuilder";
import common from "../../api/chest/common";
import icons from "../../api/icons";
import config from "../../versionData";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import uiBuilder from "../../api/uiBuilder";
import { NUT_UI_TAG } from "../preset_browser/nutUIConsts";
import itemdb from "../../api/itemdb";
import { ItemTypes } from "@minecraft/server";
import { ChestFormData } from "../../lib/chestUI";
import _ from '../../api/iconViewer/underscore'
let items = [];

ItemTypes.getAll().forEach(a=>{
    if(!a.id.startsWith('minecraft:')) return;
    items.push(a.id)
})
uiManager.addUI(config.uiNames.ItemIconSelector, "Add", (player, page = 0, cb)=>{
    let chest = new ChestFormData("81");
    let pages = _.chunk(items, 9 * 8);
    chest.title(`Vanilla Icons (${page+1}/${pages.length})`)
    let icons = page >= pages.length ? pages[pages.length - 1] : page < 0 ? pages[0] : pages[page];
    let i = -1
    for(const icon of icons) {
        i++;
        chest.button(i, icon.split(':')[1].split('_').map(_=>_[0].toUpperCase()+_.substring(1)).join(' '), [], icon, 1, false, ()=>{
            cb(icon)
        })
    }
    chest.button((9 * 8), "Back", [], `textures/blocks/glass_red`, 1, false, ()=>{
        page--;
        if(page < 0) page = 0;
        uiManager.open(player, config.uiNames.ItemIconSelector, page, cb)
    })
    chest.button((9 * 8) + 8, "Next", [], `textures/blocks/glass_lime`, 1, false, ()=>{
        page++;
        if(page >= pages.length) page = pages.length - 1;
        uiManager.open(player, config.uiNames.ItemIconSelector, page, cb)
    })
    chest.show(player).then(res=>{
        if(res.canceled) {
            cb(null)
        }
    })
})
uiManager.addUI(config.uiNames.ChestGuiAddItem, "Add an item to a Chest GUI", (player, id, r, c, i = -1, data2, initial = true)=>{
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}§r${i > -1 ? "Editing" : "Creating"} Item`)
    if(i >= -1) {
        let chest = uiBuilder.db.getByID(id);
        if(!chest) return uiManager.open(player, config.uiNames.ChestGuiRoot);
        let data = data2 ? data2 : {row:r,col:c};
            //     slot,
            // iconID,
            // name,
            // lore,
            // action,
            // amount: itemStackAmount

        if(initial && i > -1) {
            data.iconID = chest.data.icons[i].iconID;
            let rowcol = common.slotIdToRowCol(chest.data.icons[i].slot)
            data.row = rowcol[0];
            data.col = rowcol[1];
            data.itemName = chest.data.icons[i].name;
            data.lore = chest.data.icons[i].lore;
            data.action = chest.data.icons[i].action;
            data.amount = chest.data.icons[i].amount;
            for(const key of Object.keys(chest.data.icons[i])) {
                data[key] = chest.data.icons[i][key]
            }
        }
        form.button(`§dSet Icon${!data.iconID ? " §c*" : ""}\n§7Set the icon`, data.iconID && typeof data.iconID == "string" && data.iconID.includes(':') ? null : data.iconID ? icons.resolve(data.iconID) : `textures/azalea_icons/NoTexture`, (player)=>{
            // uiManager.open(player, config.uiNames.IconViewer, 0, (player, iconID)=>{
                // if(iconID != null) data.iconID = iconID;
                // return uiManager.open(player, config.uiNames.ChestGuiAddItem, id, r, c, i, data, false);
            // });
            // return;
            let iconMenu = new ActionForm();
            iconMenu.title(NUT_UI_TAG)
            iconMenu.button(`Back`, null, (player)=>{
                return uiManager.open(player, config.uiNames.ChestGuiAddItem, id, r, c, i, data, false);
            })
            iconMenu.button(`Normal Icon`, null, (player)=>{
                uiManager.open(player, config.uiNames.IconViewer, 0, (player, iconID)=>{
                    if(iconID != null) data.iconID = iconID;
                    return uiManager.open(player, config.uiNames.ChestGuiAddItem, id, r, c, i, data, false);
                });
            })
            iconMenu.button(`Item Icon\nVanilla Icons`, null, (player)=>{
                uiManager.open(player, config.uiNames.ItemIconSelector, 0, (iconID)=>{
                    if(iconID != null) data.iconID = `^${iconID}`;
                    return uiManager.open(player, config.uiNames.ChestGuiAddItem, id, r, c, i, data, false);
                })
            })
            iconMenu.show(player, false, (player)=>{})
        })
        form.button(`§eSet Display${!data.itemName ? " §c*" : ""}\n§7Set the display`, `textures/azalea_icons/edit display`, (player)=>{
            let modal = new ModalForm();
            modal.textField("Name", "Item Name", data.itemName ? data.itemName : undefined);
            modal.textField("Lore Line 1", "Line 1 of lore text", data.lore ? data.lore[0] : undefined);
            modal.textField("Lore Line 2", "Line 2 of lore text", data.lore ? data.lore[1] : undefined);
            modal.textField("Lore Line 3", "Line 3 of lore text", data.lore ? data.lore[2] : undefined);
            modal.textField("Lore Line 4", "Line 4 of lore text", data.lore ? data.lore[3] : undefined);
            modal.textField("Lore Line 5", "Line 5 of lore text", data.lore ? data.lore[4] : undefined);
            modal.slider("Amount", 1, 64, 1, data.amount ? data.amount : 1);
            modal.show(player, false, (player, response)=>{
                if(response.canceled) return uiManager.open(player, config.uiNames.ChestGuiAddItem, id, r, c, i, data, false);
                
                let lore = [];
                if(response.formValues[1]) lore.push(response.formValues[1]);
                if(response.formValues[2]) lore.push(response.formValues[2]);
                if(response.formValues[3]) lore.push(response.formValues[3]);
                if(response.formValues[4]) lore.push(response.formValues[4]);
                if(response.formValues[5]) lore.push(response.formValues[5]);

                data.lore = lore;
                data.itemName = response.formValues[0];
                data.amount = response.formValues[6];
                return uiManager.open(player, config.uiNames.ChestGuiAddItem, id, r, c, i, data, false);
                // return form.show(player, false, (player, response)=>{})
            })
        })
        if(i == -1) {
            form.button(`§6Set Action${!data.action ? " §c*" : ""}\n§7Set the action`, `textures/azalea_icons/actions`, (player)=>{
                let modal = new ModalForm();
                modal.textField("Action", "Item Action", data.action ? data.action : undefined);
                modal.show(player, false, (player, response)=>{
                    if(response.canceled) return uiManager.open(player, config.uiNames.ChestGuiAddItem, id, r, c, i, data, false);

                    data.action = response.formValues[0];
                    return uiManager.open(player, config.uiNames.ChestGuiAddItem, id, r, c, i, data, false);
                })
            })
        }
        form.button(`§5Set Position\n§7Set the position`, `textures/azalea_icons/Conditions`, (player)=>{
            let modal = new ModalForm();
            modal.slider("Row (§9X§r§f)", 1, chest.data.rows, 1, data.row ? data.row : 1);
            modal.slider("Column (§eY§r§f)", 1, 9, 1, data.col ? data.col : 1);
            modal.show(player, false, (player, response)=>{
                if(response.canceled) return uiManager.open(player, config.uiNames.ChestGuiAddItem, id, r, c, i, data, false);

                data.row = response.formValues[0];
                data.col = response.formValues[1];
                return uiManager.open(player, config.uiNames.ChestGuiAddItem, id, r, c, i, data, false);
            })
        })
        form.button(`§2Sell Button\n§7Sell buttons real`, `textures/azalea_icons/icontextures/diamond`, (player)=>{
            try {
                let modal = new ModalForm();
                modal.toggle("Enable Sell Button (will override any normal actions on the button)", data.sellButtonEnabled ? true : false)
                modal.textField("Item (example: coal, minecraft:diamond, leaf:example_item). Automatically assumes 'minecraft:'", "minecraft:coal", data.sellButtonItem ? data.sellButtonItem : "minecraft:coal")
                modal.slider("Item count", 1, 64, 1, data.sellButtonItemCount ? data.sellButtonItemCount : 4)
                modal.textField("Item Value", "20", data.sellButtonPrice ? data.sellButtonPrice.toString() : "20")
                modal.textField("Scoreboard", "money", data.sellButtonScoreboard ? data.sellButtonScoreboard : "money")
                modal.show(player, false, (player, response)=>{
                    data.sellButtonEnabled = response.formValues[0];
                    data.sellButtonItem = response.formValues[1];
                    data.sellButtonItemCount = response.formValues[2];
                    data.sellButtonPrice = parseInt(response.formValues[3]) ? parseInt(response.formValues[3]) : 0;
                    data.sellButtonScoreboard = response.formValues[4];
                    uiManager.open(player, config.uiNames.ChestGuiAddItem, id, r, c, i, data, initial);
                })
        
            } catch(e) {
                world.sendMessage(`${e}`)
            }
        })
        // }
        // Add buy button menu after sell button
        form.button(`§bBuy Button\n§7Configure buy button`, `textures/azalea_icons/icontextures/emerald`, (player)=>{
            const buyForm = new ActionForm();
            buyForm.title(NUT_UI_TAG + "§rBuy Button Settings");

            buyForm.button("§cBack\n§7Return to button editor", "textures/azalea_icons/2", (player) => {
                uiManager.open(player, config.uiNames.ChestGuiAddItem, id, r, c, i, data, initial);
            });
    
            buyForm.button(`§aSet Price\n§7Configure price`, "textures/azalea_icons/icontextures/diamond", (player) => {
                const priceForm = new ModalForm();
                priceForm.toggle("Enable Buy Button (will override any normal actions on the button)", data.buyButtonEnabled ? true : false);
                priceForm.textField("Price", "20", data.buyButtonPrice ? data.buyButtonPrice.toString() : "20");
                priceForm.textField("Scoreboard", "money", data.buyButtonScoreboard ? data.buyButtonScoreboard : "money");
    
                priceForm.show(player, false, (player, response) => {
                    if (response.canceled) return uiManager.open(player, config.uiNames.ChestGuiAddItem, id, r, c, i, data, initial);
                    
                    data.buyButtonEnabled = response.formValues[0];
                    // Validate price is a number
                    const price = parseInt(response.formValues[1]);
                    data.buyButtonPrice = isNaN(price) ? 0 : price;
                    data.buyButtonScoreboard = response.formValues[2];
                    
                    uiManager.open(player, config.uiNames.ChestGuiAddItem, id, r, c, i, data, initial);

                });
            });
    
            buyForm.button(`§eSet Item\n§7Configure item to buy`, "textures/azalea_icons/ChestLarge", (player) => {
                // Placeholder - will be implemented later
                // uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
                uiManager.open(player, config.uiNames.Basic.ItemSelect, (player, item, slot)=>{
                    if(item) {
                        let [stash, slot] = itemdb.saveItem(item);
                        data.buyButtonItem = `${stash}:${slot}`;
                        uiManager.open(player, config.uiNames.ChestGuiAddItem, id, r, c, i, data, initial);
                    } else {
                        uiManager.open(player, config.uiNames.ChestGuiAddItem, id, r, c, i, data, initial);
                        // uiManager.open(player, config.uiNames.Shop.CategoryAdmin, shopID, categoryID);
        
                    }
                })
            });
            if(data.buyButtonItem) {
                buyForm.button(`§cRemove Item\n§7Make this a paid button`, `textures/azalea_icons/Delete`, (player)=>{
                    data.buyButtonItem = "";
                    uiManager.open(player, config.uiNames.ChestGuiAddItem, id, r, c, i, data, initial);
                    
                })
            }
    
            buyForm.show(player, false, () => {});
        });
    
        if(data.iconID && data.row && data.col && data.itemName && (data.action || data.buyButtonEnabled || data.sellButtonEnabled)) {
            form.button(`§c${i > -1 ? "Save" : "Create"}\n§7${i > -1 ? "Save" : "Create"} the item`, i > -1 ? `textures/azalea_icons/Save` : `textures/azalea_icons/1`, (player)=>{
                if(i > -1) {
                    uiBuilder.replaceIconInChestGUI(id, data.row, data.col, data.iconID, data.itemName, data.lore ? data.lore : [], data.amount ? data.amount : 1, data.action, i, {
                        buyButtonEnabled: data.buyButtonEnabled,
                        buyButtonItem: data.buyButtonItem,
                        buyButtonPrice: data.buyButtonPrice,
                        buyButtonScoreboard: data.buyButtonScoreboard,
                        sellButtonEnabled: data.sellButtonEnabled,
                        sellButtonItem: data.sellButtonItem,
                        sellButtonItemCount: data.sellButtonItemCount,
                        sellButtonPrice: data.sellButtonPrice,
                        sellButtonScoreboard: data.sellButtonScoreboard
                    });
                } else {
                    uiBuilder.addIconToChestGUI(id, data.row, data.col, data.iconID, data.itemName, data.lore ? data.lore : [], data.amount ? data.amount : 1, data.action, {
                        buyButtonEnabled: data.buyButtonEnabled,
                        buyButtonItem: data.buyButtonItem,
                        buyButtonPrice: data.buyButtonPrice,
                        buyButtonScoreboard: data.buyButtonScoreboard,
                        sellButtonEnabled: data.sellButtonEnabled,
                        sellButtonItem: data.sellButtonItem,
                        sellButtonItemCount: data.sellButtonItemCount,
                        sellButtonPrice: data.sellButtonPrice,
                        sellButtonScoreboard: data.sellButtonScoreboard
                    })
                }
                uiManager.open(player, config.uiNames.ChestGuiEditItems, id);
            })
        }
        return form.show(player, false, (player, response)=>{})
    }
    // let form = new ModalForm();
    // form.title(error ? `§c${error}` : index == -1 ? "Create Item" : "Edit Item");
    // form.textField("Item Name§c*", "Change the name of the item", defaultItemName); // 0
    // form.textField("Icon ID§c*", "Example: vanilla/iron_sword", defaultIconID); // 1
    // form.textField("Item Lore", "Comma-separated list of lore entries", defaultIconLore); // 2
    // form.textField("Action§c*", "Example: /say hello, world!", defaultAction); // 3
    // form.slider("Amount", 1, 64, 1, defaultAmount); // 4
    // form.slider("Row (§eY§r)", 1, chest.data.rows, 1, defaultRow); // 5
    // form.slider("Column (§9X§r)", 1, 9, 1, defaultColumn); // 6
    // form.show(player, false, (player, response)=>{
    //     try {
    //         if(index >= 0) {
    //             chestUIBuilder.replaceIconInChestGUI(id, response.formValues[5], response.formValues[6], response.formValues[1], response.formValues[0], response.formValues[2].split(','), response.formValues[4], response.formValues[3], index);
    //         } else {
    //             chestUIBuilder.addIconToChestGUI(id, response.formValues[5], response.formValues[6], response.formValues[1], response.formValues[0], response.formValues[2].split(','), response.formValues[4], response.formValues[3]);
    //         }
    //         uiManager.open(player, config.uiNames.ChestGuiEditItems, id);
    //     } catch(e) {
    //         uiManager.open(player, config.uiNames.ChestGuiAddItem, id, response.formValues[0], response.formValues[1], response.formValues[2], response.formValues[3], response.formValues[4], response.formValues[5], response.formValues[6], e, index);
    //     }
    // })
})
uiManager.addUI(config.uiNames.ChestGuiAddItemAdvanced, "Add an item to a Chest GUI", (player, id, defaultRow = 0, defaultCol = 0, code, index = -1)=>{
    let chest = uiBuilder.db.getByID(id);
    if(!chest) return uiManager.open(player, config.uiNames.ChestGuiRoot);
    if(chest.data.type !== 4) return uiManager.open(player, config.uiNames.ChestGuiRoot);
    let form = new ModalForm();
    form.title(`Code Editor`);
    form.textField("Code", "Write code here", code ? code : `setPos({row:${defaultRow}, col:${defaultCol}})`)
    form.show(player, false, (player, response)=>{
        try {
            if(index >= 0) {
                uiBuilder.replaceIconInChestGUIAdvanced(id, response.formValues[0]);
            } else {
                uiBuilder.addIconToChestGUIAdvanced(id, response.formValues[0]);
            }
            uiManager.open(player, config.uiNames.ChestGuiEditItems, id);
        } catch(e) {
            uiManager.open(player, config.uiNames.ChestGuiAddItemAdvanced, id, defaultRow, defaultCol, response.formValues[0], index);
        }
    })
})