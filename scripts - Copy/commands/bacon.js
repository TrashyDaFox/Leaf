import { world } from "@minecraft/server";
import commandManager from "../api/commands/commandManager";

commandManager.addCommand("bacondev", {description:"bacondev", category:"b00b s3x"}, ({msg,args})=>{
    world.sendMessage("As a wise bacondevsb once said... b00b s3x...");
})