import { ItemTypes, system, world } from "@minecraft/server";
import { prismarineDb } from "../../lib/prismarinedb";
import { SegmentedStoragePrismarine } from "../../prismarineDbStorages/segmented";
import playerStorage from "../playerStorage";
import itemdb from "../itemdb";
import { dynamicToast } from "../../lib/chatNotifs";

// Only took me 3 years >:3
class AH {
    constructor() {
        this.db = prismarineDb.customStorage("AH", SegmentedStoragePrismarine)
        this.db.waitLoad().then(()=>{
            console.warn(`loaded AH data!`)
        })
        this.durations = {
            _1_DAY: 1000 * 60 * 60 * 24,
            _1_WEEK: 1000 * 60 * 60 * 24 * 7
        }
        system.runInterval(()=>{
            let auctions = this.db.findDocuments({type: "AUCTION"});
            for(const auction of auctions) {
                if(auction.data.endTime > Date.now()) continue;
                console.warn(`AH: Auction ${auction.id} is ending`)
                this.handleWinner(auction);
                this.db.deleteDocumentByID(auction.id);
            }
        },10)
    }
    addBlacklistedItem(itemID) {
        if(this.db.findFirst({item:itemID, type:"BLACKLISTED_ITEM"})) return;
        this.db.insertDocument({
            item: itemID,
            type: "BLACKLISTED_ITEM"
        })
    }
    removeBlacklistedItem(itemID) {
        let doc = this.db.findFirst({item:itemID, type:"BLACKLISTED_ITEM"})
        if(!doc) return;
        this.db.deleteDocumentByID(doc.id)
    }
    isBlacklisted(itemID) {
        let doc = this.db.findFirst({item:itemID, type:"BLACKLISTED_ITEM"})
        return doc ? true : false;
    }
    getBlacklistedItems(itemID) {
        return this.db.findDocuments({type: "BLACKLISTED_ITEM"}).map(_=>_.data.item)
    }
    handleWinner(auction) {
        let currency = prismarineDb.economy.getCurrency(auction.data.currency)
        let foundWinner = false;
        for(const bid of auction.data.bids.sort((a,b)=>b.amount-a.amount)) {
            let player = playerStorage.getPlayerByID(bid.player);
            let scoreboard = player.scores.find(_=>_.objective == currency.scoreboard);
            let score = scoreboard ? scoreboard.score : 0;
            if(score >= bid.amount) {
                let foundPlayer = false;
                let foundPlayer2 = false;
                for(const player of world.getPlayers()) {
                    let id = playerStorage.getID(player)
                    if(auction.data.player == id) {
                        prismarineDb.economy.addMoney(player, bid.amount, currency.scoreboard)
                        // player.success(`Your auction ended and you earned ${currency.symbol} ${bid.amount}`)
                        foundPlayer2 = true;
                        player.sendMessage(dynamicToast("", `§6§lAuction House\n§r§7Your auction ended and you earned §6${currency.symbol} ${bid.amount}`, "textures/azalea_icons/ChestIcons/Chest10"))
                    }

                    if(bid.player == id) {
                        prismarineDb.economy.removeMoney(player, bid.amount, currency.scoreboard)
                        // let itemStack = itemdb.getItem(auction.data.stash, auction.data.slot);
                        // let inventory = player.getComponent('inventory');
                        // inventory.container.addItem(itemStack)
                        // player.success("You won an auction! You should now have the item in your inventory.");
                        foundPlayer = true;
                        player.sendMessage(dynamicToast("", `§6§lAuction House\n§r§7Your won an auction! You can claim your rewards in auction house.`, "textures/azalea_icons/ChestIcons/Chest10"))
                        break;
                    }
                }
                if(!foundPlayer2) {
                    playerStorage.addReward(auction.data.player, currency.scoreboard, bid.amount)
                }
                if(!foundPlayer) {
                    playerStorage.addReward(bid.player, currency.scoreboard, -bid.amount)
                }
                this.db.insertDocument({
                    type: "REWARD",
                    player: bid.player,
                    stash: auction.data.stash,
                    slot: auction.data.slot
                })
                foundWinner = true;
                break;
            }
        }
        if(!foundWinner) {
            let foundPlayer = false;
            for(const player of world.getPlayers()) {
                try {
                    let id = playerStorage.getID(player)
                    if(auction.data.player == id) {
                        // let itemStack = itemdb.getItem(auction.data.stash, auction.data.slot);
                        // let inventory = player.getComponent('inventory');
                        // inventory.container.addItem(itemStack)
                        // player.success("Your auction had no winners, you can now reclaim your item.");
                        player.sendMessage(dynamicToast("", `§6§lAuction House\n§r§7Your auction ended, but had no winners. Go to auction house UI to reclaim your item.`, "textures/azalea_icons/ChestIcons/Chest10"))
                        // foundPlayer = true;
                        break;
                    }
    
                } catch {

                }
            }
            if(!foundPlayer) {
                // playerStorage.addReward(auction.data.player, currency.scoreboard, -1)
                this.db.insertDocument({
                    type: "REWARD",
                    player: auction.data.player,
                    stash: auction.data.stash,
                    slot: auction.data.slot
                })
            }
        }
    }
    async addItem(player, currency = "default", itemStack, startingBid = 40, duration = this.durations._1_DAY) {
        if(this.isBlacklisted(itemStack.typeId)) return {error: true, errorMessage: "Item is blacklisted"}
        if(!prismarineDb.economy.getCurrency(currency)) return {error: true, errorMessage: "Unknown currency"};
        let playerMoney = prismarineDb.economy.getMoney(player, currency)
        if(playerMoney < startingBid) return {error: true, errorMessage: "Not enough money for the starting bid"}
        let endTime = Date.now() + duration;
        let playerID = await playerStorage.getIDAsync(player);
        let [stash, slot] = itemdb.saveItem(itemStack);
        // let stashID = `${stash}:${slot}`;
        this.db.insertDocument({
            type: "AUCTION",
            player: playerID,
            startingBid,
            endTime,
            currency,
            bids: [],
            stash,
            slot
        })
        return {error: false}
    }
    async addBid(player, item, amount) {
        try {
            let auction = this.db.getByID(item)
            if(auction.data.type != "AUCTION") return {error: true, errorMessage: "Not an auction"}
            let playerID = await playerStorage.getIDAsync(player)
            if(auction.data.player == playerID) return {error: true, errorMessage: "You cant bid on your own auction"}
            let playerMoney = prismarineDb.economy.getMoney(player, auction.data.currency);
            if(playerMoney < amount) return { errror: true, errorMessage: "Not enough money" }
            for(const bid of auction.data.bids) {
                if(playerMoney < bid.amount) return { errror: true, errorMessage: "Not enough money" }
            }
            auction.data.bids.push({
                player: playerID,
                amount
            })
            // world.sendMessage(JSON.stringify(this.db.data, null, 2))
            this.db.overwriteDataByID(auction.id, auction.data)
            return { error: false }
    
        } catch(e) {
            world.sendMessage(`${e} ${e.stack}`)
        }
    }
}

export default new AH()