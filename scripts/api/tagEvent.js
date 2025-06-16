import { prismarineDb } from "../lib/prismarinedb";

class TagEvents {
    constructor() {
        this.db = prismarineDb.table("TagEvents");
    }
}
