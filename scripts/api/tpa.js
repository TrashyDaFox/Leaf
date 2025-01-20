import { prismarineDb } from "../lib/prismarinedb";
import { MessageFormData } from '@minecraft/server-ui'
import PlayerStorage from './playerStorage'

class TPA {
    constructor() {
        this.db = prismarineDb.nonPersistentTable('tpaRequests')
    }

    request(plr, toplr, here) {
        let req = this.db.findFirst({ plr: PlayerStorage.getID(plr), toplr: PlayerStorage.getID(toplr) })
        if (req) return false;
        let newID = this.db.insertDocument({
            toplr: toplr,
            fromplr: plr,
            fromplrname: plr.name,
            here,
            expiration: Date.now() + (60 * 1000)
        })
        this.ui(newID, toplr)
    }
    ui(id, plr) {
        let req = this.db.getByID(id)
        if (!req) return false;
        let form = new MessageFormData()
        form.title('TPA Request')
        form.body(`${req.data.fromplrname} wants ${req.data.here ? 'for you to teleport to them.' : 'to teleport to you.'} Do you accept?`)
        form.button1('Accept')
        form.button2('Decline')
        form.show(plr).then(res => {
            if (res.canceled) return this.db.deleteDocumentByID(req.id), plr.info('Cancelled request');

            switch (res.selection) {
                case 1:
                    return this.db.deleteDocumentByID(req.id), plr.info('Cancelled request');
                    break;
                case 0:
                    let req2 = this.accept(plr, req.data.fromplr)
                    if (req2 === true) {
                        plr.success('Accepted TPA request')
                    } else {
                        plr.error(req2)
                    }
            }
        })
    }
    accept(plr, from) {
        let req = this.db.findFirst({ toplr: plr, fromplr: from })
        if (req.expiration >= Date.now()) {
            this.db.deleteDocumentByID(req.id)
            return 'Request expired';
        }
        if (req.here === true) {
            try {
                plr.teleport(from.location, {
                    dimension: from.dimension
                })
            } catch (e) {
                plr.error(e)
            }
        } else {
            try {
                from.teleport(plr.location, {
                    dimension: plr.dimension
                })
            } catch (e) {
                plr.error(e)
            }
        }
        this.db.deleteDocumentByID(req.id)
        return true;
    }
}

export default new TPA();