import { prismarineDb } from "../lib/prismarinedb";

class GiftCodes {
    constructor() {
        this.db = prismarineDb.table("GiftCodes");
    }
    createCode(code, action, useOnce = false) {
        let doc = this.db.findFirst({
            code
        });
        if(doc) return;
        this.db.insertDocument({
            code,
            action,
            useOnce
        })
    }
    deleteCodeByCode(code) {
        let doc = this.db.findDocuments({
            code
        });
        if(!doc) return;
        this.db.deleteDocumentByID(doc.id);
    }
    deleteCodeByID(id) {
        this.db.deleteDocumentByID(id);
    }
    getCode(code) {
        let doc = this.db.findFirst({
            code
        });
        if(!doc) return;
        return doc.data;
    }
}

export default new GiftCodes();