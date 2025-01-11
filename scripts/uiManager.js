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
    
    open(player, id, ...data) {
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
    }
}

export default new UIManager();