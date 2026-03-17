import { world } from "@minecraft/server";

// made with <3 by TrashyDaFox
// peam
export function queryEntity(options, originLocation, originDimension) {

}
export function splitSelector(sel) {
    if(sel.startsWith('@')) {
        let parts = [`${sel[0]}${sel[1]}`]
    } else {
        return [sel];
    }
}

export function entitySel(str, player) {
    let entities = [];
    if(!str.startsWith('@')) {
        let player = str.replaceAll('"', '');
        for(const player of world.getPlayers()) {
            if(player.name.toLowerCase() == player.name.toLowerCase()) entities.push(player)
        }
    } else {
        let char = str[1];
        switch(char) {
            case 's':
                entities.push(player)
        }
    }
    return entities;
}// no this isnt what this is for
// im remaking the @a[type=whatever] syntax stuff
// like the selectors
// what about @s
// ah wait you have a point
// u fine with editing form func?
// what do you want me to do
// i wanna add a ui where you can override the cherryui theme for UIs based on title matching
// like "UIs with 'pp balls' in the title are forced to Pissgirl theme"
// wtf does that mean
// its a player thing
// some people will, i decided
// actually i have lots of ideas for this outside cherryui themes so dont do that
// hmmm
// 
// no the thing is it works with leaf guis too right
// ....
// and who the fuck will use this
// im pretty sure theres like 3 people who use action forms in the first place
// why tf not
// ok so lets do a teams system
// no i added a "teams" system. i feel like pvp groups wouldve been a better name
// nvm
// i do also have a lifesteal addon in here if u wanna help with that instead
// its in a different folder, scroll down like all the way
// i have no idea what ur talking about, please elaborate
// ok 
// its called "BP"?
// yuh
// k
// wait what do u want me to do
// player spectating for ghosts
// but why dont u add like something useful
// didnt u already do that
// so why would u want that
// do you want it to be editable by the player or like is it a dev thing
// i dont fw strings so idk what i]]m doign
// do you have anything else for me to do
// this is for ui builder btw lmao
// still
// i did forget @s existed
// and @p, u can calculate who is nearest to player who ran command using player argument
// omg my screen