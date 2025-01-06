import { prismarineDb } from "../lib/prismarinedb";

class Permissions {
    constructor() {
        this.db = prismarineDb.table("Permissions");
        this.#initializeAdmin();
        this.#initializeDefault();
    }
    #initializeAdmin() {
        let doc = this.db.findFirst({
            tag: "admin"
        });
        if(!doc) {
            this.db.insertDocument({
                isAdmin: true,
                permissions: [],
                isDefault: false,
                isCustom: false,
                isDeletable: false,
                isEditable: false,
                tag: "admin"
            })
        }
    }
    #initializeDefault() {
        let doc = this.db.findFirst({
            tag: "default"
        });
        if(!doc) {
            this.db.insertDocument({
                isAdmin: false,
                permissions: [],
                isDefault: true,
                isCustom: false,
                isDeletable: false,
                isEditable: true,
                tag: "default"
            })
        }
    }
    hasPermission(player, permission) {
        let perms = [];
        for(const role of this.db.findDocuments(null)) {
            if(player.hasTag(role.data.tag)) {
                if(role.data.isAdmin) return true;
                perms = [...perms, ...role.data.permissions];
            }
        }
        return perms.includes(permission);
    }
    createRole(tag) {
        if(this.db.findFirst({tag})) return;
        this.db.insertDocument({
            tag,
            isAdmin: false,
            permissions: [],
            isDefault: false,
            isCustom: true,
            isDeletable: true,
            isEditable: true
        });
    }
    editRolePermissions(id, permissions = [], isAdmin = false) {
        if(isAdmin) {
            let doc = this.db.getByID(id);
            if(!doc) return;
            doc.data.isAdmin = true;
            this.db.overwriteDataByID(doc.id, doc.data);
            return;
        }
        let doc = this.db.getByID(id);
        if(!doc) return;
        doc.data.isAdmin = false;
        doc.data.permissions = permissions;
        this.db.overwriteDataByID(doc.id, doc.data);
    }
}

export default new Permissions();