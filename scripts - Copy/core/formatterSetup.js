import { leafFormatter } from './api/formatting.js';

export function setupFormatters() {
    leafFormatter.addVariable("name", (sessionData) => {
        return sessionData.player ? sessionData.player.name : "SYSTEM";
    });

    leafFormatter.addVariable("msg", (sessionData) => {
        return sessionData.msg ? sessionData.msg : "Null";
    });

    // ... other formatter setup
} 