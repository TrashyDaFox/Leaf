import { Player, world } from "@minecraft/server";
import { prismarineDb } from "../lib/prismarinedb";
import uiBuilder from "./uiBuilder";
import normalForm from "./openers/normalForm";

/*
/*
                            ╱|、
                          (˚ˎ 。7  
                           |、˜〵          
                          じしˍ,)ノ

    /\___/\
   (  ◕ω◕)  
    )   ♡(   
   (     )
    |  |  |
    (___|__)

     ∧＿∧
   （｡･ω･｡)つ━☆・*。
   ⊂　　 ノ 　　　・゜
   　しーＪ　　　 。・゜

   /\＿/\
  ( ˶•ω•˶)♡
  /　　づ

             へ         ╱|、
        ૮  -   ՛ ) つ(>   < 7  
         /   ⁻  ៸          、˜〵     
  乀 (ˍ,  ل            じしˍ,)ノ

  "meow"
  - fruitkitty, 2025
*/
class WarpAPI {
    constructor() {
        this.db = prismarineDb.table("Warps");
    }
    setWarpAtVec3(vec3, name, dimension = "minecraft:overworld", rot = {}) {
        let doc = this.db.findFirst({ name });
        if (doc) {
            doc.data.loc = vec3;
            doc.data.name = name;
            doc.data.rot = rot;
            this.db.overwriteDataByID(doc.id, doc.data);
        } else {
            this.db.insertDocument({
                rot,
                loc: vec3,
                name,
                dimension,
            });
        }
        return true;
    }
    deleteWarp(name) {
        let doc = this.db.findFirst({ name });
        if (doc) {
            this.db.deleteDocumentByID(doc.id);
            return true;
        } else {
            return false;
        }
    }
    getWarp(name) {
        return this.db.findFirst({ name });
    }
    getWarps() {
        return this.db.data;
    }
    tpToWarp(player, name) {
        if (!(player instanceof Player)) return;
        let warp = uiBuilder.db.findFirst({ type: 12, name });
        if (!warp) return false;
        if (
            warp.data.requiredTag &&
            !normalForm.playerIsAllowed(player, warp.data.requiredTag)
        ) {
            return false;
        }
        player.teleport(
            {
                x: warp.data.loc.x,
                y: warp.data.loc.y,
                z: warp.data.loc.z,
            },
            {
                rotation:
                    warp.data.rot.x && warp.data.rot.y ? warp.data.rot : null,
                dimension: world.getDimension(
                    warp.data.dim || "minecraft:overworld"
                ),
            }
        );
        return true;
    }
    deleteWarp(name) {
        let warp = this.getWarp(name);
        if (!warp) return true;
        this.db.deleteDocumentByID(warp.id);
    }
}

export default new WarpAPI();
