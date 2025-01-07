import { world } from "@minecraft/server";

export function getScore(objective, player) {
    try {
        let scoreboard = world.scoreboard.getObjective(objective) 
            || world.scoreboard.addObjective(objective, objective);
        return scoreboard?.getScore(player) || 0;
    } catch {
        return 0;
    }
}

export function setScore(objective, player, score) {
    try {
        let scoreboard = world.scoreboard.getObjective(objective) 
            || world.scoreboard.addObjective(objective, objective);
        scoreboard.setScore(player, score);
    } catch {}
} 