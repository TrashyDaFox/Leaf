import { MessageFormData } from "@minecraft/server-ui";
import configAPI from "./api/config/configAPI";
import { combatMap } from "./features/clog";
import versionData from "./versionData";

class UIManager {
    #mainUIs
    #altUIs
    #descriptions
    
    constructor() {
        this.#mainUIs = new Map();
        this.#altUIs = new Map();
        this.#descriptions = new Map();
    }
    
    get uis() {
        return Array.from(this.#mainUIs.keys()).map(id => {
            return {
                id: id,
                ui: this.#mainUIs.get(id),
                description: this.#descriptions.get(id)
            }
        });
    }
    
    addUI(id, desc, ui) {
        this.#descriptions.set(id, desc ?? "No Description");
        
        const names = id.split(' | ');
        const mainName = names[0];
        
        // Store main UI
        this.#mainUIs.set(mainName, ui);
        
        // Store alternate UI if it exists
        if (names.length > 1) {
            const altName = names.slice(1).join(' | ');
            this.#altUIs.set(altName, ui);
        }
    }
    #open(player, id, ...data) {
        try {
            const names = id.split(' | ');
            const name = names[0];
            
            // Try to find and execute the UI function
            const mainUI = this.#mainUIs.get(name);
            if (mainUI) {
                mainUI(player, ...data);
                return;
            }
            
            const altUI = this.#altUIs.get(name);
            if (altUI) {
                altUI(player, ...data);
                return;
            }

            if(!altUI && !mainUI) {
                let form = new MessageFormData();
                form.body(`§cError: UI §e'${id.split(' | ')[0]}' §r§cdoes NOT exist.\n\n§fTell §vtrashy §r§fto get her shitt checked if you saw this §enormally without doing random scriptevents§r§f.`)
                form.button1("Close")
                form.button2("Meow")
                form.show(player).then(()=>{})
            }
    
        } catch(e) {
            if(configAPI.getProperty("DevMode"))
                player.error(`${e} ${e.stack}`)
        }
    }
    open(player, id, ...data) {
        if(configAPI.getProperty("CLog") && configAPI.getProperty("CLogDisableUIs") && combatMap.has(player.id)) return player.error("You cant open this UI while in combat")
        let MASSAHEX = ["MassaHex"]
        if(MASSAHEX.includes(player.name) && id != versionData.uiNames.Basic.Confirmation) {
            this.open(player, versionData.uiNames.Basic.Confirmation, `Are you sure you want to open ${id.split(' | ')[0]}? This action is irreversible!\n\n(maybe stop being an asss if u dont like this lol)`, ()=>{
                this.#open(player, id, ...data)
            }, ()=>{
                player.error("imagine being homophobic")
            })
        } else {
            this.#open(player, id, ...data)
        }
    }
}

export default new UIManager();