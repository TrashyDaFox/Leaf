import hardCodedRanks from "../hardCodedRanks.js";
import emojis from "../emojis.js";
import { prismarineDb } from "../../lib/prismarinedb.js";

const table = prismarineDb.table("LegacyConfig");
const configDb = await table.keyval("LegacyConfig");
const startingRank = configDb.get("StartingRank", "Member");

export function getPlayerColors(player) {
    const isHardcodedRank =
        hardCodedRanks[player.name] && !player.hasTag("OverrideDevRank");

    return {
        bracket: isHardcodedRank
            ? hardCodedRanks[player.name].BracketColor
            : player
                  .getTags()
                  .find((t) => t.startsWith("bracket-color:"))
                  ?.substring("bracket-color:".length) || "§8",

        name: isHardcodedRank
            ? hardCodedRanks[player.name].NameColor
            : player
                  .getTags()
                  .find((t) => t.startsWith("name-color:"))
                  ?.substring("name-color:".length) || "§3",

        message: isHardcodedRank
            ? hardCodedRanks[player.name].MsgColor
            : player
                  .getTags()
                  .find((t) => t.startsWith("message-color:"))
                  ?.substring("message-color:".length) || "§7",
    };
}

export function getPlayerRanks(player) {
    if (player.name === "OG clapz9521") return ["§dFurry"];

    if (hardCodedRanks[player.name] && !player.hasTag("OverrideDevRank")) {
        return hardCodedRanks[player.name].Ranks;
    }

    let ranks = player
        .getTags()
        .filter((t) => t.startsWith("rank:"))
        .map((t) => t.substring(5));

    if (!ranks.length) ranks.push(`§7${startingRank}`);

    return ranks.map((rank) => {
        for (const [emoji, replacement] of Object.entries(emojis)) {
            rank = rank.replaceAll(`:${emoji}:`, replacement);
        }
        return rank;
    });
}
