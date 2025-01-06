import getRanks from "../../../playerAPI/getRanks";
import { formatter } from "../../main_formatter";

function getScore(data, sessionData) {
    if(!sessionData.player && !data.fake_player) return 0;
    let objectiveName = data.objective ?? "money";
    let score = 0;
    try {
        let objective = world.scoreboard.getObjective(objectiveName);
        score = objective.getScore(data.fake_player ? data.fake_player : sessionData.player)
    } catch {}
    return score ? score : 0;
}

formatter.addVariable("name", (sessionData)=>{
    if(!sessionData.player) return "SYSTEM";
    return sessionData.player.name;
})

formatter.addVariable("username", (sessionData)=>{
    if(!sessionData.player) return "SYSTEM";
    return sessionData.player.name;
})

formatter.addVariable("deaths", (sessionData)=>{
    return getScore({objective:"leaf:deaths"}, sessionData).toString()
})

formatter.addVariable("kills", (sessionData)=>{
    return getScore({objective:"leaf:kills"}, sessionData).toString()
})

formatter.addFunction("rank_joiner", (callData, sessionData)=>{
    return getRanks.getRanksFromNameAndTagList(
        sessionData.player ? sessionData.player.name : "SYSTEM",
        sessionData.player ? sessionData.player.getTags() : ["rank:You cant use ranks in a non-player environment"]
    ).join(callData.joiner ? callData.joiner : `§r, `);
})

formatter.addVariable("rank", (sessionData)=>{
    return getRanks.getRanksFromNameAndTagList(
        sessionData.player ? sessionData.player.name : "SYSTEM",
        sessionData.player ? sessionData.player.getTags() : ["rank:You cant use ranks in a non-player environment"]
    )[0];
})

formatter.addVariable("hp", (sessionData)=>{
    if(!sessionData.player) return "0";
    let health = sessionData.player.getComponent('health');
    return Math.floor(health.currentValue);
})

formatter.addVariable("hp_max", (sessionData)=>{
    if(!sessionData.player) return "0";
    let health = sessionData.player.getComponent('health');
    return Math.floor(health.effectiveMax)
})

formatter.addVariable("hp_min", (sessionData)=>{
    if(!sessionData.player) return "0";
    let health = sessionData.player.getComponent('health');
    return Math.floor(health.effectiveMin)
})

formatter.addVariable("hp_default", (sessionData)=>{
    if(!sessionData.player) return "0";
    let health = sessionData.player.getComponent('health');
    return Math.floor(health.defaultValue)
})

function divide(num1, num2) {
    if (num1 > 0 && num2 == 0) return num1;
    if (num1 == 0 && num2 > 0) return -num2;
    if (num1 == 0 && num2 == 0) return 1;
    return num1 / num2;
}

formatter.addVariable("k/d", (sessionData)=>{
    let deaths = getScore({objective:"leaf:deaths"}, sessionData);
    let kills = getScore({objective:"leaf:kills"}, sessionData);
    return divide(kills, deaths).toFixed(1);
})