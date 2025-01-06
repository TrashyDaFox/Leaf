import chestUIBuilder from "../../api/chest/chestUIBuilder";
import common from "../../api/chest/common";
import icons from "../../api/icons";
import config from "../../config";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.ChestGuiAddItem, "Add an item to a Chest GUI", (player, id, r, c, i = -1, data2, initial = true)=>{
    let form = new ActionForm();
    if(i >= -1) {
        let chest = chestUIBuilder.db.getByID(id);
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
        }
        form.button(`§dSet Icon${!data.iconID ? " §c*" : ""}\n§7Set the icon`, data.iconID ? icons.resolve(data.iconID) : null, (player)=>{
            uiManager.open(player, config.uiNames.IconViewer, 0, (player, iconID)=>{
                if(iconID != null) data.iconID = iconID;
                return uiManager.open(player, config.uiNames.ChestGuiAddItem, id, r, c, i, data, false);
            });
        })
        form.button(`§eSet Display${!data.itemName ? " §c*" : ""}\n§7Set the display`, null, (player)=>{
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
        form.button(`§6Set Action${!data.action ? " §c*" : ""}\n§7Set the action`, null, (player)=>{
            let modal = new ModalForm();
            modal.textField("Action", "Item Action", data.action ? data.action : undefined);
            modal.show(player, false, (player, response)=>{
                if(response.canceled) return uiManager.open(player, config.uiNames.ChestGuiAddItem, id, r, c, i, data, false);

                data.action = response.formValues[0];
                return uiManager.open(player, config.uiNames.ChestGuiAddItem, id, r, c, i, data, false);
            })
        })
        form.button(`§5Set Position\n§7Set the position`, null, (player)=>{
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
        if(data.iconID && data.row && data.col && data.itemName && data.action) {
            form.button(`§c${i > -1 ? "Edit" : "Create"}\n§7${i > -1 ? "Edit" : "Create"} the item`, null, (player)=>{
                if(i > -1) {
                    chestUIBuilder.replaceIconInChestGUI(id, data.row, data.col, data.iconID, data.itemName, data.lore ? data.lore : [], data.amount ? data.amount : 1, data.action, i);
                } else {
                    chestUIBuilder.addIconToChestGUI(id, data.row, data.col, data.iconID, data.itemName, data.lore ? data.lore : [], data.amount ? data.amount : 1, data.action)
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
    let chest = chestUIBuilder.db.getByID(id);
    if(!chest) return uiManager.open(player, config.uiNames.ChestGuiRoot);
    let form = new ModalForm();
    form.title(`Code Editor`);
    form.textField("Code", "Write code here", code ? code : `setPos({row:${defaultRow}, col:${defaultCol}})`)
    form.show(player, false, (player, response)=>{
        try {
            if(index >= 0) {
                chestUIBuilder.replaceIconInChestGUIAdvanced(id, response.formValues[0]);
            } else {
                chestUIBuilder.addIconToChestGUIAdvanced(id, response.formValues[0]);
            }
            uiManager.open(player, config.uiNames.ChestGuiEditItems, id);
        } catch(e) {
            uiManager.open(player, config.uiNames.ChestGuiAddItemAdvanced, id, defaultRow, defaultCol, response.formValues[0], index);
        }
    })
})