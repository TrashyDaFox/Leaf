import { prismarineDb } from "../lib/prismarinedb";

class ModalFormEditor {
    constructor() {
        this.db = prismarineDb.table("Meow");
    }

    createModalForm(title, scriptevent) {
        return this.db.insertDocument({
            title,
            scriptevent,
            controls: []
        });
    }

    addToggle(id, label, toggleOnCommand, toggleOffCommand, toggledOnTag) {
        let doc = this.db.getByID(id);
        if(!doc) return;
        doc.data.controls.push({
            label,
            toggleOnCommand,
            toggleOffCommand,
            toggledOnTag
        })
        this.db.overwriteDataByID(doc.id, doc.data);
    }

    editToggle(id, label, toggleOnCommand, toggleOffCommand, toggledOnTag, index) {
        let doc = this.db.getByID(id);
        if(!doc) return;
        doc.data.controls[index] = {
            label,
            toggleOnCommand,
            toggleOffCommand,
            toggledOnTag
        }
        this.db.overwriteDataByID(doc.id, doc.data);
    }

    deleteModalForm(id) {
        this.db.deleteDocumentByID(id);
    }

    getUIs() {
        return this.db.data;
    }
}

export default new ModalFormEditor();