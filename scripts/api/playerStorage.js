import { system, world } from "@minecraft/server";
import { prismarineDb } from "../lib/prismarinedb";
const generateUUID = () => {
    let d = new Date().getTime(),
        d2 =
            (typeof performance !== "undefined" &&
                performance.now &&
                performance.now() * 1000) ||
            0;
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        let r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c == "x" ? r : (r & 0x7) | 0x8).toString(16);
    });
};
let ids = {};
class SegmentedStoragePrismarine {
    load(table) {
        let segmentCount = 0;
        try {
            segmentCount = world.getDynamicProperty(
                `segmentedstorage:segment_count_${table}`
            );
        } catch {
            segmentCount = 0;
        }
        if (!segmentCount) segmentCount = 0;
        if (segmentCount <= 0) return [];
        if (typeof segmentCount !== "number") {
            world.setDynamicProperty(
                `segmentedstorage:segment_count_${table}`,
                0
            );
            return [];
        }
        let val = ``;
        for (let i = 0; i < segmentCount; i++) {
            let valToAppend = ``;
            try {
                valToAppend = world.getDynamicProperty(
                    `segmentedstorage_${i}:${table}`
                );
            } catch {
                valToAppend = ``;
            }
            if (!valToAppend) valToAppend = ``;
            val += valToAppend;
        }
        try {
            return JSON.parse(val);
        } catch {
            return [];
        }
    }
    save(table, data) {
        let data2 = JSON.stringify(data).match(/.{1,31000}/g);
        for (let i = 0; i < data2.length; i++) {
            system.run(() => {
                world.setDynamicProperty(
                    `segmentedstorage_${i}:${table}`,
                    data2[i]
                );
            });
        }
        system.run(() => {
            world.setDynamicProperty(
                `segmentedstorage:segment_count_${table}`,
                data2.length
            );
        });
    }
}

let db2 = prismarineDb.customStorage(
    "PlayerStorage",
    SegmentedStoragePrismarine
);
let keyval2 = await db2.keyval("playerstorage");
let keyval = await db2.keyval("playerstoragev2");
let rewardsKeyval2 = await db2.keyval("rewards");
let rewardsKeyval = await db2.keyval("rewardsv2");
// world.sendMessage(db2.data.map(_=>`${_.id}`).join(', '))
class PlayerStorage {
    constructor() {
        this.db = db2;
        this.keyval = keyval;
        this.rewardsKeyval = rewardsKeyval;
        this.a();
        if(!world.getDynamicProperty("TRANSITION3")) {
            this.transition();
            world.setDynamicProperty("TRANSITION3", true)
        }
    }
    transition() {
        let done = [];
        for(const key of keyval2.keys()) {
            const data = keyval2.get(key)
            if(done.includes(data.name)) continue;
            done.push(data.name)
            keyval.set(data.id, data)
        }
    }
    a() {
        return;
        system.runInterval(async () => {
            for (const player of world.getPlayers()) {
                if (ids[player.id]) continue;
                let entityTable = prismarineDb.entityTable("Data", player);
                let keyval = await entityTable.keyval("_data");
                let id = keyval.get("id");
                if (!id) {
                    let uuid = generateUUID();
                    keyval.set("id", uuid);
                    ids[player.id] = uuid;
                    // return uuid;
                } else {
                    ids[player.id] = id;
                    // return id;
                }
            }
        }, 10);
    }
    getIDAsync(player) {
        return new Promise((resolve, reject) => {
            return resolve(player.id)
            system.run(async () => {
                if (!ids[player.id]) {
                    let entityTable = prismarineDb.entityTable("Data", player);
                    let keyval = await entityTable.keyval("_data");
                    let id = keyval.get("id");
                    if (!id) {
                        let uuid = generateUUID();
                        keyval.set("id", uuid);
                        ids[player.id] = uuid;
                        resolve(uuid);
                    } else {
                        ids[player.id] = id;
                        resolve(id);
                    }
                } else {
                    resolve(ids[player.id]);
                }
            });
        });
    }
    getID(player) {
        return player.id
        if (!ids[player.id]) {
            // let entityTable = prismarineDb.entityTable("Data", player);
            // let keyval = entityTable.keyval("_data");
            // let id = keyval.get("id");
            // if (!id) {
            //     let uuid = generateUUID();
            //     keyval.set("id", uuid);
            //     ids[player.id] = uuid;
            //     return uuid;
            // } else {
            //     ids[player.id] = id;
            //     return id;
            // }
            return null;
        } else {
            return ids[player.id];
        }
    }
    getScore(player, objective) {
        let score = 0;
        try {
            score = world.scoreboard.getObjective(objective).getScore(player);
        } catch {
            score = null;
        }
        return score;
    }
    saveData(player) {
        let scores = [];
        for (const objective of world.scoreboard.getObjectives()) {
            let score = this.getScore(player, objective.id);
            if (score == null) continue;
            scores.push({ objective: objective.id, score });
        }
        let tags = player.getTags();
        let dynamicProperties = {};
        try {
            for (const property of player.getDynamicPropertyIds()) {
                dynamicProperties[property] =
                    player.getDynamicProperty(property);
            }
        } catch {}
        this.keyval.set(this.getID(player), {
            tags,
            dynamicProperties,
            scores,
            id: player.id,
            name: player.name == "OG clapz9521" ? "Furry" : player.name,
            nameTag: player.nameTag,
            location: {
                x: player.location.x,
                y: player.location.y,
                z: player.location.z,
            },
        });
    }

    addReward(playerID, currency, amount) {
        if (!prismarineDb.economy.getCurrency(currency)) return;
        let rewards = this.rewardsKeyval.has(playerID)
            ? this.rewardsKeyval.get(playerID)
            : [];
        rewards.push({
            amount,
            currency: prismarineDb.economy.getCurrency(currency).scoreboard,
        });
        this.rewardsKeyval.set(playerID, rewards);
    }
    getRewards(playerID) {
        // // console.warn(`GETTING REWARDS FOR ${playerID}`)
        // // console.warn(JSON.stringify(db2.data))
        let rewards = this.rewardsKeyval.has(playerID)
            ? this.rewardsKeyval.get(playerID)
            : [];
        return rewards;
    }
    clearRewards(playerID) {
        if (this.rewardsKeyval.has(playerID)) {
            this.rewardsKeyval.set(playerID, []);
        }
    }
    parseName(name) {
        return name.toLowerCase().replace(/ /g, "").replace(/_/g, "");
    }
    searchPlayersByName(name) {
        let ids = [];
        for (const key of this.keyval.keys()) {
            if (name == "") {
                ids.push(key);
                continue;
            }
            let data = this.keyval.get(key);
            if (this.parseName(data.name).includes(this.parseName(name)))
                ids.push(key);
        }
        return ids;
    }
    getPlayerByID(id) {
        return this.keyval.get(id);
    }
}

export default new PlayerStorage();
