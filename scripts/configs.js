import configAPI from "./api/config/configAPI";
import config from "./versionData";
import { prismarineDb } from "./lib/prismarinedb";

let db1 = prismarineDb.table("SidebarConfig2");
let db2 = prismarineDb.table("GeneralConfig2");
let db3 = prismarineDb.table("CombatLog2");
let db4 = prismarineDb.table("DiscordLogs");
export const sidebarConfig = await db1.keyval("main");
export const generalConfig = await db2.keyval("main");
export const combatLogDB = await db3.keyval("main");
export const discordLogs = await db4.keyval("main");
configAPI.registerProperty(
    "chatformat",
    configAPI.Types.String,
    config.defaults.chatformat
);
if (!generalConfig.has("ChatRanks")) {
    generalConfig.set("ChatRanks", true);
}
