import { prismarineDb } from "../lib/prismarinedb";

class InviteManager {
    constructor() {
        this.inviteDb = prismarineDb.nonPersistentTable("Invite");
    }
    invite(inviter, invited, {onAccept, onDeny, onTimeout, onSend} = {onAccept(){},onDeny(){},onTimeout(){},onSend(){}}) {
        let id = this.inviteDb.insertDocument({
            inviter,
            invited,
            onAccept,
            onDeny,
            onTimeout
        });
        onSend(inviter, invited, id);
    }
}