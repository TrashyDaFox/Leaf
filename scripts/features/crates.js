// import { world, Vector, Player, Enchantment, system } from "@minecraft/server";
// import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";
// import { any, armor, bow, crossbow, fishingrod, sword, axe, pickaxe, hoe, shovel, mace, shield, trident, uniqueEnchantments } from "./modules/enchantments.js";
// import { set1, set2, set3, set4, set5, set6, set7, set8, set9, set10, rewardnames, keynames } from "./rewards.js";
// const rewardSets = [set1, set2, set3, set4, set5, set6, set7, set8, set9, set10];
// const enchantmentMap = {
//   "sword": sword,
//   "pickaxe": pickaxe,
//   "axe": axe,
//   "hoe": hoe,
//   "shovel": shovel,
//   "mace": mace,
//   "shield": shield,
//   "trident": trident,
//   "bow": bow,
//   "crossbow": crossbow,
//   "fishing rod": fishingrod,
//   "fishing_rod": fishingrod,
//   "fishingrod": fishingrod,
//   "any": any,
//   "armor": armor
// };
// const crateKeys = new Map([
//   ["leaf:key1", keynames.key1_name],
//   ["leaf:key2", keynames.key2_name],
//   ["leaf:key3", keynames.key3_name],
//   ["leaf:key4", keynames.key4_name],
//   ["leaf:key5", keynames.key5_name],
//   ["leaf:key6", keynames.key6_name],
//   ["leaf:key7", keynames.key7_name],
//   ["leaf:key8", keynames.key8_name],
//   ["leaf:key9", keynames.key9_name],
//   ["leaf:key10", keynames.key10_name]
// ]);
// try { system.events.beforeWatchdogTerminate.subscribe(eventData => eventData.cancel = true); } catch (error) { system.beforeEvents.watchdogTerminate.subscribe((eventData) => { system.run(() => { eventData.cancel = true; // console.warn(`${eventData.terminateReason}`); }); }); }
// function shuffleArray(array) { let currentIndex = array.length, temp, randomIndex; while (currentIndex !== 0) { randomIndex = Math.floor(Math.random() * currentIndex); currentIndex--; temp = array[currentIndex]; array[currentIndex] = array[randomIndex]; array[randomIndex] = temp; } return array; }
// function generateShowcaseItems(rewards, count) { const selectedItems = []; let lastItem = null; if (rewards.length === 1) { for (let i = 0; i < count; i++) { selectedItems.push(rewards[0]); } return selectedItems; } while (selectedItems.length < count) { const shuffled = shuffleArray([...rewards]); for (const item of shuffled) { if (selectedItems.length >= count) break; if (item !== lastItem) { selectedItems.push(item); lastItem = item; } else { const alternate = rewards.filter(x => x !== item); selectedItems.push(alternate[0]); lastItem = alternate[0]; } } } return selectedItems; }
// function animateShowcase(entity, rewardSet) { const itemsToShow = generateShowcaseItems(rewardSet, 30); const totalItems = itemsToShow.length; const baseDelay = 2; let delay = baseDelay, counter = 0, index = 0; system.run(function animate() { if (counter < delay) { counter++; } else if (counter === delay) { counter = 0; index++; const currentIndex = index - 1; try { const currentItem = itemsToShow[currentIndex]; if (!currentItem.commands && currentItem.id) { const dataVal = currentItem.data || 0; entity.runCommandAsync(`replaceitem entity @s slot.weapon.mainhand 0 ${currentItem.id} 1 ${dataVal}`); entity.nameTag = `${currentItem.name}`; if (currentItem.hasEnchantment) { entity.runCommandAsync(`enchant @s unbreaking`); } } else { const displayData = currentItem.display.data || 0; const displayId = currentItem.display.item || "minecraft:command_block"; const displayName = currentItem.display.name || "???"; entity.runCommandAsync(`replaceitem entity @s slot.weapon.mainhand 0 ${displayId} 1 ${displayData}`); entity.nameTag = `${displayName}`; if (currentItem.display.foil) { entity.runCommandAsync(`enchant @s unbreaking`); } } } catch (err) { // console.warn(err); } entity.runCommandAsync(`playsound note.banjo @a ~~~`); const remaining = totalItems - index; if (remaining >= totalItems * 2 / 3) { delay = baseDelay; } else if (remaining >= totalItems / 3) { delay = baseDelay * 1.5; } else { delay = baseDelay * 3; } } if (index < totalItems) system.run(animate); }); }
// function distributeReward(rewardList, crateEntity, crateType, playerName) {
//   const shuffledRewards = shuffleArray(rewardList);
//   let totalWeight = 0;
//   for (const reward of shuffledRewards) { totalWeight += reward.chance; }
//   let randomThreshold = Math.floor(Math.random() * totalWeight) + 1;
//   for (const reward of shuffledRewards) {
//     if (randomThreshold <= reward.chance && randomThreshold > 0) {
//       const chancePercentage = Math.round((1000 * (reward.chance / totalWeight))) / 10;
//       if (!reward.commands && reward.id) {
//         let quantity = 1;
//         const dataValue = reward.data || 0;
//         if (reward.amount) {
//           if (Array.isArray(reward.amount)) {
//             let [minAmount, maxAmount] = reward.amount;
//             if (minAmount > maxAmount) [minAmount, maxAmount] = [maxAmount, minAmount];
//             quantity = Math.floor(minAmount + Math.floor(Math.pow(Math.random(), 1.2) * (maxAmount - minAmount + 1)));
//           } else {
//             quantity = typeof reward.amount === "number" ? reward.amount : parseInt(reward.amount) || 1;
//           }
//         }
//         crateEntity.runCommandAsync(`replaceitem entity @s slot.inventory 0 ${reward.id} ${quantity} ${dataValue}`);
//         const crateInv = crateEntity.getComponent("inventory").container;
//         crateEntity.runCommandAsync(`replaceitem entity @s slot.weapon.mainhand 0 ${reward.id} ${quantity} ${dataValue}`);
//         system.runTimeout(() => {
//           let itemStack = crateInv.getItem(0);
//           crateInv.setItem(0, itemStack);
//           let item = crateInv.getItem(0);
//           item.nameTag = "§r§f" + reward.name + "§r";
//           const loreLines = reward.lore || [];
//           item.setLore(loreLines);
//           if (reward.hasEnchantment) {
//             crateEntity.runCommandAsync(`enchant @s unbreaking`);
//             let enchantInfo = reward.hasEnchantment;
//             let enchantProp = enchantInfo.enchantment;
//             let enchantCount = enchantInfo.enchantAmount;
//             let enchantLevel = enchantInfo.level;
//             if (enchantProp) {
//               let selectedEnchantments = [];
//               if (Array.isArray(enchantProp)) {
//                 for (let i = 0; i < enchantCount; i++) { selectedEnchantments.push(enchantProp[Math.floor(Math.random() * enchantProp.length)]); }
//               } else if (typeof enchantProp === "string") {
//                 const typeKey = enchantProp.toLowerCase();
//                 const typeEnchants = enchantmentMap[typeKey] || any;
//                 for (let i = 0; i < enchantCount; i++) { selectedEnchantments.push(typeEnchants[Math.floor(Math.random() * typeEnchants.length)]); }
//               }
//               for (let ench of selectedEnchantments) {
//                 let maxAllowed = ench[1];
//                 if (enchantLevel) {
//                   if (Array.isArray(enchantLevel)) {
//                     const [minLevel, maxLevel] = enchantLevel;
//                     enchantLevel = maxAllowed < maxLevel ? Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel : Math.floor(Math.random() * (maxAllowed - minLevel + 1)) + minLevel;
//                   } else { enchantLevel = typeof enchantLevel === "number" ? enchantLevel : parseInt(enchantLevel) || 1; }
//                 } else { enchantLevel = 1; }
//                 try {
//                   const enchantInstance = new Enchantment(ench[0], enchantLevel);
//                   let enchants = item.getComponent("enchantments").enchantments;
//                   enchants.addEnchantment(enchantInstance);
//                   item.getComponent("enchantments").enchantments = enchants;
//                 } catch (err) { break; }
//               }
//             }
//           }
//           crateEntity.nameTag = `§6${quantity}§rx §e${reward.name}§r`;
//           crateEntity.runCommandAsync(`particle minecraft:totem_particle ~~1.2~`);
//           crateInv.setItem(0, item);
//           const resetTimeout = system.runTimeout(() => {
//             crateEntity.runCommandAsync(`playsound random.pop2 @a ~~1.5~`);
//             crateEntity.runCommandAsync(`particle minecraft:dragon_destroy_block ~~1.5~`);
//             crateEntity.runCommandAsync(`replaceitem entity @s slot.inventory 0 air`);
//             crateEntity.triggerEvent(`leaf:event2.5`);
//             system.clearRun(checkInterval);
//           }, 12000);
//           const checkInterval = system.runInterval(() => {
//             for (const player of world.getPlayers({ name: playerName })) {
//               crateEntity.dimension.spawnItem(item, player.location);
//               player.runCommandAsync(`tellraw @a[name=!"${player.name}"] {"rawtext":[{"text":" §f${player.name}§7 received a §e${reward.name}§r§7 from §f${crateType}§r§7!"}]}`);
//               player.sendMessage(` Congratulations! You obtained §6${quantity}§rx §e${reward.name}§r from ${crateType} (Chance: §f${chancePercentage}%§7)!`);
//               system.runTimeout(() => {
//                 crateEntity.runCommandAsync(`playsound random.pop2 @a ~~1.5~`);
//                 crateEntity.runCommandAsync(`particle minecraft:dragon_destroy_block ~~1.5~`);
//                 crateEntity.runCommandAsync(`replaceitem entity @s slot.inventory 0 air`);
//                 crateEntity.triggerEvent(`leaf:event2.5`);
//               }, 70);
//               system.clearRun(checkInterval);
//               system.clearRun(resetTimeout);
//             }
//           }, 10);
//         }, 1);
//       } else {
//         const rewardName = reward.display.name || "Reward";
//         const rewardMsg = reward.display.message || `Congratulations! You received §e${rewardName}§r from ${crateType} (Chance: §f${chancePercentage}%§7)!`;
//         const displayItem = reward.display.item || "minecraft:command_block";
//         const displayData = reward.display.data || 0;
//         const foil = reward.display.foil || false;
//         crateEntity.nameTag = `§f${rewardName}§r`;
//         crateEntity.runCommandAsync(`replaceitem entity @s slot.weapon.mainhand 0 ${displayItem} 1 ${displayData}`);
//         crateEntity.runCommandAsync(`particle minecraft:totem_particle ~~1.2~`);
//         if (foil) crateEntity.runCommandAsync(`enchant @s unbreaking`);
//         const resetCmdTimeout = system.runTimeout(() => {
//           crateEntity.runCommandAsync(`playsound random.pop2 @a ~~1.5~`);
//           crateEntity.runCommandAsync(`particle minecraft:dragon_destroy_block ~~1.5~`);
//           crateEntity.triggerEvent(`leaf:event2.5`);
//           system.clearRun(customCmdInterval);
//         }, 12000);
//         const customCmdInterval = system.runInterval(() => {
//           for (const player of world.getPlayers({ name: playerName })) {
//             try {
//               if (Array.isArray(reward.commands)) {
//               }
//             } catch (err) {}
//           }
//         }, 10);
//       }
//       return;
//     }
//     randomThreshold -= reward.chance;
//   }
// }
// export const sword = [
//   ["sharpness", 5],
//   ["smite", 5],
//   ["bane_of_arthropods", 5],
//   ["fire_aspect", 2],
//   ["knockback", 2],
//   ["looting", 3],
//   ["sweeping_edge", 3],
//   ["unbreaking", 3],
//   ["mending", 1],
//   ["curse_of_vanishing", 1]
// ];
// export const bow = [
//   ["power", 5],
//   ["punch", 2],
//   ["flame", 1],
//   ["infinity", 1],
//   ["unbreaking", 3],
//   ["mending", 1],
//   ["curse_of_vanishing", 1]
// ];
// export const crossbow = [
//   ["quick_charge", 3],
//   ["multishot", 1],
//   ["piercing", 4],
//   ["unbreaking", 3],
//   ["mending", 1],
//   ["curse_of_vanishing", 1]
// ];
// export const trident = [
//   ["impaling", 5],
//   ["channeling", 1],
//   ["riptide", 3],
//   ["loyalty", 3],
//   ["unbreaking", 3],
//   ["mending", 1],
//   ["curse_of_vanishing", 1]
// ];
// export const axe = [
//   ["sharpness", 5],
//   ["smite", 5],
//   ["bane_of_arthropods", 5],
//   ["efficiency", 5],
//   ["unbreaking", 3],
//   ["fortune", 3],
//   ["silk_touch", 1],
//   ["mending", 1],
//   ["curse_of_vanishing", 1]
// ];
// export const shield = [
//   ["unbreaking", 3],
//   ["mending", 1],
//   ["curse_of_vanishing", 1]
// ];
// export const mace = [
//   ["sharpness", 5],
//   ["smite", 5],
//   ["bane_of_arthropods", 5],
//   ["knockback", 2],
//   ["looting", 3],
//   ["unbreaking", 3],
//   ["mending", 1],
//   ["curse_of_vanishing", 1]
// ];
// export const any = [];
// export const armor = [];
// export const uniqueEnchantments = {
//   density: ["density", 1],
//   breach: ["breach", 1],
//   windBurst: ["wind_burst", 1]
// };
// export const pickaxe = [];
// export const hoe = [];
// export const shovel = [];
// export const fishingrod = [];
