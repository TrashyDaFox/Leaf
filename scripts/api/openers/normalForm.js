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
import homes from "../homes";

class MetaHandler {
    constructor() {
        this.handlers = new Map();
        this.registerDefaultHandlers();
    }

    registerDefaultHandlers() {
        this.registerHandler('#INVITES', this.handleInvites.bind(this));
        this.registerHandler('#WARP_GROUP', this.handleWarpGroup.bind(this));
        this.registerHandler('#PLAYER_LIST', this.handlePlayerList.bind(this));
        this.registerHandler('#PDB_FIND_ALL:', this.handlePdbFindAll.bind(this));
        this.registerHandler('#HOMES', this.handleHomes.bind(this))
    }

    handleHomes(meta, context) {
        const { player, button, data, args, currView, unprocessedButtonText } = context;

        return homes.getAllFromPlayer(player).map(_=>{
            let homeOwner = playerStorage.getPlayerByID(_.data.owner)
            return {
                text: context.parseArgs(formatStr(unprocessedButtonText, player, {
                    home_name : _.data.name,
                    home_name_original: homes.get(_.id)?.data?.name,
                    home_owner: homeOwner.name
                }), ...args),
                icon: icons.resolve(context.getIcon(button.iconID, button.iconOverrides, player)),
                action(player) {
                    for(const action of button.actions) {
                        let actionNew = context.parseArgs(formatStr(action, player, {
                            home_name : _.data.name,
                            home_name_original: homes.get(_.id)?.data?.name,
                            home_owner: homeOwner.name
                        }), ...args)

                        actionParser.runAction(player, actionNew)
                    }
                }
            }
        })
    }

    registerHandler(prefix, handler) {
        this.handlers.set(prefix, handler);
    }

    async handleMeta(meta, context) {
        const { player, button, data, args, currView, unprocessedButtonText } = context;
        
        // Check for custom meta handler
        const metaPrefix = meta.split(' ')[0];
        if (scripting.hookExists(`customizer_meta:${metaPrefix}`)) {
            return scripting.callHooks(player, `customizer_meta:${metaPrefix}`, {
                currView,
                unprocessedButtonText,
                buttons: context.buttons,
                player,
                data,
                args,
                button,
                meta,
                playerIsAllowed: context.playerIsAllowed,
                parseArgs: context.parseArgs,
                getIcon: context.getIcon
            });
        }

        // Find and execute registered handler
        for (const [prefix, handler] of this.handlers) {
            if (meta.startsWith(prefix)) {
                return await handler(meta, context);
            }
        }

        return null;
    }

    async handleInvites(meta, context) {
        const { player, button, data, args, currView, unprocessedButtonText } = context;
        const data2 = meta.split(' ').slice(1);
        const invite_nsp = data2[0] || "UNKWN";
        const invite_outgoing = data2.length > 1 && data2[1] == "out";

        const invites = this.getInvites(invite_nsp, player, invite_outgoing);
        return this.createInviteButtons(invites, {...context, invite_outgoing});
    }

    async handleWarpGroup(meta, context) {
        const { player, button, data, args, currView, unprocessedButtonText } = context;
        const warps = warpAPI.getWarps();
        return warps.map(warp => ({
            text: context.parseArgs(formatStr(unprocessedButtonText, player, {
                warpname: warp.data.name,
                warpx: Math.floor(warp.data.loc.x),
                warpy: Math.floor(warp.data.loc.y),
                warpz: Math.floor(warp.data.loc.z)
            }), ...args),
            icon: null,
            action: (player) => {
                if (button.disabled) return;
                warpAPI.tpToWarp(player, warp.data.name);
            },
            currView,
        }));
    }

    async handlePlayerList(meta, context) {
        const { player, button, data, args, currView, unprocessedButtonText } = context;
        return world.getPlayers()
            .filter(player2 => !button.requiredTag || context.playerIsAllowed(player, formatStr(button.requiredTag, player2)))
            .map(player2 => ({
                text: context.parseArgs(formatStr(unprocessedButtonText, player2, {}, { player2: player }), ...args),
                icon: icons.resolve(context.getIcon(button.iconID, button.iconOverrides, player)),
                currView,
                action: (player) => this.handlePlayerListAction(player, player2, button, data, args)
            }));
    }

