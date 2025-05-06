import React, { useState } from "react";

const ENEMIES_BASE = [
  { name: "Slime", hp: 30, attack: 5, xp: 5, gold: 3 },
  { name: "Goblin", hp: 45, attack: 8, xp: 8, gold: 6 },
  { name: "Orc", hp: 60, attack: 12, xp: 12, gold: 10 },
];
const BOSS_BASE = { name: "Boss Ogre", hp: 120, attack: 18, xp: 40, gold: 25, boss: true };

function scaleEnemy(enemy, level) {
  // Scale HP, attack, xp, gold by level
  return {
    ...enemy,
    hp: Math.round(enemy.hp * (1 + (level - 1) * 0.5)),
    attack: Math.round(enemy.attack * (1 + (level - 1) * 0.3)),
    xp: Math.round(enemy.xp * (1 + (level - 1) * 0.7)),
    gold: Math.round(enemy.gold * (1 + (level - 1) * 0.7)),
  };
}

function scaleBoss(boss, level) {
  return {
    ...boss,
    hp: Math.round(boss.hp * (1 + (level - 1) * 0.8)),
    attack: Math.round(boss.attack * (1 + (level - 1) * 0.5)),
    xp: Math.round(boss.xp * (1 + (level - 1) * 1.0)),
    gold: Math.round(boss.gold * (1 + (level - 1) * 1.0)),
  };
}

