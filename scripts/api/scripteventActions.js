import { prismarineDb } from '../lib/prismarinedb'

class ScriptEventActions {
    constructor() {
        this.db = prismarineDb.table('scripteventactions')
    }
    add(action, name) {
        if(this.db.findFirst({name})) return;
        
    }
}