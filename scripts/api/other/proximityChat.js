import configAPI from "../config/configAPI";

configAPI.registerProperty("ProximityChat", configAPI.Types.Boolean, true);
configAPI.registerProperty(
    "ProximityChatIndicators",
    configAPI.Types.Boolean,
    true
);
configAPI.registerProperty("ProximityChatRadius", configAPI.Types.Number, 20);

function isPointInSphere(px, py, pz, cx, cy, cz, radius) {
    const dx = px - cx;
    const dy = py - cy;
    const dz = pz - cz;
    return dx * dx + dy * dy + dz * dz <= radius * radius;
}

class ProximityChat {
    canInit(msg) {
        return (
            configAPI.getProperty("ProximityChat") &&
            msg.sender.hasTag("proxchat")
        );
    }

    canShowToPlayer(msg, player) {
        return isPointInSphere(
            player.location.x,
            player.location.y,
            player.location.z,
            msg.sender.location.x,
            msg.sender.location.y,
            msg.sender.location.z,
            configAPI.getProperty("ProximityChatRadius")
        );
    }
}

export default new ProximityChat();
