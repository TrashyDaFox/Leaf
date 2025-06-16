// apple music is objectively better

import { prismarineDb } from "../lib/prismarinedb";

class Reports {
    constructor() {
        this.db = prismarineDb.table("Reports");
    }
    create(name, body, type, player) {
        if (this.db.findFirst({ name })) return false;
        this.db.insertDocument({
            name,
            body,
            type,
            player: player.name,
        });
        return true;
    }
    get(id) {
        let r = this.db.getByID(id);
        if (!r) return false;
        return r;
    }
    getAll() {
        return this.db.findDocuments();
    }
    delete(id) {
        let r = this.db.getByID(id);
        if (!r) return false;
        this.db.deleteDocumentByID(id);
        return true;
    }
    getFromPlayer(name) {
        return this.db.findDocuments({ player: name });
    }
}

export default new Reports();
