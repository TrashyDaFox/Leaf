import { ActionFormData } from "@minecraft/server-ui";

let actionForm = new ActionFormData();

export function supportsHeaderAndLabel() {
    return actionForm.header ? true : false;
}