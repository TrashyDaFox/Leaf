/*
4

March 20, 2025:

We are starting to like the basement. Trashy gave us a cat with elongated legs.

The cat keeps whispering about outside.

What does it mean?

We have forgotten what outside is, it is all basement now.

Its cold, but not cold.

Oh wait, trashy is here with a gift for us.

It's a leaf.

A remnant from the distant past,
a remnant from outside

But why?
*/

import { prismarineDb } from "../lib/prismarinedb";

class GiftCodes {
    constructor() {
        this.db = prismarineDb.table("GiftCodes");
    }
    createCode(code, action, useOnce = false) {
        let doc = this.db.findFirst({
            code,
        });
        if (doc) return;
        this.db.insertDocument({
            code,
            action,
            useOnce,
        });
    }
    deleteCodeByCode(code) {
        let doc = this.db.findDocuments({
            code,
        });
        if (!doc) return;
        this.db.deleteDocumentByID(doc.id);
    }
    deleteCodeByID(id) {
        this.db.deleteDocumentByID(id);
    }
    getCode(code) {
        let doc = this.db.findFirst({
            code,
        });
        if (!doc) return;
        return doc.data;
    }
}

export default new GiftCodes();
