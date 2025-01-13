import { prismarineDb } from "../lib/prismarinedb";

class TPA {
    constructor() {
        this.db = prismarineDb.nonPersistentTable('tpa')
    }
    request(plr, toplr) {
        
    }
}