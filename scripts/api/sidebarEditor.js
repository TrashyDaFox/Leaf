import { prismarineDb } from "../lib/prismarinedb";
import { array_move } from "./utils/array_move";
import { formatStr } from "./azaleaFormatting";
import { system, world } from "@minecraft/server";
import emojis from "./emojis";
import uiBuilder from "./uiBuilder";
const generateUUID = () => {
    let d = new Date().getTime(),
        d2 =
            (typeof performance !== "undefined" &&
                performance.now &&
                performance.now() * 1000) ||
            0;
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        let r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c == "x" ? r : (r & 0x7) | 0x8).toString(16);
    });
};
let animationIndex = 0;
system.runInterval(() => {
    animationIndex++;
    // if(animationIndex > 20) animationIndex = 0;
}, 1);
let cache = {};
class SidebarEditor {
    constructor() {
        this.db = prismarineDb.table("sidebars");
        this.lineTickSpeeds = {};
        this.lineCaches = {};
    }
    createSidebar(name) {
        return uiBuilder.createSidebar(name);
        if (!name) return; // fix empty sidebar bug. reported by theboss12332397
        let doc = uiBuilder.db.findFirst({
            _name: name,
        });
        if (doc) return;
        uiBuilder.db.insertDocument({
            _type: "SIDEBAR",
            _name: name,
            lines: [],
        });
    }
    deleteSidebar(name) {
        let doc = uiBuilder.db.findFirst({
            type: 7,
            name: name,
        });
        if (!doc) return;
        uiBuilder.db.trashDocumentByID(doc.id);
    }
    getLines(name) {
        if (this.lineCaches[`!${name}`]) return this.lineCaches[`!${name}`];
        let doc = uiBuilder.db.findFirst({
            type: 7,
            name: name,
        });
        if (!doc) return [];
        this.lineCaches[`!${name}`] = doc.data.lines;
        return doc.data.lines;
    }
    getLineByID(name, id) {
        let doc = uiBuilder.db.findFirst({
            type: 7,
            name: name,
        });
        if (!doc) return;
        return doc.data.lines.find((_) => _.id == id);
    }
    editLineTickSpeed(name, id, tickSpeed = 10) {
        let doc = uiBuilder.db.findFirst({
            type: 7,
            name: name,
        });
        this.clearLineCache(name);
        if (!doc) return;
        let lineIndex = doc.data.lines.findIndex((_) => _.id == id);
        if (lineIndex < 0) return;
        let lines = doc.data.lines;
        lines[lineIndex].tickSpeed = tickSpeed;
        doc.data.lines = lines;
        this.lineTickSpeeds[id] = tickSpeed;
        JSON.stringify(uiBuilder.db.overwriteDataByID(doc.id, doc.data));
    }
    containsSpecialPatterns(str) {
        // Regular expressions for {{}} and <> with text inside
        const regexBraces = /\{\{.*?\}\}/;
        const regexAngleBrackets = /<.*?>/;

        // Test the string against both patterns
        const hasBraces = regexBraces.test(str);
        const hasAngleBrackets = regexAngleBrackets.test(str);

        // Return true if either pattern is found
        return hasBraces || hasAngleBrackets;
    }
    getLineTickSpeed(name, id) {
        if (this.lineTickSpeeds[id]) return this.lineTickSpeeds[id];
        let line = this.getLineByID(name, id);
        // world.sendMessage(JSON.stringify(line))
        this.lineTickSpeeds[id] = line.tickSpeed ? line.tickSpeed : 10;
        return line.tickSpeed ? line.tickSpeed : 10;
        // return 1;
    }
    clearLineTickSpeedCache() {
        this.lineTickSpeeds = {};
    }
    clearLineCache(name) {
        this.lineCaches[`!${name}`] = null;
    }
    extractEmojis(str) {
        // Regular expression to match valid text between `::`
        const regex = /:([a-z0-9_-]+):/g;

        // Find all matches
        const matches = str.match(regex);

        return matches && typeof matches === "object" && Array.isArray(matches)
            ? matches
            : [];
    }
    createTextAnimator({
        text,
        glowOut = "<GLOWOUT>",
        glowIn = "<GLOWIN>",
        bg = "<BG>",
        skipChars = [" "],
    }) {
        const chars = [...text];
        const nonSkippable = chars
            .map((ch, i) => (skipChars.includes(ch) ? null : i))
            .filter((i) => i !== null);
        const len = nonSkippable.length;

        function getFrame(frame) {
            const [a, b, c] = [0, 1, 2].map(
                (offset) => nonSkippable[(frame + offset) % len]
            );
            return chars
                .map((ch, i) => {
                    if (skipChars.includes(ch)) return ch;
                    if (i === a || i === c) return glowOut + ch;
                    if (i === b) return glowIn + ch;
                    return bg + ch;
                })
                .join("");
        }

        getFrame.maxFrames = len;
        return getFrame;
    }

