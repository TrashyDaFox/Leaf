import { prismarineDb } from "./lib/prismarinedb";
let tagsDb = prismarineDb.table("WorldTags2")
let tagsKeyval = await tagsDb.keyval("WTAG");

class WorldTags {
    constructor() {
        this.tagsDb = tagsKeyval;
        if(!this.tagsDb.get("tags")) this.tagsDb.set("tags", [])
    }
    removeTag(tag) {
        let tags = this.tagsDb.get("tags", []);
        this.tagsDb.set("tags", tags.filter(_=>_ != tag));
    }
    addTag(tag) {
        let tags = this.tagsDb.get("tags", []);
        tags.push(tag);
        this.tagsDb.set("tags", tags);
    }
    getTags() {
        let tags = this.tagsDb.get("tags", []);
        return tags;
    }
    hasTag(tag) {
        let tags = this.tagsDb.get("tags", []);
        return tags.includes(tag);
    }
}

export const worldTags = new WorldTags();