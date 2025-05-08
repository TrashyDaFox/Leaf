import chestUIBuilder from "../../api/chest/chestUIBuilder";
import common from "../../api/chest/common";
import icons from "../../api/icons";
import translation from "../../api/translation";
import config from "../../versionData";
import { ChestFormData } from "../../lib/chestUI";
import uiManager from "../../uiManager";
import uiBuilder from "../../api/uiBuilder";
import { world } from "@minecraft/server";

uiManager.addUI(config.uiNames.ChestGuiEditItems, "Edit the items in Chest GUIs", (player, id)=>{
    let chest = uiBuilder.db.getByID(id);
    if(!chest) return uiManager.open(player, config.uiNames.ChestGuiRoot);
    if(chest.data.type !== 4) return uiManager.open(player, config.uiNames.ChestGuiRoot);
    let form = new ChestFormData((Math.min(chest.data.rows * 9, 6 * 9)).toString());
    let usedSlots = [];
    let advancedSlots = [];
    for(let i = 0;i < chest.data.icons.length;i++) {
        let icon = chest.data.icons[i];
        console.warn(icon)
        if(chest.data.advanced) {
            let data = {};
            let slot = 0;
            eval(`(({setIcon,setPos,setLore,setName,setOnclick,setAmount,player})=>{${icon}})`)({
                setIcon(iconID) {
                    data.iconID = iconID;
                },
                setPos({row, col}) {
                    data.slot = common.rowColToSlotId(row, col);
                },
                setName(name) {
                    data.name = name;
                },
                setLore(lore) {
                    data.lore = lore;
                },
                setAmount(amount) {
                    data.amount = amount;
                },
                setOnclick() {},
                player: player
            });
            form.button(data.slot ? data.slot : 0, data.name ? data.name : "Example Name", data.lore ? data.lore : [], icons.resolve(data.iconID), data.amount ? data.amount : 1);
            usedSlots.push(data.slot)
            advancedSlots.push({slot: data.slot, code: icon, index: i})
            continue;
        }
        usedSlots.push(icon.slot);
        form.button(icon.slot, icon.name, icon.lore, icons.resolve(icon.iconID), icon.amount);
    }
    form.title(`Edit (${chest.data.title}§r)`)
    for(let i = 0;i < (chest.data.rows * 9);i++) {
        // world.sendMessage(`${chest.data.patterns.findIndex(_=>_[0] == i)}`)
        if(chest.data.patterns && chest.data.patterns.find(_=>_[0] == i)) continue;
        if(usedSlots.includes(i)) continue;
        form.button(i, `§8[§2+§8] §a§l${translation.getTranslation(player, "chestguis.additem")}`, [translation.getTranslation(player, "chestguis.additemlore.line1"), translation.getTranslation(player, "chestguis.additemlore.line2"), translation.getTranslation(player, "chestguis.additemlore.line3")], "textures/blocks/glass_lime", 1);
    }
    //player, id, defaultItemName = "", defaultIconID = "", defaultIconLore = "", defaultAction = "", defaultAmount = 1, defaultRow = 1, defaultColumn = 1, error = "", index = -1
    form.show(player).then(res=>{
        if(res.canceled) return uiManager.open(player, config.uiNames.UIBuilderEdit, id);
        if(res.cancelled) return;
        if(!usedSlots.includes(res.selection)) {
            let [row,col] = common.slotIdToRowCol(res.selection);
            if(chest.data.advanced) {
                return uiManager.open(player, config.uiNames.ChestGuiAddItemAdvanced, id, row, col)
            }
            return uiManager.open(player, config.uiNames.ChestGuiAddItem, id, row, col, -1);
        }
        if(chest.data.advanced) {
            let slotData = advancedSlots.find(_=>_.slot == res.selection);
            if(slotData) {
                uiManager.open(player, config.uiNames.ChestGuiEditItem, id, slotData.index);
            }
        }
        let index = chest.data.icons.findIndex(_=>_.slot == res.selection);
        if(index > -1) {
            uiManager.open(player, config.uiNames.ChestGuiEditItem, id, index);
        }
    })
})