import { MessageFormData } from '@minecraft/server-ui'
import { prismarineDb } from '../lib/prismarineDb'

class TpaAPI {
    constructor() {
        this.db = prismarineDb.table('TpaRequests')
    }
    
} 