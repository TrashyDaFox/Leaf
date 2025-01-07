// OpenClanAPI
// By Trash9240
// Free to use in your own addons
// Powered by LeafDB/PrismarineDB


/*
                            ╱|、
                          (˚ˎ 。7  
                           |、˜〵          
                          じしˍ,)ノ

    /\___/\
   (  ◕ω◕)  
    )   ♡(   
   (     )
    |  |  |
    (___|__)

     ∧＿∧
   （｡･ω･｡)つ━☆・*。
   ⊂　　 ノ 　　　・゜
   　しーＪ　　　 。・゜

   /\＿/\
  ( ˶•ω•˶)♡
  /　　づ

             へ         ╱|、
        ૮  -   ՛ ) つ(>   < 7  
         /   ⁻  ៸          、˜〵     
  乀 (ˍ,  ل            じしˍ,)ノ

*/
import { Player } from "@minecraft/server";
import playerStorage from "./playerStorage";
import { prismarineDb } from "../lib/prismarinedb";
import { SegmentedStoragePrismarine } from "../prismarineDbStorages/segmented";
import inviteManager from "./inviteManager";

class OpenClanAPI {
    constructor() {
        this.name = "OpenClanAPI";
        this.version = 1.0;
        this.db = prismarineDb.customStorage("clans", SegmentedStoragePrismarine);
        this.keyval = prismarineDb.keyval("Clans");
        this.bankDb = prismarineDb.customStorage("clans_bank", SegmentedStoragePrismarine)
        this.clanMessageEvents = [];
    }
    /**
     * @description creates a clan message event
     * @param {Function} fn 
     */
    onClanMessage(fn) {
        this.clanMessageEvents.push(fn);
    }
    /**
     * @description creates a clan
     * @param {Player} owner 
     * @param {string} name 
     * @returns {number}
     * @throws if the name is an invalid length or is already used
     */
    createClan(owner, name) {
        if(!(owner instanceof Player)) throw new Error("Owner must be a player");
        if(name.length > 10) throw new Error("Name must be 10 characters or under");
        if(name.length < 2) throw new Error("Name must be 2 characters or over");
        if(this.db.findFirst({name: name})) throw new Error("Name is already taken");
        let ownerID = playerStorage.getID(owner);
        let clanID = this.db.insertDocument({
            owner: ownerID,
            name,
            settings: {}
        })
        this.keyval.set(ownerID, clanID);
        return clanID;
    }
    /**
     * 
     * @param {number} clanID 
     * @param {string} key 
     * @param {*} val 
     */
    setClanProperty(clanID, key, val) {
        let doc = this.db.getByID(clanID);
        if(!doc) return;
        doc.data.settings[key] = val;
        this.db.overwriteDataByID(doc.id, doc.data);
    }

    /**
     * 
     * @param {number} clanID 
     * @param {string} key 
     */
    getClanProperty(clanID, key) {
        let doc = this.db.getByID(clanID);
        if(!doc) return;
        return doc.data.settings[key];
    }

    /**
     * 
     * @param {number} clanID 
     * @param {*} vec3 
     */
    setClanBase(clanID, vec3) {
        this.setClanProperty(clanID, "clanBase", vec3);
    }
    /**
     * 
     * @param {Player} player 
     * @param {number} clanID 
     * @param {string} message
     */
    clanSendMessage(player, clanID, message) {
        for(const fn of this.clanMessageEvents) {
            fn(player, clanID, message);
        }
    }
    transferOwnership(clanID, playerID1, playerID2) {
        let clan = this.db.getByID(clanID);
        if(clan && clan.data.owner == playerID1) {
            if(this.keyval.has(playerID2) && this.keyval.get(playerID2) == clanID) {
                clan.data.owner = playerID2;
                this.db.overwriteDataByID(clan.id, clan.data);
            }
        }
    }
    depositMoneyIntoClanBank(player, clanID, currency, amount) {
        let currencyData = prismarineDb.economy.getCurrency(currency);
        if(currencyData && currencyData.scoreboard) {
            let clan = this.db.getByID(clanID);
            if(clan) {
                let doc = this.bankDb.findFirst({owner:clanID});
                let data = doc ? doc.data : {};
                if(prismarineDb.economy.getMoney(player, currency) < amount) return;
                if(!doc) {
                    if(data[currencyData.scoreboard]) data[currencyData.scoreboard] += amount
                    else data[currencyData.scoreboard] = amount;

                    prismarineDb.economy.removeMoney(player, currency)

                    data.owner = clan.id;
                    this.bankDb.insertDocument(data);
                } else {
                    if(data[currencyData.scoreboard]) data[currencyData.scoreboard] += amount
                    else data[currencyData.scoreboard] = amount;

                    prismarineDb.economy.removeMoney(player, currency)

                    this.bankDb.overwriteDataByID(doc.id, data);
                }
            }
        }
    }

    withdrawMoneyFromClanBank(player, clanID, currency, amount) {
        let currencyData = prismarineDb.economy.getCurrency(currency);
        if(currencyData && currencyData.scoreboard) {
            let clan = this.db.getByID(clanID);
            if(clan) {
                let doc = this.bankDb.findFirst({owner:clanID});
                let data = doc ? doc.data : {};
                if(data[currencyData.scoreboard] < amount) return; // Ensuring the bank has enough funds
                if(!doc) {
                    // If there's no bank record, no money to withdraw
                    return;
                } else {
                    // Subtract the amount from the clan bank
                    data[currencyData.scoreboard] -= amount;
    
                    // Add the withdrawn amount to the player's balance
                    prismarineDb.economy.addMoney(player, currency, amount);
    
                    // Save the updated data in the bank database
                    this.bankDb.overwriteDataByID(doc.id, data);
                }
            }
        }
    }
    

    /**
     * 
     * @param {number} clanID 
     * @param {string} playerID 
     * @returns 
     */
    kickMemberFromClan(clanID, playerID) {
        if(this.keyval.has(playerID) && this.keyval.get(playerID) == clanID) {
            this.keyval.delete(playerID);
            return true;
        } else {
            return false;
        }
    }
    /**
     * 
     * @param {Player} sender 
     * @param {Player} receiver 
     * @param {number} clanID 
     * @returns 
     */
    invitePlayerToClan(sender, receiver, clanID) {
        if(sender.id == receiver.id) return;
        if(!this.db.getByID(clanID)) return
        receiver.info("You received an invite to a clan. Open the clan UI to accept");
        sender.success(`Sent invite to ${receiver.name}`)
        inviteManager.createInvite(sender, receiver, "CLAN", (inviteData, state)=>{
            if(state == inviteManager.States.Accepted) {
                sender.info(`${receiver.name} is now in your clan`)
                receiver.success(`Joined clan`)
                this.keyval.set(playerStorage.getID(receiver), clanID);
            }
        })
    }

    getClanMembers(clanID) {
        let playerIDs = [];
        for(const key of this.keyval.keys()) {
            if(this.keyval.get(key) == clanID) playerIDs.push(key)
        }
        return playerIDs
    }
    /**
     * 
     * @param {Player} player 
     * @returns {*}
     */
    getClan(player) {
        let playerID = playerStorage.getID(player);
        let id = this.keyval.has(playerID) ? this.keyval.get(playerID) : null;
        if(id) return this.db.getByID(id)
        return null;
    }
    disbandClan(clanID) {
        let clan = this.db.getByID(clanID);
        if(clan) {
            this.db.deleteDocumentByID(clan.id);
            for(const key of this.keyval.keys()) {
                if(this.keyval.get(key) == clan.id) this.keyval.delete(key);
            }
        }
    }
}
export default new OpenClanAPI();