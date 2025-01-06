import { prismarineDb } from '../lib/prismarinedb';
import { array_move } from './utils/array_move';
import { formatStr } from './azaleaFormatting';
import { system, world } from '@minecraft/server';
import emojis from './emojis';
const generateUUID = () => {
    let
      d = new Date().getTime(),
      d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      let r = Math.random() * 16;
      if (d > 0) {
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
};
let animationIndex = 0;
system.runInterval(()=>{
    animationIndex++;
    // if(animationIndex > 20) animationIndex = 0;
},1);
let cache = {};
class SidebarEditor {
    constructor() {
        this.db = prismarineDb.table("sidebars");
        this.lineTickSpeeds = {};
        this.lineCaches = {};
    }
    createSidebar(name) {
        let doc = this.db.findFirst({
            _name: name
        })
        if(doc) return;
        this.db.insertDocument({
            _type: "SIDEBAR",
            _name: name,
            lines: []
        });
    }
    deleteSidebar(name) {
        let doc = this.db.findFirst({
            _name: name
        });
        if(!doc) return;
        this.db.trashDocumentByID(doc.id);
    }
    getLines(name) {
        if(this.lineCaches[`!${name}`]) return this.lineCaches[`!${name}`];
        let doc = this.db.findFirst({
            _name: name
        });
        if(!doc) return [];
        this.lineCaches[`!${name}`] = doc.data.lines
        return doc.data.lines;
    }
    getLineByID(name, id) {
        let doc = this.db.findFirst({
            _name: name
        });
        if(!doc) return;
        return doc.data.lines.find(_=>_.id == id);
    }
    editLineTickSpeed(name, id, tickSpeed = 10) {
        let doc = this.db.findFirst({
            _name: name
        });
        this.clearLineCache(name);
        if(!doc) return;
        let lineIndex = doc.data.lines.findIndex(_=>_.id == id);
        if(lineIndex < 0) return;
        let lines = doc.data.lines;
        lines[lineIndex].tickSpeed = tickSpeed
        doc.data.lines = lines;
        this.lineTickSpeeds[id] = tickSpeed
        JSON.stringify(this.db.overwriteDataByID(doc.id, doc.data));
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
        if(this.lineTickSpeeds[id]) return this.lineTickSpeeds[id];
        let line = this.getLineByID(name, id)
        // world.sendMessage(JSON.stringify(line))
        this.lineTickSpeeds[id] = line.tickSpeed ? line.tickSpeed : 10
        return line.tickSpeed ? line.tickSpeed : 10;
        // return 1;
    }
    clearLineCache(name) {
        this.lineCaches[`!${name}`] = null;
    }
    extractEmojis(str) {
        // Regular expression to match valid text between `::`
        const regex = /:([a-z0-9_-]+):/g;
    
        // Find all matches
        const matches = str.match(regex);
    
        return matches && typeof matches === "object" && Array.isArray(matches) ? matches : [];
    }
    parseEntireSidebar(player, name) {
        try {
            if(!this.lineCaches[`${player.id}`]) this.lineCaches[`${player.id}`] = {};
            let lineCache = this.lineCaches[`${player.id}`];
            let lines = this.getLines(name);
            if(!lines) return "@@LEAF_SIDEBAR_IGNORE";
            let lineMapIndex = new Map();
            let newLines = lines.map((_,i)=>{
                try {
                    if(_.text == "" || !_.text) return "";
                    let frames = _.text.split('\n').filter(_=>_ ? true : false);
                    if(frames.length === 1) return frames[0];
                    let index = Math.floor(animationIndex / this.getLineTickSpeed(name, _.id)) % frames.length
                    let str = frames[index]
                    return str;
                } catch {
                    try {
                        return _.text.split('\n')[0]; // remove animations as fallback
                    } catch {
                        return "§cLINE_ANIM_FAIL"; // in case something goes horribly wrong. likely wont happen
                    }
                }
            });
    
            let text = newLines.map(line => {
                try {
                    if(line == "") return line;
                    if(!this.containsSpecialPatterns(line)) {
                        let newLine = line;
                        let emojis2 = this.extractEmojis(line);
                        for(const emoji of emojis2) {
                            // world.sendMessage(emoji.substring(1).slice(0,-1))
                            if(emojis[emoji.substring(1).slice(0,-1)]) newLine = newLine.replaceAll(`${emoji}`, emojis[emoji.substring(1).slice(0,-1)])
                        }
                        return newLine;
                    }
                    return formatStr(line, player, {"sidebar-name": name})
        
                } catch {
                    return line;
                }
            }).join('\n§r');
            if(!text) return "@@LEAF_SIDEBAR_IGNORE"
            return text;
        } catch {
            return "@@LEAF_SIDEBAR_IGNORE" // parsing the sidebar went very wrong. do not display to the user
        }
    }
    parseLine(player, lineText) {
        return formatStr([lineText].map(_=>{
            let frames = _.split('\n').filter(_=>_ ? true : false);
            let index = Math.floor(animationIndex / 10) % frames.length
            return frames[index]
        }).join(''), player);
    }
    duplicateSidebar(name, newName) {
        let doc = this.db.findFirst({
            _name: name
        });
        if(!doc) return;
        let doc2 = this.db.findFirst({
            _name: newName
        })
        if(doc2) return;
        this.db.insertDocument({
            ...doc.data,
            _name: newName
        })
    }
    getSidebarNames() {
        return this.db.findDocuments({_type:"SIDEBAR"}).map(_=>_.data._name);
    }
    addLine(name, text) {
        this.clearLineCache(name);
        let doc = this.db.findFirst({
            _name: name
        })
        if(!doc) return;
        doc.data.lines.push({
            id: generateUUID(),
            text
        });
        this.db.overwriteDataByID(doc.id, doc.data);
    }
    removeLine(name, id) {
        this.clearLineCache(name);
        let doc = this.db.findFirst({
            _name: name
        })
        if(!doc) return;
        doc.data.lines = doc.data.lines.filter(_=>_.id != id);
        this.db.overwriteDataByID(doc.id, doc.data);
    }
    editLine(name, id, text) {
        this.clearLineCache(name);
        let doc = this.db.findFirst({
            _name: name
        })
        if(!doc) return;
        let index = doc.data.lines.findIndex(_=>_.id == id);
        if(index < 0) return;
        doc.data.lines[index] = {
            id,
            text
        };
        this.db.overwriteDataByID(doc.id, doc.data);

    }
    moveLineDown(name, id) {
        this.clearLineCache(name);
        let doc = this.db.findFirst({
            _name: name
        })
        if(!doc) return;
        let index = doc.data.lines.findIndex(_=>_.id == id);
        // world.sendMessage(`Index: ${index}`);
        // world.sendMessage(JSON.stringify(doc.data.lines, null, 2));
        if(index + 1 >= doc.data.lines.length) return;
        array_move(doc.data.lines, index, index + 1);
        this.db.overwriteDataByID(doc.id, doc.data);
    }
    moveLineUp(name, id) {
        this.clearLineCache(name);
        let doc = this.db.findFirst({
            _name: name
        })
        if(!doc) return;
        let index = doc.data.lines.findIndex(_=>_.id == id);
        // world.sendMessage(`Index: ${index}`);
        // world.sendMessage(JSON.stringify(doc.data.lines, null, 2));
        if(index < 1) return;
        
        array_move(doc.data.lines, index, index - 1);

        this.db.overwriteDataByID(doc.id, doc.data);
    }
}

export default new SidebarEditor();