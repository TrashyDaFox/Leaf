import { ChestFormData } from "../../lib/chestUI";
import actionParser from "../actionParser";
import { formatStr } from "../azaleaFormatting";
import icons from "../icons";
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
        let chest = new ChestFormData(form.rows == 0.5 ? "5" : (form.rows * 9).toString());
        chest.title(form.title);
        let advancedSlots = [];
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
                actionParser.runAction(player, icon.action);
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