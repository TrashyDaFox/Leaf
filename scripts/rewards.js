const rewardnames = {

  //change these if you want to rename the droplist in setting up crates for easier navigation
    set1_name: "Common Rewards", 
    set2_name: "Rare Rewards",
    set3_name: "Legendary Rewards",
    set4_name: "Reward 4",
    set5_name: "Reward 5",
    set6_name: "Reward 6",
    set7_name: "Reward 7",
    set8_name: "Reward 8",
    set9_name: "Reward 9",
    set10_name: "Reward 10"
  
  }
  
  const keynames = {
  
    //change these to rename the keys
      key1_name: "Common Crate Key", 
      key2_name: "Rare Crate Key",
      key3_name: "Legendary Crate Key",
      key4_name: "Crate Key 4",
      key5_name: "Crate Key 5",
      key6_name: "Crate Key 6",
      key7_name: "Crate Key 7",
      key8_name: "Crate Key 8",
      key9_name: "Crate Key 9",
      key10_name: "Crate Key 10"
    
    }
  
  
  const set1 = [
    { //*ITEM-ONLY REWARD*//
      name: "§fIron Ore§r",       //required! for item display name
      id: "minecraft:iron_ore",   //required! item identifier 
      data: 0,                    //optional~ || Default is 0
      amount: [1, 16],            //optional~ min and max amount, can be an integer (eg. amount: 1) || Default is 1
      lore: [`line 1 of lore`,`line 2 of lore`, `and so on`], //optional~ for adding lore to the item
      chance: 80                  ////required! defines the chance of getting the item (not percentage) the higher the more likely to get. If you want this to be the percentage, make sure all the chance of each rewards will equal to 100
    },
    {
      //*COMMAND-ONLY REWARD*//
      commands: [ 
        "give @s dirt 64",          //put your commands here
        "say I got Dirts!",         //put your commands here
        "summon fireworks_rocket"   //put your commands here
      ],
      chance: 100,                  //required! defines the chance of getting the command (not percentage) the higher the more likely to get.
      display: {
        name: "Dirt",  // for displaying the reward name in the reward display
        message: "Better Luck next time!", // for displaying message in chat
        item: "minecraft:dirt",         // item identifier 
        data: 0,                    //optional~ || Default is 0
        foil: false          //optional~ if you want the item in display to have enchantment glint || Default is False
      }
    },
    {
      //*ITEM-WITH-COMMANDS REWARD*//
      name: "§fCoal§r",       //required! for item display name
      id: "minecraft:coal",   //required! item identifier 
      data: 0,                //optional~ || Default is 0
      amount: [1, 64],        //optional~ min and max amount, can be an integer (eg. amount: 1) || Default is 1
      lore: [`line 1 of lore`,`line 2 of lore`, `and so on`],             //optional~ for adding lore to the item
      includeCommands: [`summon chicken`,`playsound random.levelup @s`],  //optional~ if you want to add commands to your item
      chance: 100            //required! defines the chance of getting the item (not percentage) the higher the more likely to get. If you want this to be the percentage, make sure all the chance of each rewards will equal to 100
    },
    {
      name: "§fGold Ore§r",
      id: "minecraft:gold_ore",
      amount: [1, 8],
      chance: 60
    },
    {
      chance: 100,
      commands: ["give @s je:key1"],
      display: {
        name: "Crate Key",
        message: "§fCONGRATS! YOU GOT A KEY!§r",
        item: "je:key1"
      }
    },
    {
      name: "§fRedstone Dust§r",
      id: "minecraft:redstone",
      amount: [1, 32],
      chance: 50
    },
    {
      name: "§fLapis Lazuli§r",
      id: "minecraft:dye",
      data: 4,
      amount: [1, 16],
      chance: 40
    },
    {
      name: "§fIron Ingot§r",
      id: "minecraft:iron_ingot",
      amount: [1, 8],
      chance: 30
    },
    {
      name: "§fGold Ingot§r",
      id: "minecraft:gold_ingot",
      amount: [1, 4],
      chance: 20
    },
    {
      name: "§fBucket§r",
      id: "minecraft:bucket",
      amount: 1,
      chance: 10
    },
    {
      name: "§fBread§r",
      id: "minecraft:bread",
      amount: [1, 8],
      chance: 5
    },
    {
      name: "§fLeather§r",
      id: "minecraft:leather",
      amount: [1, 4],
      chance: 5
    }
  ]
  
  
  
  
  
  
  
  //Rewards Set #2
  const set2 = [
    {
      name: "§7Coal§r", //required! for item display name
      id: "minecraft:coal", //required! item identifier 
      data: 0, //optional~ || Default is 0
      amount: [20, 64], //optional~ min and max amount, can be an integer (eg. amount: 1) || Default is 1
      chance: 30 //required! defines the chance of getting the item (not percentage) the higher the more likely to get. If you want this to be the percentage, make sure all the chance of each rewards will equal to 100
    },
    {
      name: "§eGolden Apple§r",
      id: "minecraft:golden_apple",
      amount: 1,
      chance: 5
    },
    {
      name: "§eGold Ingot§r",
      id: "minecraft:gold_ingot",
      amount: [1,20],
      chance: 27
  
    },
    {
      name: "§bDiamond§r",
      id: "minecraft:diamond",
      amount: [1, 3],
      chance: 20
    },
    {
      name: "§fIron Ingot§r",
      id: "minecraft:iron_ingot",
      amount: [1, 32],
      chance: 25
    },
    {
      name: "§bEmerald§r",
      id: "minecraft:emerald",
      amount: [1, 16],
      chance: 15
    },
    {
      name: "§6Netherite Ingot§r",
      id: "minecraft:netherite_ingot",
      amount: 1,
      chance: 4
    }
  ]
  
  
  
  
  
  
  
  //Rewards Set #3
  const set3 = [
    {
      name: "§6Dirty Wooden Axe",
      id: "minecraft:wooden_axe",
      chance: 1
    },
    {
      name: "§6Weak Wooden Sword",
      id: "minecraft:wooden_sword",
      chance: 1
    },
    {
      name: "§dSuperior Netherite Sword",
      id: "minecraft:netherite_sword",
      data: 0,
      amount: 1, //ignored if the item has enchant
      chance: 1,
      hasEnchantment: {
        enchantment: "sword", //type of enchantment || Default: "any"
        enchantAmount: [1, 10], //min and max amount of enchantments that the item must have, can be an integer ( eg. enchantAmount: 3 ) || Default: 1
        level: [1, 10]
      }
    },
    {
      name: "§bOP Diamond Sword",
      id: "minecraft:diamond_sword",
      data: 0,
      amount: 1, //ignored if the item has enchant
      chance: 1,
      hasEnchantment: {
        enchantment: "sword", //type of enchantment || Default: "any"
        enchantAmount: [1, 5], //min and max amount of enchantments that the item must have, can be an integer ( eg. enchantAmount: 3 ) || Default: 1
        level: [1, 5]
      }
    },
    {
      name: "§cFlaming Iron Sword",
      id: "minecraft:iron_sword",
      data: 0,
      amount: 1,
      chance: 1,
      hasEnchantment: {
        enchantment: "fire aspect",
        enchantAmount: 20,
        level: 5
      }
    },
    {
      name: "§3Enchanted Book",
      id: "minecraft:enchanted_book",
      data: 0,
      amount: 1,
      chance: 1,
      hasEnchantment: {
        enchantment: "armor",
        enchantAmount: 5,
        level: 1
      }
    },
    {
      name: "§eLucky Chestplate",
      id: "minecraft:diamond_chestplate",
      data: 0,
      amount: 1,
      chance: 1,
      hasEnchantment: {
        enchantment: "armor",
        enchantAmount: 5,
        level: 1
      }
    },
    {
      name: "§9Block Of Diamond",
      id: "minecraft:diamond_block",
      amount: [1,64],
      chance: 1
    }
  ]
  
  
  
  
  
  //Rewards Set #4
  const set4 = [
  
    // {
    //   name: "Example Format",
    //   id: "minecraft:id",
    //   chance: 50
    // },
  
    // {
    //   name: "This is an Example Format",
    //   id: "minecraft:id",
    //   data: 0,
    //   amount: [/*min, max*/],
    //   chance: 100,
    //   hasEnchantment: {
    //     enchantment: "any",
    //     enchantAmount: [/*min, max*/],
    //     level: [/*min, max*/]
    //   }
    // }
  
  ]
  
  
  
  
  
  //Rewards Set #5
  const set5 = [
  
    //put your items here
  
  ]
  
  
  
  
  
  //Rewards Set #6
  const set6 = [
  
    //put your items here
  
  ]
  
  
  
  
  
  
  
  //Rewards Set #7
  const set7 = [
  
    //put your items here
  
  ]
  
  
  
  
  
  
  
  //Rewards Set #8
  const set8 = [
  
    //put your items here
  
  ]
  
  
  
  
  
  
  //Rewards Set #9
  const set9 = [
  
    //put your items here
  
  ]
  
  
  
  
  
  
  //Rewards Set #10
  const set10 = [
  
    //put your items here
  
  ]
  
  
  
  
  
  
  
  
  
  
  
  
  
  export { set1, set2, set3, set4, set5, set6, set7, set8, set9, set10, rewardnames, keynames }
  