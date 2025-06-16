// import { leaderboardDb } from "../../api/leaderboard";
import config from "../../versionData";
import leaderboardHandler from "../../leaderboardHandler";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import { NUT_UI_TAG } from "../preset_browser/nutUIConsts";

uiManager.addUI(
    config.uiNames.Leaderboards.Root,
    "Leaderboards Root",
    (player) => {
        let form = new ActionForm();
        form.title(`${NUT_UI_TAG}§gBleederblorrds uwu kawaii meow mrrp`)
        form.body(
            `§e!lb §badd §a<objective> §r§7- §fAdds a leaderboard\n§e!lb §bremove §a<objective> §r§7- §fRemoves a leaderboard\n\n§eREMEMBER: DO NOT INCLUDE THE <>`
        );
        for (const lb of leaderboardHandler.db.data) {
            // form.button(`${JSON.stringify(Object.keys(lb.data))}`)
            form.button(
                `§b${
                    lb.data.displayName
                        ? lb.data.displayName
                        : lb.data.objective
                }\n§r§7${lb.data.showOffline ? "Offline" : "Online Only"}`,
                null,
                (player) => {
                    uiManager.open(
                        player,
                        config.uiNames.Leaderboards.Edit,
                        lb.id
                    );
                }
            );
        }
        form.show(player, false, (player, response) => {});
    }
);
