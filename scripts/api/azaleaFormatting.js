import { Player, system, world, MoonPhase } from "@minecraft/server";
import { getClaimText } from "../landClaims.js";
import OpenClanAPI from "./OpenClanAPI.js";
import { parseQuotedString, safeDivide, abbreviateNumber } from "./formatting/utils.js";
import { getScore, setScore } from "./formatting/scores.js";
import { getTPS } from "./formatting/tps.js";
import { getPlayerColors, getPlayerRanks } from "./formatting/playerFormat.js";
import emojis from "./emojis.js";
import { prismarineDb } from "../lib/prismarinedb.js";
import playerStorage from "./playerStorage.js";
import { temp } from "../pdbScriptevents.js";
import zones from "./zones.js";
let db1 = prismarineDb.table("LegacyConfig")
const configDb = await db1.keyval("LegacyConfig");
const startingRank = configDb.get("StartingRank", "Member");
const recursionSessions = new Map();
let playersClicks = new Map();

function recordClick(player) {
    if(!playersClicks.has(player.id)) playersClicks.set(player.id, []);
    playersClicks.get(player.id).push(Date.now());
}
function calculateCPS(clicks, player) {
    const currentTime = Date.now();
    // Filter out clicks that are older than 1 second
    while (clicks.length > 0 && currentTime - clicks[0] > 1000) {
      clicks.shift();  // Remove clicks older than 1 second
    }
    playersClicks.set(player.id, clicks);
    return clicks.length;  // Return the number of clicks in the last second
}
// CPS handling
world.afterEvents.entityHitEntity.subscribe(e => {
    if (e.damagingEntity.typeId === "minecraft:player") {
        recordClick(e.damagingEntity);
        setScore("azalea:cps", e.damagingEntity, calculateCPS(playersClicks.get(e.damagingEntity.id), e.damagingEntity));
    }
});

system.runInterval(() => {
    recursionSessions.clear();
    for (const player of world.getPlayers()) {
        setScore("azalea:cps", player, calculateCPS(playersClicks.has(player.id) ? playersClicks.get(player.id) : [], player));
    }
}, 20);

