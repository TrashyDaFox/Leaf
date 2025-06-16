import { Player, world } from "@minecraft/server";
import playerStorage from "../playerStorage";

export function getScore(objective, player) {
    if(!(player instanceof Player)) {
        try {
            let obj = player.scores.find(_=>_.objective == objective)
            // console.warn(JSON.stringify(obj))
            return obj ? obj.score : 0;
        } catch {
            return 0;
        }
        return;
    }
    try {
        let scoreboard =
            world.scoreboard.getObjective(objective) ||
            world.scoreboard.addObjective(objective, objective);
        return scoreboard?.getScore(player) || 0;
    } catch {
        return 0;
    }
}

export function setScore(objective, player, score) {
    try {
        let scoreboard =
            world.scoreboard.getObjective(objective) ||
            world.scoreboard.addObjective(objective, objective);
        scoreboard.setScore(player, score);
    } catch {}
}
