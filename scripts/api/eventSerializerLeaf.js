import { world, system } from "@minecraft/server"
import base64 from "./uibuild/base64";

export class EventSerializer {
    constructor(eventKey) {
        this.eventNamespaces = {
            start: 'levent:start',
            append: 'levent:append',
            end: 'levent:end'
        };
        this.eventKey = eventKey;
        this.eventSessions = {};
        this.handler = ()=>{}
        this.register();
    }
    setHandler(fn) {
        this.handler = fn;
    }
    handleOutput(json, id) {
        if(json.key != this.eventKey) return;
        this.handler(json, id)
    }
    splitEveryNChars(str, chars = 190) {
        const parts = [];
        for (let i = 0; i < str.length; i += 190) {
          parts.push(str.slice(i, i + 190));
        }
        return parts;
    }
    register() {
        system.afterEvents.scriptEventReceive.subscribe(e=>{
            // world.sendMessage(`${e.id} ${e.message}`)
            if(e.id == this.eventNamespaces.start) {
                this.eventSessions[e.message] = '';
            } else if(e.id == this.eventNamespaces.append) {
                try {
                    let key = e.message.split(' ')[0];
                    let message = e.message.split(' ').slice(1).join(' ');
                    this.eventSessions[key] += JSON.parse(message).d;
                } catch(e) {
                    console.error(e)
                }
            } else if(e.id == this.eventNamespaces.end) {
                try {
                    let decodedOutput = base64.decode(this.eventSessions[e.message])
                    this.handleOutput(JSON.parse(decodedOutput), e.message)
                } catch(e) {
                    console.error(e)
                }
            }
        })
    }
    send(eventKey, data) {
        let id = (Date.now() * 1000) + Math.floor(Math.random() * 1000);
        let finalData = this.splitEveryNChars(base64.encode(JSON.stringify({...data, key: eventKey}), 190));
        // world.sendMessage(JSON.stringify(finalData))
        // world.sendMessage(finalD)
        this.runCommand(`scriptevent ${this.eventNamespaces.start} ${id}`)
        for(const d of finalData) {
            this.runCommand(`scriptevent ${this.eventNamespaces.append} ${id} ${JSON.stringify({d})}`)
        }
        this.runCommand(`scriptevent ${this.eventNamespaces.end} ${id}`)
    }
    runCommand(cmd) {
        // world.sendMessage(cmd)
        world.getDimension('overworld').runCommand(cmd)
    }
}