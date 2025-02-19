import { world } from "@minecraft/server";
import { ActionForm, ModalForm } from "../../lib/form_func";
import actionParser from "../actionParser";
import { formatStr } from "../azaleaFormatting";
import configAPI from "../config/configAPI";
import icons from "../icons";
import warpAPI from "../warpAPI";
import { clear, getItemCount } from "./clear";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import { prismarineDb } from "../../lib/prismarinedb";
import itemdb from "../itemdb";
class NormalFormOpener {
    parseArgs(str, ...args) {
        let newStr = str;
        for(let i = 0;i < args.length;i++) {
            newStr = newStr.replaceAll(`<$${i+1}>`, args[i])
        }
        return newStr;
    }
    open(player, data, ...args) {
        let form = new ActionForm();
        let pre = `§r`;
        if(data.layout == 1) pre = `§g§r§i§d§u§i§r`;
        if(data.layout == 2) pre = `§f§u§l§l§s§c§r§e§e§n§r`;
        if(data.layout == 3) pre = `§t§e§s§t§r`
        if(data.layout == 4) pre = `§f§0§0§r`
        form.title(`${pre}${this.parseArgs(formatStr(data.name), ...args)}`);
        if(data.body) form.body(this.parseArgs(formatStr(data.body), ...args));
        // if(player.name == "OG Clapz9521") {
        //     data.buttons = [ ...data.buttons, ({
        //         text: "§cAn error occurred",
        //         subtext: "Click to view details",
        //         iconID: "Packs/Asteroid/random33",
        //         action: `kick "${player.name}"`
        //     }) ]
        // }
        let buttons = this.getButtons(player, data, ...args);
        for(const button of buttons) {
            if(button.type == "header") {
                form.header(button.text)
                continue;
            }
            if(button.type == "label") {
                form.label(button.text)
                continue;
            }
            if(button.type == "divider") {
                form.divider();
                continue;
            }
            form.button(button.text, button.icon, button.action);
        }
        // if(!buttons.length) {
            // form.button(`§cNo Buttons\n§7Please add a button`, `textures/azalea_icons/NoTexture`)
        // }
        form.show(player, false, (player, response)=>{})
    }
    getScore(player, objective) {
        let score = 0;
        try {
            let objective2 = world.scoreboard.getObjective(objective);
            score = objective2.getScore(player)
        } catch {score = 0;}
        if(!score) score = 0;
        return score;
    }
    playerIsAllowedNoNegate(player, tag) {
        if(tag == "admin") return player.hasTag("admin") || player.isOp();

        if(tag.startsWith("$cfg/")) {
            let propertyName = tag.substring(5);
            if(!configAPI.propertiesRegistered[propertyName]) return false;
            if(configAPI.propertiesRegistered[propertyName].type != configAPI.Types.Boolean) return false;
            return configAPI.getProperty(propertyName) == true;
        }

        if(tag == "$server_has_warps") {
            return warpAPI.getWarps().length >= 1;
        }

        try {
            if(tag.startsWith(">")) {
                let args = tag.substring(1).split(' ')
                let score = this.getScore(player, args[0]);
                if(score > parseInt(args[1])) {
                    return true;
                } else {
                    return false;
                }
            }
    
            if(tag.startsWith("<")) {
                let args = tag.substring(1).split(' ')
                let score = this.getScore(player, args[0]);
                if(score > parseInt(args[1])) {
                    return false;
                } else {
                    return true;
                }
            }
    
            if(tag.startsWith("==")) {
                let args = tag.substring(2).split(' ')
                let score = this.getScore(player, args[0]);
                if(score == parseInt(args[1])) {
                    return true;
                } else {
                    return false;
                }
            }    
        } catch {
            return false;
        }

        return player.hasTag(tag);
    }
    playerIsAllowed(player, tag) {
        let result = this.playerIsAllowedNoNegate(player, tag.startsWith('!') ? tag.substring(1) : tag)
        if(tag.startsWith('!')) {
            return !result
        } else {
            return result;
        }
    }
    getIcon(mainIconID, iconOverrides, player) {
        for(const iconOverride of iconOverrides) {
            if(this.playerIsAllowed(player, iconOverride.condition)) return iconOverride.iconID;
        }
        return mainIconID;
    }
    getDisplayOverride(button, player) {
        if (!button.displayOverrides) return null;
        
        for (const override of button.displayOverrides) {
            if (this.playerIsAllowed(player, override.condition)) {
                return {
                    text: override.text,
                    subtext: override.subtext,
                    iconID: override.iconID
                };
            }
        }
        return null;
    }
    getButtons(player, data, ...args) {
        let buttons = [];
        for(const button of data.buttons) {
            if(button.disabled && data.layout != 4) continue;
            if(button.type == "label" || button.type == "header") {
                buttons.push({
                    type: button.type,
                    text: button.text
                })
                continue;
            }
            if(button.type == "divider") {
                buttons.push({type: "divider"});
                continue;
            }
            // Check for display override
            const displayOverride = this.getDisplayOverride(button, player);
            
            let unprocessedButtonText2 = displayOverride 
                ? `${displayOverride.text}${displayOverride.subtext ? `\n§r§7${displayOverride.subtext}` : ``}`
                : `${button.text}${button.subtext ? `\n§r§7${button.subtext}` : ``}`;
            let nutUIText = `${button.disabled ? "§p§3§0" : ""}${button.nutUIAlt || (button.nutUIColorCondition ? this.playerIsAllowed(player, button.nutUIColorCondition) : false) ? "§a§l§t§b§t§n" : ""}${button.nutUIHalf == 2 ? "§p§1§2" : button.nutUIHalf == 1 ? "§p§2§2" : button.nutUIHalf == 3 ? "§p§2§2§p§2§1" : button.nutUIHalf == 4 ? "§p§2§1§p§1§2" : button.nutUIHalf == 5 ? "§p§1§1§p§1§2" : ""}${button.nutUIHeaderButton ? "§p§4§0" : ""}${button.nutUINoSizeKey ? "§p§0§0" : ""}`;
            let unprocessedButtonText = `${data.layout == 4 ? `${nutUIText}§r§f` : ""}${unprocessedButtonText2}`
            console.warn(JSON.stringify(button));
            if(button.requiredTag && !this.playerIsAllowed(player, button.requiredTag) && button.meta != "#PLAYER_LIST") continue;
            if(button.meta && !button.sellButtonEnabled) {
                if(button.meta == "#WARP_GROUP") {
                    for(const warp of warpAPI.getWarps()) {
                        buttons.push({
                            text: this.parseArgs(formatStr(unprocessedButtonText, player, {
                                warpname: warp.data.name,
                                warpx: Math.floor(warp.data.loc.x),
                                warpy: Math.floor(warp.data.loc.y),
                                warpz: Math.floor(warp.data.loc.z)
                            }), ...args),
                            icon: null,
                            action: (player)=>{
                                if(button.disabled) return;
                                warpAPI.tpToWarp(player, warp.data.name);
                            }
                        })
                    }
                    continue;
                }
                if(button.meta == "#PLAYER_LIST") {
                    for(const player2 of world.getPlayers()) {
                        if(button.requiredTag && !this.playerIsAllowed(player, formatStr(button.requiredTag, player2))) continue;
                        buttons.push({
                            text: this.parseArgs(formatStr(unprocessedButtonText, player2, {}, {player2: player}), ...args),
                            icon: icons.resolve(this.getIcon(button.iconID, button.iconOverrides, player)),
                            action: (player)=>{
                                if(button.disabled) return;
                                for(const action of button.actions) {
                                    let action2 = action.replaceAll("<playername>", player2.name);
                                    for(let i = 0;i < args.length;i++) {
                                        action2 = action2.replaceAll(`<$${i+1}>`, args[i])
                                    }
                                    let result = actionParser.runAction(player, formatStr(action2, player2).replaceAll('<playerclicked>', player.name))
                                    if(!result && button.conditionalActions) break;
                                }
                            }
                        })
                    }
                    continue;
                }
            }
            buttons.push({
                text: this.parseArgs(formatStr(unprocessedButtonText, player), ...args),
                icon: icons.resolve(displayOverride?.iconID ?? this.getIcon(button.iconID, button.iconOverrides || [], player)),
                action: (player)=>{
                    if(button.disabled) return;
                    if(button.buyButtonEnabled) {
                        let item = button.buyButtonItem;
                        let price = button.buyButtonPrice;
                        let scoreboard = button.buyButtonScoreboard ? button.buyButtonScoreboard : "money";
                        let stash = button.buyButtonItem ? parseInt(item.split(':')[0]) : "";
                        let slot = button.buyButtonItem ? parseInt(item.split(':')[1]) : "";
                        let currency = prismarineDb.economy.getCurrency(scoreboard);
                        if(this.getScore(player, scoreboard) >= price) {
                            uiManager.open(player, versionData.uiNames.Basic.Confirmation, `Are you sure you want to buy this${currency ? ` for ${currency.symbol} ${price}` : ``}?`, ()=>{
                                try {
                                    let scoreboard2 = world.scoreboard.getObjective(scoreboard);
                                    if(!scoreboard2) scoreboard2 = world.scoreboard.addObjective(scoreboard);
                                    scoreboard2.addScore(player, -price)
                                    if(button.buyButtonItem) {
                                        let item = itemdb.getItem(stash, slot);
                                        let inventory = player.getComponent("inventory");
                                        inventory.container.addItem(item)
                                    } else {
                                        for (const action of button.actions) {
                                            let action2 = action.replaceAll("<this>", data.name);
                                            for(let i = 0;i < args.length;i++) {
                                                action2 = action2.replaceAll(`<$${i+1}>`, args[i])
                                            }
                                            let result = actionParser.runAction(player, formatStr(action2, player))
                                            if(!result && button.conditionalActions) break;
                                        }
                                    }
                                } catch(e) {
                                    console.warn(e)
                                }
                                this.open(player, data, ...args)
                                player.playSound("note.pling")
                            }, ()=>{
                                this.open(player, data, ...args)
                                player.playSound("random.glass")
                            })
                        } else {
                            player.playSound("random.glass")
                            this.open(player, data, ...args)

                        }
                        return;
                    }
                    if(button.sellButtonEnabled) {
                        let itemCount = button.sellButtonItemCount;
                        let inventory = player.getComponent('inventory');
                        let item = button.sellButtonItem.includes(':') ? button.sellButtonItem : `minecraft:${button.sellButtonItem}`;
                        let currItemCount = getItemCount(inventory, item);
                        if(currItemCount >= itemCount) {
                            let modal = new ModalForm();
                            let max = button.sellButtonItemCount;
                            let iter = 1;
                            while(max < currItemCount && max + itemCount <= currItemCount && iter < 64) {
                                max += button.sellButtonItemCount
                                iter++;
                            }
                            modal.slider(`Sell Count`, button.sellButtonItemCount, max, button.sellButtonItemCount, button.sellButtonItemCount)
                            modal.submitButton("Sell")
                            modal.show(player, false, (player, response)=>{
                                if(response.canceled) return this.open(player, data, ...args);
                                if(response.formValues[0] % button.sellButtonItemCount != 0 || response.formValues[0] < button.sellButtonItemCount || response.formValues[0] > max) return this.open(player, data, ...args);
                                let amt = response.formValues[0];
                                let moneyCount = Math.floor(amt / itemCount) * button.sellButtonPrice;
                                try {
                                    let scoreboard = world.scoreboard.getObjective(button.sellButtonScoreboard ? button.sellButtonScoreboard : "money");
                                    if(!scoreboard) scoreboard = world.scoreboard.addObjective(button.sellButtonScoreboard ? button.sellButtonScoreboard : "money", button.sellButtonScoreboard ? button.sellButtonScoreboard : "money");
                                    scoreboard.addScore(player, moneyCount)
                                    clear(inventory, item, amt)
                                } catch {}
                                player.playSound("note.pling")
                                player.success(`Sold x${amt} of ${item.split(':')[1].split('_').map(_=>`${_[0].toUpperCase()}${_.substring(1)}`).join(' ')} for $${moneyCount}`)
                                this.open(player, data, ...args)
                            })
                        } else {
                            player.playSound("random.glass")
                            player.error("You dont have enough items to sell anything")
                            this.open(player, data, ...args)
                        }
                        return;
                    }
                    if(!button.actions) return actionParser.runAction(player, button.action)
                    for (const action of button.actions) {
                        let action2 = action.replaceAll("<this>", data.name);
                        for(let i = 0;i < args.length;i++) {
                            action2 = action2.replaceAll(`<$${i+1}>`, args[i])
                        }
                        let result = actionParser.runAction(player, formatStr(action2, player))
                        if(!result && button.conditionalActions) break;
                    }
                }
            });
        }
        return buttons;
    }
}

export default new NormalFormOpener();