import { world } from "@minecraft/server";
import { prismarineDb } from "../lib/prismarinedb";
import playerStorage from "./playerStorage";
import configAPI from "./config/configAPI";
/*>:3>:3>:3>:3>:3>:3>:3
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀>:3>:3>:3
⠀>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3>:3⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡤⠤⠤⠤⠴⠶⠶⠒⠚⠋⠉⠉⠉⠉⣷⢀⣀⡤⠤⠶⠶⠒⠛⢶⡄⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡀⠀⣿⠉⠀⠀⠀⠀⠀⠀⠀⠀⢿⡀⠀⠀>:3>:3>:3
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⣇⣾⠀⠀⠀⠀⣴⡄⢠⣿⣄⡀⣰⠏⠙⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣧⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠤⠶⠚⠉⠉⠙⢦⣄⣀⣀⡟⠙⠋⠁⠈⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠇⠀⠀⠀⠀⠀⠀⠀⠈⠉⠁⠀⠀⠀⠀⠀⢀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣇⠀>:3>:3>:3>:3>:3
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⢰⠋⢈⡷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣇⠀⠀⠀⠀⠀⠀⠀⠀⠠⣆⠀⠀⢿⠀⢸⡶⢿⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡀>:3>:3
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣤⣀⡼⠀⠀⠻⠀⠀⠙⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡖⠀⠀⠀⠀⠀⠀⠀⠀⠸⡇>:3
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⠳⣦⡀⣼⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⣧
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠇⣿⠀⠀⠀⠀⠀⠀⣀⣀⠀⠀⠀⠀⠀⡟⢳⣄⠀⠀⠀⠀⠙⣇⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⡿>:3
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡿⠀⢿⡀⠀⠀⠀⢀⡞⠁⠉⠓⠀⠀⠀⠀⣯⠴⠻⣆⠀⠀⠀⠀⢻⡆⠀⠀⠀⠻⠃⠀⠀⠀⠀⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠇⠀⢸⡇⠀⠀⠀⠘⣧⠀⠖⠚⣷⠀⠀⠀⣧⠀⠀⠘⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇>:3
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡟⠀⠀⠘⡇⠀⠀⠀⠀⠘⠷⣤⣠⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠇⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡾⠀⠀⠀⠀⢸⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡠⠞⠁⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⠾⣦⠀⢸⡇⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣠⡤⠔⠚⠉⠀⠀⠀⠀>:3
⠀⠀⣴⢦⣄⠀⠀⢀⣰⠏⠀⠘⣧⣿⠀⠀⠀⠀⢠⢾⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⡤⠴⠶⠒⠋⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⡏⠀⠈⠛⠋⠉⢀⣴⣿⣟⢿⡏⠀⠀⢀⡴⠋⠀⣧⠀⠀⢀⣀⣠⣤⣤⠤⠴⠒⠚⠛⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣧⢀⣴⣶⣶⡄⢾⣿⣿⡿⣸⠃⠀⢠⠞⠁⠀⠀⠈⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀>:3⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢿⣿⣿⣿⣿⣿⠘⢿⣭⡵⠋⠀⣰⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀>:3⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠈⠳⣬⣿⣭⠯⠖⠚⠁⠀⢀⡞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀>:3⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢠⠇⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀>:3⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣰⠏⠀⣀⠀⠀⠀⠀⠀⢸⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀>:3⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⡼⢃⡴⠚⡿⠀⠀⠀⣤⠀⠈⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀>:3⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢀⣾⠗⠋⠀⢠⡏⠀⠀⣸⠋⢷⡀⢹⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀>:3⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠋⠁⣄⠀⢠⡿⡇⠀⢰⡏⠀⠀⠻⣮⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀>:3⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠙⠛⠋⠀⡇⢠⡟⠀⠀⠀⠀⠈⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀>:3⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣧⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀>:3⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ >:3⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
get it right, im actually trans⠀⠀⠀⠀ >:3⠀⠀⠀⠀⠀⠀⠀⠀⠀
u can be multiple at the same time yk >:3
trans is gender identity gay is sexual orientation "lesiban" - fucktitty, 2026⠀>:3
yes but for women its lesbian >:3
i cant join server >:3
no no worky :( >:3
"outdated client" we NEED to make smth for leaf rn why im bored and i wanna add something >:3
lets make leaf plugins **TOGETHER** (i dont mean u watch me do everything and fix the smallest mistakes i make) >:3
pr eview mc >:3
oki meow :3 >:3
teehee~ :3 >:3
meow :3 >:3
meow >:3 >:3 >:3
angry colon three will take over the world
brb
STOP
NOW
OR
I
WILL
KILL
YOUR
FAMILY
:3
>:3
that dragon guy in leaf is so weird
like why does he want to use azalea over leaf
REAL
what do we add
lets finish auction house ^-^
who leaves something avaliable but unfinished after multiple updates
auction house is finished by other peoples standards, but not my standards. needs to be absolutely perfect
so your shitty ranks system is ABSOLUTELY perfect?
no im just too lazy to update it
fair enough
lets update it together ^-^
NO TTHANKS
please :<
what about peoples already made ranks/tags
we can have a toggle to toggle between 2 rank systems
thats a pain in the ass thoooooooooooooooooo
how? wtf
"how? response.formValues[0]" - trashy 2025
"meow :3" - Fruitkitty 2025
i'd rather jump off a bridge than use azalea
REAL
lets recreate strawberry blooms chatranks
i loved those soo muchh
LETS STOP PROCRASTINATING FFS
LETS MAKE STRAWBERY BLOOM CHATRANKS
:3
ok
whats ip and port again
nothing-message.gl.at.ply.gg:4440 
make leaf plugins NOW
bitch or else i will kill you and all of the people in your life
i will make you beg for mercy and slowly kills you
wdym bny leaf plugsin
an addon that can be added to a world and is able to interact with leaf, you could maybe even make a system to allow cherrycloud and run the javascript but that would probably need high moderation
meow meow
*/

