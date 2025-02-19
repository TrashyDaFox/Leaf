import { prismarineDb } from "../../lib/prismarinedb";
import { SegmentedStoragePrismarine } from "../../prismarineDbStorages/segmented";

class PlayerContentManager {
    #validTypes;
    constructor() {
        this.db = prismarineDb.table("ContentDumps");
        this.contentDumps = {};
        this.#validTypes = [
            "BOOL",
            "STRING",
            "NUMBER",
            "RANGE",
            "STRING_DROPDOWN"
        ];
        this.types = {
            Bool: "BOOL",
            String: "STRING",
            Number: "NUMBER",
            Range: "RANGE",
            StringDropdown: "STRING_DROPDOWN"
        };
    }
    createContentDump(name) {
        if(this.db.findFirst({name})) return null
        return this.db.insertDocument({
            name,
            configProperties: {},
            properties: [],
            type: "CONTENT_DUMP"
        })
    }
    getContentDumps() {
        return this.db.findDocuments({type:"CONTENT_DUMP"})
    }
    createBoolProperty(contentDumpName, {name, displayName}) {
        let contentDump = this.db.findFirst({name: contentDumpName});
        if(!contentDump) return false;
        if(contentDump.data.properties.find(_=>_.name == name)) return false;
        contentDump.data.properties.push({
            name,
            displayName,
            type: "BOOL"
        })
        return true;
    }
    createStringProperty(contentDumpName, {name, maxLength = 100, minLength = 1, displayName}) {
        let contentDump = this.db.findFirst({name: contentDumpName});
        if(!contentDump) return false;
        if(contentDump.data.properties.find(_=>_.name == name)) return false;
        contentDump.data.properties.push({
            name,
            displayName,
            maxLength,
            minLength,
            type: "STRING"
        })
        return true;
    }
    createNumberProperty(contentDumpName, {name, max = 64, min = 1, displayName}) {
        let contentDump = this.db.findFirst({name: contentDumpName});
        if(!contentDump) return false;
        if(contentDump.data.properties.find(_=>_.name == name)) return false;
        contentDump.data.properties.push({
            name,
            displayName,
            max,
            min,
            type: "NUMBER"
        })
        return true;
    }
    verifyResponse(contentDumpName, data) {
        let contentDump = this.db.findFirst({name: contentDumpName});
        if(!contentDump) return {error: true, message: "Content dump not found"};
        for(const key in data) {
            if(!contentDump.properties.find(_=>_.name  == key)) return {error: true, message: "Invalid property key"}
        }
        return true;
    }
    getContentDumpDB(contentDumpName) {
        let contentDump = this.db.findFirst({name: contentDumpName});
        if(!contentDump) return null;
        let contentDumpDB = this.contentDumps[contentDumpName];
        if(!contentDumpDB) contentDumpDB = prismarineDb.customStorage(`ContentDump~${contentDumpName}`, SegmentedStoragePrismarine);
        return contentDumpDB;
    }
    submit(contentDumpName, data) {
        let contentDump = this.db.findFirst({name: contentDumpName});
        if(!contentDump) return false;
        if(!this.verifyResponse(contentDumpName, data)) return false;
        let contentDumpDB = this.getContentDumpDB(contentDumpName)
        if(!contentDumpDB) return false;
        contentDumpDB.insertDocument({
            type: "RESPONSE",
            responseData: data
        })
        return true;
    }
    getResponses(contentDumpName) {
        let contentDump = this.db.findFirst({name: contentDumpName});
        if(!contentDump) return false;
        let contentDumpDB = this.getContentDumpDB(contentDumpName)
        if(!contentDumpDB) return false;
        let responses = contentDumpDB.data.filter(_=>_.data.type == "RESPONSE").map(_=>_.data.responseData);
        return responses;
    }
}

export default new PlayerContentManager();