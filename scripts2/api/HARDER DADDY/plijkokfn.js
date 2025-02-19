import { prismarineDb } from "../../lib/prismarinedb";
import actionParser from "../actionParser";
import * as mc from '@minecraft/server'
class CustomActions {
    constructor() {
        // this.instructionList = data;
        // this.player = player;
        // this.sessionID = 100;
        this.db = prismarineDb.table("nya")

        this.conditions = {
            gtscore: {
                params: [
                    "score",
                    "objective"
                ],
                display: "Score >",
                check(player, {score, objective}) {
                    return this.getScore(player, objective) > score;
                }
            },
            ltscore: {
                params: [
                    "score",
                    "objective"
                ],
                display: "Score <",
                check(player, {score, objective}) {
                    return this.getScore(player, objective) < score;
                }
            },
            eqscore: {
                params: [
                    "score",
                    "objective"
                ],
                display: "Score = ",
                check(player, {score, objective}) {
                    return this.getScore(player, objective) == score;
                }
            },
            hastag: {
                params: [
                    "tag"
                ],
                display: "Player Has Tag",
                check(player, {tag}) {
                    return player.hasTag(tag);
                }
            },
            playeronmobile: {
                params: [],
                display: "Player On Mobile",
                check(player) {
                    if(!(player instanceof mc.Player)) return false;

                    return player.clientSystemInfo.platformType == mc.PlatformType.Mobile
                }
            },
            playeronconsole: {
                params: [],
                display: "Player On Console",
                check(player) {
                    if(!(player instanceof mc.Player)) return false;

                    return player.clientSystemInfo.platformType == mc.PlatformType.Console
                }
            },
            playerondesktop: {
                params: [],
                display: "Player On Desktop",
                check(player) {
                    if(!(player instanceof mc.Player)) return false;

                    return player.clientSystemInfo.platformType == mc.PlatformType.Desktop
                }
            },
            playerusingcontroller: {
                params: [],
                display: "Player Using Controller",
                check(player) {
                    if(!(player instanceof mc.Player)) return false;

                    return player.inputInfo.lastInputModeUsed == mc.InputMode.Gamepad
                }
            },
            playerusingtouchscreen: {
                params: [],
                display: "Player Using Controller",
                check(player) {
                    if(!(player instanceof mc.Player)) return false;

                    return player.inputInfo.lastInputModeUsed == mc.InputMode.Touch
                }
            },
            playerxplevelgt: {
                params: ["xplevel"],
                display: "Player XP Level >",
                check(player, {xpl}) {
                    if(!(player instanceof mc.Player)) return false;

                    return player.level > xpl;
                }

            },
            playerxplevellt: {
                params: ["xplevel"],
                display: "Player XP Level <",
                check(player, {xpl}) {
                    if(!(player instanceof mc.Player)) return false;

                    return player.level < xpl;
                }

            },
            playerxpleveleq: {
                params: ["xplevel"],
                display: "Player XP Level <",
                check(player, {xpl}) {
                    if(!(player instanceof mc.Player)) return false;

                    return player.level == xpl;
                }

            }
        }
    }

    getScore(player, objective) {
        let scoreboard = mc.world.scoreboard.getObjective(objective);
        if(!scoreboard) return 0;
        let score = scoreboard.getScore(player);
        return score ? score : 0;
    }

    createActionGroup(name) {
        if(!/^[a-z]+$/.test(name)) return false;
        if(this.db.findFirst({name})) return false;

        this.db.insertDocument({
            name,
            instructions: []
        })

        return true;
    }

    getActionGroupByName(name) {
        return this.db.findFirst({name: name.split('/')[0]})
    }

    addCommentInstruction(name, comment) {
        let group = this.getActionGroupByName(name);
        if(!group) return false;

        let arr = group.data.instructions;
        let parts = name.split('/');
        if(parts.length > 1) {
            for(const part of parts) {
                let type = part.startsWith('?') ? 0 : 1;
                if(type == 0) {
                    if(arr.find(_=>_.type == "if" && _.conditionalID == part.substring(1))) arr = arr.find(_=>_.type == "if" && _.conditionalID == part.substring(1));
                } else {
                    if(arr.find(_=>_.type == "function" && _.funcName == part.substring(1))) arr = arr.find(_=>_.type == "function" && _.funcName == part.substring(1));

                }
            }
        }

        arr.push({
            id: Date.now(),
            type: "comment",
            label: comment
        })

        // mc.world.sendMessage(JSON.stringify(arr))

        this.db.overwriteDataByID(group.id, group.data)

        return true;
    }

    getInstructions(name) {
        let group = this.getActionGroupByName(name);
        if(!group) return [];

        let arr = group.data.instructions;
        let parts = name.split('/');
        if(parts.length > 1) {
            for(const part of parts) {
                let type = part.startsWith('?') ? 0 : 1;
                if(type == 0) {
                    if(arr.find(_=>_.type == "if" && _.conditionalID == part.substring(1))) arr = arr.find(_=>_.type == "if" && _.conditionalID == part.substring(1));
                } else {
                    if(arr.find(_=>_.type == "function" && _.funcName == part.substring(1))) arr = arr.find(_=>_.type == "function" && _.funcName == part.substring(1));

                }
            }
        }

        return arr;
    }

