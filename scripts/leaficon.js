import { system } from '@minecraft/server';
import icons from './api/icons';

let tempRegistry = {};

system.afterEvents.scriptEventReceive.subscribe(e=>{
    if(!e.id.startsWith('leaficon:')) return;
    if(e.id == "leaficon:add_icon_pack") {
        let json = JSON.parse(e.message);
        if(json.ns && typeof json.ns === "string" && json.name && typeof json.name === "string" && json.version && typeof json.version === "number") {
            tempRegistry[json.ns] = new Map([
                ["pack_name", json.name],
                ["pack_icon", "textures/items/diamond_sword"],
                ["pack_namespace", json.ns],
                ["pack_data", new Map()]
            ])
        }
    }
    if(e.id == "leaficon:add_icon_to_pack") {
        let json = JSON.parse(e.message);
        if(tempRegistry[json.pack]) {
            tempRegistry[json.pack].get("pack_data").set(json.icon.name, json.icon.texture_path)
        }
    }
    if(e.id == "leaficon:push_icon_pack_to_registry") {
        if(tempRegistry[e.message]) {
            icons.install(tempRegistry[e.message]);
        }
    }
})