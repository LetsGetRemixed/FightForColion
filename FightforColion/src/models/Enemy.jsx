export class Enemy {
    constructor({ name, hp, attack, xp, gold, boss = false }) {
      this.name = name;
      this.baseHp = hp;
      this.baseAttack = attack;
      this.baseXp = xp;
      this.baseGold = gold;
      this.boss = boss;
    }
  
    scale(level) {
      const scaleFactor = this.boss ? { hp: 0.8, attack: 0.5, xp: 1.0, gold: 1.0 } : { hp: 0.5, attack: 0.3, xp: 0.7, gold: 0.7 };
      this.hp = Math.round(this.baseHp * (1 + (level - 1) * scaleFactor.hp));
      this.attack = Math.round(this.baseAttack * (1 + (level - 1) * scaleFactor.attack));
      this.xp = Math.round(this.baseXp * (1 + (level - 1) * scaleFactor.xp));
      this.gold = Math.round(this.baseGold * (1 + (level - 1) * scaleFactor.gold));
      return this;
    }
  }
  