const SPELLS = {
  // --- Mage ---
  Fireball: {
    name: "Fireball",
    dmg: (player, boost) => Math.round((30 + player.level * 4) * (boost ? 1.25 : 1)),
    cooldown: 5,
    desc: "Big fire damage! (5 attacks cooldown)",
    classType: "Mage"
  },
  "Ice Shard": {
    name: "Ice Shard",
    dmg: (player, boost) => Math.round((20 + player.level * 3) * (boost ? 1.25 : 1)),
    cooldown: 3,
    desc: "A sharp blast of ice. Short cooldown.",
    classType: "Mage"
  },
  "Lightning Bolt": {
    name: "Lightning Bolt",
    dmg: (player, boost) => Math.round((40 + player.level * 5) * (boost ? 1.25 : 1)),
    cooldown: 7,
    desc: "A powerful bolt of lightning. Long cooldown.",
    classType: "Mage"
  },
  "Heal": {
    name: "Heal",
    dmg: () => 0,
    cooldown: 6,
    heal: (player, boost) => Math.round((30 + player.level * 5) * (boost ? 1.25 : 1)),
    desc: "Restore your own health. (6 attacks cooldown)",
    classType: "Mage"
  },
  "Arcane Nova": {
    name: "Arcane Nova",
    dmg: (player, boost) => Math.round((50 + player.level * 6) * (boost ? 1.25 : 1)),
    cooldown: 8,
    desc: "Massive arcane damage to all foes.",
    classType: "Mage"
  },
  "Frost Barrier": {
    name: "Frost Barrier",
    dmg: () => 0,
    cooldown: 6,
    shield: (player, boost) => Math.round((20 + player.level * 3) * (boost ? 1.25 : 1)),
    desc: "Gain a shield that absorbs damage.",
    classType: "Mage"
  },
  "Mana Surge": {
    name: "Mana Surge",
    dmg: () => 0,
    cooldown: 8,
    buff: true,
    desc: "Increase spell damage for next 2 turns.",
    classType: "Mage"
  },
  // --- Warrior ---
  Strike: {
    name: "Strike",
    dmg: (player, boost) => Math.round((10 + player.level * 2) * (boost ? 1.25 : 1)),
    cooldown: 0,
    desc: "Basic attack",
    classType: "Warrior"
  },
  "Double Strike": {
    name: "Double Strike",
    dmg: (player, boost) => 2 * Math.round((8 + player.level * 2) * (boost ? 1.25 : 1)),
    hits: 2,
    cooldown: 4,
    desc: "Strike twice in quick succession. (4 attacks cooldown)",
    classType: "Warrior"
  },
  "Shield Bash": {
    name: "Shield Bash",
    dmg: (player, boost) => Math.round((25 + player.level * 3) * (boost ? 1.25 : 1)),
    cooldown: 6,
    desc: "Damage and reduce next enemy attack.",
    classType: "Warrior"
  },
  "Power Slam": {
    name: "Power Slam",
    dmg: (player, boost) => Math.round((35 + player.level * 4) * (boost ? 1.25 : 1)),
    cooldown: 6,
    desc: "Heavy blow. Extra damage if enemy is stunned.",
    classType: "Warrior"
  },
  "Whirlwind": {
    name: "Whirlwind",
    dmg: (player, boost) => Math.round((18 + player.level * 2) * (boost ? 1.25 : 1)),
    cooldown: 5,
    desc: "Hits all enemies.",
    classType: "Warrior"
  },
  "Battle Cry": {
    name: "Battle Cry",
    dmg: () => 0,
    cooldown: 8,
    buff: true,
    desc: "Increase own damage for next 2 turns.",
    classType: "Warrior"
  },
  // --- Rogue ---
  "Poison Dagger": {
    name: "Poison Dagger",
    dmg: (player, boost) => Math.round((18 + player.level * 2) * (boost ? 1.25 : 1)),
    cooldown: 5,
    desc: "Damage and poison enemy over time.",
    classType: "Rogue"
  },
  "Shadowstep": {
    name: "Shadowstep",
    dmg: (player, boost) => Math.round((22 + player.level * 3) * (boost ? 1.25 : 1)),
    cooldown: 5,
    desc: "Attack and dodge next hit.",
    classType: "Rogue"
  },
  "Backstab": {
    name: "Backstab",
    dmg: (player, boost) => Math.round((36 + player.level * 4) * (boost ? 1.25 : 1)),
    cooldown: 7,
    desc: "Extra damage if enemy is debuffed.",
    classType: "Rogue"
  },
  "Evasion": {
    name: "Evasion",
    dmg: () => 0,
    cooldown: 8,
    buff: true,
    desc: "Greatly increase dodge chance for 2 turns.",
    classType: "Rogue"
  },
  "Fan of Knives": {
    name: "Fan of Knives",
    dmg: (player, boost) => Math.round((14 + player.level * 2) * (boost ? 1.25 : 1)),
    cooldown: 4,
    desc: "Hits all enemies with blades.",
    classType: "Rogue"
  },
  "Smoke Bomb": {
    name: "Smoke Bomb",
    dmg: () => 0,
    cooldown: 10,
    buff: true,
    desc: "Escape and avoid all attacks next turn.",
    classType: "Rogue"
  }
};

