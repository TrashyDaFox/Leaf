
    // form.title("§t§a§b§b§e§d§r§fTab UIs");
    // form.button(`§t§a§b§r§f\uE180 UIs`, null, (player)=>{
    //     uiManager.open(player, config.uiNames.UIBuilderRoot)
    // })
    // // form.button(`§t§a§b§r§f${emojis.axolotl_bucket} Presets`, null, (player)=>{

import uiManager from "../uiManager";
import { ActionForm } from "./form_func";

    // // })
    // form.button(`§t§a§b§a§c§t§i§v§e§r§f\uE17E Tab UIs`, null, (player)=>{
    //     uiManager.open(player, config.uiNames.UIBuilderTabbed)

    // })
    // form.button(`§t§a§b§r§f\uE17F Info`, null, (player)=>{
    //     uiManager.open(player, config.uiNames.UIBuilderInfo)
    // })

export class TabUI {
    constructor() {
        this.tabs = [];
    }
    registerTab(title, fn) {
        this.tabs.push({title, fn})
    }
    open(player, tab = 0) {
        if(tab < 0) tab = 0;
        if(tab >= this.tabs.length) tab = this.tabs.length - 1;

        let form = new ActionForm();
        form.title(`§t§a§b§b§e§d§r§f${this.tabs[tab].title}`);

        for(let i = 0;i < this.tabs.length;i++) {
            form.button(`§t§a§b${i == tab ? "§a§c§t§i§v§e" : ""}§r§f${this.tabs[i].title}`, null, (player)=>{
                this.open(player, i)
            })
        }

        let data = this.tabs[tab].fn(player)

        if(data) {
            if(data.buttons) {
                for(const button of data.buttons) {
                    form.button(button.text, button.iconPath, button.callback)
                }
            }

            if(data.body) {
                form.body(data.body)
            }
        }

        form.show(player, false, (player, response)=>{})
    }
}

let tabUI = new TabUI();
tabUI.registerTab("Tab 1", (player)=>{
    let buttons = [
        {
            text: "Dimond :3",
            iconPath: "textures/items/diamond",
            callback(player) {
                player.sendMessage("haii")
            }
        }
    ]
    return { buttons, body: "Body 1" }
})

tabUI.registerTab("Tab 2", (player)=>{
    let buttons = [
        {
            text: "Emerald >:3",
            iconPath: "textures/items/emerald",
            callback(player) {
                player.sendMessage("haii (part 2)")
            }
        }
    ]
    return { buttons, body: "Body 2" }
})

uiManager.addUI("tab_test_2 | Leaf/Tests/Tab/2", "a", (player)=>{
    tabUI.open(player)
})
// very simple 
// also if u put an emoji on the tab the title will display the emoji id
// i will fix that uwu]
// am back
// yo what are u doing
// i am meowing~ :3 uwu
// u` have a whole list of things u can do on the trello thing
// ik, im going to add custom commands :3