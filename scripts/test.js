import { world, system } from '@minecraft/server';
import { ActionFormData } from "@minecraft/server-ui";
import uiManager from './uiManager';
uiManager.addUI("tab_test", "testing UI for tabs", (player)=>{
        new ActionFormData().title("§t§a§b§b§e§dHi")
            .button("A")
            .button("§a§c§t§i§v§e§t§a§b§r§fSettings")
            .button("§t§a§b§r§fB")
            .button("§t§a§b§r§fB")
            .button("§t§a§b§r§fB")
            .button("§t§a§b§r§fB")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .button("A")
            .show(player)
})
world.beforeEvents.playerBreakBlock.subscribe(e => {
    const player = e.player;
    if (player.hasTag('Spawn')) {
        e.cancel = true;
        system.run(() => {
            player.onScreenDisplay.setActionBar("§cYou can't do that here");
        });
    }
});
world.beforeEvents.playerPlaceBlock.subscribe(e=>{
    const player = e.player;
    if (player.hasTag('Spawn')) {
        e.cancel = true;
        system.run(() => {
            player.onScreenDisplay.setActionBar("§cYou can't do that here");
        });
    }
});
world.beforeEvents.playerInteractWithBlock.subscribe( e=> {
    const player = e.player;
    if (player.hasTag('Spawn')) {
        e.cancel = true;
        system.run(() => {
            player.onScreenDisplay.setActionBar("§cYou can't do that here");
        });
    }
});
world.beforeEvents.playerInteractWithEntity.subscribe( e=> {
    const player = e.player;
    if (player.hasTag('Spawn')) {
        e.cancel = true;
        system.run(() => {
            player.onScreenDisplay.setActionBar("§cYou can't do that here");
        });
    }
});
function loop() {
    for(const player of world.getPlayers()) {
        if(player.hasTag('Spawn')) {
            player.onScreenDisplay.setActionBar("§aSpawn");
    }
    }
}
system.runInterval(() => {
    loop();
}, 1);