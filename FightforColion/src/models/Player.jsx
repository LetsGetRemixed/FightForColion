export class Player {
    constructor() {
      this.hp = 100;
      this.maxHp = 100;
      this.xp = 0;
      this.gold = 0;
      this.level = 1;
      this.spells = ["Strike"];
      this.fighters = ["Hero"];
      this.companions = [];
      this.equippedSpells = [];
    }
  
    heal(amount) {
      this.hp = Math.min(this.maxHp, this.hp + amount);
    }
  
    takeDamage(amount) {
      this.hp = Math.max(0, this.hp - amount);
    }
  
    earnGold(amount) {
      this.gold += amount;
    }
  
    gainXp(amount) {
      this.xp += amount;
    }
  
    addSpell(spellKey) {
      if (!this.spells.includes(spellKey)) {
        this.spells.push(spellKey);
      }
    }
  
    equipSpell(spellKey) {
      if (!this.equippedSpells.includes(spellKey) && this.equippedSpells.length < 5) {
        this.equippedSpells.push(spellKey);
      }
    }
  
    unequipSpell(spellKey) {
      this.equippedSpells = this.equippedSpells.filter(s => s !== spellKey);
    }
  
    addCompanion(name, specialSpell) {
      if (!this.companions.includes(name)) {
        this.companions.push(name);
        this.addSpell(specialSpell);
      }
    }
  } 
  