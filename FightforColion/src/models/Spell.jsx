export class Spell {
    constructor({ name, baseDamage = 0, baseHeal = 0, baseShield = 0, buff = false, cooldown = 0, classType = '', hits = 1 }) {
      this.name = name;
      this.baseDamage = baseDamage;
      this.baseHeal = baseHeal;
      this.baseShield = baseShield;
      this.buff = buff;
      this.cooldown = cooldown;
      this.classType = classType;
      this.hits = hits;
    }
  
    calculateDamage(playerLevel, boosted = false) {
      const multiplier = boosted ? 1.25 : 1;
      return Math.round((this.baseDamage + playerLevel * 2) * multiplier) * this.hits;
    }
  
    calculateHeal(playerLevel, boosted = false) {
      const multiplier = boosted ? 1.25 : 1;
      return Math.round((this.baseHeal + playerLevel * 5) * multiplier);
    }
  
    calculateShield(playerLevel, boosted = false) {
      const multiplier = boosted ? 1.25 : 1;
      return Math.round((this.baseShield + playerLevel * 3) * multiplier);
    }
  }
  