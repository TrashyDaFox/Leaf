import { Player, system, world } from "@minecraft/server";
import { prismarineDb } from "../../lib/prismarinedb";
import { SegmentedStoragePrismarine } from "../../prismarineDbStorages/segmented";
import configAPI from "../config/configAPI";
import playerStorage from "../playerStorage";
import zones from "../zones";

function isPointInCube(px, py, pz, x1, y1, z1, x2, y2, z2) {
    // Ensure the coordinates are ordered correctly (min and max)
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    const minZ = Math.min(z1, z2);
    const maxZ = Math.max(z1, z2);

    // Check if the point is within the cube bounds
    return (
        px >= minX &&
        px <= maxX &&
        py >= minY &&
        py <= maxY &&
        pz >= minZ &&
        pz <= maxZ
    );
}

configAPI.registerProperty("LandClaimsBasePrice", configAPI.Types.Number, 100);
configAPI.registerProperty("LandClaimsRegionPrice", configAPI.Types.Number, 25);
configAPI.registerProperty(
    "LandClaimsIncreasingPrice",
    configAPI.Types.Number,
    10
);
configAPI.registerProperty(
    "LandClaimsIncreasingPriceGrowthFactor",
    configAPI.Types.Number,
    1.2
);
configAPI.registerProperty(
    "LandClaimsCurrency",
    configAPI.Types.String,
    "default"
);
configAPI.registerProperty(
    "LandClaimsRefundPercent",
    configAPI.Types.Number,
    100
);
configAPI.registerProperty("LandClaimsMaxArea", configAPI.Types.Number, 20000);
configAPI.registerProperty("LandClaimsRegionSize", configAPI.Types.Number, 12);

let playerMap = new Map();

