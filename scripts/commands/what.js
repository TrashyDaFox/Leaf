import commandManager from "../api/commands/commandManager";
import { prismarineDb } from "../lib/prismarinedb";
import { SegmentedStoragePrismarine } from "../prismarineDbStorages/segmented";
let db = prismarineDb.customStorage("WhatList", SegmentedStoragePrismarine).keyval("WhatList");
let theme = {
    category: "§8",
    description: "§7",
    command: "§a"
}
commandManager.addCommand("what", {
    description: "Does stuff",
    category: "Fun",
    author: "ZSStudios + TRASH",
    format: "!what <post | view> [text]"
}, ({ msg, args }) => {
    if (!db.get("WhatList")) db.set("WhatList", "[]");
    let whatList = JSON.parse(db.get("WhatList") ? db.get("WhatList") : "[]");
    if (args.length) { // checks if theres an argument
        if (args[0] == "post") {
            // list.push(args.slice(1).join(' '));
            whatList.push({
                t: args.slice(1).join(' '),
                s: msg.sender.name
            });
            db.set("WhatList", JSON.stringify(whatList));
            msg.sender.success(`Posted!`)
        } else if (args[0] == "view") {
            let text = [];
            text.push(`${theme.category}<-=- ${theme.command}What List ${theme.category}-=->`);
            for (const post of whatList) {
                text.push(`${theme.command}${post.s} ${theme.description}${post.t}§r`);
            }
            text.push(``);
            response(`TEXT ${text.join('\n')}`);
        }
    } else {
        let text = [];
        text.push(`${theme.category}<-=- ${theme.command}What List ${theme.category}-=->`);
        for (const post of whatList) {
            text.push(`§a${post.s} §7${theme.description}${post.t}§r`);
        }
        text.push(``);
        msg.sender.sendMessage(text.join('\n'));
    }
})