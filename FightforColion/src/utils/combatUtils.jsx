// Check if a spell is boosted by any companion
export const isSpellBoosted = (player, spell) => {
    if (!spell.classType || !player.companions) return false;
    return player.companions.some(comp => comp.toLowerCase().includes(spell.classType.toLowerCase()));
  };
  
  // Get cooldown status
  export const isSpellReady = (spellName, cooldownMap, spells) => {
    const spell = spells[spellName];
    if (!spell) return false;
    const turnsSince = cooldownMap[spellName] || spell.cooldown;
    return spell.cooldown === 0 || turnsSince >= spell.cooldown;
  };
  
  // Advance cooldowns
  export const advanceCooldowns = (cooldowns, usedSpell, spells) => {
    const next = { ...cooldowns };
    Object.keys(spells).forEach((s) => {
      if (s === usedSpell) {
        next[s] = 1;
      } else {
        next[s] = (next[s] ?? spells[s].cooldown) + 1;
      }
    });
    return next;
  };
  
  // Clamp a number within bounds
  export const clamp = (num, min, max) => Math.max(min, Math.min(max, num));
  
  