function CombatScreen({ player, setPlayer, level, setLevel }) {
  const [wave, setWave] = useState(0);
  // Use scaled enemies
  const getEnemy = (wave, level) => scaleEnemy(ENEMIES_BASE[wave], level);
  const getBoss = (level) => scaleBoss(BOSS_BASE, level);
  const [enemy, setEnemy] = useState(getEnemy(0, level));
  const [playerHp, setPlayerHp] = useState(player.hp);
  const [enemyHp, setEnemyHp] = useState(enemy.hp);
  const [message, setMessage] = useState("");
  // Track cooldowns: {spell: turns since last use}
  const [spellCooldowns, setSpellCooldowns] = useState({});
  // Track total attacks for cooldown logic
  const [attackCount, setAttackCount] = useState(0);

  React.useEffect(() => {
    // New wave or boss
    if (wave < ENEMIES_BASE.length) {
      const e = getEnemy(wave, level);
      setEnemy(e);
      setEnemyHp(e.hp);
    } else {
      const boss = getBoss(level);
      setEnemy(boss);
      setEnemyHp(boss.hp);
    }
    setMessage("");
    setAttackCount(0);
    // (Do NOT reset spellCooldowns here; cooldowns persist across waves/levels)
    // eslint-disable-next-line
  }, [wave, level]);

  // Use a spell (including basic attack)
  const useSpell = (spellName) => {
    const spell = SPELLS[spellName];
    if (!spell) return;
    // Check cooldown
    if (spell.cooldown && (spellCooldowns[spellName] ?? spell.cooldown) < spell.cooldown) return;
    let dmg = spell.dmg(player);
    let newEnemyHp = enemyHp;
    let msg = "";
    if (spellName === "Heal") {
      // Special Heal branch: handle enemy attack and return early so no normal enemy attack is triggered

      // Heal spell: restore HP, cannot exceed maxHp
      const healAmt = SPELLS.Heal.heal(player);
      const healed = Math.min(playerHp + healAmt, player.maxHp);
      const healedAmount = healed - playerHp;
      // Apply heal first
      setPlayerHp(healed);
      setMessage(`You cast Heal and restore ${healedAmount} HP!`);
      // Update cooldowns: increment all, reset used
      setSpellCooldowns((cds) => {
        const next = { ...cds };
        player.spells.forEach((s) => {
          if (s === spellName) next[s] = 1; // Set to 1 so cooldown starts now
          else next[s] = (next[s] ?? SPELLS[s]?.cooldown ?? 0) + 1;
        });
        return next;
      });
      setTimeout(() => {
        setPlayerHp(current => {
          const afterEnemyHp = current - enemy.attack;
          setMessage(`${enemy.name} hits you for ${enemy.attack}!`);
          if (afterEnemyHp <= 0) {
            setMessage("You died! Restarting level...");
            setTimeout(() => {
              setWave(0);
              setPlayerHp(player.maxHp);
              setPlayer((p) => ({ ...p, hp: p.maxHp }));
            }, 1200);
          }
          return afterEnemyHp;
        });
      }, 600);
      msg = `You cast Heal and restore ${healedAmount} HP!`;
      return; // Prevent normal enemy attack from firing after Heal
    } else if (spellName === "Double Strike") {
      // Double Strike: two hits
      const hit = 8 + player.level * 2;
      newEnemyHp = enemyHp - hit;
      if (newEnemyHp > 0) newEnemyHp -= hit;
      setEnemyHp(newEnemyHp);
      msg = `You use Double Strike for ${hit} + ${hit} damage!`;
    } else {
      newEnemyHp = enemyHp - dmg;
      setEnemyHp(newEnemyHp);
      msg = `You cast ${spellName} for ${dmg} damage!`;
    }
    setMessage(msg);
    // Update cooldowns: increment all, reset used
    setSpellCooldowns((cds) => {
      const next = { ...cds };
      player.spells.forEach((s) => {
        if (s === spellName) next[s] = 1; // Set to 1 so cooldown starts now
        else next[s] = (next[s] ?? SPELLS[s]?.cooldown ?? 0) + 1;
      });
      return next;
    });
    setAttackCount((c) => c + 1);
    if (newEnemyHp <= 0) {
      if (enemy.boss) {
        setMessage("You defeated the boss! Next level unlocked!");
        setPlayer((p) => ({ ...p, xp: p.xp + enemy.xp, gold: p.gold + enemy.gold }));
        setLevel(level + 1);
        setWave(0);
      } else {
        setPlayer((p) => ({ ...p, xp: p.xp + enemy.xp, gold: p.gold + enemy.gold }));
        setWave(wave + 1);
      }
    } else {
      setTimeout(enemyAttack, 400);
    }
  };




  const enemyAttack = () => {
    let newPlayerHp = playerHp - enemy.attack;
    setPlayerHp(newPlayerHp);
    setMessage(`${enemy.name} hits you for ${enemy.attack}!`);
    if (newPlayerHp <= 0) {
      setMessage("You died! Restarting level...");
      setTimeout(() => {
        setWave(0);
        setPlayerHp(player.maxHp);
        setPlayer((p) => ({ ...p, hp: p.maxHp }));
      }, 1200);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 12, background: '#222', borderRadius: 10 }}>
      {/* Stage/Level Counter */}
      <div style={{ background: '#444', color: '#fff', fontWeight: 'bold', fontSize: 20, textAlign: 'center', padding: 8, borderRadius: 8, marginBottom: 12 }}>
        Stage: {level}
      </div>
      {/* Player Stats */}
      <div style={{ background: '#111', padding: 10, borderRadius: 8, marginBottom: 16, color: '#ffd700' }}>
        <div><strong>Level:</strong> {player.level}</div>
        <div><strong>HP:</strong> {playerHp} / {player.maxHp}</div>
        <div><strong>Gold:</strong> <span style={{ color: '#ffe066' }}>{player.gold}</span></div>
        <div><strong>XP:</strong> <span style={{ color: '#8ef' }}>{player.xp}</span></div>
        <div><strong>Spells:</strong> {player.spells.join(', ')}</div>
      </div>

      {/* Enemy Stats */}
      <div style={{ background: '#333', padding: 10, borderRadius: 8, marginBottom: 16, color: '#fa8072' }}>
        <div><strong>{enemy.name}</strong></div>
        <div>HP: {enemyHp} / {enemy.hp}</div>
        <div>ATK: {enemy.attack}</div>
      </div>

      {/* Spell/Attack Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {player.spells.map((spellName) => {
          const spell = SPELLS[spellName];
          if (!spell) return null;
          const cooldown = spell.cooldown;
          const turnsSince = spellCooldowns[spellName] || cooldown;
          const isReady = cooldown === 0 || turnsSince >= cooldown;
          // Determine if spell is boosted by companion
          const hasCompanion = (player.companions || []).some(c => (spell.classType && c.toLowerCase().includes(spell.classType.toLowerCase())));
          let effectText = '';
          if (spellName === 'Heal') {
            effectText = `Heal: +${spell.heal(player, hasCompanion)}${hasCompanion ? ' (boosted)' : ''}`;
          } else if (spellName === 'Double Strike') {
            const hit = spell.dmg ? spell.dmg(player, hasCompanion) / 2 : 8 + player.level * 2;
            effectText = `Damage: ${hit} + ${hit}${hasCompanion ? ' (boosted)' : ''}`;
          } else {
            effectText = `Damage: ${spell.dmg(player, hasCompanion)}${hasCompanion ? ' (boosted)' : ''}`;
          }
          return (
            <button
              key={spellName}
              onClick={() => isReady && useSpell(spellName)}
              disabled={!isReady || playerHp <= 0 || enemyHp <= 0}
              title={spell.desc}
              style={{ minWidth: 130, fontWeight: spellName === 'Strike' ? 'normal' : 'bold', background: isReady ? '#3b82f6' : '#555', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <div style={{ fontWeight: 'bold' }}>{spellName} <span style={{fontSize:11, color:'#aaa'}}>({spell.classType})</span></div>
              <div style={{ fontSize: 12 }}>{effectText}</div>
              <div style={{ fontSize: 12 }}>
                CD: {cooldown} {cooldown > 0 && !isReady && `(Ready in ${cooldown - turnsSince})`}
              </div>
            </button>
          );
        })}
      </div>
      {/* Show companions */}
      {player.companions && player.companions.length > 0 && (
        <div style={{marginBottom:12, color:'#bff', fontWeight:'bold'}}>
          Companions: {player.companions.join(', ')}
        </div>
      )}

      {/* Message/Results */}
      <div style={{ minHeight: 40, background: '#111', borderRadius: 6, padding: 8, marginBottom: 12, color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
        {message}
      </div>
    </div>
  );
}

export default CombatScreen;