configAPI.registerProperty(
    "AzaleaStyleSharedHomes",
    configAPI.Types.Boolean,
    true
);
configAPI.registerProperty("HomesLimit", configAPI.Types.Number, 5);
class Homes {
    constructor() {
        this.db = prismarineDb.table("homes");
    }
    createHome(name, player) {
        let owner = playerStorage.getID(player);
        let hs = this.db.findDocuments({ owner });
        if (hs.length + 1 > configAPI.getProperty("HomesLimit")) {
            player.error("You have reached the homes limit!");
            return false;
        }

        let h = this.db.findFirst({ owner, name });
        if (h) return false;
        let h2 = this.db.insertDocument({
            owner,
            name,
            loc: player.location,
            sharedTo: [],
        });
        return h2;
    }
    removeHome(name, player) {
        let owner = playerStorage.getID(player);
        let h = this.db.findFirst({ owner, name });
        if (!h) return false;
        this.db.deleteDocumentByID(h.id);
        return true;
    }
    editName(id, name, player) {
        let owner = playerStorage.getID(player);
        let h = this.db.getByID(id);
        if (!h) return false;
        h.data.name = name;
        this.db.overwriteDataByID(id, h.data);
        return true;
    }
    teleport(id, player) {
        let h = this.db.getByID(id);
        player.teleport({
            x: h.data.loc.x,
            y: h.data.loc.y,
            z: h.data.loc.z,
        });
        return true;
    }
    shareHome(id, player) {
        let h = this.db.getByID(id);
        if (!h) return false;
        h.data.sharedTo.push(player.name);
        this.db.overwriteDataByID(id, h.data);
        return true;
    }
    getSharedHomes(player) {
        let hs = [];
        for (const h of this.db.findDocuments()) {
            for (const sh of h.data.sharedTo) {
                if (sh == player.name) {
                    hs.push(h);
                }
            }
        }
        return hs;
    }
    removeShare(id, name) {
        let h = this.db.getByID(id);
        if (!h) return false;
        let index = h.data.sharedTo.findIndex((sh) => sh == name);
        if (index) return h.data.sharedTo.splice(index, 1);
        this.db.overwriteDataByID(id, h.data);
    }
    delete(id) {
        let h = this.db.getByID(id);
        if (!h) return false;
        this.db.deleteDocumentByID(h.id);
        return true;
    }
    getAllFromPlayer(player) {
        let owner = playerStorage.getID(player);
        let hs = this.db.findDocuments({ owner });
        if (configAPI.getProperty("AzaleaStyleSharedHomes")) {
            for (const doc of this.db.data) {
                if (
                    !doc.data.sharedTo ||
                    !doc.data.sharedTo.includes(player.name)
                )
                    continue;
                let newDoc = JSON.parse(JSON.stringify(doc));
                let playerData = playerStorage.getPlayerByID(newDoc.data.owner);
                newDoc.data.name = `${
                    playerData ? playerData.name : "UnknownPlayer"
                } / ${newDoc.data.name}`;
                hs.push(newDoc);
            }
        }
        return hs;
    }
    get(id) {
        return this.db.getByID(id);
    }
}

export default new Homes();
