import { system } from "@minecraft/server";

export const TPS_SAMPLE_SIZE = 20;
export const TPS_UPDATE_INTERVAL = 20;
export const TPS_CLEAR_INTERVAL = 20;

let lastTick = Date.now();
let tps = 20;
let timeArray = [];

system.runInterval(() => {
    if (timeArray.length === 20) timeArray.shift();
    timeArray.push(Math.round(1000 / (Date.now() - lastTick) * 100) / 100);
    tps = timeArray.reduce((a, b) => a + b) / timeArray.length;
    lastTick = Date.now();
});

system.runInterval(() => {
    timeArray = [];
}, TPS_CLEAR_INTERVAL);

export function getTPS() {
    return tps;
} 