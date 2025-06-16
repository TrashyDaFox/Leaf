import uiManager from "../../../uiManager";
import config from "../../../versionData";
import { ModalForm } from "../../../lib/form_func";
import configAPI from "../../../api/config/configAPI";
import { prismarineDb } from "../../../lib/prismarinedb";
configAPI.registerProperty("RTPEnabled", configAPI.Types.Boolean, false);
configAPI.registerProperty("RTPCost", configAPI.Types.Number, 0);
configAPI.registerProperty("RTPCurrency", configAPI.Types.String, "default");
configAPI.registerProperty("RTPRadius", configAPI.Types.Number, 1000);
uiManager.addUI(config.uiNames.Config.RTP, "RTP configuration", (player) => {
    let modalForm = new ModalForm();
    modalForm.toggle("Enable RTP?", configAPI.getProperty("RTPEnabled"));
    modalForm.textField(
        "RTP Cost - Amount",
        "Enter a price...",
        (configAPI.getProperty("RTPCost")
            ? configAPI.getProperty("RTPCost")
            : 0
        ).toString()
    );
    let displayOptions = prismarineDb.economy.getCurrencies().map((_) => {
        return `${_.symbol} ${_.displayName}`;
    });
    let internalOptions = prismarineDb.economy.getCurrencies().map((_) => {
        return `${_.scoreboard}`;
    });
    modalForm.dropdown(
        "Clan price - Currency",
        displayOptions.map((_) => {
            return {
                callback() {},
                option: _,
            };
        }),
        internalOptions.findIndex(
            (_) =>
                _ ==
                prismarineDb.economy.getCurrency(
                    configAPI.getProperty("RTPCurrency")
                ).scoreboard
        )
    );
    modalForm.textField(
        "RTP Radius",
        "Enter a radius...",
        (configAPI.getProperty("RTPRadius")
            ? configAPI.getProperty("RTPRadius")
            : 1000
        ).toString()
    );
    modalForm.show(player, false, (player, response) => {
        configAPI.setProperty("RTPEnabled", response.formValues[0]);
        if (/^\d+$/.test(response.formValues[1]))
            configAPI.setProperty("RTPCost", parseInt(response.formValues[1]));
        configAPI.setProperty(
            "RTPCurrency",
            internalOptions[response.formValues[2]]
        );
        if (/^\d+$/.test(response.formValues[3]))
            configAPI.setProperty(
                "RTPRadius",
                parseInt(response.formValues[3])
            );
        return uiManager.open(player, config.uiNames.ConfigMain);
    });
});
