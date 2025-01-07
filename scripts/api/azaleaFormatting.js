import { Player, system, world, MoonPhase } from "@minecraft/server";
import hardCodedRanks from "./hardCodedRanks.js";
import emojis from "./emojis";
import { prismarineDb } from "../lib/prismarinedb.js";
import { getClaimText } from "../landClaims.js";
import OpenClanAPI from "./OpenClanAPI.js";

// TPS tracking
const TPS_SAMPLE_SIZE = 20;
const TPS_UPDATE_INTERVAL = 20; // ticks
const TPS_CLEAR_INTERVAL = 20; // ticks (changed from ms)

let lastTick = Date.now();
let tps = 20;
let timeArray = [];
const configDb = prismarineDb.table("LegacyConfig").keyval("LegacyConfig");
const startingRank = configDb.get("StartingRank", "Member");
const recursionSessions = new Map();

// Utility functions
function parseQuotedString(str) {
    const regex = /[^\s"]+|"([^"]*)"/gi;
    const results = [];
    let match;
    
    while ((match = regex.exec(str)) !== null) {
        results.push(match[1] || match[0]);
    }
    
    return results;
}

function getScore(objective, player) {
    try {
        let scoreboard = world.scoreboard.getObjective(objective) 
            || world.scoreboard.addObjective(objective, objective);
        return scoreboard?.getScore(player) || 0;
    } catch {
        return 0;
    }
}

function setScore(objective, player, score) {
    try {
        let scoreboard = world.scoreboard.getObjective(objective) 
            || world.scoreboard.addObjective(objective, objective);
        scoreboard.setScore(player, score);
    } catch {}
}

function safeDivide(num1, num2) {
    if (num2 === 0) return num1 > 0 ? num1 : num1 === 0 ? 1 : -num2;
    return num1 / num2;
}

function abbreviateNumber(number, decPlaces) {
    const suffixes = ['k', 'm', 'b', 't'];
    const decScale = Math.pow(10, decPlaces);
    
    for (let i = suffixes.length - 1; i >= 0; i--) {
        const size = Math.pow(10, (i + 1) * 3);
        if (size <= number) {
            number = Math.round((number * decScale) / size) / decScale;
            if (number === 1000 && i < suffixes.length - 1) {
                number = 1;
                i++;
            }
            number += suffixes[i];
            break;
        }
    }
    return number;
}

// System intervals

system.runInterval(() => {
    if (timeArray.length === 20) timeArray.shift();
    timeArray.push(Math.round(1000 / (Date.now() - lastTick) * 100) / 100);
    tps = timeArray.reduce((a, b) => a + b) / timeArray.length;
    lastTick = Date.now();
  });
// CPS handling
world.afterEvents.entityHitEntity.subscribe(e => {
    if (e.damagingEntity.typeId === "minecraft:player") {
        setScore("azalea:cps", e.damagingEntity, getScore("azalea:cps", e.damagingEntity) + 1);
    }
});

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        setScore("azalea:cps", player, 0);
    }
}, TPS_UPDATE_INTERVAL);

system.runInterval(() => {
    recursionSessions.clear();
    timeArray = [];
}, TPS_CLEAR_INTERVAL);

// Formatting functions
function getPlayerColors(player) {
    const isHardcodedRank = hardCodedRanks[player.name] && !player.hasTag("OverrideDevRank");
    
    return {
        bracket: isHardcodedRank ? hardCodedRanks[player.name].BracketColor 
            : player.getTags().find(t => t.startsWith('bracket-color:'))?.substring('bracket-color:'.length) || "§8",
            
        name: isHardcodedRank ? hardCodedRanks[player.name].NameColor
            : player.getTags().find(t => t.startsWith('name-color:'))?.substring('name-color:'.length) || "§3",
            
        message: isHardcodedRank ? hardCodedRanks[player.name].MsgColor
            : player.getTags().find(t => t.startsWith('message-color:'))?.substring('message-color:'.length) || "§7"
    };
}

