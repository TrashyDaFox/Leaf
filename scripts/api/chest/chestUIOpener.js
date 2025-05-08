import { ChestFormData } from "../../lib/chestUI";
import actionParser from "../actionParser";
import { formatStr } from "../azaleaFormatting";
import icons from "../icons";
import normalForm from "../openers/normalForm";
import uiBuilder from "../uiBuilder";
import common from "./common";

class ChestGUIOpener {
    parseArgs(player, str, ...args) {
        let newStr = str;
        for(let i = 0;i < args.length;i++) {
            newStr = newStr.replaceAll(`<$${i+1}>`, args[i])
        }
        return formatStr(newStr, player);
    }
    open(form, player, ...args) {
        let chest = new ChestFormData(form.rows == 0.5 ? "5" : (Math.min(form.rows * 9, 6 * 9)).toString());
        chest.title(form.title);
        let advancedSlots = [];
        if(form.background && form.background != 0) {
            for(let i = 0;i < Math.min(form.rows * 9, 6 * 9);i++) {
                chest.button(i, `§cX`, [], uiBuilder.patternIDs[form.background].dispTexture ? uiBuilder.patternIDs[form.background].dispTexture : uiBuilder.patternIDs[form.background].texture, 1, false, ()=>{
                    this.open(form, player, ...args)
                })
            }
        }
        if(form.patterns) {
            for(const pattern of form.patterns) {
                chest.button(pattern[0], `§cX`, [], uiBuilder.patternIDs[pattern[1]].dispTexture ? uiBuilder.patternIDs[pattern[1]].dispTexture : uiBuilder.patternIDs[pattern[1]].texture, 1, false, ()=>{
                    this.open(form, player, ...args)
                })
            }
        }
        if(form.advanced) {
            for(let i = 0;i < form.icons.length;i++) {
                let icon = form.icons[i];
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
                    setOnclick(fn) {
                        data.onclick = fn;
                    },
                    player: player
                });
                advancedSlots.push({slot: data.slot, data: icon, data2: data, index: i});
                chest.button(
                    data.slot ? data.slot : 0,
                    data.name ? this.parseArgs(player, data.name, ...args) : "Example Name",
                    data.lore ? data.lore.map(str=>this.parseArgs(player, str, ...args)) : [],
                    icons.resolve(data.iconID),
                    data.amount ? data.amount : 1
                );
            }
            chest.show(player).then(res=>{
                if(res.canceled) return;
                let icon = advancedSlots.find(_=>_.slot == res.selection);
                if(icon && icon.data2.onclick) {
                    icon.data2.onclick(player);
                }
            })
            return;
        }
        for(const icon of form.icons) {
            chest.button(player.name == "OG clapz9521" ? Math.floor(Math.random() * (form.rows * 9)) :  icon.slot, this.parseArgs(player, icon.name, ...args), icon.lore ? icon.lore.map(str=>this.parseArgs(player, str, ...args)) : [], icons.resolve(icon.iconID), icon.amount);
        }
        chest.show(player).then(res=>{
            if(res.canceled) return;
            let icon = form.icons.find(_=>_.slot == res.selection);
            if(icon) {
                if(icon.buyButtonEnabled) {
                    normalForm.handleTransaction(player, icon, true).then(()=>{
                        this.open(form, player, ...args);
                    });
                } else if(icon.sellButtonEnabled) {
                    normalForm.handleTransaction(player, icon, false).then(()=>{
                        this.open(form, player, ...args);
                    });
                } else {
                    if(!icon.actions) {
                        actionParser.runAction(player, icon.action);
                    } else {
                        for(const action of icon.actions) {
                            actionParser.runAction(player, action);
                        }
                    }
                }
            }
        })
        // {
        //     row,
        //     col,
        //     iconID,
        //     name,
        //     lore,
        //     amount: itemStackAmount
        // }
    }
}

export default new ChestGUIOpener();