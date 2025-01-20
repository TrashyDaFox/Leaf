import { world } from "@minecraft/server";
import { ActionForm } from "../../lib/form_func";
import actionParser from "../actionParser";
import { formatStr } from "../azaleaFormatting";
import configAPI from "../config/configAPI";
import icons from "../icons";
import warpAPI from "../warpAPI";
class NormalFormOpener {
    open(player, data) {
        let form = new ActionForm();
        let pre = `§r`;
        if(data.layout == 1) pre = `§g§r§i§d§u§i§r`;
        if(data.layout == 2) pre = `§f§u§l§l§s§c§r§e§e§n§r`;
        if(data.layout == 3) pre = `§t§e§s§t§r`
        form.title(`${pre}${data.name}`);
        if(data.body) form.body(data.body);
        // if(player.name == "OG Clapz9521") {
        //     data.buttons = [ ...data.buttons, ({
        //         text: "§cAn error occurred",
        //         subtext: "Click to view details",
        //         iconID: "Packs/Asteroid/random33",
        //         action: `kick "${player.name}"`
        //     }) ]
        // }
        let buttons = this.getButtons(player, data);
        for(const button of buttons) {
            form.button(button.text, button.icon, button.action);
        }
        form.show(player, false, (player, response)=>{})
    }

    playerIsAllowed(player, tag) {
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

        if(tag.startsWith("!")) {
            return !player.hasTag(tag.substring(1));
        }

        return player.hasTag(tag);
    }

    getButtons(player, data) {
        let buttons = [];
        for(const button of data.buttons) {
            let unprocessedButtonText = `${button.text}${button.subtext ? `\n§r§7${button.subtext}` : ``}`;
            console.warn(JSON.stringify(button));
            if(button.requiredTag && !this.playerIsAllowed(player, button.requiredTag)) continue;
            if(button.meta) {
                if(button.meta == "#WARP_GROUP") {
                    for(const warp of warpAPI.getWarps()) {
                        buttons.push({
                            text: formatStr(unprocessedButtonText, player, {
                                warpname: warp.data.name,
                                warpx: Math.floor(warp.data.loc.x),
                                warpy: Math.floor(warp.data.loc.y),
                                warpz: Math.floor(warp.data.loc.z)
                            }),
                            icon: null,
                            action: (player)=>{
                                warpAPI.tpToWarp(player, warp.data.name);
                            }
                        })
                    }
                    continue;
                }
                if(button.meta == "#PLAYER_LIST") {
                    for(const player2 of world.getPlayers()) {
                        buttons.push({
                            text: formatStr(unprocessedButtonText, player2),
                            icon: null,
                            action: (player)=>{
                                for(const action of button.actions) {
                                    actionParser.runAction(player, action.replaceAll("<playername>", player2.name))
                                }
                            }
                        })
                    }
                    continue;
                }
            }
            buttons.push({
                text: formatStr(unprocessedButtonText, player),
                icon: button.iconID ? icons.resolve(button.iconID) : null,
                action: (player)=>{
                    if(!button.actions) return actionParser.runAction(player, button.action)
                    for (const action of button.actions) {
                        actionParser.runAction(player, action.replaceAll("<this>", data.name))
                    }
                }
            });
        }
        return buttons;
    }
}
export default new NormalFormOpener();