import translation from "../api/translation.js";
import hardCodedRanks from "../api/hardCodedRanks.js";

export function setupPlayerPrototype() {
    Player.prototype.info = function (msg) {
        this.sendMessage(translation.getTranslation(this, "info", msg));
    };

    Player.prototype.success = function (msg) {
        this.sendMessage(translation.getTranslation(this, "success", msg));
    };

    Player.prototype.error = function (msg) {
        this.sendMessage(translation.getTranslation(this, "error", msg));
    };

    Player.prototype.warn = function (msg) {
        this.sendMessage(translation.getTranslation(this, "warn", msg));
    };

    Player.prototype.getRanks = function () {
        let rankTags = this.getTags().filter((_) => _.startsWith("rank:"));
        let ranks = [];
        if (rankTags.length) {
            ranks.push(...rankTags.map((_) => _.substring(5)));
        }
        if (!ranks.length) {
            ranks.push("§7Member");
        }
        if (hardCodedRanks[this.name] && !this.hasTag("override_dev_rank")) {
            ranks = hardCodedRanks[this.name].Ranks;
        }
        return ranks;
    };

    Player.prototype.getBracketColor = function () {
        let tag = this.getTags().find((_) => _.startsWith("bracket-color:"));
        if (hardCodedRanks[this.name] && !this.hasTag("override_dev_rank")) {
            return hardCodedRanks[this.name].BracketColor;
        }
        return tag ? tag.replace("bracket-color:", "") : "§8";
    };

    Player.prototype.getNameColor = function () {
        let tag = this.getTags().find((_) => _.startsWith("name-color:"));
        if (hardCodedRanks[this.name] && !this.hasTag("override_dev_rank")) {
            return hardCodedRanks[this.name].NameColor;
        }
        return tag ? tag.replace("name-color:", "") : "§7";
    };

    Player.prototype.getMessageColor = function () {
        let tag = this.getTags().find((_) => _.startsWith("message-color:"));
        if (hardCodedRanks[this.name] && !this.hasTag("override_dev_rank")) {
            return hardCodedRanks[this.name].MsgColor;
        }
        return tag ? tag.replace("message-color:", "") : "§7";
    };
}
