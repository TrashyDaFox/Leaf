import { world } from "@minecraft/server";

class Metastring {
    constructor() {
        this.metastrings = [];
    }
    register(name, fn) {
        this.metastrings.push({name, fn})
    }
    parse(player, metastring) {
        let metaStringDef = metastring.split(' ')[0];
        let metaStringArg = metastring.split(' ').slice(1)

        for(const metastringReg of this.metastrings) {
            let {name, fn} = metastringReg;

            if(metaStringDef == `#${name.toUpperCase()}`) {
                fn(player, metaStringArg)
            }
        }
    }
}

const metastringRegister = new Metastring();

metastringRegister.register("player_list", (player)=>{
    return {
        dataset: world.getPlayers(),
        getRedirects(index) {
            return {
                redirectP1: this.dataset[index],
                redirectP2: player
            }
        }
    }
})

export const metastring = metastringRegister;