function getPlayerRanks(player) {
    if (player.name === "OG clapz9521") return ["§dFurry"];
    
    if (hardCodedRanks[player.name] && !player.hasTag("OverrideDevRank")) {
        return hardCodedRanks[player.name].Ranks;
    }
    
    let ranks = player.getTags()
        .filter(t => t.startsWith('rank:'))
        .map(t => t.substring(5));
        
    if (!ranks.length) ranks.push(`§7${startingRank}`);
    
    return ranks.map(rank => {
        for (const [emoji, replacement] of Object.entries(emojis)) {
            rank = rank.replaceAll(`:${emoji}:`, replacement);
        }
        return rank;
    });
}

// Main formatting function remains mostly the same for compatibility
export function formatStr(str, player = null, extraVars = {}, session = Date.now()) {
    if(!recursionSessions.has(session)) recursionSessions.set(session, 0)
    let newStr = str;
    let vars = {};
    vars.drj = ` §r<bc>] [ <rc>`
    for(const key in extraVars) {
        vars[key] = extraVars[key];
    }
    if(player) {
        if(!(player instanceof Player)) return;
        let bracketColorTag = player.getTags().find(_=>_.startsWith('bracket-color:'));
        let bracketColor = "§8";
        if(bracketColorTag) {
            bracketColor = bracketColorTag.substring('bracket-color:'.length);
        }
        if(hardCodedRanks[player.name] && !player.hasTag("OverrideDevRank")) bracketColor = hardCodedRanks[player.name].BracketColor;
        let nameColorTag = player.getTags().find(_=>_.startsWith('name-color:'));
        let nameColor = "§3";
        if(nameColorTag) {
            nameColor = nameColorTag.substring('name-color:'.length);
        }
        if(hardCodedRanks[player.name] && !player.hasTag("OverrideDevRank")) nameColor = hardCodedRanks[player.name].NameColor;

        let messageColorTag = player.getTags().find(_=>_.startsWith('message-color:'));
        let messageColor = "§7";
        if(messageColorTag) {
            messageColor = messageColorTag.substring('message-color:'.length);
        }
        if(hardCodedRanks[player.name] && !player.hasTag("OverrideDevRank")) messageColor = hardCodedRanks[player.name].MsgColor;


        vars.bc = bracketColor;
        vars.nc = nameColor;
        vars.mc = messageColor;
        vars.x = `${Math.floor(player.location.x)}`;
        vars.y = `${Math.floor(player.location.y)}`;
        vars.z = `${Math.floor(player.location.z)}`;
        vars.name = player.name;
        vars.username = player.name;
        newStr = newStr.replaceAll('[@username]', player.name);
        vars.name_tag = player.nameTag;
        try {
            vars.xp = `${player.xpEarnedAtCurrentLevel}`
        } catch {
            vars.xp = `0`;
        }
        try {
            vars.level = `${player.level}`
        } catch {
            vars.level = `0`;
        }
        let health = player.getComponent('health');
        vars.hp = `${Math.floor(health.currentValue)}`
        vars.hp_max = `${Math.floor(health.effectiveMax)}`
        vars.hp_min = `${Math.floor(health.effectiveMin)}`
        vars.hp_default = `${Math.floor(health.defaultValue)}`
        let ranks = player.getTags().filter(_=>_.startsWith('rank:')).map(_=>_.substring(5));
        if(!ranks.length) ranks.push(`§7${startingRank}`);
        if(hardCodedRanks[player.name] && !player.hasTag("OverrideDevRank")) ranks = hardCodedRanks[player.name].Ranks;
        for(const emoji in emojis) {
            ranks = ranks.map(_=>_.replaceAll(`:${emoji}:`, emojis[emoji]))
        }
        vars.rank = ranks[0];
        vars.kills = `${getScore("azalea:kills", player)}`;
        vars.deaths = `${getScore("azalea:deaths", player)}`;
        vars.cps = `${getScore("azalea:cps", player)}`;
        vars["k/d"] = `${safeDivide(parseFloat(vars.kills), parseFloat(vars.deaths))}`;
        vars.claim = getClaimText(player);

    }
    vars.tps = `${tps}`;

    // vars.tps = `${Math.floor(tps)}`;
    vars.online = `${world.getPlayers().length}`;
    vars.day = `${Math.floor(world.getDay())}`;
    vars.yr = `${new Date().getUTCFullYear()}`;
    vars.mo = `${(new Date().getUTCMonth())+1}`;
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    vars["mo/n"] = monthNames[vars.mo-1];
    vars.m = `${new Date().getUTCMinutes()}`;
    vars.h = `${new Date().getUTCHours()}`;
    vars.s = `${new Date().getUTCSeconds()}`;
    vars.ms = `${new Date().getUTCMilliseconds()}`;
    vars.d = `${new Date().getDate()}`;
    vars.dra = `»`;
    vars.tps = `${Math.floor(tps)}`;
    vars.online = `${world.getPlayers().length}`;
    vars.day = `${Math.floor(world.getDay())}`;
    let moonPhase = world.getMoonPhase();
    let moonPhaseText = moonPhase == MoonPhase.FirstQuarter ? "First Quarter" :
        moonPhase == MoonPhase.FullMoon ? "Full Moon" :
        moonPhase == MoonPhase.LastQuarter ? "Last Quarter" :
        moonPhase == MoonPhase.NewMoon ? "New Moon" :
        moonPhase == MoonPhase.WaningCrescent ? "Waning Crescent" :
        moonPhase == MoonPhase.WaningGibbous ? "Waning Gibbous" :
        moonPhase == MoonPhase.WaxingCrescent ? "Waxing Crescent" :
        moonPhase == MoonPhase.WaxingGibbous ? "Waxing Gibbous" : "Full Moon";
    vars.moonPhase = `${moonPhaseText}`;
    vars.randomShit = `${Math.random()}`;

    let date = new Date();
    let _12hourformat = date.getHours();
    let isPm = false;
    if (_12hourformat >= 12) isPm = true;
    _12hourformat = _12hourformat % 12;
    _12hourformat = _12hourformat ? _12hourformat : 12;
    vars["h/12"] = _12hourformat.toString();
    vars["am/pm"] = isPm ? "PM" : "AM";
    // nearly forgot hardcoded ranks exist
    vars.isGay = `false`;
    if(vars.name && vars.name == "OG clapz9521" && vars.msg) {
        vars.msg = vars.msg.replaceAll('r', 'w').replaceAll('l', 'w')
        vars.moonPhase = "yes";
    }
    if(vars.name && vars.name == "OG clapz9521") {
        vars.kills = `0`;
        vars.cps = `0`;
        vars.deaths = `0`;
        vars["k/d"] = `0`;
        vars.rank = "§dFurry";
        vars.bc = `§8`
        vars.nc = "§5";
        vars.mc = `§7`
        vars.isGay = `true`;
    }
    for(const key in vars) {
        let val = vars[key];
        newStr = newStr.replaceAll(`<${key}>`, `${val}`);
    }
    let fnRegex = /\{\{([\s\S]*?)\}\}/g;
    let fnMatches = newStr.match(fnRegex);
    let fns = {
        rank_joiner(separator) {
            if(!player) return "";
            if(player.name == "OG clapz9521") {
                return ["§dFurry"].join(separator);
            }
            let ranks = player.getTags().filter(_=>_.startsWith('rank:')).map(_=>_.substring(5));
            if(!ranks.length) ranks.push(`${vars.rc ? vars.rc : `§7`}${configDb.get("StartingRank", "Member")}`);
            if(hardCodedRanks[player.name] && !player.hasTag("OverrideDevRank")) ranks = hardCodedRanks[player.name].Ranks;
            for(const emoji in emojis) {
                ranks = ranks.map(_=>_.replaceAll(`:${emoji}:`, emojis[emoji]))
            }
            return ranks.join(separator).replaceAll('&Q;','"');
        },
        alternate(text, codes) {
            let codesList = codes.split('').map(_=>`§${_}`);
            let newText = [];
            for(let i2 = 0; i2 < text.length; i2++) {
                newText.push(`${codesList[i2 % codesList.length]}${text[i2]}`);
            }
            return newText.join('');
        },
        score(objective) {
            if(!player) return `0`;
            return `${getScore(objective, player)}`;
        },
        score2(stringName, objective) {
            return `${getScore(objective, stringName)}`;
        },
        scoreshort(objective) {
            if(!player) return `0`;
            return `${abbreviateNumber(getScore(objective, player),1)}`;
        },
        scoreshort2(stringName, objective) {
            return `${abbreviateNumber(getScore(objective, stringName))}`;
        },
        is_afk(isAfk, notAfk) {
            return player.hasTag("leaf:afk") ? isAfk : notAfk ? notAfk : "";
        },
        has_tag(tag, ifHasTag, ifNotHasTag) {
            if(!player) return ifNotHasTag == "<bl>" ? "" : ifNotHasTag;
            if(!player.hasTag(tag)) return ifNotHasTag == "<bl>" ? "" : ifNotHasTag
            else return ifHasTag == "<bl>" ? "" : ifHasTag;
        },
        kill() {
            system.run(()=>{
                try {
                    player.kill()
                } catch {}
                try {
                    player.destroy()
                } catch {}

            })
            return "I ded :3"
        },
        vars() {
            return Object.keys(vars).join(', ')
        },
        fns() {
            return Object.keys(fns).join(', ')
        },
        clan(text, notText) {
            let clan2 = OpenClanAPI.getClan(player);
            return clan2 ? text.replace('[@CLAN]', clan2.data.name) : notText ? notText : "";
        },
        gay(text) {
            let codes = 'c6eabd'
            let codesList = codes.split('').map(_=>`§${_}`);
            let newText = [];
            for(let i2 = 0; i2 < text.length; i2++) {
                newText.push(`${codesList[i2 % codesList.length]}${text[i2]}`);
            }
            return newText.join('');
        }
    }
    function extractEmojis(str) {
        // Regular expression to match valid text between `::`
        const regex = /:([a-z0-9_-]+):/g;
    
        // Find all matches
        const matches = str.match(regex);
    
        return matches && typeof matches === "object" && Array.isArray(matches) ? matches : [];
    }
    if(str.includes(':')) {
        let emojisUsed = extractEmojis(newStr);
        if(emojisUsed && Array.isArray(emojisUsed) && emojisUsed.length) {
            for(const emoji of emojisUsed) {
                // if(emoji != ":coins:") world.sendMessage(emoji)
                if(emojis[emoji.substring(1).slice(0,-1)]) newStr = newStr.replaceAll(`${emoji}`, emojis[emoji.substring(1).slice(0,-1)])
            }
        }
    }
    vars.cause_an_error = "<cause_an_error>"
    
    let b = [];
    let c = [];
    for(const key of Object.keys(fns)) {
        b.push(key);
    }
    for(const key of Object.keys(vars)) {
        c.push(key);
    }
    if(fnMatches && fnMatches.length) {
        for(const fnMatch of fnMatches) {
            let args = parseQuotedString(fnMatch.slice(0,-2).substring(2));
            if(fns[args[0]]) {
                newStr = newStr.replace(
                    fnMatch,
                    fns[args[0]](...args.slice(1))
                );
            }
        }
    }
    recursionSessions.set(session, recursionSessions.get(session) + 1)
    if(c.some(_=>newStr.includes(`<${_}>`)) || b.some(_=>newStr.includes(`{{${_}`)) || Object.keys(emojis).some(_=>newStr.includes(`:${_}:`))) {
        if(recursionSessions.get(session) >= 10) {
            recursionSessions.delete(session)
            return newStr + "  §r§o§c(Error: recursion limit reached)"
        }
        return formatStr(newStr, player, extraVars, session)
    } else {
        recursionSessions.delete(session)
        return newStr
    }
    return newStr;
}