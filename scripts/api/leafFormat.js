import { world } from "@minecraft/server";

export class LeafFormatter {
    #variables;
    #functions;
    #sessions;

    constructor() {
        this.#variables = {};
        this.#functions = {};
        this.#sessions = {};
    }

    addVariable(variableName, fn) {
        if(typeof fn !== "function") return;
        this.#variables[variableName] = fn;
    }

    addFunction(functionName, fn) {
        if(typeof fn !== "function") return;
        this.#functions[functionName] = fn;
    }

    format(text, sessionData, sessionID = Date.now()) {
        if(!this.#sessions[sessionID]) this.#sessions[sessionID] = 1;

        let newText = text;

        for(const variable in this.#variables) {
            try {
                if(!newText.includes(`<${variable}>`)) continue;
                let newPart = this.#variables[variable](sessionData, sessionID);
                if(!newPart) continue;
                newText = newText.replaceAll(`<${variable}>`, newPart)
    
            } catch(e) {
                newText += `${e}`
            }
        }

        let fnCallsRegex = /\$([a-z_]*?)\(([\s\S]*?)\)/g
        let calls = newText.match(fnCallsRegex)
        if(calls && calls.length) {
            for(const call of calls) {
                let callData = call.split('(').slice(1).join('(').slice(0,-1)
                callData = callData.replaceAll('\\;', '^SEMICOLON');
                let callArgs = callData.split(';');
                let callVars = {};
                for(const arg of callArgs) {
                    let data = arg.split('=').slice(1).join('=');
                    if(data.startsWith('"') && data.endsWith('"')) data = data.substring(1).slice(0, -1);
                    callVars[arg.split('=')[0]] = data;
                }
                let fnName = call.split('(')[0].substring(1);
                if(!this.#functions[fnName]) continue;
                let retValue = this.#functions[fnName](callVars, sessionData, sessionID);
                newText = newText.replace(call, retValue ? retValue : '')
            }
        }
        
        if(sessionData.lowPriorityVariables) {
            for(const lpVariable in sessionData.lowPriorityVariables) {
                newText = newText.replaceAll(`<${lpVariable}>`, sessionData.lowPriorityVariables[lpVariable])
            }
        }

        return newText;
    }
}