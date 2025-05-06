export const SPELLS = {
    // Mage Spells
    Fireball: { name: "Fireball", baseDamage: 30, cooldown: 5, classType: "Mage", desc: "Big fire damage! (5 attacks cooldown)", cost: 100 },
    "Ice Shard": { name: "Ice Shard", baseDamage: 20, cooldown: 3, classType: "Mage", desc: "A sharp blast of ice. Short cooldown.", cost: 75 },
    "Lightning Bolt": { name: "Lightning Bolt", baseDamage: 40, cooldown: 7, classType: "Mage", desc: "A powerful bolt of lightning. Long cooldown.", cost: 125 },
    Heal: { name: "Heal", baseHeal: 30, cooldown: 6, classType: "Mage", desc: "Restore your own health. (6 attacks cooldown)", cost: 90 },
    "Arcane Nova": { name: "Arcane Nova", baseDamage: 50, cooldown: 8, classType: "Mage", desc: "Massive arcane damage to all foes.", cost: 150 },
    "Frost Barrier": { name: "Frost Barrier", baseShield: 20, cooldown: 6, classType: "Mage", desc: "Gain a shield that absorbs damage.", cost: 110 },
    "Mana Surge": { name: "Mana Surge", buff: true, cooldown: 8, classType: "Mage", desc: "Increase spell damage for next 2 turns.", cost: 120 },
   
    // Warrior Spells
    Strike: { name: "Strike", baseDamage: 10, cooldown: 0, classType: "Warrior", desc: "Basic attack.", cost: 50 },
    "Double Strike": { name: "Double Strike", baseDamage: 16, hits: 2, cooldown: 4, classType: "Warrior", desc: "Strike twice in quick succession. (4 attacks cooldown)", cost: 80 },
    "Shield Bash": { name: "Shield Bash", baseDamage: 25, cooldown: 6, classType: "Warrior", desc: "Damage and reduce next enemy attack.", cost: 100 },
    "Power Slam": { name: "Power Slam", baseDamage: 35, cooldown: 6, classType: "Warrior", desc: "Heavy blow. Extra damage if enemy is stunned.", cost: 120 },
    Whirlwind: { name: "Whirlwind", baseDamage: 18, cooldown: 5, classType: "Warrior", desc: "Hits all enemies.", cost: 90 },
    "Battle Cry": { name: "Battle Cry", buff: true, cooldown: 8, classType: "Warrior", desc: "Increase own damage for next 2 turns.", cost: 110 },
   
    // Rogue Spells
    "Poison Dagger": { name: "Poison Dagger", baseDamage: 18, cooldown: 5, classType: "Rogue", desc: "Damage and poison enemy over time.", cost: 85 },
    Shadowstep: { name: "Shadowstep", baseDamage: 22, cooldown: 5, classType: "Rogue", desc: "Attack and dodge next hit.", cost: 95 },
    Backstab: { name: "Backstab", baseDamage: 36, cooldown: 7, classType: "Rogue", desc: "Extra damage if enemy is debuffed.", cost: 130 },
    Evasion: { name: "Evasion", buff: true, cooldown: 8, classType: "Rogue", desc: "Greatly increase dodge chance for 2 turns.", cost: 115 },
    "Fan of Knives": { name: "Fan of Knives", baseDamage: 14, cooldown: 4, classType: "Rogue", desc: "Hits all enemies with blades.", cost: 70 },
    "Smoke Bomb": { name: "Smoke Bomb", buff: true, cooldown: 10, classType: "Rogue", desc: "Escape and avoid all attacks next turn.", cost: 140 },
  };