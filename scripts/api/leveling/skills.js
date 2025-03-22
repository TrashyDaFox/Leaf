import { prismarineDb } from "../../lib/prismarinedb";
import { SegmentedStoragePrismarine } from "../../prismarineDbStorages/segmented";

class Skills {
    constructor() {
        this.db = prismarineDb.customStorage("Jobs", SegmentedStoragePrismarine)
    }
}

export default new Skills();