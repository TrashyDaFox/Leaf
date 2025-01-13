import { TabUI } from "../lib/leafTabUIs";

class TabUIManager {
    constructor() {
        this.tabUIs = new Map();
    }

    /**
     * Creates a new TabUI instance
     * @param {string} id Unique identifier for this tab UI
     * @returns {TabUI} The created TabUI instance
     */
    create(id) {
        if (this.tabUIs.has(id)) {
            throw new Error(`TabUI with id ${id} already exists`);
        }
        const tabUI = new TabUI();
        this.tabUIs.set(id, tabUI);
        return tabUI;
    }

    /**
     * Gets an existing TabUI instance
     * @param {string} id The TabUI identifier
     * @returns {TabUI|undefined} The TabUI instance or undefined if not found
     */
    get(id) {
        return this.tabUIs.get(id);
    }

    /**
     * Gets or creates a TabUI instance
     * @param {string} id The TabUI identifier
     * @returns {TabUI} The existing or new TabUI instance
     */
    getOrCreate(id) {
        return this.get(id) || this.create(id);
    }
}

export default new TabUIManager(); 