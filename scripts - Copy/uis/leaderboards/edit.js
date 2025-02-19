import config from "../../versionData";
import leaderboardHandler from "../../leaderboardHandler";
import { ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.Leaderboards.Edit, "Leaderboards Edit", (player, id)=>{
    let lb = leaderboardHandler.db.getByID(id);
    let form = new ModalForm();
    form.toggle("Show Offline Players", lb.data.showOffline);
    form.textField("Display Name", "Type lb display name", lb.data.displayName ? lb.displayName : "");
    form.slider("Max Players", 1, 20, 1, lb.data.maxPlayers ? lb.data.maxPlayers : 10);
    form.toggle("Force Disable Currency Display", lb.data.disableCurrency ? lb.data.disableCurrency : false);
    form.dropdown("Theme", leaderboardHandler.themes.map(_=>{
        return {
            option: _.name,
            callback() {}
        }
    }), lb.data.theme ? lb.data.theme : 0)
    form.toggle("Disable Ranks", lb.data.disableRanks ? true : false)
    form.toggle("Abbreviate", lb.data.abbreviate ? true : false)
    form.show(player, false, (player, response)=>{
        if(response.canceled) return uiManager.open(player, config.uiNames.Leaderboards.Root)
        lb.data.showOffline = response.formValues[0];
        lb.data.displayName = response.formValues[1];
        lb.data.maxPlayers = response.formValues[2];
        lb.data.disableCurrency = response.formValues[3];
        lb.data.theme = response.formValues[4];
        lb.data.disableRanks = response.formValues[5];
        lb.data.abbreviate = response.formValues[6];
        leaderboardHandler.db.overwriteDataByID(lb.id, lb.data)
        uiManager.open(player, config.uiNames.Leaderboards.Root)
        return;
    })

})