class LandClaims {
    constructor() {
        this.db = prismarineDb.customStorage(
            "LandClaims",
            SegmentedStoragePrismarine
        );
        this.initSystem();
    }
    initSystem() {
        system.runInterval(() => {
            if (!configAPI.getProperty("LandClaims")) return null;
            for (const player of world.getPlayers()) {
                // // console.warn(player.name)
                if (!playerMap.has(player.id)) {
                    // // console.warn(`Initializing keys`)
                    let zone = zones.getZoneAtVec3(player.location);
                    playerMap.set(player.id, zone ? zone.id : null);
                    continue;
                }
                let zone = zones.getZoneAtVec3(player.location);
                let currZone = playerMap.get(player.id);
                // // console.warn(`Zone: ${zone ? zone.id : "null"}, Old Zone: ${currZone ? currZone : "null"}`)
                if ((zone ? zone.id : null) != currZone) {
                    playerMap.set(player.id, zone ? zone.id : null);
                    player.onScreenDisplay.setActionBar(
                        `${zone ? zone.data.name : "Wilderness"}`
                    );
                }
            }
        }, 20);
    }
    isInClaim(pos) {
        if (!configAPI.getProperty("LandClaims")) return null;
        for (const doc of this.db.findDocuments({ type: "CLAIM" })) {
            let result = isPointInCube(
                pos.x,
                pos.y,
                pos.z,
                doc.data.pos1.x,
                doc.data.pos1.y,
                doc.data.pos1.z,
                doc.data.pos2.x,
                doc.data.pos2.y,
                doc.data.pos2.z
            );
            if (result) return doc;
        }
        return null;
    }
    async claim(name, owner, pos1, pos2) {
        if (!configAPI.getProperty("LandClaims")) return 4;
        if (!(owner instanceof Player)) return 1;
        pos1 = {
            x: Math.floor(pos1.x),
            y: Math.floor(pos1.y),
            z: Math.floor(pos1.z),
        };
        pos2 = {
            x: Math.floor(pos2.x),
            y: Math.floor(pos2.y),
            z: Math.floor(pos2.z),
        };
        let playerID = await playerStorage.getIDAsync(owner);
        let width = Math.abs(pos2.x - pos1.x);
        let length = Math.abs(pos2.z - pos1.z);
        let size = width * length;
        let maxArea = configAPI.getProperty("LandClaimsMaxArea");
        if (size > maxArea) return 3;
        let basePrice = configAPI.getProperty("LandClaimsBasePrice");
        let priceForRegion = configAPI.getProperty("LandClaimsRegionPrice");
        let increasingPrice = configAPI.getProperty(
            "LandClaimsIncreasingPrice"
        );
        let increasingPriceGrowthFactor = configAPI.getProperty(
            "LandClaimsIncreasingPriceGrowthFactor"
        );
        let landClaimCount = this.db.findDocuments({
            owner: playerID,
            ownerType: "PLAYER",
            type: "CLAIM",
        }).length;
        let regionSize = configAPI.getProperty("LandClaimsRegionSize");
        let price = Math.floor(
            basePrice +
                Math.max(0, Math.floor(size / regionSize ** 2) - 1) *
                    priceForRegion +
                (increasingPrice == 0
                    ? 0
                    : Math.floor(
                          landClaimCount > 0
                              ? landClaimCount ** increasingPriceGrowthFactor *
                                    increasingPrice
                              : 0
                      ))
        );

        let currency = configAPI.getProperty("LandClaimsCurrency");
        let currencyData = prismarineDb.economy.getCurrency(currency);
        let playerBalance = prismarineDb.economy.getMoney(
            owner,
            currencyData.scoreboard
        );
        if (playerBalance < price) return 2;
        prismarineDb.economy.removeMoney(owner, price, currencyData.scoreboard);
        if (this.isInClaim(pos1) || this.isInClaim(pos2)) return 0;
        pos1.y = owner.dimension.heightRange.min;
        pos2.y = owner.dimension.heightRange.max;
        this.db.insertDocument({
            type: "CLAIM",
            ownerType: "PLAYER",
            name,
            owner: playerID,
            pos1,
            pos2,
            dimension: owner.dimension.id,
            price,
            currency: currencyData.scoreboard,
            permissions: [],
            flags: zones.flags,
            priority: 0,
        });
        return -1;
    }
    async getClaimPrice(owner, pos1, pos2) {
        if (!configAPI.getProperty("LandClaims")) return 2;
        if (!(owner instanceof Player)) return 1;
        let playerID = await playerStorage.getIDAsync(owner);
        let width = Math.abs(pos2.x - pos1.x);
        let length = Math.abs(pos2.z - pos1.z);
        let size = width * length;
        let maxArea = configAPI.getProperty("LandClaimsMaxArea");
        if (size > maxArea) return -1;
        let basePrice = configAPI.getProperty("LandClaimsBasePrice");
        let priceForRegion = configAPI.getProperty("LandClaimsRegionPrice");
        let increasingPrice = configAPI.getProperty(
            "LandClaimsIncreasingPrice"
        );
        let increasingPriceGrowthFactor = configAPI.getProperty(
            "LandClaimsIncreasingPriceGrowthFactor"
        );
        let landClaimCount = this.db.findDocuments({
            owner: playerID,
            ownerType: "PLAYER",
            type: "CLAIM",
        }).length;
        let regionSize = configAPI.getProperty("LandClaimsRegionSize");
        let price = Math.floor(
            basePrice +
                Math.max(0, Math.floor(size / regionSize ** 2) - 1) *
                    priceForRegion +
                (increasingPrice == 0
                    ? 0
                    : Math.floor(
                          landClaimCount > 0
                              ? landClaimCount ** increasingPriceGrowthFactor *
                                    increasingPrice
                              : 0
                      ))
        );

        return price;
    }
    async unclaim(id) {
        if (!configAPI.getProperty("LandClaims")) return 1;
        let claim = this.db.getByID(id);
        if (!claim || claim.data.type != "CLAIM") return 0;
        let foundPlayer = false;
        let refundPercent = configAPI.getProperty("LandClaimsRefundPercent");
        let refundAmount = Math.ceil(claim.data.price * (100 / refundPercent));
        for (const player of world.getPlayers()) {
            try {
                let id = playerStorage.getID(player);
                if (id == claim.data.owner) {
                    prismarineDb.economy.addMoney(
                        player,
                        refundAmount,
                        claim.data.currency
                    );
                    foundPlayer = true;
                }
            } catch {}
        }
        if (!foundPlayer) {
            playerStorage.addReward(
                claim.data.owner,
                claim.data.currency,
                refundAmount
            );
        }
        this.db.deleteDocumentByID(id);
        return 100 + refundAmount;
    }
}

export default new LandClaims();
