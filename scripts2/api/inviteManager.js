import { system } from "@minecraft/server";

class InviteManager {
    #inviteMap;
    constructor() {
        this.#inviteMap = new Map();
        this.States = {
            Accepted: "ACCEPTED",
            Rejected: "REJECTED",
            Expired: "EXPIRED",
            Cancelled: "CANCELLED"
        }
        system.runInterval(()=>{
            for(const invite of this.#inviteMap.keys()) {
                let inviteData = this.#inviteMap.get(invite);
                inviteData.callback(inviteData, this.States.Expired);
                if(Date.now() >= inviteData.expiration) this.#inviteMap.delete(invite);
            }
        },20);
    }
    createInvite(player, otherPlayer, category = "global", callback) {
        let code = "";
        let chars = "abcdefghijklmnopqrstuvwxyz1234567890".split('');
        for(let i = 0;i < 5;i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        let expiration = Date.now() + (60 * 1000);
        this.#inviteMap.set(code, {
            code,
            player,
            otherPlayer,
            category,
            callback,
            expiration
        })
    }
    getInvitesToPlayer(player) {
        let invites = [];
        for(const invite of this.#inviteMap.keys()) {
            let inviteData = this.#inviteMap.get(invite);
            if(inviteData.otherPlayer.id == player.id) invites.push(inviteData.code);
        }
        return invites;
    }
    getInvite(code) {
        return this.#inviteMap.get(code)
    }
    getInvitesToPlayerByCategory(player, category) {
        let invites = [];
        for(const invite of this.#inviteMap.keys()) {
            let inviteData = this.#inviteMap.get(invite);
            if(inviteData.otherPlayer.id == player.id && inviteData.category == category) invites.push(inviteData.code);
        }
        return invites;
    }
    cancelInvite(code) {
        if(this.#inviteMap.has(code)) {
            let inviteData = this.#inviteMap.get(code);
            inviteData.callback(inviteData, this.States.Cancelled);
            this.#inviteMap.delete(code);
        }
    }
    acceptInvite(code) {
        if(this.#inviteMap.has(code)) {
            let inviteData = this.#inviteMap.get(code);
            inviteData.callback(inviteData, this.States.Accepted);
            this.#inviteMap.delete(code);
        }
    }
    rejectInvite(code) {
        if(this.#inviteMap.has(code)) {
            let inviteData = this.#inviteMap.get(code);
            inviteData.callback(inviteData, this.States.Rejected);
            this.#inviteMap.delete(code);
        }
    }
}

export default new InviteManager();