    addCommandInstruction(name, label, command) {
        let group = this.getActionGroupByName(name);
        if(!group) return false;

        let arr = group.data.instructions;
        let parts = name.split('/');
        if(parts.length > 1) {
            for(const part of parts) {
                let type = part.startsWith('?') ? 0 : 1;
                if(type == 0) {
                    if(arr.find(_=>_.type == "if" && _.conditionalID == part.substring(1))) arr = arr.find(_=>_.type == "if" && _.conditionalID == part.substring(1));
                } else {
                    if(arr.find(_=>_.type == "function" && _.funcName == part.substring(1))) arr = arr.find(_=>_.type == "function" && _.funcName == part.substring(1));

                }
            }
        }


        arr.push({
            id: Date.now(),
            type: "command",
            label,
            command
        })

        this.db.overwriteDataByID(group.id, group.data)

        return true;
    }

    addFunctionInstruction(name, funcName) {
        let group = this.getActionGroupByName(name);
        if(!group) return false;
        if(!/^[a-z]+$/.test(funcName)) return false;
        if(group.data.instructions.find(_=>_.type=="function"&&_.funcName == funcName)) return false;

        group.data.instructions.push({
            id: Date.now(),
            type: "function",
            funcName,
            instructions: []
        })

        this.db.overwriteDataByID(group.id, group.data)

        return true;
    }

    addIfInstruction(name, label) {
        let group = this.getActionGroupByName(name);
        if(!group) return false;
        // if(!/^[a-z]+$/.test(funcName)) return false;
        // if(group.data.instructions.find(_=>_.type=="function"&&_.funcName == funcName)) return false;
        let arr = group.data.instructions;
        let parts = name.split('/');
        if(parts.length > 1) {
            for(const part of parts) {
                let type = part.startsWith('?') ? 0 : 1;
                if(type == 0) {
                    if(arr.find(_=>_.type == "if" && _.conditionalID == part.substring(1))) arr = arr.find(_=>_.type == "if" && _.conditionalID == part.substring(1));
                } else {
                    if(arr.find(_=>_.type == "function" && _.funcName == part.substring(1))) arr = arr.find(_=>_.type == "function" && _.funcName == part.substring(1));

                }
            }
        }
        arr.push({
            id: Date.now(),
            type: "if",
            conditionalID: Date.now(),
            label,
            conditions,
            instructions: []
        })

        this.db.overwriteDataByID(group.id, group.data)

        return true;

    }

    addCallInstruction(name, label, actionGroup, funcName) {
        let group1 = this.getActionGroupByName(name);
        if(!group1) return false;
        let group2 = this.getActionGroupByName(actionGroup);
        if(!group2) return false;
        if(!group2.data.instructions.find(_=>_.type == "function" && _.funcName == funcName)) return false;
        let arr = group1.data.instructions;
        let parts = name.split('/');
        if(parts.length > 1) {
            for(const part of parts) {
                let type = part.startsWith('?') ? 0 : 1;
                if(type == 0) {
                    if(arr.find(_=>_.type == "if" && _.conditionalID == part.substring(1))) arr = arr.find(_=>_.type == "if" && _.conditionalID == part.substring(1));
                } else {
                    if(arr.find(_=>_.type == "function" && _.funcName == part.substring(1))) arr = arr.find(_=>_.type == "function" && _.funcName == part.substring(1));

                }
            }
        }
        arr.push({
            id: Date.now(),
            type: "call",
            actionGroup,
            label,
            funcName
        })

        this.db.overwriteDataByID(group1.id, group1.data)
    }

    getFns() {
        let fnsList = [];
        for(const group of this.db.data) {
            for(const instruction of group.instructions) {
                if(instruction.type != "function") continue;
                fnsList.push([group.name, instruction.funcName]);
            }
        }
    }

    // exec() {
    //     for(const instruction of this.instructionList) {
    //         if(instruction.type == "comment") continue;

    //         switch(instruction.type) {
    //             case "call":
    //                 handleCalling(instruction)
    //                 break;
    //             case "command":
    //                 actionParser.runAction(this.player, instruction.command)
    //             case "if":
    //                 let conditions = [];
    //                 for(const condition of instruction.conditions) {
    //                     let score = getScore(this.player, condition.objective)
    //                     switch(condition.type) {
    //                         case ">score":
    //                             conditions.push(score > handleInput(score))
    //                             break;
    //                         case "<score":
    //                             conditions.push(score < handleInput(score))
    //                             break;
    //                         case "=score":
    //                             conditions.push(score < handleInput(score))
    //                             break;
    //                         case "hasTag":
    //                             conditions.push(this.player.hasTag(condition.tag))
    //                             break;
    //                     }
    //                 }

    //         }
    //     }
    // }
}
export default new CustomActions()
// https://www.youtube.com/watch?v=USQ6BA0r7-Y

// HUH

// WHAT IS THIS

// lmao

// https://youtu.be/wKBvb9Zo-nQ?si=vRpj2Ff5mKtj3XsH

// https://www.youtube.com/watch?v=-0Yb3W3GoY0

// https://www.youtube.com/watch?v=HdHvpaOB8pc