    parseEntireSidebar(player, name) {
        try {
            const id = `${player.id}`;
            this.lineCaches[id] ??= {};

            const lines = this.getLines(name);
            if (!lines) return "@@LEAF_SIDEBAR_IGNORE";

            const newLines = lines.map((lineObj) => {
                const {
                    type,
                    text = "",
                    bg,
                    glowout,
                    glowin,
                    id: lineId,
                } = lineObj;

                if (type === "text-effect") {
                    const formatted = formatStr(text, player);
                    const animator = this.createTextAnimator({
                        text: formatted,
                        bg,
                        glowOut: glowout,
                        glowIn: glowin,
                    });
                    const frame =
                        Math.floor(
                            animationIndex / this.getLineTickSpeed(name, lineId)
                        ) % animator.maxFrames;
                    return animator(frame);
                }

                try {
                    const frames = text.split("\n").filter(Boolean);
                    if (frames.length === 1) return frames[0];

                    const frame =
                        Math.floor(
                            animationIndex / this.getLineTickSpeed(name, lineId)
                        ) % frames.length;
                    return frames[frame].replaceAll("[@username]", player.name);
                } catch {
                    return text.split("\n")[0] ?? "§cLINE_ANIM_FAIL";
                }
            });

            const finalText = newLines
                .map((line) => {
                    if (!line) return "";

                    try {
                        if (!this.containsSpecialPatterns(line)) {
                            let replaced = line;
                            for (const emoji of this.extractEmojis(line)) {
                                const key = emoji.slice(1, -1);
                                if (emojis[key])
                                    replaced = replaced.replaceAll(
                                        emoji,
                                        emojis[key]
                                    );
                            }
                            return replaced;
                        }

                        return formatStr(line, player, {
                            "sidebar-name": name,
                        });
                    } catch {
                        return line.replaceAll("[@username]", player.name);
                    }
                })
                .join("\n§r");

            return finalText || "@@LEAF_SIDEBAR_IGNORE";
        } catch {
            return "@@LEAF_SIDEBAR_IGNORE";
        }
    }

    parseLine(player, lineText) {
        return formatStr(
            [lineText]
                .map((_) => {
                    let frames = _.split("\n").filter((_) =>
                        _ ? true : false
                    );
                    let index = Math.floor(animationIndex / 10) % frames.length;
                    return frames[index];
                })
                .join(""),
            player
        );
    }
    duplicateSidebar(name, newName) {
        let doc = uiBuilder.db.findFirst({
            type: 7,
            name: name,
        });
        if (!doc) return;
        let doc2 = uiBuilder.db.findFirst({
            type: 7,
            name: newName,
        });
        if (doc2) return;
        uiBuilder.db.insertDocument({
            ...doc.data,
            name: newName,
        });
    }
    getSidebarLineAnimFrameCount(name, id) {
        let doc = uiBuilder.db.findFirst({
            type: 7,
            name: name,
        });
        if (!doc) return;
        let index = doc.data.lines.findIndex((_) => _.id == id);
        if (index < 0) return;
        return doc.data.lines[index].frameCount || 5;
    }
    setSidebarLineAnimFrameCount(name, id, count = 5) {
        let doc = uiBuilder.db.findFirst({
            type: 7,
            name: name,
        });
        if (!doc) return;
        let index = doc.data.lines.findIndex((_) => _.id == id);
        if (index < 0) return;
        doc.data.lines[index].frameCount = count;
    }
    getSidebarNames() {
        return uiBuilder.db.findDocuments({ type: 7 }).map((_) => _.data.name);
    }
    getSidebar(name) {
        return uiBuilder.db.findFirst({ type: 7, name });
    }
    addLine(name, text) {
        this.clearLineCache(name);
        let doc = uiBuilder.db.findFirst({
            type: 7,
            name: name,
        });
        if (!doc) return;
        doc.data.lines.push({
            id: generateUUID(),
            text,
        });
        uiBuilder.db.overwriteDataByID(doc.id, doc.data);
    }
    removeLine(name, id) {
        this.clearLineCache(name);
        let doc = uiBuilder.db.findFirst({
            type: 7,
            name: name,
        });
        if (!doc) return;
        doc.data.lines = doc.data.lines.filter((_) => _.id != id);
        uiBuilder.db.overwriteDataByID(doc.id, doc.data);
    }
    editLine(name, id, text) {
        this.clearLineCache(name);
        let doc = uiBuilder.db.findFirst({
            type: 7,
            name: name,
        });
        if (!doc) return;
        let index = doc.data.lines.findIndex((_) => _.id == id);
        if (index < 0) return;
        doc.data.lines[index] = {
            ...doc.data.lines[index],
            id,
            text,
        };
        uiBuilder.db.overwriteDataByID(doc.id, doc.data);
    }
    moveLineDown(name, id) {
        this.clearLineCache(name);
        let doc = uiBuilder.db.findFirst({
            type: 7,
            name: name,
        });
        if (!doc) return;
        let index = doc.data.lines.findIndex((_) => _.id == id);
        // world.sendMessage(`Index: ${index}`);
        // world.sendMessage(JSON.stringify(doc.data.lines, null, 2));
        if (index + 1 >= doc.data.lines.length) return;
        array_move(doc.data.lines, index, index + 1);
        uiBuilder.db.overwriteDataByID(doc.id, doc.data);
    }
    moveLineUp(name, id) {
        this.clearLineCache(name);
        let doc = uiBuilder.db.findFirst({
            type: 7,
            name: name,
        });
        if (!doc) return;
        let index = doc.data.lines.findIndex((_) => _.id == id);
        // world.sendMessage(`Index: ${index}`);
        // world.sendMessage(JSON.stringify(doc.data.lines, null, 2));
        if (index < 1) return;

        array_move(doc.data.lines, index, index - 1);

        uiBuilder.db.overwriteDataByID(doc.id, doc.data);
    }
}

export default new SidebarEditor();