    async handlePdbFindAll(meta, context) {
        const { player, button, data, args, currView, unprocessedButtonText } = context;
        const [tableName, ...queryParts] = meta.substring('#PDB_FIND_ALL:'.length).split(',');
        const query = this.parsePdbQuery(queryParts.join(','));
        const table = await getTable(tableName);
        const docs = table.findDocuments(query).sort((a, b) => b.updatedAt - a.updatedAt);
        
        return docs.map(doc => {
            const displayOverride = context.getDisplayOverride(button, player);
            const extra = {
                "pdb_special:id": doc.id.toString(),
                ...context.convertJSONIntoFormattingExtraVars(doc.data)
            };
            
            if (button.requiredTag && !context.playerIsAllowed(player, formatStr(button.requiredTag, player, extra))) {
                return null;
            }

            return {
                text: context.parseArgs(formatStr(unprocessedButtonText, player, extra), ...args),
                icon: icons.resolve(displayOverride?.iconID ?? context.getIcon(button.iconID, button.iconOverrides || [], player)),
                currView,
                action: (player) => this.handlePdbAction(player, button, data, args, extra)
            };
        }).filter(Boolean);
    }

    // Helper methods
    getInvites(invite_nsp, player, invite_outgoing) {
        const outgoing = [];
        const incoming = [];
        
        for (const [key, inv] of Object.entries(uiBuilder.invites)) {
            if (inv.invite_name != invite_nsp) continue;
            if (inv.sender.id == player.id) outgoing.push([key, inv]);
            if (inv.receiver.id == player.id) incoming.push([key, inv]);
        }
        
        return invite_outgoing ? outgoing : incoming;
    }

    createInviteButtons(invites, context) {
        return invites.map(([key, invite]) => ({
            text: context.parseArgs(formatStr(context.unprocessedButtonText, invite.receiver, {}, { player2: invite.sender }), ...context.args),
            icon: icons.resolve(context.getIcon(context.button.iconID, context.button.iconOverrides, context.player)),
            currView: context.currView,
            action: (player) => this.handleInviteAction(player, key, invite, context)
        }));
    }

    handleInviteAction(player, key, invite, context) {
        if (context.invite_outgoing) {
            delete uiBuilder.invites[key];
            context.open(player, context.data, ...context.args);
        } else {
            this.showInviteResponseForm(player, invite, context);
        }
    }

    showInviteResponseForm(player, invite, context) {
        const form = new ActionForm();
        form.title(`Invite`);
        form.button(`§6Back\n§7[ Click to Go Back ]`, `textures/azalea_icons/2`, (player) => {
            context.open(player, context.data, ...context.args);
        });
        form.button(`§aAccept\n§7[ Click to Accept ]`, `textures/azalea_icons/accept`, (player) => {
            uiBuilder.inviteCMD({}, "accept", invite.invite_name, invite.sender, invite.receiver);
            system.runTimeout(() => {
                context.open(player, context.data, ...context.args);
            }, 1);
        });
        form.button(`§cDeny\n§7[ Click to Deny ]`, `textures/azalea_icons/deny`, (player) => {
            uiBuilder.inviteCMD({}, "deny", invite.invite_name, invite.sender, invite.receiver);
            system.runTimeout(() => {
                context.open(player, context.data, ...context.args);
            }, 1);
        });
        form.show(player, false, () => {});
    }

    handlePlayerListAction(player, player2, button, data, args) {
        if (button.disabled) return;
        for (const action of button.actions) {
            const action2 = action
                .replaceAll("<playername>", player2.name)
                .replaceAll("<this>", data.name);
            
            for (let i = 0; i < args.length; i++) {
                action2 = action2.replaceAll(`<$${i + 1}>`, args[i]);
            }
            
            const result = actionParser.runAction(player, formatStr(action2, player2).replaceAll('<playerclicked>', player.name));
            if (!result && button.conditionalActions) break;
        }
    }

    handlePdbAction(player, button, data, args, extra) {
        if (button.disabled) return;
        for (const action of button.actions) {
            const action2 = action.replaceAll("<this>", data.name);
            for (let i = 0; i < args.length; i++) {
                action2 = action2.replaceAll(`<$${i + 1}>`, args[i]);
            }
            const result = actionParser.runAction(player, formatStr(action2, player, extra));
            if (!result && button.conditionalActions) break;
        }
    }

