import hardCodedRanks from "./hardCodedRanks";
import { colors } from "../lib/prismarinedb";
import configAPI from "./config/configAPI";
import ranks from "./ranks";
import { formatStr } from "./azaleaFormatting";

configAPI.registerProperty("DefaultNameColor", configAPI.Types.String, "§7");
configAPI.registerProperty("DefaultMessageColor", configAPI.Types.String, "§f");
configAPI.registerProperty("DefaultBracketColor", configAPI.Types.String, "§8");
configAPI.registerProperty("DefaultRank", configAPI.Types.String, "Member");

class PlayerUtils {
    constructor() {
        this.defaultRankColor = "§7";
        this.override = "OverrideDevRank";
    }
    getStrawberryBracketColor(player) {
        let strawberryRanks = ranks.getRanks();
        let bracketColor = configAPI.getProperty("DefaultBracketColor");
        for (const rank of strawberryRanks) {
            if (!player.hasTag(rank.tag)) continue;
            if (rank.bracketColor != "default") {
                bracketColor = rank.bracketColor;
                break;
            }
        }
        return bracketColor;
    }
    getStrawberryMessageColor(player) {
        let strawberryRanks = ranks.getRanks();
        let messageColor = configAPI.getProperty("DefaultMessageColor");
        for (const rank of strawberryRanks) {
            if (!player.hasTag(rank.tag)) continue;
            if (rank.messageColor != "default") {
                messageColor = rank.messageColor;
                break;
            }
        }
        return messageColor;
    }
    getStrawberryNameColor(player) {
        let strawberryRanks = ranks.getRanks();
        let nameColor = configAPI.getProperty("DefaultNameColor");
        for (const rank of strawberryRanks) {
            if (!player.hasTag(rank.tag)) continue;
            if (rank.nameColor != "default") {
                nameColor = rank.nameColor;
                break;
            }
        }
        return nameColor;
    }
    getStrawberryRanks(player) {
        let strawberryRanks =
            configAPI.getProperty("SingleRankMode") ||
            configAPI.getProperty("HighestPrioriyRankFirst")
                ? ranks.getRanks()
                : ranks.getRanks().reverse();
        let ranks2 = [];
        for (const rank of strawberryRanks) {
            if (!player.hasTag(rank.tag)) continue;
            ranks2.push(rank.name);
        }
        let ranks3 = ranks2.length
            ? ranks2
            : [configAPI.getProperty("DefaultRank")];
        let ranks4 = configAPI.getProperty("SingleRankMode")
            ? ranks3.slice(0, 1)
            : ranks3;
        return ranks4.map(_=>formatStr(_))
    }
    getStrawberryRanksTags(tags) {
        let strawberryRanks = configAPI.getProperty("SingleRankMode")
            ? ranks.getRanks()
            : ranks.getRanks().reverse();
        let ranks2 = [];
        for (const rank of strawberryRanks) {
            if (!tags.includes(rank.tag)) continue;
            ranks2.push(rank.name);
        }
        let ranks3 = ranks2.length
            ? ranks2
            : [configAPI.getProperty("DefaultRank")];
        let ranks4 = configAPI.getProperty("SingleRankMode")
            ? ranks3.slice(0, 1)
            : ranks3;
        return ranks4.map(_=>formatStr(_))
    }
    getRanks(player) {
        if (configAPI.getProperty("UseNewRanks"))
            return this.getStrawberryRanks(player);
        let tags = player.getTags();
        let ranks = tags
            .filter((_) => _.startsWith("rank:"))
            .map((_) => _.substring(5));
        if (
            hardCodedRanks[player.name] &&
            hardCodedRanks[player.name].Ranks &&
            !player.hasTag(this.override)
        )
            ranks = [...hardCodedRanks[player.name].Ranks, ...ranks];
        if (!ranks.length)
            ranks.push(
                `${this.defaultRankColor}${configAPI.getProperty(
                    "DefaultRank"
                )}`
            );
        return ranks;
    }
    getTag(player, prefix) {
        let tags = player.getTags();
        let tag = tags.find((_) => _.startsWith(prefix));
        return tag ? tag.substring(prefix.length) : null;
    }
    getNameColor(player) {
        if (configAPI.getProperty("UseNewRanks"))
            return this.getStrawberryNameColor(player);
        let color = this.getTag(player, "name-color:");
        if (
            hardCodedRanks[player.name] &&
            hardCodedRanks[player.name].NameColor &&
            !player.hasTag(this.override)
        )
            color = hardCodedRanks[player.name].NameColor;
        return color && colors.isValidColorCode(color)
            ? color
            : configAPI.getProperty("DefaultNameColor");
    }
    getBracketColor(player) {
        if (configAPI.getProperty("UseNewRanks"))
            return this.getStrawberryBracketColor(player);
        let color = this.getTag(player, "bracket-color:");
        if (
            hardCodedRanks[player.name] &&
            hardCodedRanks[player.name].BracketColor &&
            !player.hasTag(this.override)
        )
            color = hardCodedRanks[player.name].BracketColor;
        return color && colors.isValidColorCode(color)
            ? color
            : configAPI.getProperty("DefaultBracketColor");
    }
    getMessageColor(player) {
        if (configAPI.getProperty("UseNewRanks"))
            return this.getStrawberryMessageColor(player);
        let color = this.getTag(player, "message-color:");
        if (
            hardCodedRanks[player.name] &&
            hardCodedRanks[player.name].MsgColor &&
            !player.hasTag(this.override)
        )
            color = hardCodedRanks[player.name].MsgColor;
        return color && colors.isValidColorCode(color)
            ? color
            : configAPI.getProperty("DefaultMessageColor");
    }
}

export default new PlayerUtils();
