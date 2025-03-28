import { sidebarConfig } from "../configs";
import sidebarEditor from "./sidebarEditor";
import { system, world } from '@minecraft/server';
import uiBuilder from "./uiBuilder";
import configAPI from "./config/configAPI";

configAPI.registerProperty("Sidebar", configAPI.Types.Boolean, false)

system.runInterval(()=>{
    if(!configAPI.getProperty("Sidebar")) return;
    for(const player of world.getPlayers()) {
        try {
            if(player.hasTag("disable-sidebar")) {
                player.onScreenDisplay.setTitle("")
                return;
            }
            let sidebarName = uiBuilder.db.findFirst({isDefaultSidebar: true, type: 7})?.data.name || sidebarEditor.getSidebarNames()[0];
            let tag = player.getTags().find(_=>_.startsWith('sidebar:'));
            if(tag) sidebarName = tag.substring('sidebar:'.length);
            try {
                let sidebar = sidebarEditor.parseEntireSidebar(player, sidebarName);
                if(sidebar != "@@LEAF_SIDEBAR_IGNORE") player.onScreenDisplay.setTitle(`§r${sidebar}`);
    
            } catch(e) {
                console.error(e)
            }
    
        } catch {

        }
    }
},3);