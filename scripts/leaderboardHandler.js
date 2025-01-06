import { system, world } from "@minecraft/server";
import { prismarineDb } from "./lib/prismarinedb";
import playerStorage from "./api/playerStorage";
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
                let dimension = world.getDimension(lb.data.dimension ? lb.data.dimension : "overworld")
                let entities = dimension.getEntities({
                    tags: [`lbid:${lb.id}`],
                    type: "leaf:floating_text"
                });
                let lbText = [`§8-=-=-=-=- §r§b§l${lb.data.displayName ? lb.data.displayName : lb.data.objective} §r§8-=-=-=-=-`];
                let scores = [];
                for(const player of playerStorage.keyval.keys()) {
                    let playerData = playerStorage.keyval.get(player);
                    let score = playerData.scores.find(_=>_.objective == lb.data.objective);
                    if(score) {
                        scores.push({playerData,score:score.score});
                    } else {
                        scores.push({playerData,score:0});
                    }
                }
                scores = scores.sort((a,b)=>b.score - a.score);
                let num = 0;
                let limit = lb.data.limit ? lb.data.limit : 10;
                scores = scores.slice(0, limit)
                for(const score of scores) {
                    num++;
                    lbText.push(`§e${num}§7. §a${score.playerData.name}§r§f: §7${abbrNum(score.score, 1)}`)
                }
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
                    } catch(e) {console.warn(e)}
                }
    
            } catch(e) {
                console.warn(e)
            }
        }
    }
}

let leaderboardHandler = new LeaderboardHandler();

export default leaderboardHandler;