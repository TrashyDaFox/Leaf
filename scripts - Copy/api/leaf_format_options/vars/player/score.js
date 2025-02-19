import { world } from "@minecraft/server";
import { formatter } from "../../main_formatter";

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

formatter.addFunction("score", (data, sessionData)=>{
    return getScore(data, sessionData).toString()
})

formatter.addFunction("scoreshort", (data, sessionData)=>{
    return abbrNum(getScore(data, sessionData), data.dec_places ? parseInt(data.dec_places) : 1);
})