// Main formatting function
export function formatStr(str, player = null, extraVars = {}, formatcfg = {}, session = Date.now()) {
    if(!recursionSessions.has(session)) recursionSessions.set(session, 0)
    let newStr = str;
    let vars = {};
    vars.drj = ` §r<bc>] [ <rc>`
    for(const key in extraVars) {
        vars[key] = extraVars[key];
    }
    if(player) {
        newStr = newStr.replaceAll('[@username]', player.name);
        if(!(player instanceof Player)) return;
        const colors = getPlayerColors(player);
        vars.bc = colors.bracket;
        vars.nc = colors.name;
        vars.mc = colors.message;
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
        vars.rank = getPlayerRanks(player)[0];
        vars.kills = `${getScore("azalea:kills", player)}`;
        vars.deaths = `${getScore("azalea:deaths", player)}`;
        vars.cps = `${getScore("azalea:cps", player)}`;
        vars["k/d"] = `${safeDivide(parseFloat(vars.kills), parseFloat(vars.deaths))}`;
        let zone = zones.getZoneAtVec3(player.location);
        vars.claim = zone ? zone.data.type == "ZONE" ? `§v${zone.data.name}` : zone.data.type == "CLAIM" ? `§q${zone.data.name}` : `§c${zone.data.name}` : `§7Wilderness`;
    }
    if(formatcfg && formatcfg.player2) {
        let player = formatcfg.player2;
        newStr = newStr.replaceAll('[@username2]', player.name);
        if(!(player instanceof Player)) return;
        const colors = getPlayerColors(player);
        vars.bc2 = colors.bracket;
        vars.nc2 = colors.name;
        vars.mc2 = colors.message;
        vars.x2 = `${Math.floor(player.location.x)}`;
        vars.y2 = `${Math.floor(player.location.y)}`;
        vars.z2 = `${Math.floor(player.location.z)}`;
        vars.name2 = player.name;
        vars.username2 = player.name;
        newStr = newStr.replaceAll('[@username]', player.name);
        vars.name_tag2 = player.nameTag;
        try {
            vars.xp2 = `${player.xpEarnedAtCurrentLevel}`
        } catch {
            vars.xp2 = `0`;
        }
        try {
            vars.level2 = `${player.level}`
        } catch {
            vars.level2 = `0`;
        }
        let health = player.getComponent('health');
        vars.hp2 = `${Math.floor(health.currentValue)}`
        vars.hp_max2 = `${Math.floor(health.effectiveMax)}`
        vars.hp_min2 = `${Math.floor(health.effectiveMin)}`
        vars.hp_default2 = `${Math.floor(health.defaultValue)}`
        vars.rank2 = getPlayerRanks(player)[0];
        vars.kills2 = `${getScore("azalea:kills", player)}`;
        vars.deaths2 = `${getScore("azalea:deaths", player)}`;
        vars.cps2 = `${getScore("azalea:cps", player)}`;
        vars["k/d2"] = `${safeDivide(parseFloat(vars.kills), parseFloat(vars.deaths))}`;
        vars.claim2 = getClaimText(player);
    }
    vars.tps = `${Math.floor(getTPS())}`;
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
    vars.dla = `«`;

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

    // Store original message before any formatting
    const originalMsg = vars.msg;

    for(const key in vars) {
        // if(key == "msg") continue;
        let val = vars[key];
        newStr = newStr.replaceAll(`<${key}>`, `${val}`);
    }

    // Restore original message after variable replacement
    // if (originalMsg !== undefined) {
    //     vars.msg = originalMsg;
    //     newStr = newStr.replaceAll(`<msg>`, originalMsg);
    // }

    let fnRegex = /\{\{([\s\S]*?)\}\}/g;
    let fnMatches = newStr.match(fnRegex);
    let fns = {
        rank_joiner(separator) {
            if(!player) return "";
            return getPlayerRanks(player).join(separator).replaceAll('&Q;','"');
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
        // kill() {
            // system.run(()=>{
            //     try {
            //         player.kill()
            //     } catch {}
            //     try {
            //         player.destroy()
            //     } catch {}
            // })
            // return "I ded :3"
        // },
        // jsEval(...args) {
        //     let newArgs = args.join(' ')
        //     try {
        //         let fn = new Function(`return (v)=>{return ${newArgs}}`)()
        //         return fn(extraVars)
    
        //     } catch {
        //         return ""
        //     }
        // },
        vars() {
            return Object.keys(vars).join(', ')
        },
        fns() {
            return Object.keys(fns).join(', ')
        },
        "get-player-name": (entityID)=>{
            for(const key of playerStorage.keyval.keys()) {
                let data = playerStorage.keyval.get(key);
                if(data.id && data.id.toString() == entityID.toString()) return data.name;
            }
            return "Unknown Player"
        },
        "get-temp-key": (name, key)=>{
            // return `${name},${key}`
            if(!temp[name]) return "null";

            let val = temp[name][key];
            if(val == null || val == undefined) return "null";
            
            if(typeof val == "number") return val.toString()
            if(typeof val == "string") return val;
            if(typeof val == "boolean") return val;
        },
        clan(text, notText) {
            let clan2 = OpenClanAPI.getClan(player);
            return clan2 ? text.replace('[@CLAN]', clan2.data.name).replace('[@LVL]', `${OpenClanAPI.getLevel(clan2.data.xp ? clan2.data.xp : 0)}`) : notText ? notText : "";
        },
        get_tag(startingChar, textIfHas, textIfNotHas) {
            let tags = player.getTags();
            let tag = tags.find(_=>_.startsWith(startingChar))
            if(tag) {
                return textIfHas.replaceAll(`<tag>`, tag.substring(startingChar.length))
            } else {
                return textIfNotHas.replaceAll(`<bl>`, ``);
            }
        },
        gay(text) {
            let codes = 'c6eabd'
            let codesList = codes.split('').map(_=>`§${_}`);
            let newText = [];
            let i3 = -1;
            for(let i2 = 0; i2 < text.length; i2++) {
                if(text[i2] != " ") i3++;
                if(i3 >= codesList.length) i3 = 0;
                newText.push(`${codesList[i3]}${text[i2]}`);
            }
            return newText.join('');
        }
    }
    if(vars.msg && vars.msg.includes('jsEval')) return `${player ? player.name : "Unknown Player"} - INSECURE CONTENT BLOCKED`;
    if(str.includes(':')) {
        let emojisUsed = str.match(/:([a-z0-9_-]+):/g) || [];
        for(const emoji of emojisUsed) {
            if(emojis[emoji.substring(1).slice(0,-1)]) {
                newStr = newStr.replaceAll(emoji, emojis[emoji.substring(1).slice(0,-1)]);
            }
        }
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
    if(Object.keys(vars).some(_=>newStr.includes(`<${_}>`)) || 
       Object.keys(fns).some(_=>newStr.includes(`{{${_}`)) || 
       Object.keys(emojis).some(_=>newStr.includes(`:${_}:`))) {
        if (vars.msg !== undefined) {
            newStr = newStr.replaceAll(`<msg>`, vars.msg);
        }
        if(recursionSessions.get(session) >= 10) {
            recursionSessions.delete(session)
            // Format message before returning on recursion limit
            return newStr + "  §r§o§c(Error: recursion limit reached)"
        }
        return formatStr(newStr, player, extraVars, formatcfg, session)
    } else {
        recursionSessions.delete(session)
        // Format message only on final iteration
        if (vars.msg !== undefined) {
            newStr = newStr.replaceAll(`<msg>`, vars.msg);
        }
        return newStr
    }
}