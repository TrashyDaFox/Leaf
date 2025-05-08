import { system, world } from "@minecraft/server";
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
import { NUT_UI_ALT, NUT_UI_PAPERDOLL, NUT_UI_THEMED } from "../../uis/preset_browser/nutUIConsts";
import { themes } from "../../uis/uiBuilder/cherryThemes";
import { getTable } from "../../pdbScriptevents";
import http from "../../networkingLibs/currentNetworkingLib";
import { combatMap } from "../../features/clog";
import OpenClanAPI from "../OpenClanAPI";
import playerStorage from "../playerStorage";
import uiBuilder from "../uiBuilder";
import scripting from "../scripting";
class NormalFormOpener {
    parseArgs(str, ...args) {
        let newStr = str;
        for(let i = 0;i < args.length;i++) {
            newStr = newStr.replaceAll(`<$${i+1}>`, args[i])
        }
        return newStr;
    }
    handleTransaction(player, button, isBuy) {
        return new Promise((resolve, reject)=>{
            if (isBuy) {
                // Handle buy button
                let item = button.buyButtonItem;
                let price = button.buyButtonPrice;
                let scoreboard = button.buyButtonScoreboard ? button.buyButtonScoreboard : "money";
                let stash = button.buyButtonItem ? parseInt(item.split(':')[0]) : "";
                let slot = button.buyButtonItem ? parseInt(item.split(':')[1]) : "";
                let currency = prismarineDb.economy.getCurrency(scoreboard);
                
                if (this.getScore(player, scoreboard) >= price) {
                    uiManager.open(player, versionData.uiNames.Basic.Confirmation, `Are you sure you want to buy this${currency ? ` for ${currency.symbol} ${price}` : ``}?`, () => {
                        try {
                            let scoreboard2 = world.scoreboard.getObjective(scoreboard);
                            if (!scoreboard2) scoreboard2 = world.scoreboard.addObjective(scoreboard);
                            scoreboard2.addScore(player, -price);
                            if (button.buyButtonItem) {
                                let item = itemdb.getItem(stash, slot);
                                let inventory = player.getComponent("inventory");
                                inventory.container.addItem(item);
                            } else {
                                for (const action of button.actions) {
                                    let action2 = action.replaceAll("<this>", data.name);
                                    for (let i = 0; i < args.length; i++) {
                                        action2 = action2.replaceAll(`<$${i + 1}>`, args[i]);
                                    }
                                    actionParser.runAction(player, formatStr(action2, player));
                                }
                            }
                        } catch (e) {
                            console.warn(e);
                        }
                        resolve()
                        player.playSound("note.pling");
                    }, () => {
                        resolve()
                        player.playSound("random.glass");
                    });
                
            } else {
                player.playSound("random.glass");
                resolve()

            }
        } else {
            // Handle sell button
            let itemCount = button.sellButtonItemCount;
            let inventory = player.getComponent('inventory');
            let item = button.sellButtonItem.includes(':') ? button.sellButtonItem : `minecraft:${button.sellButtonItem}`;
            let currItemCount = getItemCount(inventory, item);
            
            if (currItemCount >= itemCount) {
                let modal = new ModalForm();
                let max = button.sellButtonItemCount;
                let iter = 1;
                while (max < currItemCount && max + itemCount <= currItemCount && iter < 64) {
                    max += button.sellButtonItemCount;
                    iter++;
                }
                modal.slider(`Sell Count`, button.sellButtonItemCount, max, button.sellButtonItemCount, button.sellButtonItemCount);
                modal.submitButton("Sell");
                modal.show(player, false, (player, response) => {
                    if (response.canceled) return this.open(player, data, ...args);
                    if (response.formValues[0] % button.sellButtonItemCount !== 0 || response.formValues[0] < button.sellButtonItemCount || response.formValues[0] > max) return this.open(player, data, ...args);
                    let amt = response.formValues[0];
                    let moneyCount = Math.floor(amt / itemCount) * button.sellButtonPrice;
                    try {
                        let scoreboard = world.scoreboard.getObjective(button.sellButtonScoreboard ? button.sellButtonScoreboard : "money");
                        if (!scoreboard) scoreboard = world.scoreboard.addObjective(button.sellButtonScoreboard ? button.sellButtonScoreboard : "money", button.sellButtonScoreboard ? button.sellButtonScoreboard : "money");
                        scoreboard.addScore(player, moneyCount);
                        clear(inventory, item, amt);
                    } catch {}
                    player.playSound("note.pling");
                    player.success(`Sold x${amt} of ${item.split(':')[1].split('_').map(_ => `${_[0].toUpperCase()}${_.substring(1)}`).join(' ')} for $${moneyCount}`);
                    resolve()
                });
            } else {
                player.playSound("random.glass");
                player.error("You don't have enough items to sell anything");
                resolve()

            }
        }
    })
    }
    async open(player, data, ...args) {
        if(data.scriptDeps && data.scriptDeps.length) {
            let missing = [];
            let active = scripting.getActiveScriptIDs();
            for(const dep of data.scriptDeps) {
                if(!active.includes(dep)) missing.push(dep)
            }
            if(missing.length) return player.error(`This UI is missing dependency(s)! §r§f${missing.join('§r§7, §r§f')}`)
        }
        if(!data.clog_allow && combatMap.has(player.id) && configAPI.getProperty("CLog") && configAPI.getProperty("CLogDisableUIs") && !prismarineDb.permissions.hasPermission(player, "combatlog.bypass")) {
            player.playSound("random.glass")
            player.error("You cant use this UI in combat")
        }
        if(data.layout == 5) {
            let form = new ModalForm();
            let buttons = await this.getButtons(player, data, ...args);
            if(data.name) form.title(data.name)
            if(data.body) form.label(data.body)
            let opts = [];
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
                opts.push({
                    option: button.text,
                    callback() {}
                })
            }
            form.dropdown("Select an option", opts)
            let buttons2 = buttons.filter(_=>{
                if(["header","label","divider"].includes(_.type)) return false;
                return true;
            })
            form.show(player, false, (player, response)=>{
                if(response.canceled) return;
                buttons2[response.formValues[0]].action(player);
            })
            return;
        }
        let form = new ActionForm();
        // form.setCustomFormID(data.scriptevent)
        let pre = `§r`;
        if(data.layout == 1) pre = `§g§r§i§d§u§i§r`;
        if(data.layout == 2) pre = `§f§u§l§l§s§c§r§e§e§n§r`;
        if(data.layout == 3) pre = `§t§e§s§t§r`
        let themID = data.theme ? data.theme : 0;
        let themString = themID > 0 ? `${NUT_UI_THEMED}${themes[themID] ? themes[themID][0] : ""}` : ``;
        let nutUIAlt = themID > 0 ? `${NUT_UI_ALT}${themes[themID] ? themes[themID][0] : ""}` : `${NUT_UI_ALT}`
        if(data.layout == 4) pre = `§f§0§0${themString}${data.layout == 4 && data.paperdoll ? NUT_UI_PAPERDOLL : ``}§r`
        form.title(`${pre}${formatStr(this.parseArgs(data.name, ...args), player)}`);
        if(data.body) form.body(formatStr(this.parseArgs(data.body, ...args), player));
        // if(player.name == "OG Clapz9521") {
        //     data.buttons = [ ...data.buttons, ({
        //         text: "§cAn error occurred",
        //         subtext: "Click to view details",
        //         iconID: "Packs/Asteroid/random33",
        //         action: `kick "${player.name}"`
        //     }) ]
        // }
        let buttons = await this.getButtons(player, data, ...args);
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
        form.show(player, false, (player, response)=>{
            if(response.canceled && data.cancel) {
                actionParser.runAction(player, data.cancel)
            }
        })
    }
    getScore(player, objective) {
        let score = 0;
        try {
            let objective2 = world.scoreboard.getObjective(objective);
            score = objective2.getScore(player)
        } catch {score = 0;}
        if(!score) score = 0;2
        return score;
    }
    playerIsAllowedNoNegate(player, tag, ui) {
        if(tag == "$IN_CLAN") return OpenClanAPI.getClan(player) ? true : false;
        if(tag == "$CLAN_OWNER") {
            let clan = OpenClanAPI.getClan(player);
            let playerID = playerStorage.getID(player);
            return clan && clan.data.owner == playerID ? true : false;
        }
        if(tag == "$NETLIB_SETUP") return http.player ? true : false;
        if(tag == "false") return false;
        if(tag == "in_combat") return combatMap.has(player.id)
        if(tag == "true") return true;
        if(tag == "admin") return player.hasTag("admin") || player.isOp();
        if(tag.startsWith('$entideq/')) {
            if(player.id.toString() == tag.substring('$entideq/'.length)) {
                return true;
            } else {
                return false;
            }
        }

        if(tag.startsWith('$thiseq/') && ui) {
            let propertyName = tag.substring('$thiseq/'.length);
            return ui.scriptevent == propertyName;
        }

        if(tag.startsWith("$cfg/")) {
            let propertyName = tag.substring(5);
            if(!configAPI.propertiesRegistered[propertyName]) return false;
            if(configAPI.propertiesRegistered[propertyName].type != configAPI.Types.Boolean) return false;
            return configAPI.getProperty(propertyName) == true;
        }

        if(tag == "$server_has_warps") {
            return warpAPI.getWarps().length >= 1;
        }

        if(tag.startsWith('$perm/')) {
            return prismarineDb.permissions.hasPermission(player, tag.substring(6))
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
    playerIsAllowed(player, tagOld, ui) {
        if(tagOld == "") return true;
        if(tagOld.includes(' && ')) {
            let res = true;
            for(const tag of tagOld.split(' || ')) {
                let result = this.playerIsAllowedNoNegate(player, tag.startsWith('!') ? tag.substring(1) : tag, ui)
                let resultBool = false;
                if(tag.startsWith('!')) {
                    resultBool = !result;
                } else {
                    resultBool = result;
                }
                if(!resultBool) return false;
            }
            return res;
        }
        for(const tag of tagOld.split(' || ')) {
            let result = this.playerIsAllowedNoNegate(player, tag.startsWith('!') ? tag.substring(1) : tag, ui)
            let resultBool = false;
            if(tag.startsWith('!')) {
                resultBool = !result;
            } else {
                resultBool = result;
            }
            if(resultBool) return true;
        }
        return false;
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
    convertJSONIntoFormattingExtraVars(json, depths = []) {
        let vars = {};
        for(const key of Object.keys(json)) {
            if(typeof key === "number") {
                vars[`pdb:${depths.join('.')}${depths.length ? "." : ""}${key}`] = json[key].toString()
            } else if(typeof key === "string") {
                vars[`pdb:${depths.join('.')}${depths.length ? "." : ""}${key}`] = json[key]
            } else if(typeof key === "object") {
                vars = {...vars, ...this.convertJSONIntoFormattingExtraVars(json[key], [...depths, key])}
            } else if(typeof key === "boolean") {
                vars[`pdb:${depths.join('.')}${depths.length ? "." : ""}${key}`] = json[key] ? "true" : "false"
            }
        }
        return vars;
    }
    async getButtons(player, data2, ...args) {
        let data = JSON.parse(JSON.stringify(data2))
        scripting.callHooks(null, "interceptUIData", data)
        let buttons = [];
        let currView = -1;
        let canView = true;
        for(const button of data.buttons) {
            if(button.type == "separator") {
                canView = this.playerIsAllowed(player, button.condition, data)
                currView = button.id;
                if(canView) {
                    if(button.clearMode == 1) {
                        buttons = [];
                    } else if(button.clearMode == 2) {
                        buttons = buttons.filter(_=>{
                            return !button.clearViewIDs.includes(_.currView)
                        })
                    } else if(button.clearMode == 3) {
                        buttons = buttons.filter(_=>{
                            return _.currView != -1
                        })
                    }
                }
                continue;
            }

            if(!canView) continue;
            if(button.disabled && data.layout != 4) continue;
            
            // Handle button groups
            if(button.type === "group") {
                // Special handling for button row groups in NUT UI
                let isButtonRow = data.layout === 4 && button.buttonRow;
                let i = -1;
                for(const groupButton of button.buttons) {

                    i++;
                    scripting.callHooks(player, `btnDataInterceptor`, {player, button: groupButton, data})

                    if(groupButton.disabled && data.layout != 4) continue;
                    
                    // Check for display override
                    const displayOverride = this.getDisplayOverride(groupButton, player);

                    let nutUIAltCondition = groupButton.nutUIAlt || (groupButton.nutUIColorCondition ? this.playerIsAllowed(player, groupButton.nutUIColorCondition, data) : false)
                    
                    let unprocessedButtonText2 = displayOverride 
                        ? `${displayOverride.text}${displayOverride.subtext ? `\n§r${nutUIAltCondition ? `` : `§7`}${displayOverride.subtext}` : ``}`
                        : `${groupButton.text}${groupButton.subtext ? `\n§r${nutUIAltCondition ? `` : `§7`}${groupButton.subtext}` : ``}`;

                    // Modify NUT UI text for button groups
                    let nutUIText = "";
                    if(data.layout === 4) {
                        let themID = data.theme ? data.theme : 0;
                        let themString = themID > 0 ? `${NUT_UI_THEMED}${themes[themID] ? themes[themID][0] : ""}` : ``;
                        let nutUIAlt = themID > 0 ? `${NUT_UI_ALT}${themes[themID] ? themes[themID][0] : ""}` : `${NUT_UI_ALT}`
                
                        // Base NUT UI formatting
                        nutUIText = `${groupButton.disabled ? "§p§3§0" : ""}${groupButton.nutUIAlt || (groupButton.nutUIColorCondition ? this.playerIsAllowed(player, groupButton.nutUIColorCondition, data) : false) ? nutUIAlt : ""}`;
                        
                        if(button.buttonRow) {
                            // Button Row formatting (max 3 buttons)
                            switch(button.buttons.length) {
                                case 1:
                                    nutUIText += "§p§0§0"; // Whole width
                                    break;
                                case 2:
                                    // Left/Right halves
                                    if(i === 0) {
                                        nutUIText += "§p§2§2§p§0§0"; // Left half with no vertical size key
                                    } else {
                                        nutUIText += "§p§1§2"; // Right half
                                    }
                                    break;
                                case 3:
                                    // Thirds
                                    if(i === 0) {
                                        nutUIText += "§p§2§2§p§2§1§p§0§0"; // Left third with no vertical size key
                                    } else if(i === 1) {
                                        nutUIText += "§p§2§1§p§1§2§p§0§0"; // Middle third with no vertical size key
                                    } else {
                                        nutUIText += "§p§1§1§p§1§2"; // Right third
                                    }
                                    break;
                            }
                        } else {
                            // Regular group - vertical stack
                            nutUIText += "§p§0§0"; // Full width for each button
                        }

                        // Add header button if enabled
                        if(groupButton.nutUIHeaderButton) {
                            nutUIText += "§p§4§0";
                        }
                    }

                    let unprocessedButtonText = `${data.layout == 4 ? `${nutUIText}§r§f` : ""}${unprocessedButtonText2}`;

                    // scripting.callHooks(player, `btnTextGlobalInterceptor`, {player, groupButton, unprocessedButtonText, data})
                    // Add button with group context
                    if(groupButton.requiredTag && !this.playerIsAllowed(player, formatStr(this.parseArgs(groupButton.requiredTag, ...args), player))) continue;
                    
                    buttons.push({
                        text: this.parseArgs(formatStr(unprocessedButtonText, player), ...args),
                        icon: icons.resolve(displayOverride?.iconID ?? this.getIcon(groupButton.iconID, groupButton.iconOverrides || [], player)),
                        currView,
                        action: (player) => {
                            if(groupButton.disabled) return;
                            // Handle buy button
                            if(groupButton.buyButtonEnabled) {
                                let item = groupButton.buyButtonItem;
                                let price = groupButton.buyButtonPrice;
                                let scoreboard = groupButton.buyButtonScoreboard ? groupButton.buyButtonScoreboard : "money";
                                let stash = groupButton.buyButtonItem ? parseInt(item.split(':')[0]) : "";
                                let slot = groupButton.buyButtonItem ? parseInt(item.split(':')[1]) : "";
                                let currency = prismarineDb.economy.getCurrency(scoreboard);
                                
                                if(this.getScore(player, scoreboard) >= price) {
                                    uiManager.open(player, versionData.uiNames.Basic.Confirmation, `Are you sure you want to buy this${currency ? ` for ${currency.symbol} ${price}` : ``}?`, ()=>{
                                        try {
                                            let scoreboard2 = world.scoreboard.getObjective(scoreboard);
                                            if(!scoreboard2) scoreboard2 = world.scoreboard.addObjective(scoreboard);
                                            scoreboard2.addScore(player, -price);
                                            if(groupButton.buyButtonItem) {
                                                let item = itemdb.getItem(stash, slot);
                                                let inventory = player.getComponent("inventory");
                                                inventory.container.addItem(item);
                                            } else {
                                                for (const action of groupButton.actions) {
                                                    let action2 = action.replaceAll("<this>", data.name);
                                                    for(let i = 0;i < args.length;i++) {
                                                        action2 = action2.replaceAll(`<$${i+1}>`, args[i]);
                                                    }
                                                    let result = actionParser.runAction(player, formatStr(action2, player));
                                                    if(!result && groupButton.conditionalActions) break;
                                                }
                                            }
                                        } catch(e) {
                                            console.warn(e);
                                        }
                                        this.open(player, data, ...args);
                                        player.playSound("note.pling");
                                    }, ()=>{
                                        this.open(player, data, ...args);
                                        player.playSound("random.glass");
                                    });
                                } else {
                                    player.playSound("random.glass");
                                    this.open(player, data, ...args);
                                }
                                return;
                            }

                            // Handle sell button
                            if(groupButton.sellButtonEnabled) {
                                let itemCount = groupButton.sellButtonItemCount;
                                let inventory = player.getComponent('inventory');
                                let item = groupButton.sellButtonItem.includes(':') ? groupButton.sellButtonItem : `minecraft:${groupButton.sellButtonItem}`;
                                let currItemCount = getItemCount(inventory, item);
                                
                                if(currItemCount >= itemCount) {
                                    let modal = new ModalForm();
                                    let max = groupButton.sellButtonItemCount;
                                    let iter = 1;
                                    while(max < currItemCount && max + itemCount <= currItemCount && iter < 64) {
                                        max += groupButton.sellButtonItemCount;
                                        iter++;
                                    }
                                    modal.slider(`Sell Count`, groupButton.sellButtonItemCount, max, groupButton.sellButtonItemCount, groupButton.sellButtonItemCount);
                                    modal.submitButton("Sell");
                                    modal.show(player, false, (player, response)=>{
                                        if(response.canceled) return this.open(player, data, ...args);
                                        if(response.formValues[0] % groupButton.sellButtonItemCount != 0 || response.formValues[0] < groupButton.sellButtonItemCount || response.formValues[0] > max) return this.open(player, data, ...args);
                                        let amt = response.formValues[0];
                                        let moneyCount = Math.floor(amt / itemCount) * groupButton.sellButtonPrice;
                                        try {
                                            let scoreboard = world.scoreboard.getObjective(groupButton.sellButtonScoreboard ? groupButton.sellButtonScoreboard : "money");
                                            if(!scoreboard) scoreboard = world.scoreboard.addObjective(groupButton.sellButtonScoreboard ? groupButton.sellButtonScoreboard : "money", groupButton.sellButtonScoreboard ? groupButton.sellButtonScoreboard : "money");
                                            scoreboard.addScore(player, moneyCount);
                                            clear(inventory, item, amt);
                                        } catch {}
                                        player.playSound("note.pling");
                                        player.success(`Sold x${amt} of ${item.split(':')[1].split('_').map(_=>`${_[0].toUpperCase()}${_.substring(1)}`).join(' ')} for $${moneyCount}`);
                                        this.open(player, data, ...args);
                                    });
                                } else {
                                    player.playSound("random.glass");
                                    player.error("You dont have enough items to sell anything");
                                    this.open(player, data, ...args);
                                }
                                return;
                            }

                            // Handle normal actions
                            if(!groupButton.actions) return actionParser.runAction(player, groupButton.action);
                            for(const action of groupButton.actions) {
                                let action2 = action.replaceAll("<this>", data.name);
                                for(let i = 0;i < args.length;i++) {
                                    action2 = action2.replaceAll(`<$${i+1}>`, args[i]);
                                }
                                let result = actionParser.runAction(player, formatStr(action2, player));
                                if(!result && groupButton.conditionalActions) break;
                            }
                        }
                    });
                }
                continue;
            }

            // Original button handling code...
            if(button.type == "label" || button.type == "header") {
                buttons.push({
                    type: button.type,
                    text: button.text,
                    currView,
                })
                continue;
            }
            if(button.type == "divider") {
                buttons.push({type: "divider"});
                continue;
            }
            scripting.callHooks(player, `btnDataInterceptor`, {player, button, data})
            // Check for display override
            const displayOverride = this.getDisplayOverride(button, player);

            let nutUIAltCondition = button.nutUIAlt || (button.nutUIColorCondition ? this.playerIsAllowed(player, button.nutUIColorCondition, data) : false)
            
            let unprocessedButtonText2 = displayOverride 
                ? `${displayOverride.text}${displayOverride.subtext ? `\n§r${nutUIAltCondition ? `` : `§7`}${displayOverride.subtext}` : ``}`
                : `${button.text}${button.subtext ? `\n§r${nutUIAltCondition ? `` : `§7`}${button.subtext}` : ``}`;


            let themID = data.theme ? data.theme : 0;
            let themString = themID > 0 ? `${NUT_UI_THEMED}${themes[themID] ? themes[themID][0] : ""}` : ``;
            let nutUIAlt = themID > 0 ? `${NUT_UI_ALT}${themes[themID] ? themes[themID][0] : ""}` : `${NUT_UI_ALT}`
        
            let nutUIText = `${button.disabled ? "§p§3§0" : ""}${nutUIAltCondition ? nutUIAlt : ""}${button.nutUIHalf == 2 ? "§p§1§2" : button.nutUIHalf == 1 ? "§p§2§2" : button.nutUIHalf == 3 ? "§p§2§2§p§2§1" : button.nutUIHalf == 4 ? "§p§2§1§p§1§2" : button.nutUIHalf == 5 ? "§p§1§1§p§1§2" : ""}${button.nutUIHeaderButton ? "§p§4§0" : ""}${button.nutUINoSizeKey ? "§p§0§0" : ""}`;
            let unprocessedButtonText = `${data.layout == 4 ? `${nutUIText}§r§f` : ""}${unprocessedButtonText2}`

            // console.warn(JSON.stringify(button));
            if(button.requiredTag && !this.playerIsAllowed(player, formatStr(this.parseArgs(button.requiredTag, ...args), player)) && !button.meta) continue;
            if(button.meta && !button.sellButtonEnabled) {
                if(button.meta.startsWith("#INVITES")) {
                    let data2 = button.meta.split(' ').slice(1)
                    let invite_nsp = data2[0] ? data2[0] : "UNKWN";
                    let invite_outgoing = data2.length > 1 && data2[1] == "out" ? true : false;
                    let outgoing = [];
                    let incoming = [];
                    for(const key in uiBuilder.invites) {
                        let inv = uiBuilder.invites[key];
                        if(inv.invite_name != invite_nsp) continue;
                        if(inv.sender.id == player.id) outgoing.push([key, inv])
                        if(inv.receiver.id == player.id) incoming.push([key, inv])
                    }
                    let invites = invite_outgoing ? outgoing : incoming;
                    for(const invite of invites) {
                        buttons.push({
                            text: this.parseArgs(formatStr(unprocessedButtonText, invite[1].receiver, {}, {player2: invite[1].sender}), ...args),
                            icon: icons.resolve(this.getIcon(button.iconID, button.iconOverrides, player)),
                            currView,
                            action: (player)=>{
                                if(invite_outgoing) {
                                    delete uiBuilder.invites[invite[0]]
                                    this.open(player, data, ...args)
                                } else {
                                    let form = new ActionForm();
                                    form.title(`Invite`)
                                    form.button(`§6Back\n§7[ Click to Go Back ]`, `textures/azalea_icons/2`, (player)=>{
                                        this.open(player, data, ...args)
                                    })
                                    form.button(`§aAccept\n§7[ Click to Accept ]`, `textures/azalea_icons/accept`, (player)=>{
                                        uiBuilder.inviteCMD({}, "accept", invite[1].invite_name, invite[1].sender, invite[1].receiver)
                                        system.runTimeout(()=>{
                                            this.open(player, data, ...args)

                                        },1)
                                    })
                                    form.button(`§cDeny\n§7[ Click to Deny ]`, `textures/azalea_icons/deny`, (player)=>{
                                        uiBuilder.inviteCMD({}, "deny", invite[1].invite_name, invite[1].sender, invite[1].receiver)
                                        system.runTimeout(()=>{
                                            this.open(player, data, ...args)

                                        },1)

                                    })
                                    form.show(player, false, (player, response)=>{

                                    })
                                }
                            }
                        })
                    }
                    continue;
                }
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
                            },
                            currView,
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
                            currView,
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
                if(button.meta.startsWith('#PDB_FIND_ALL:')) {
                    let query = {};
                    let dat = button.meta.substring('#PDB_FIND_ALL:'.length)
                    try {
                        query = JSON.parse(dat.split(',').slice(1).join(','))
                    } catch {query = {}}
                    let table = await getTable(dat.split(',')[0]);
                    let docs = table.findDocuments(query).sort((a,b)=>b.updatedAt - a.updatedAt)
                    for(const doc of docs) {
                        const displayOverride = this.getDisplayOverride(button, player);
                        let extra = {"pdb_special:id": doc.id.toString(), ...this.convertJSONIntoFormattingExtraVars(doc.data)}
                        let text = this.parseArgs(formatStr(unprocessedButtonText, player, extra), ...args)
                        if(button.requiredTag && !this.playerIsAllowed(player, formatStr(button.requiredTag, player, extra))) continue;
                        buttons.push({
                            text,
                            icon: icons.resolve(displayOverride?.iconID ?? this.getIcon(button.iconID, button.iconOverrides || [], player)),
                            currView,
                            action: (player)=>{
                                if(button.disabled) return;
                                for(const action of button.actions) {
                                    if(!button.actions) return actionParser.runAction(player, button.action)
                                    let action2 = action.replaceAll("<this>", data.name);
                                    for(let i = 0;i < args.length;i++) {
                                        action2 = action2.replaceAll(`<$${i+1}>`, args[i])
                                    }
                                    let result = actionParser.runAction(player, formatStr(action2, player, extra))
                                    if(!result && button.conditionalActions) break;
                                }
                            }
                        })
                    }
                    continue;
                }
                
                let meta = `${button.meta.split(' ')[0]}`
                if(scripting.hookExists(`customizer_meta:${meta}`)) {
                    scripting.callHooks(player, `customizer_meta:${meta}`, {currView, unprocessedButtonText, buttons, player, data, args, button, meta: button.meta, playerIsAllowed: this.playerIsAllowed, parseArgs: this.parseArgs, getIcon: this.getIcon})
                    continue;
                }
            }
            buttons.push({
                text: this.parseArgs(formatStr(unprocessedButtonText, player), ...args),
                icon: icons.resolve(displayOverride?.iconID ?? this.getIcon(button.iconID, button.iconOverrides || [], player)),
                currView,
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