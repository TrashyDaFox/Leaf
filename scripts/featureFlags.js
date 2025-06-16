import { prismarineDb } from "./lib/prismarinedb";

class FeatureFlags {
    constructor() {
        this.db = prismarineDb
            .table("featureflags")
            .keyval("asdasdasdasdasdasdasdasdasdasdasdasd"); // very professional frfr
    }
    // getFeatureFlags() {
    //     return this.db.has("a") ? this.db.get("a") : [];
    // }
    // setFeatureFlags(flags) {
    //     this.db.set("a", [])
    // }
    // addFeatureFlag(flag) {
    //     let flags = this.#getFeatureFlags();
    //     if(!flags.includes(flag)) flags.push(flag);

    // }
}

export default new FeatureFlags();
