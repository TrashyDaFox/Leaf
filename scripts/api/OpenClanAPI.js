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
import { EntityDamageCause, Player, system, world } from "@minecraft/server";
import playerStorage from "./playerStorage";
import { prismarineDb } from "../lib/prismarinedb";
import { SegmentedStoragePrismarine } from "../prismarineDbStorages/segmented";
import inviteManager from "./inviteManager";
import configAPI from "./config/configAPI";
import actionParser from "./actionParser";
import { ModalFormData } from "@minecraft/server-ui";
let db = prismarineDb.customStorage("clans", SegmentedStoragePrismarine);
let keyval = await prismarineDb.keyval("Clans");
configAPI.registerProperty(
    "EnableStealXPOnKill",
    configAPI.Types.Boolean,
    true
);
class OpenClanAPI {
    constructor() {
        this.name = "OpenClanAPI";
        this.version = 1.0;
        this.db = db;
        this.keyval = keyval;
        this.bankDb = prismarineDb.customStorage(
            "clans_bank",
            SegmentedStoragePrismarine
        );
        this.clanMessageEvents = [];
        this.initEvents();
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
        if (!(owner instanceof Player))
            throw new Error("Owner must be a player");
        if (name.length > 15)
            throw new Error("Name must be 15 characters or under");
        if (name.length < 2)
            throw new Error("Name must be 2 characters or over");
        if (this.db.findFirst({ name: name }))
            throw new Error("Name is already taken");
        let ownerID = playerStorage.getID(owner);
        let clanID = this.db.insertDocument({
            owner: ownerID,
            name,
            settings: {},
        });
        this.keyval.set(ownerID, clanID);
        return clanID;
    }
    addXP(clanID, xp, multiplier) {
        let doc = this.db.getByID(clanID);
        if (!doc) return;
        doc.data.xp += xp * multiplier;
        this.db.overwriteDataByID(doc.id, doc.data);
    }
    removeXP(clanID, xp) {
        let doc = this.db.getByID(clanID);
        if (!doc) return;
        doc.data.xp -= xp;
        this.db.overwriteDataByID(doc.id, doc.data);
    }
    getKiller(damageSource) {
        let { damagingEntity, damagingProjectile } = damageSource;
        if (damagingEntity) return damagingEntity;
        try {
            let projectileComponent = damagingProjectile.getComponent(
                "minecraft:projectile"
            );
            return projectileComponent.owner ? projectileComponent.owner : null;
        } catch {
            return null;
        }
        return null;
    }
    getClanXPMultiplier(clanID) {
        let doc = this.db.getByID(clanID);
        if (!doc) return;
        return doc.data.xpMult ? doc.data.xpMult : 1;
    }
    getClanXP(clanID) {
        let doc = this.db.getByID(clanID);
        if (!doc) return;
        return doc.data.xp ? doc.data.xp : 0;
    }
    setPublicClan(clanID, value = true) {
        let doc = this.db.getByID(clanID);
        if (!doc) return;
        doc.data.isPublic = value;
        this.db.overwriteDataByID(doc.id, doc.data);
    }
    getPublicClans() {
        return this.db.findDocuments({ isPublic: true }).sort((b, a) => {
            return (b.data.xp ? b.data.xp : 0) - (a.data.xp ? a.data.xp : 0);
        });
    }
    setClanQuestions(clanID, questions = []) {
        let doc = this.db.getByID(clanID);
        if (!doc) return;
        doc.data.applicationQuestions = questions;
        this.db.overwriteDataByID(doc.id, doc.data);
    }
    getClanQuestions(clanID) {
        let doc = this.db.getByID(clanID);
        if (!doc) return;
        return doc.data.applicationQuestions
            ? doc.data.applicationQuestions
            : [];
    }
    getApplications(clanID) {
        let doc = this.db.getByID(clanID);
        if (!doc) return;
        return doc.data.applications ? doc.data.applications.filter(_=>{
            let clan = this.getClan2(_.playerID)
            if(!clan) return true;
            return false;
        }) : [];
    }
    denyApplication(clanID, playerID) {
        let doc = this.db.getByID(clanID);
        if (!doc) return;
        if(doc.data.applications && doc.data.applications.length) {
            doc.data.applications = doc.data.applications.filter(_=>{
                return _.playerID != playerID
            })
        }
        this.db.overwriteDataByID(doc.id, doc.data);

    }
    acceptApplication(clanID, playerID) {
        let doc = this.db.getByID(clanID);
        if (!doc) return;
        if(doc.data.applications && doc.data.applications.length) {
            doc.data.applications = doc.data.applications.filter(_=>{
                return _.playerID != playerID
            })
            this.keyval.set(playerID, clanID)
        }
        this.db.overwriteDataByID(doc.id, doc.data);

    }
    submitApplication(clanID, player, answers) {
        let doc = this.db.getByID(clanID);
        if (!doc) return;
        let application = {
            playerID: playerStorage.getID(player),
            answers: [],
        };
        let questions = this.getClanQuestions(clanID);
        for (let i = 0; i < answers.length; i++) {
            application.answers.push([questions[i], answers[i]]);
        }
        if(doc.data.applications && doc.data.applications.length && doc.data.applications.find(_=>_.playerID == playerStorage.getID(player))) return;
        doc.data.applications = [...this.getApplications(clanID), application];
        this.db.overwriteDataByID(doc.id, doc.data);
    }
    initEvents() {
        system.afterEvents.scriptEventReceive.subscribe((e) => {
            if(e.id == "ocapi:print_clan_data") {
                if(!e.sourceEntity || e.sourceEntity.typeId !== 'minecraft:player') return;
                let clan = this.getClan(e.sourceEntity)
                if(!clan) return;
                e.sourceEntity.sendMessage(JSON.stringify(clan, null, 4))
            }
            if (e.id == "ocapi:set_base") {
                // let args = e.message.split(" ");
                // let id = parseInt(args[0]);
                // let
                if(!e.sourceEntity || e.sourceEntity.typeId !== 'minecraft:player') return;
                let clan = this.getClanID(e.sourceEntity)
                if(!clan) return;
                this.setClanBase(clan, e.sourceEntity.location)
            }
            if (e.id == "ocapi:remove_base") {
                if(!e.sourceEntity || e.sourceEntity.typeId !== 'minecraft:player') return;
                let clan = this.getClanID(e.sourceEntity)
                if(!clan) return;
                this.removeClanBase(clan)
            }
            if(e.id == "ocapi:disband") {
                if(!e.sourceEntity || e.sourceEntity.typeId !== 'minecraft:player') return;
                let clan = this.getClanID(e.sourceEntity)
                if(!clan) return;
                this.disbandClan(clan)
            }
            if(e.id == "ocapi:force_ownership") {
                if(!e.sourceEntity || e.sourceEntity.typeId !== 'minecraft:player') return;
                let clan = this.getClan(e.sourceEntity)
                if(!clan) return;
                this.transferOwnership(clan.id, clan.data.owner, playerStorage.getID(e.sourceEntity))
            }

            if(e.id == "ocapi:transfer_ownership") {
                if(!e.sourceEntity || e.sourceEntity.typeId !== 'minecraft:player') return;
                let clan = this.getClanID(e.sourceEntity)
                if(!clan) return;
                this.transferOwnership(clan, playerStorage.getID(e.sourceEntity), e.message)
            }
            if(e.id == "ocapi:kick") {
                if(!e.sourceEntity || e.sourceEntity.typeId !== 'minecraft:player') return;
                let clan = this.getClanID(e.sourceEntity)
                if(!clan) return;
                this.kickMemberFromClan(clan, e.message)
            }
            if(e.id == "ocapi:make_public") {
                if(!e.sourceEntity || e.sourceEntity.typeId !== 'minecraft:player') return;
                let clan = this.getClanID(e.sourceEntity)
                if(!clan) return;
                this.setPublicClan(clan, true)
            }
            if(e.id == "ocapi:make_private") {
                if(!e.sourceEntity || e.sourceEntity.typeId !== 'minecraft:player') return;
                let clan = this.getClanID(e.sourceEntity)
                if(!clan) return;
                this.setPublicClan(clan, false)
            }
            if(e.id == "ocapi:leave") {
                if(!e.sourceEntity || e.sourceEntity.typeId !== 'minecraft:player') return;
                let clan = this.getClanID(e.sourceEntity)
                if(!clan) return;
                this.kickMemberFromClan(
                    clan,
                    playerStorage.getID(e.sourceEntity)
                );

            }
            if(e.id == "ocapi:join_clan") {
                if(!e.sourceEntity || e.sourceEntity.typeId !== 'minecraft:player') return;
                let clan = this.db.getByID(e.message)
                if(!clan) return;
                this.keyval.set(playerStorage.getID(e.sourceEntity), clan.id);
            }
            if(e.id == "ocapi:join_clan2") {
                if(!e.sourceEntity || e.sourceEntity.typeId !== 'minecraft:player') return;
                let clan = this.db.getByID(e.message)
                if(!clan) return;
                if(clan.data.applicationQuestions && clan.data.applicationQuestions.length) {
                    let modalForm = new ModalFormData();
                    modalForm.title(`Apply to ${clan.data.name}`);
                    for(const question of clan.data.applicationQuestions) {
                        modalForm.textField(question, "Answer here...", undefined)
                    }
                    modalForm.show(e.sourceEntity).then(res=>{
                        this.submitApplication(clan.id, e.sourceEntity, res.formValues.filter(_=>typeof _ === "string"))
                        e.sourceEntity.success("Submitted application!")
                    })
                } else {
                    this.keyval.set(playerStorage.getID(e.sourceEntity), clan.id);
                }
            }
            if(e.id == "ocapi:teleport_to_clan_base") {
                if(!e.sourceEntity || e.sourceEntity.typeId !== 'minecraft:player') return;
                let clan = this.getClan(e.sourceEntity)
                if(!clan) return;
                e.sourceEntity.teleport(clan.data.settings.clanBase)
            }
            try {
                if(!e.sourceEntity || e.sourceEntity.typeId !== 'minecraft:player') return;
                let msg = JSON.parse(e.message);
                if(e.id == "ocapi:accept_application") {
                    this.acceptApplication(msg.clan, msg.player)
                    if(msg.after) {
                        actionParser.runAction(e.sourceEntity, msg.after)
                    }
                }
                if(e.id == "ocapi:deny_application") {
                    this.denyApplication(msg.clan, msg.player)
                    if(msg.after) {
                        actionParser.runAction(e.sourceEntity, msg.after)
                    }
                }
                if(e.id == "ocapi:set_questions") {
                    if(!e.sourceEntity || e.sourceEntity.typeId !== 'minecraft:player') return;
                    let clan = this.getClan(e.sourceEntity)
                    if(!clan) return;
                    if(!msg.questions) return;
                    this.setClanQuestions(clan.id, msg.questions.split(',').map(_=>_.trim()).filter(_=>_.length > 0))
                    if(msg.after) {
                        actionParser.runAction(e.sourceEntity, msg.after)
                    }
                }
                if(e.id == "ocapi:create_clan") {
                    if(!msg.name) e.sourceEntity.error("No clan name in input")
                    try {
                        this.createClan(e.sourceEntity, msg.name)
                        if(msg.success) {
                            actionParser.runAction(e.sourceEntity, msg.success)
                        }
                    } catch(e2) {
                        e.sourceEntity.error(`${e2}`);
                        if(msg.failure) {
                            actionParser.runAction(e.sourceEntity, msg.success)
                        }
                    }

                }
            } catch {}
        });
        world.afterEvents.entityDie.subscribe((e) => {
            let killer = this.getKiller(e.damageSource);
            if (!killer) return;
            if (killer.typeId != "minecraft:player") return;
            let clanID = this.getClanID(killer);
            if (!clanID) return;
            let clanXPMultiplier = this.getClanXPMultiplier(clanID);
            let clan = this.db.getByID(clanID);
            let currLevel = this.getLevel(this.getClanXP(clanID));
            // world.sendMessage(`XP: ${this.getClanXP(clanID)}, currLevel: ${currLevel}`)
            switch (e.deadEntity.typeId) {
                case "minecraft:wither":
                    this.addXP(clanID, 100, clanXPMultiplier);
                case "minecraft:ender_dragon":
                    this.addXP(clanID, 200, clanXPMultiplier);
                case "minecraft:warden":
                    this.addXP(clanID, 250, clanXPMultiplier);
                case "minecraft:player":
                    let extra = 0;
                    if (configAPI.getProperty("EnableStealXPOnKill")) {
                        try {
                            let clan = this.getClan(e.deadEntity);
                            extra = Math.floor(
                                Math.min(
                                    (clan.data.xp ? clan.data.xp : 0) * 0.1,
                                    500
                                )
                            );
                            this.removeXP(clan.id, extra);
                        } catch {}
                    }
                    this.addXP(clanID, 20 + extra, clanXPMultiplier);
                case "minecraft:skeleton":
                    this.addXP(clanID, 20, clanXPMultiplier);
                default:
                    this.addXP(clanID, 5, clanXPMultiplier);
            }
            let newLevel = this.getLevel(this.getClanXP(clanID));
            if (newLevel > currLevel) {
                killer.sendMessage(
                    `§aLEVEL UP §8§l>> §r§7Your clan leveled up to §aLvl ${newLevel}`
                );
            }
        });
    }
    getLevel(xp) {
        return Math.floor((xp / 100) ** (1 / 1.4));
    }
    /**
     *
     * @param {number} clanID
     * @param {string} key
     * @param {*} val
     */
    setClanProperty(clanID, key, val) {
        let doc = this.db.getByID(clanID);
        if (!doc) return;
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
        if (!doc) return;
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
    removeClanBase(clanID) {
        this.setClanProperty(clanID, "clanBase", null)
    }
    /**
     *
     * @param {Player} player
     * @param {number} clanID
     * @param {string} message
     */
    clanSendMessage(player, clanID, message) {
        for (const fn of this.clanMessageEvents) {
            fn(player, clanID, message);
        }
    }
    transferOwnership(clanID, playerID1, playerID2) {
        let clan = this.db.getByID(clanID);
        if (clan && clan.data.owner == playerID1) {
            if (
                this.keyval.has(playerID2) &&
                this.keyval.get(playerID2) == clanID
            ) {
                clan.data.owner = playerID2;
                this.db.overwriteDataByID(clan.id, clan.data);
            }
        }
    }
    depositMoneyIntoClanBank(player, clanID, currency, amount) {
        let currencyData = prismarineDb.economy.getCurrency(currency);
        if (currencyData && currencyData.scoreboard) {
            let clan = this.db.getByID(clanID);
            if (clan) {
                let doc = this.bankDb.findFirst({ owner: clanID });
                let data = doc ? doc.data : {};
                if (prismarineDb.economy.getMoney(player, currency) < amount)
                    return;
                if (!doc) {
                    if (data[currencyData.scoreboard])
                        data[currencyData.scoreboard] += amount;
                    else data[currencyData.scoreboard] = amount;

                    prismarineDb.economy.removeMoney(player, currency);

                    data.owner = clan.id;
                    this.bankDb.insertDocument(data);
                } else {
                    if (data[currencyData.scoreboard])
                        data[currencyData.scoreboard] += amount;
                    else data[currencyData.scoreboard] = amount;

                    prismarineDb.economy.removeMoney(player, currency);

                    this.bankDb.overwriteDataByID(doc.id, data);
                }
            }
        }
    }

    withdrawMoneyFromClanBank(player, clanID, currency, amount) {
        let currencyData = prismarineDb.economy.getCurrency(currency);
        if (currencyData && currencyData.scoreboard) {
            let clan = this.db.getByID(clanID);
            if (clan) {
                let doc = this.bankDb.findFirst({ owner: clanID });
                let data = doc ? doc.data : {};
                if (data[currencyData.scoreboard] < amount) return; // Ensuring the bank has enough funds
                if (!doc) {
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
        if (this.keyval.has(playerID) && this.keyval.get(playerID) == clanID) {
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
        if (sender.id == receiver.id) return;
        if (!this.db.getByID(clanID)) return;
        receiver.info(
            "You received an invite to a clan. Open the clan UI to accept"
        );
        sender.success(`Sent invite to ${receiver.name}`);
        inviteManager.createInvite(
            sender,
            receiver,
            "CLAN",
            (inviteData, state) => {
                if (state == inviteManager.States.Accepted) {
                    sender.info(`${receiver.name} is now in your clan`);
                    receiver.success(`Joined clan`);
                    this.keyval.set(playerStorage.getID(receiver), clanID);
                }
            }
        );
    }

    getClanMembers(clanID) {
        let playerIDs = [];
        for (const key of this.keyval.keys()) {
            if (this.keyval.get(key) == clanID) playerIDs.push(key);
        }
        return playerIDs;
    }
    /**
     *
     * @param {Player} player
     * @returns {*}
     */
    getClan(player) {
        let playerID = playerStorage.getID(player);
        let id = this.keyval.has(playerID) ? this.keyval.get(playerID) : null;
        if (id) return this.db.getByID(id);
        return null;
    }
    getClan2(playerID) {
        let id = this.keyval.has(playerID) ? this.keyval.get(playerID) : null;
        if (id) return this.db.getByID(id);
        return null;
    }
    getClanID(player) {
        let playerID = playerStorage.getID(player);
        let id = this.keyval.has(playerID) ? this.keyval.get(playerID) : null;
        if (id) return id;
        return null;
    }
    disbandClan(clanID) {
        let clan = this.db.getByID(clanID);
        if (clan) {
            this.db.deleteDocumentByID(clan.id);
            for (const key of this.keyval.keys()) {
                if (this.keyval.get(key) == clan.id) this.keyval.delete(key);
            }
        }
    }
}
export default new OpenClanAPI();
