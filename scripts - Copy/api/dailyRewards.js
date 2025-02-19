import { world } from "@minecraft/server";
import { prismarineDb } from "../lib/prismarinedb";
import { SegmentedStoragePrismarine } from "../prismarineDbStorages/segmented";
import actionParser from "./actionParser";
import { formatStr } from "./azaleaFormatting";
import playerStorage from "./playerStorage";
export class TimeIntervals {
    interval;
    azaleaEpoch;
    constructor(intervalInMilliseconds) {
        this.interval = intervalInMilliseconds;
        this.azaleaEpoch = 1720310400000;
    }
    get currentInterval() {
        let now = new Date().getTime();
        return Math.floor(now / this.interval);
    }
    get timeUntilNextInterval() {
        let now = new Date().getTime();
        let currentInterval = Math.floor(now / this.interval);
        let nextIntervalStart = (currentInterval + 1) * this.interval;
        return nextIntervalStart - now;
    }
}
class DailyRewardsAPI {
    constructor() {
        this.db = prismarineDb.customStorage("DailyRewards", SegmentedStoragePrismarine);
        this.keyval = this.db.keyval("Rewards");
        // for(const key of this.keyval.keys()) {
        //     if(key !== "REWARDS") this.keyval.set(key, {})
        // }
        this.monthInterval = new TimeIntervals(24 * 60 * 60 * 1000 * 30);
        this.weekInterval = new TimeIntervals(24 * 60 * 60 * 1000 * 7);
        this.dayInterval = new TimeIntervals(24 * 60 * 60 * 1000);
    }
    timestampToDays(timestamp) {
        return this.dayInterval.currentInterval
    }
    timestampToMonths(timestamp) {
        return this.monthInterval.currentInterval;
    }
    timestampToWeeks(timestamp) {
        return this.weekInterval.currentInterval;
    }
    millisecondsUntilNextDay() {
        return this.dayInterval.timeUntilNextInterval;
    }
    millisecondsUntilNextWeek() {
        return this.weekInterval.timeUntilNextInterval;
    }
    millisecondsUntilNextMonth() {
        return this.monthInterval.timeUntilNextInterval;
    }
    isValidType(type = "command") {
        return type == "command" || type == "currency";
    }
    getRewards(rewardKey = "REWARDS") {
        return this.keyval.has(rewardKey) ? this.keyval.get(rewardKey) : [];
    }
    createReward(rewardKey, type = "command", options = {}) {
        if(!this.isValidType(type)) return;
        if(type == "command") {
            let rewards = this.getRewards(rewardKey)
            rewards.push({
                doctype: "REWARD",
                type,
                command: options.command,
                message: options.message,
            })
            this.keyval.set(rewardKey, rewards);
        } else if(type == "currency") {
            let rewards = this.getRewards(rewardKey);
            rewards.push({
                doctype: "REWARD",
                type,
                currency: options.currency,
                amount: options.amount,
            });
            this.keyval.set(rewardKey, rewards);
        }
    }
    createDailyReward(type = "command", options = {}) {
        this.createReward("REWARDS", type, options);
    }
    createWeeklyReward(type = "command", options = {}) {
        this.createReward("REWARDS_WEEKLY", type, options);
    }
    createMonthlyReward(type = "command", options = {}) {
        this.createReward("REWARDS_MONTHLY", type, options);
    }
    claimReward(reward, player) {
        if(reward) {
            if(reward.type == "command") {
                actionParser.runAction(player, reward.command)
                player.sendMessage(formatStr(reward.message, player));
            } else if(reward.type == "currency") {
                let currency = prismarineDb.economy.getCurrency(reward.currency) ? prismarineDb.economy.getCurrency(reward.currency) : prismarineDb.economy.getCurrency("default");
                prismarineDb.economy.addMoney(player, reward.amount, currency.scoreboard)
                player.info(`You have earned §b${currency.symbol} ${reward.amount}§r§7!`)
            }
        }
    }
    claimDailyReward(player) {
        let playerID = playerStorage.getID(player);
        let data = this.keyval.has(playerID) ? this.keyval.get(playerID) : {};
        if(!data.claims) data.claims = [];
        let currentDay = this.timestampToDays(Date.now());
        if(data.claims.includes(currentDay)) return false;
        let rewards = this.getRewards("REWARDS");
        let day = 1;
        for(let i = 0;i < data.claims.length;i++) {
            let prevClaim = i > 0 ? data.claims[i - 1] : -1;
            let claim = data.claims[i];
            if(prevClaim == claim - 1) {
                day++;
            } else {
                day = 1;
            }
        }
        let index = (day - 1) % rewards.length;
        let reward = rewards[index];
        this.claimReward(reward, player);
        data.claims.push(currentDay);
        this.keyval.set(playerID, data);
    }
    claimWeeklyReward(player) {
        let playerID = playerStorage.getID(player);
        let data = this.keyval.has(playerID) ? this.keyval.get(playerID) : {};
        if(!data.claimsWeekly) data.claimsWeekly = [];
        let currentDay = this.timestampToWeeks(Date.now());
        if(data.claimsWeekly.includes(currentDay)) return false;
        let rewards = this.getRewards("REWARDS_WEEKLY");
        let day = 1;
        for(let i = 0;i < data.claimsWeekly.length;i++) {
            let prevClaim = i > 0 ? data.claimsWeekly[i - 1] : -1;
            let claim = data.claimsWeekly[i];
            if(prevClaim == claim - 1) {
                day++;
            } else {
                day = 1;
            }
        }
        let index = (day - 1) % rewards.length;
        let reward = rewards[index];
        this.claimReward(reward, player);
        data.claimsWeekly.push(currentDay);
        this.keyval.set(playerID, data);
    }
    claimMonthlyReward(player) {
        let playerID = playerStorage.getID(player);
        let data = this.keyval.has(playerID) ? this.keyval.get(playerID) : {};
        if(!data.claimsMonthly) data.claimsMonthly = [];
        let currentDay = this.timestampToMonths(Date.now());
        if(data.claimsMonthly.includes(currentDay)) return false;
        let rewards = this.getRewards("REWARDS_MONTHLY");
        let day = 1;
        for(let i = 0;i < data.claimsMonthly.length;i++) {
            let prevClaim = i > 0 ? data.claimsMonthly[i - 1] : -1;
            let claim = data.claimsMonthly[i];
            if(prevClaim == claim - 1) {
                day++;
            } else {
                day = 1;
            }
        }
        let index = (day - 1) % rewards.length;
        let reward = rewards[index];
        this.claimReward(reward, player);
        data.claimsMonthly.push(currentDay);
        this.keyval.set(playerID, data);
    }
    getDay(player) {
        let playerID = playerStorage.getID(player);
        let data = this.keyval.has(playerID) ? this.keyval.get(playerID) : {};
        if(!data.claims) data.claims = [];
        let day = 1;
        for(let i = 0;i < data.claims.length;i++) {
            let prevClaim = i > 0 ? data.claims[i - 1] : -1;
            let claim = data.claims[i];
            if(prevClaim == claim - 1) {
                day++;
            } else {
                day = 1;
            }
        }
        return day;
    }
    hasReward(player) {
        let playerID = playerStorage.getID(player);
        let data = this.keyval.has(playerID) ? this.keyval.get(playerID) : {};
        if(!data.claims) data.claims = [];
        let currentDay = this.timestampToDays(Date.now());
        return !data.claims.includes(currentDay);
    }
    hasRewardWeekly(player) {
        let playerID = playerStorage.getID(player);
        let data = this.keyval.has(playerID) ? this.keyval.get(playerID) : {};
        if(!data.claimsWeekly) data.claimsWeekly = [];
        let currentDay = this.timestampToWeeks();
        return !data.claimsWeekly.includes(currentDay);
    }
    hasRewardMonthly(player) {
        let playerID = playerStorage.getID(player);
        let data = this.keyval.has(playerID) ? this.keyval.get(playerID) : {};
        if(!data.claimsMonthly) data.claimsMonthly = [];
        let currentDay = this.timestampToMonths();
        return !data.claimsMonthly.includes(currentDay);
    }
}

export default new DailyRewardsAPI();