    parsePdbQuery(queryStr) {
        try {
            return JSON.parse(queryStr);
        } catch {
            return {};
        }
    }
}

class ButtonProcessor {
    constructor() {
        this.metaHandler = new MetaHandler();
    }

    async processButton(button, context) {
        const { player, data, args, currView } = context;

        if(!button.meta && button.requiredTag && !context.playerIsAllowed(player, button.requiredTag, data)) return;

        // Handle special button types
        if (button.type === "header" || button.type === "label") {
            return {
                type: button.type,
                text: button.text,
                currView,
            };
        }

        if (button.type === "divider") {
            return { type: "divider" };
        }

        // Handle button groups
        if (button.type === "group") {
            return this.processButtonGroup(button, context);
        }

        scripting.callHooks(player, `btnDataInterceptor`, { player, button, data });

        // Handle meta buttons
        if (button.meta && !button.sellButtonEnabled) {
            const metaButtons = await this.metaHandler.handleMeta(button.meta, {
                ...context,
                button,
                unprocessedButtonText: this.getUnprocessedButtonText(button, player, data, context)
            });
            if (metaButtons) return metaButtons;
        }

        // Handle regular buttons
        return this.createRegularButton(button, context);
    }

    processButtonGroup(button, context) {
        const { player, data, args, currView } = context;
        const buttons = [];
        const isButtonRow = data.layout === 4 && button.buttonRow;

        button.buttons.forEach((groupButton, index) => {
            if (groupButton.disabled && data.layout != 4) return;

            scripting.callHooks(player, `btnDataInterceptor`, { player, button: groupButton, data });

            const displayOverride = context.getDisplayOverride(groupButton, player);
            const nutUIAltCondition = groupButton.nutUIAlt || (groupButton.nutUIColorCondition ? context.playerIsAllowed(player, groupButton.nutUIColorCondition, data) : false);
            
            let unprocessedButtonText2 = displayOverride 
                ? `${displayOverride.text}${displayOverride.subtext ? `\n§r${nutUIAltCondition ? `` : `§7`}${displayOverride.subtext}` : ``}`
                : `${groupButton.text}${groupButton.subtext ? `\n§r${nutUIAltCondition ? `` : `§7`}${groupButton.subtext}` : ``}`;

            // NUT UI formatting for button groups
            let nutUIText = "";
            if (data.layout === 4) {
                const themID = data.theme || 0;
                const themString = themID > 0 ? `${NUT_UI_THEMED}${themes[themID]?.[0] || ""}` : ``;
                const nutUIAlt = themID > 0 ? `${NUT_UI_ALT}${themes[themID]?.[0] || ""}` : `${NUT_UI_ALT}`;

                // Base NUT UI formatting
                nutUIText = `${groupButton.disabled ? "§p§3§0" : ""}${groupButton.nutUIAlt || (groupButton.nutUIColorCondition ? context.playerIsAllowed(player, groupButton.nutUIColorCondition, data) : false) ? nutUIAlt : ""}`;

                if (button.buttonRow) {
                    // Button Row formatting (max 3 buttons)
                    switch (button.buttons.length) {
                        case 1:
                            nutUIText += "§p§0§0"; // Whole width
                            break;
                        case 2:
                            // Left/Right halves
                            if (index === 0) {
                                nutUIText += "§p§2§2§p§0§0"; // Left half with no vertical size key
                            } else {
                                nutUIText += "§p§1§2"; // Right half
                            }
                            break;
                        case 3:
                            // Thirds
                            if (index === 0) {
                                nutUIText += "§p§2§2§p§2§1§p§0§0"; // Left third with no vertical size key
                            } else if (index === 1) {
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
                if (groupButton.nutUIHeaderButton) {
                    nutUIText += "§p§4§0";
                }
            }

            const unprocessedButtonText = `${data.layout == 4 ? `${nutUIText}§r§f` : ""}${unprocessedButtonText2}`;

            if (groupButton.requiredTag && !context.playerIsAllowed(player, formatStr(context.parseArgs(groupButton.requiredTag, ...args), player))) return;

            buttons.push({
                text: context.parseArgs(formatStr(unprocessedButtonText, player), ...args),
                icon: icons.resolve(displayOverride?.iconID ?? context.getIcon(groupButton.iconID, groupButton.iconOverrides || [], player)),
                currView,
                action: (player) => this.handleButtonAction(player, groupButton, data, args)
            });
        });

        return buttons;
    }

    getUnprocessedButtonText(button, player, data, context) {
        const displayOverride = context.getDisplayOverride(button, player);
        const nutUIAltCondition = button.nutUIAlt || (button.nutUIColorCondition ? context.playerIsAllowed(player, button.nutUIColorCondition, data) : false);
        
        let unprocessedButtonText2 = displayOverride 
            ? `${displayOverride.text}${displayOverride.subtext ? `\n§r${nutUIAltCondition ? `` : `§7`}${displayOverride.subtext}` : ``}`
            : `${button.text}${button.subtext ? `\n§r${nutUIAltCondition ? `` : `§7`}${button.subtext}` : ``}`;

        // NUT UI formatting for regular buttons
        let nutUIText = "";
        if (data.layout === 4) {
            const themID = data.theme || 0;
            const themString = themID > 0 ? `${NUT_UI_THEMED}${themes[themID]?.[0] || ""}` : ``;
            const nutUIAlt = themID > 0 ? `${NUT_UI_ALT}${themes[themID]?.[0] || ""}` : `${NUT_UI_ALT}`;

            nutUIText = `${button.disabled ? "§p§3§0" : ""}${nutUIAltCondition ? nutUIAlt : ""}${button.nutUIHalf == 2 ? "§p§1§2" : button.nutUIHalf == 1 ? "§p§2§2" : button.nutUIHalf == 3 ? "§p§2§2§p§2§1" : button.nutUIHalf == 4 ? "§p§2§1§p§1§2" : button.nutUIHalf == 5 ? "§p§1§1§p§1§2" : ""}${button.nutUIHeaderButton ? "§p§4§0" : ""}${button.nutUINoSizeKey ? "§p§0§0" : ""}`;
        }

        return `${data.layout == 4 ? `${nutUIText}§r§f` : ""}${unprocessedButtonText2}`;
    }

    createRegularButton(button, context) {
        const { player, data, args, currView } = context;
        const unprocessedButtonText = this.getUnprocessedButtonText(button, player, data, context);
        const displayOverride = context.getDisplayOverride(button, player);

        return {
            text: context.parseArgs(formatStr(unprocessedButtonText, player), ...args),
            icon: icons.resolve(displayOverride?.iconID ?? context.getIcon(button.iconID, button.iconOverrides || [], player)),
            currView,
            action: (player) => this.handleButtonAction(player, button, data, args)
        };
    }

    handleButtonAction(player, button, data, args) {
        if (button.disabled) return;

        if (button.buyButtonEnabled) {
            return this.handleBuyButton(player, button, data, args);
        }

        if (button.sellButtonEnabled) {
            return this.handleSellButton(player, button, data, args);
        }

        if (!button.actions) {
            return actionParser.runAction(player, button.action);
        }

        for (const action of button.actions) {
            const action2 = action.replaceAll("<this>", data.name);
            for (let i = 0; i < args.length; i++) {
                action2 = action2.replaceAll(`<$${i + 1}>`, args[i]);
            }
            const result = actionParser.runAction(player, formatStr(action2, player));
            if (!result && button.conditionalActions) break;
        }
    }

    handleBuyButton(player, button, data, args) {
        const item = button.buyButtonItem;
        const price = button.buyButtonPrice;
        const scoreboard = button.buyButtonScoreboard || "money";
        const stash = button.buyButtonItem ? parseInt(item.split(':')[0]) : "";
        const slot = button.buyButtonItem ? parseInt(item.split(':')[1]) : "";
        const currency = prismarineDb.economy.getCurrency(scoreboard);

        if (this.getScore(player, scoreboard) >= price) {
            uiManager.open(player, versionData.uiNames.Basic.Confirmation, 
                `Are you sure you want to buy this${currency ? ` for ${currency.symbol} ${price}` : ``}?`,
                () => this.processBuyTransaction(player, button, data, args, scoreboard, stash, slot),
                () => {
                    this.open(player, data, ...args);
                    player.playSound("random.glass");
                }
            );
        } else {
            player.playSound("random.glass");
            this.open(player, data, ...args);
        }
    }

    handleSellButton(player, button, data, args) {
        const itemCount = button.sellButtonItemCount;
        const inventory = player.getComponent('inventory');
        const item = button.sellButtonItem.includes(':') ? button.sellButtonItem : `minecraft:${button.sellButtonItem}`;
        const currItemCount = getItemCount(inventory, item);

        if (currItemCount >= itemCount) {
            this.showSellModal(player, button, data, args, itemCount, currItemCount, inventory, item);
        } else {
            player.playSound("random.glass");
            player.error("You don't have enough items to sell anything");
            this.open(player, data, ...args);
        }
    }

    showSellModal(player, button, data, args, itemCount, currItemCount, inventory, item) {
        const modal = new ModalForm();
        let max = button.sellButtonItemCount;
        let iter = 1;
        while (max < currItemCount && max + itemCount <= currItemCount && iter < 64) {
            max += button.sellButtonItemCount;
            iter++;
        }

        modal.slider(`Sell Count`, button.sellButtonItemCount, max, button.sellButtonItemCount, button.sellButtonItemCount);
        modal.submitButton("Sell");
        modal.show(player, false, (player, response) => this.handleSellResponse(player, response, button, data, args, itemCount, inventory, item, max));
    }

    handleSellResponse(player, response, button, data, args, itemCount, inventory, item, max) {
        if (response.canceled) return this.open(player, data, ...args);
        if (response.formValues[0] % button.sellButtonItemCount !== 0 || 
            response.formValues[0] < button.sellButtonItemCount || 
            response.formValues[0] > max) {
            return this.open(player, data, ...args);
        }

        const amt = response.formValues[0];
        const moneyCount = Math.floor(amt / itemCount) * button.sellButtonPrice;

        try {
            const scoreboard = world.scoreboard.getObjective(button.sellButtonScoreboard || "money");
            if (!scoreboard) {
                world.scoreboard.addObjective(button.sellButtonScoreboard || "money");
            }
            scoreboard.addScore(player, moneyCount);
            clear(inventory, item, amt);
        } catch {}

        player.playSound("note.pling");
        player.success(`Sold x${amt} of ${item.split(':')[1].split('_').map(_ => `${_[0].toUpperCase()}${_.substring(1)}`).join(' ')} for $${moneyCount}`);
        this.open(player, data, ...args);
    }

    processBuyTransaction(player, button, data, args, scoreboard, stash, slot) {
        try {
            const scoreboard2 = world.scoreboard.getObjective(scoreboard);
            if (!scoreboard2) {
                world.scoreboard.addObjective(scoreboard);
            }
            scoreboard2.addScore(player, -button.buyButtonPrice);

            if (button.buyButtonItem) {
                const item = itemdb.getItem(stash, slot);
                const inventory = player.getComponent("inventory");
                inventory.container.addItem(item);
            } else {
                for (const action of button.actions) {
                    const action2 = action.replaceAll("<this>", data.name);
                    for (let i = 0; i < args.length; i++) {
                        action2 = action2.replaceAll(`<$${i + 1}>`, args[i]);
                    }
                    const result = actionParser.runAction(player, formatStr(action2, player));
                    if (!result && button.conditionalActions) break;
                }
            }
        } catch (e) {
            console.warn(e);
        }

        this.open(player, data, ...args);
        player.playSound("note.pling");
    }
}

class NormalFormOpener {
    constructor() {
        this.buttonProcessor = new ButtonProcessor();
    }

    parseArgs(str, ...args) {
        let newStr = str;
        for (let i = 0; i < args.length; i++) {
            newStr = newStr.replaceAll(`<$${i + 1}>`, args[i]);
        }
        return newStr;
    }

    async open(player, data, ...args) {
        if (data.scriptDeps?.length) {
            const missing = data.scriptDeps.filter(dep => !scripting.getActiveScriptIDs().includes(dep));
            if (missing.length) {
                return player.error(`This UI is missing dependency(s)! §r§f${missing.join('§r§7, §r§f')}`);
            }
        }

        if (!data.clog_allow && combatMap.has(player.id) && 
            configAPI.getProperty("CLog") && 
            configAPI.getProperty("CLogDisableUIs") && 
            !prismarineDb.permissions.hasPermission(player, "combatlog.bypass")) {
            player.playSound("random.glass");
            player.error("You can't use this UI in combat");
            return;
        }

        if (data.layout == 5) {
            return this.openModalForm(player, data, ...args);
        }

        return this.openActionForm(player, data, ...args);
    }

    async openModalForm(player, data, ...args) {
        const form = new ModalForm();
        const buttons = await this.getButtons(player, data, ...args);

        if (data.name) form.title(data.name);
        if (data.body) form.label(data.body);

        const opts = buttons
            .filter(button => !["header", "label", "divider"].includes(button.type))
            .map(button => ({
                option: button.text,
                callback() {}
            }));

        form.dropdown("Select an option", opts);
        const buttons2 = buttons.filter(button => !["header", "label", "divider"].includes(button.type));

        form.show(player, false, (player, response) => {
            if (response.canceled) return;
            buttons2[response.formValues[0]].action(player);
        });
    }

    async openActionForm(player, data, ...args) {
        const form = new ActionForm();
        const pre = this.getFormPrefix(data);
        const themID = data.theme || 0;
        const themString = themID > 0 ? `${NUT_UI_THEMED}${themes[themID]?.[0] || ""}` : ``;
        const nutUIAlt = themID > 0 ? `${NUT_UI_ALT}${themes[themID]?.[0] || ""}` : `${NUT_UI_ALT}`;

        form.title(`${pre}${formatStr(this.parseArgs(data.name, ...args), player)}`);
        if (data.body) form.body(formatStr(this.parseArgs(data.body, ...args), player));

        const buttons = await this.getButtons(player, data, ...args);
        for (const button of buttons) {
            if (button.type === "header") {
                form.header(button.text);
                continue;
            }
            if (button.type === "label") {
                form.label(button.text);
                continue;
            }
            if (button.type === "divider") {
                form.divider();
                continue;
            }
            form.button(button.text, button.icon, button.action);
        }

        form.show(player, false, (player, response) => {
            if (response.canceled && data.cancel) {
                actionParser.runAction(player, data.cancel);
            }
        });
    }

    getFormPrefix(data) {
        if (data.layout == 1) return `§g§r§i§d§u§i§r`;
        if (data.layout == 2) return `§f§u§l§l§s§c§r§e§e§n§r`;
        if (data.layout == 3) return `§t§e§s§t§r`;
        if (data.layout == 4) {
            const themID = data.theme || 0;
            const themString = themID > 0 ? `${NUT_UI_THEMED}${themes[themID]?.[0] || ""}` : ``;
            return `§f§0§0${themString}${data.layout == 4 && data.paperdoll ? NUT_UI_PAPERDOLL : ``}§r`;
        }
        return `§r`;
    }

    async getButtons(player, data, ...args) {
        let data2 = JSON.parse(JSON.stringify(data));
        scripting.callHooks(null, "interceptUIData", data2);
        
        let buttons = [];
        let currView = -1;
        let canView = true;

        for (const button of data2.buttons) {
            if (button.type === "separator") {
                canView = this.playerIsAllowed(player, button.condition, data2);
                currView = button.id;
                if (canView) {
                    if (button.clearMode == 1) {
                        buttons = [];
                    } else if (button.clearMode == 2) {
                        buttons = buttons.filter(_ => !button.clearViewIDs.includes(_.currView));
                    } else if (button.clearMode == 3) {
                        buttons = buttons.filter(_ => _.currView != -1);
                    }
                }
                continue;
            }

            if (!canView) continue;
            if (button.disabled && data2.layout != 4) continue;

            const processedButtons = await this.buttonProcessor.processButton(button, {
                player,
                data: data2,
                args,
                currView,
                buttons,
                playerIsAllowed: this.playerIsAllowed.bind(this),
                parseArgs: this.parseArgs.bind(this),
                getIcon: this.getIcon.bind(this),
                getDisplayOverride: this.getDisplayOverride.bind(this),
                convertJSONIntoFormattingExtraVars: this.convertJSONIntoFormattingExtraVars.bind(this),
                open: this.open.bind(this)
            });

            if (Array.isArray(processedButtons)) {
                buttons.push(...processedButtons);
            } else if (processedButtons) {
                buttons.push(processedButtons);
            }
        }

        return buttons;
    }

    getScore(player, objective) {
        let score = 0;
        try {
            const objective2 = world.scoreboard.getObjective(objective);
            score = objective2.getScore(player);
        } catch {
            score = 0;
        }
        if (!score) score = 0;
        return score;
    }

    playerIsAllowedNoNegate(player, tag, ui) {
        if (tag == "$IN_CLAN") return OpenClanAPI.getClan(player) ? true : false;
        if (tag == "$CLAN_OWNER") {
            const clan = OpenClanAPI.getClan(player);
            const playerID = playerStorage.getID(player);
            return clan && clan.data.owner == playerID ? true : false;
        }
        if (tag == "$NETLIB_SETUP") return http.player ? true : false;
        if (tag == "false") return false;
        if (tag == "in_combat") return combatMap.has(player.id);
        if (tag == "true") return true;
        if (tag == "admin") return player.hasTag("admin") || player.isOp();
        if (tag.startsWith('$entideq/')) {
            return player.id.toString() == tag.substring('$entideq/'.length);
        }
        if (tag.startsWith('$thiseq/') && ui) {
            const propertyName = tag.substring('$thiseq/'.length);
            return ui.scriptevent == propertyName;
        }
        if (tag.startsWith("$cfg/")) {
            const propertyName = tag.substring(5);
            if (!configAPI.propertiesRegistered[propertyName]) return false;
            if (configAPI.propertiesRegistered[propertyName].type != configAPI.Types.Boolean) return false;
            return configAPI.getProperty(propertyName) == true;
        }
        if (tag == "$server_has_warps") {
            return warpAPI.getWarps().length >= 1;
        }
        if (tag.startsWith('$perm/')) {
            return prismarineDb.permissions.hasPermission(player, tag.substring(6));
        }

        try {
            if (tag.startsWith(">")) {
                const [objective, value] = tag.substring(1).split(' ');
                return this.getScore(player, objective) > parseInt(value);
            }
            if (tag.startsWith("<")) {
                const [objective, value] = tag.substring(1).split(' ');
                return this.getScore(player, objective) <= parseInt(value);
            }
            if (tag.startsWith("==")) {
                const [objective, value] = tag.substring(2).split(' ');
                return this.getScore(player, objective) == parseInt(value);
            }
        } catch {
            return false;
        }

        return player.hasTag(tag);
    }

    playerIsAllowed(player, tagOld, ui) {
        if (tagOld == "") return true;
        if (tagOld.includes(' && ')) {
            let res = true;
            for (const tag of tagOld.split(' && ')) {
                let result = this.playerIsAllowedNoNegate(player, tag.startsWith('!') ? tag.substring(1) : tag, ui);
                let resultBool = false;
                if (tag.startsWith('!')) {
                    resultBool = !result;
                } else {
                    resultBool = result;
                }
                if (!resultBool) return false;
            }
            return res;
        }
        for (const tag of tagOld.split(' || ')) {
            let result = this.playerIsAllowedNoNegate(player, tag.startsWith('!') ? tag.substring(1) : tag, ui);
            let resultBool = false;
            if (tag.startsWith('!')) {
                resultBool = !result;
            } else {
                resultBool = result;
            }
            if (resultBool) return true;
        }
        return false;
    }

    getIcon(mainIconID, iconOverrides, player) {
        for (const iconOverride of iconOverrides) {
            if (this.playerIsAllowed(player, iconOverride.condition)) return iconOverride.iconID;
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
        for (const key of Object.keys(json)) {
            if (typeof key === "number") {
                vars[`pdb:${depths.join('.')}${depths.length ? "." : ""}${key}`] = json[key].toString();
            } else if (typeof key === "string") {
                vars[`pdb:${depths.join('.')}${depths.length ? "." : ""}${key}`] = json[key];
            } else if (typeof key === "object") {
                vars = { ...vars, ...this.convertJSONIntoFormattingExtraVars(json[key], [...depths, key]) };
            } else if (typeof key === "boolean") {
                vars[`pdb:${depths.join('.')}${depths.length ? "." : ""}${key}`] = json[key] ? "true" : "false";
            }
        }
        return vars;
    }
}

export default new NormalFormOpener();