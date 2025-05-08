import { system, world } from "@minecraft/server";
import { prismarineDb } from "./lib/prismarinedb";
import playerStorage from "./api/playerStorage";
import playerUtils from "./api/playerUtils";
/*
  ∧,,,∧
(  ̳• · • ̳)
/    づ♡ I would love you if you could make this not shit yk
*/
const abbrNum = (number, decPlaces) => {
    decPlaces = Math.pow(10, decPlaces)
    var abbrev = ['k', 'm', 'b', 't']
    for (var i = abbrev.length - 1; i >= 0; i--) {
      var size = Math.pow(10, (i + 1) * 3)
      if (size <= number) {
        number = Math.round((number * decPlaces) / size) / decPlaces
        if (number == 1000 && i < abbrev.length - 1) {
          number = 1
          i++
        }
        number += abbrev[i]
        break
      }
    }
    return number
  }
class LeaderboardHandler {
    constructor() {
        this.db = prismarineDb.table("Leaderboards");
        // this.db.clear();
        system.runInterval(()=>{
            this.updateLeaderboards();
        },30);

        this.themes = [
            {
                header: "§b",
                headerSurroundings: "§8",
                num: "§e",
                player: "§a",
                score: "§7",
                scoreSurroundings: "§f",
                name: "Default"
            },
            {
                header: "§e",
                headerSurroundings: "§8",
                player: "§d",
                score: "§5",
                scoreSurroundings: "§a",
                num: "§6",
                name: "Purple"
            }
        ]
    }
    addLeaderboard(objective, vec3, dimension = "overworld") {
        this.db.insertDocument({
            loc: vec3,
            objective,
            showOffline: true,
            dimension: dimension,
            theme: 0,
            id: Date.now().toString()
        });
    }
    updateLeaderboards() {
        // return;
        let lbText = [`${Date.now()}`]
        // for(const doc of this.db.data) {
        //     let lbText = [`a`];
        // }
        for(const lb of this.db.data) {
            // console.warn(JSON.stringify(lb.data))
            // let entityID = lb.data.entityID ? lb.data.entityID : null;
            // if(entityID) {
            //     try {
            //         let entity = world.getEntity(entityID);
            //         if(!entity) {
            //             entity = world.getDimension('overworld').spawnEntity('leaf:floating_text', lb.data.loc);
            //             entity.nameTag = lbText.join('\n§r')
            //             lb.data.entityID = entity.id;
            //             this.db.overwriteDataByID(lb.id, lb.data);
            //         }
            //         entity.addTag(`lbid:${lb.id}`)
            //         entity.nameTag = lbText.join('\n§r')
            //     } catch(e) {
            //         if(!(`${e}`.includes('LocationInUnloadedChunkError'))) {
            //             let entity = world.getDimension('overworld').spawnEntity('leaf:floating_text', lb.data.loc);
            //             entity.addTag(`lbid:${lb.id}`)
            //             entity.nameTag = lbText.join('\n§r')
            //             lb.data.entityID = entity.id;
            //             this.db.overwriteDataByID(lb.id, lb.data);
            //         }
            //     }
            // } else {
            //     let entity = world.getDimension('overworld').spawnEntity('leaf:floating_text', lb.data.loc);
            //     entity.addTag(`id:${lb.id}`)
            //     entity.nameTag = lbText.join('\n§r')
            //     lb.data.entityID = entity.id;
            //     this.db.overwriteDataByID(lb.id, lb.data);
            // }
            try {
                let curnc = lb.data.disableCurrency ? null : prismarineDb.economy.getCurrency(lb.data.objective);
                let dimension = world.getDimension(lb.data.dimension ? lb.data.dimension : "overworld")
                let entities = dimension.getEntities({
                    tags: [`lbid:${lb.id}`],
                    type: "leaf:floating_text"
                });
                let lbText = [``];
                let scores = [];
                for(const player of playerStorage.keyval.keys()) {
                    let playerID = player;
                    if(scores.find(_=>_.playerID == playerID)) continue;
                    if(!lb.data.showOffline && !world.getPlayers().find(_=>playerStorage.getID(_))) continue;
                    let playerData = playerStorage.keyval.get(player);
                    let score = playerData.scores.find(_=>_.objective == lb.data.objective);
                    if(score) {
                        scores.push({playerID,playerData,score:score.score});
                    } else {
                        scores.push({playerID,playerData,score:0});
                    }
                }
                scores = scores.sort((a,b)=>b.score - a.score);
                let num = 0;
                let limit = lb.data.maxPlayers ? lb.data.maxPlayers : 10;
                scores = scores.slice(0, limit)
                for(const score of scores) {
                    num++;
                    // lbText.push(`§e${num}§7. §a${score.playerData.name}§r§f: §7${abbrNum(score.score, 1)}`)
                    let playerText = `${this.themes[lb.data.theme].player}${score.playerData.name}§r§f`;
                    let enabledRanks = lb.data.disableRanks ? false : true;
                    if(enabledRanks) {
                        playerText = ""
                        // let ranks = score.playerData.tags.filter(_=>_.startsWith('rank:')).map(_=>_.substring(5));
                        // if(!ranks.length) ranks.push("§7Member");
                        let ranks = playerUtils.getStrawberryRanksTags(score.playerData.tags)
                        // playerText += `§8[§r§7${ranks.join('§r§8] [§7')}§r§8] `
                        playerText += `§8[§r§7${ranks[0]}§r§8] `

                        let nameColor = score.playerData.tags.find(_=>_.startsWith('name-color:'));
                        playerText += `${nameColor ? nameColor.substring('name-color:'.length) : this.themes[lb.data.theme].player}${score.playerData.name}`;
                    }
                    lbText.push(`${this.themes[lb.data.theme].num}${num}§7. ${playerText}: §r${this.themes[lb.data.theme].scoreSurroundings}§r${this.themes[lb.data.theme].score}${num == 1 ? "§e" : num  == 2 ? "§f" : num == 3 ? "§n" : ""}${curnc ? "$" : ""}${lb.data.abbreviate ? abbrNum(score.score, 1) : score.score}`)
                }
                let longestLine = lbText.reduce((a, b) => (b.replace(/§./g,"").length > a.replace(/§./g,"").length ? b : a)).replace(/§./g,"");
                let example = `§r§l${(lb.data.displayName ? lb.data.displayName : lb.data.objective).replace(/§./g,"")}`
                let newLength = Math.floor((longestLine.length - (example.length + (curnc ? 4 : 2))) / 2)
                lbText[0] = `${this.themes[lb.data.theme].headerSurroundings}${"-".repeat(newLength)} §r${this.themes[lb.data.theme].header}§l${lb.data.displayName ? lb.data.displayName : lb.data.objective} §r${this.themes[lb.data.theme].headerSurroundings}${"-".repeat(newLength)}`
    
                if(entities && entities.length) {
                    // console.warn('a')
                    entities[0].nameTag = lbText.join('\n§r');
                    // for(const entity of entities.slice(1)) {
                    //     entity.kill();
                    // }
                } else {
                    try {
                        // console.warn("Entity not found. spawning now.")
                        let entity = dimension.spawnEntity("leaf:floating_text", lb.data.loc);
                        entity.addTag(`lbid:${lb.id}`);
                        entity.nameTag = lbText.join('\n§r');
                        // console.warn('Entity spawned!')
                    } catch(e) {}
                }
    
            } catch(e) {
                // console.warn(e)
            }
        }
    }
}

let leaderboardHandler = new LeaderboardHandler();

export default leaderboardHandler;