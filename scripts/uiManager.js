import { functionStore } from "./lib/prismarinedb";
// what u doing in here
// dont break this
// this is the most important thing in leaf other than prismarinedb
class UIManager {
    #store
    #descriptions
    #altStore
    #uis
    constructor() {
        this.#store = functionStore.getStore("uis");
        this.#altStore = functionStore.getStore("uis_alt");
        this.#descriptions = new Map();
        this.#uis = {};
    }
    get uis() {
        return [...this.#store.getList()].map(_=>{
            return {
                id: _,
                ui: function(){},
                desc: this.#descriptions.get(_)
            }
        });
    }
    addUI(id, desc, ui) {
        this.#descriptions.set(id, desc ? desc : "No Description");
        let names = id.split(' | ');
        let mainName = names[0];
        this.#store.add(mainName, ui);
        this.#uis[mainName] = "MAIN";
        if(names.length > 1) {
            this.#altStore.add(names.slice(1).join(' | '), ui);
            this.#uis[names.slice(1).join(' | ')] = "ALT"
        }
    }
    open(player, id, ...data) {
        let name = id.split(' | ')[0];
        let type = this.#uis[name];
        if(type == "MAIN") {
            this.#store.call(name, player, ...data);
        } else if(type == "ALT") {
            this.#altStore.call(name, player, ...data);
        }
    }
}
export default new UIManager();