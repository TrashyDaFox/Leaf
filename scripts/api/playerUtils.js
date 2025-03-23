import hardCodedRanks from './hardCodedRanks'
import { colors } from "../lib/prismarinedb"
import configAPI from './config/configAPI'

configAPI.registerProperty("DefaultNameColor", configAPI.Types.String, "§7")
configAPI.registerProperty("DefaultMessageColor", configAPI.Types.String, "§f")
configAPI.registerProperty("DefaultBracketColor", configAPI.Types.String, "§8")
configAPI.registerProperty("DefaultRank", configAPI.Types.String, "Member")

class PlayerUtils {
    constructor() {
        this.defaultRankColor = "§7"
        this.override = "OverrideDevRank";
    }
    getRanks(player) {
        let tags = player.getTags();
        let ranks = tags.filter(_=>_.startsWith('rank:')).map(_=>_.substring(5))
        if(hardCodedRanks[player.name] && hardCodedRanks[player.name].Ranks && !player.hasTag(this.override)) ranks = [...hardCodedRanks[player.name].Ranks, ...ranks]
        if(!ranks.length) ranks.push(`${this.defaultRankColor}${configAPI.getProperty("DefaultRank")}`)
        return ranks;
    }
    getTag(player, prefix) {
        let tags = player.getTags();
        let tag = tags.find(_=>_.startsWith(prefix))
        return tag ? tag.substring(prefix.length) : null;        
    }
    getNameColor(player) {
        let color = this.getTag(player, "name-color:")
        if(hardCodedRanks[player.name] && hardCodedRanks[player.name].NameColor && !player.hasTag(this.override)) color = hardCodedRanks[player.name].NameColor
        return color && colors.isValidColorCode(color) ? color : configAPI.getProperty("DefaultNameColor")
    }
    getBracketColor(player) {
        let color = this.getTag(player, "bracket-color:")
        if(hardCodedRanks[player.name] && hardCodedRanks[player.name].BracketColor && !player.hasTag(this.override)) color = hardCodedRanks[player.name].BracketColor;
        return color && colors.isValidColorCode(color) ? color : configAPI.getProperty("DefaultBracketColor")
    }
    getMessageColor(player) {
        let color = this.getTag(player, "message-color:")
        if(hardCodedRanks[player.name] && hardCodedRanks[player.name].MsgColor && !player.hasTag(this.override)) color = hardCodedRanks[player.name].MsgColor;
        return color && colors.isValidColorCode(color) ? color : configAPI.getProperty("DefaultMessageColor")
    }
}

export default new PlayerUtils();