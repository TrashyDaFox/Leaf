import { system, world } from "@minecraft/server";
import generator from "../api/generator";
import config from "../config";
import { ActionForm, ModalForm } from "../lib/form_func";
import uiManager from "../uiManager";
import { prismarineDb } from "../lib/prismarinedb";
import configAPI from "../api/config/configAPI";

uiManager.addUI(config.uiNames.Generator.Create, "Create Generator", (player, blockTypeID)=>{
    if(!configAPI.getProperty("Generators")) return player.sendMessage("Generators are not enabled");
    let modalForm = new ModalForm();
    modalForm.textField(`You are making a generator for block ${blockTypeID}\n\nGenerator Name`, "Gold Generator", undefined)
    modalForm.textField("Respawn Time", "Respawn Time (in seconds)", undefined)
    modalForm.textField("Scriptevent to give player the item", "gold_gen", undefined)
    modalForm.show(player, false, (player, response)=>{
        if(response.canceled) return;
        if(!response || response.canceled || !response.formValues || !response.formValues[0] || !response.formValues[1] || !/^\d+$/.test(response.formValues[1]) || !response.formValues[2]) return uiManager.open(player, config.uiNames.Generator.Create, blockTypeID);
        generator.addGenerator(response.formValues[0], blockTypeID, parseInt(response.formValues[1]), response.formValues[2]);
    })
})
uiManager.addUI(config.uiNames.Generator.EditRoot, "Generator Edit Root", (player)=>{
    if(!configAPI.getProperty("Generators")) return player.sendMessage("Generators are not enabled");
    let form = new ActionForm();
    form.title("Generators");
    for(const generatorData of generator.getGenerators()) {
        form.button(`§a${generatorData.data.name}\n§r§7${generatorData.data.scriptevent ? generatorData.data.scriptevent : "N/A"}`, null, (player)=>{
            uiManager.open(player, config.uiNames.Generator.EditGenerator, generatorData.id)
        })
    }
    form.show(player, false, ()=>{})
})
uiManager.addUI(config.uiNames.Generator.EditGenerator, "a", (player, id)=>{
    if(!configAPI.getProperty("Generators")) return player.sendMessage("Generators are not enabled");
    let gen = generator.db.getByID(id);
    let form = new ActionForm();
    form.title(gen.data.name);
    form.button("Edit Upgrades", null, (player)=>{
        uiManager.open(player, config.uiNames.Generator.EditGeneratorUpgrades, id);
    })
    form.button("Edit Settings", null, (player)=>{
        
    })
    form.show(player, false, ()=>{})
})
uiManager.addUI(config.uiNames.Generator.EditGeneratorUpgrades, "a", (player, id)=>{
    if(!configAPI.getProperty("Generators")) return player.sendMessage("Generators are not enabled");
    let gen = generator.db.getByID(id);
    let form = new ActionForm();
    form.button("New Upgrade", null, (player)=>{
        let modal = new ModalForm();
        modal.textField("Respawn Time (in seconds)", "10");
        modal.textField("Price", "120");
        let vals1 = prismarineDb.economy.getCurrencies().map(_=>`${_.symbol} ${_.displayName}`);
        let vals2 = prismarineDb.economy.getCurrencies().map(_=>_.scoreboard);
        modal.dropdown(`Currency`, vals1.map(_=>{
            return {
                option: _,
                callback() {}
            }
        }));
        modal.show(player, false, (player, response)=>{
            if(response.canceled) return uiManager.open(player, config.uiNames.Generator.EditGeneratorUpgrades, id);
            if(!response.formValues[0] || !response.formValues[1] || !/^\d+$/.test(response.formValues[0]) || !/^\d+$/.test(response.formValues[1])) return;
            generator.addGeneratorUpgrade(id, parseInt(response.formValues[0]), vals2[response.formValues[2]], parseInt(response.formValues[1]));
            return uiManager.open(player, config.uiNames.Generator.EditGenerator, id);
        })
    })
    let i = 1;
    for(const upgrade of gen.data.upgrades) {
        i++;
        let currency = prismarineDb.economy.getCurrency(upgrade.currency) ? prismarineDb.economy.getCurrency(upgrade.currency) : prismarineDb.economy.getCurrency("default");
        form.button(`Level ${i} (${upgrade.respawnTime}s)\n${currency.symbol} ${upgrade.price}`, null, (player)=>{
            let form2 = new ActionForm();
            form2.button("Delete", null, (player)=>{
                uiManager.open(config.uiNames.Basic.Confirmation, "Are you sure you want to delete this upgrade?", ()=>{
                    gen.data.upgrades.splice(i - 2, 1);
                    generator.db.overwriteDataByID(gen.id, gen.data);
                })
            })
        })
    }
    form.show(player, false, ()=>{});
})
let blockMap = new Map();
system.runInterval(()=>{
    blockMap.clear();
},20);
world.beforeEvents.playerInteractWithBlock.subscribe(e=>{
    if(blockMap.has(e.player.id)) return;
    blockMap.set(e.player.id, true);
    if(e.itemStack && e.itemStack.typeId == "leaf:generator_editor") {
        system.run(()=>{
            uiManager.open(e.player, config.uiNames.Generator.Create, e.block.typeId);

        })
    }
})