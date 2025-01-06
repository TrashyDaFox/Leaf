import actionParser from "../../api/actionParser";
import icons from "../../api/icons";
import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.Basic.Confirmation, "Basic Confirmation UI", (player, actionLabel, actionYes, actionNo)=>{
    let form = new ActionForm();
    form.title("Confirmation");
    form.body(actionLabel);
    form.button("§aYes", icons.resolve("leaf/image-822"), player=>{
        if(typeof actionYes === "function") {
            actionYes(player);
        } else if(typeof actionYes === "string") {
            actionParser.runAction(player, actionYes)
        }
    })
    form.button("§cNo", icons.resolve("leaf/image-1168"), player=>{
        if(typeof actionNo === "function") {
            actionNo(player);
        } else if(typeof actionNo === "string") {
            actionParser.runAction(player, actionNo)
        }
    })
    form.show(player, false, (player, response)=>{})
})