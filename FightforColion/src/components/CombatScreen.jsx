import React, { useState, useEffect } from "react";
import { Player } from "../models/Player";
import { Enemy } from "../models/Enemy";
import { SPELLS } from "../data/spells";
import { ENEMIES, BOSS } from "../data/enemies";
import { Spell } from "../models/Spell";
import { isSpellBoosted, isSpellReady, advanceCooldowns } from "../utils/combatUtils";

const CombatScreen = ({ player, setPlayer, level, setLevel }) => {
  const [wave, setWave] = useState(0);
  const [enemy, setEnemy] = useState(new Enemy(ENEMIES[0]).scale(level));
  const [playerHp, setPlayerHp] = useState(player.hp);
  const [enemyHp, setEnemyHp] = useState(enemy.hp);
  const [message, setMessage] = useState("");
  const [spellCooldowns, setSpellCooldowns] = useState({});
  const [attackCount, setAttackCount] = useState(0);

  useEffect(() => {
    const nextEnemy = wave < ENEMIES.length ? new Enemy(ENEMIES[wave]) : new Enemy(BOSS);
    setEnemy(nextEnemy.scale(level));
    setEnemyHp(nextEnemy.hp);
    setMessage("");
    setAttackCount(0);
  }, [wave, level]);

  const useSpell = (spellName) => {
    const data = SPELLS[spellName];
    if (!data) return;

    const spell = new Spell(data);
    const boosted = isSpellBoosted(player, spell);

    if (!isSpellReady(spellName, spellCooldowns, SPELLS)) return;

    let newEnemyHp = enemyHp;
    let msg = "";

    if (spellName === "Heal") {
      const healed = Math.min(playerHp + spell.calculateHeal(player.level, boosted), player.maxHp);
      const healedAmount = healed - playerHp;
      setPlayerHp(healed);
      msg = `You cast Heal and restore ${healedAmount} HP!`;
    } else {
      const damage = spell.calculateDamage(player.level, boosted);
      newEnemyHp -= damage;
      setEnemyHp(newEnemyHp);
      msg = `You cast ${spellName} for ${damage} damage!`;
    }

    setMessage(msg);
    setSpellCooldowns(prev => advanceCooldowns(prev, spellName, SPELLS));
    setAttackCount(c => c + 1);

    if (newEnemyHp <= 0) {
      if (enemy.boss) {
        setMessage("You defeated the boss! Next level unlocked!");
        setPlayer(p => ({ ...p, xp: p.xp + enemy.xp, gold: p.gold + enemy.gold }));
        setLevel(level + 1);
        setWave(0);
      } else {
        setPlayer(p => ({ ...p, xp: p.xp + enemy.xp, gold: p.gold + enemy.gold }));
        setWave(wave + 1);
      }
    } else {
      setTimeout(() => enemyAttack(), 400);
    }
  };

  const enemyAttack = () => {
    const newHp = playerHp - enemy.attack;
    setPlayerHp(newHp);
    setMessage(`${enemy.name} hits you for ${enemy.attack}!`);
    if (newHp <= 0) {
      setMessage("You died! Restarting level...");
      setTimeout(() => {
        setWave(0);
        setPlayerHp(player.maxHp);
        setPlayer((p) => ({ ...p, hp: p.maxHp }));
      }, 1200);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-800 rounded-lg">
      <div className="bg-gray-700 text-white font-bold text-xl text-center py-2 rounded mb-4">
        Stage: {level}
      </div>

      <div className="bg-gray-900 text-yellow-300 p-4 rounded mb-4">
        <div><strong>Level:</strong> {player.level}</div>
        <div><strong>HP:</strong> {playerHp} / {player.maxHp}</div>
        <div><strong>Gold:</strong> <span className="text-yellow-400">{player.gold}</span></div>
        <div><strong>XP:</strong> <span className="text-blue-300">{player.xp}</span></div>
        <div><strong>Spells:</strong> {player.spells.join(', ')}</div>
      </div>

      <div className="bg-gray-700 text-red-300 p-4 rounded mb-4">
        <div><strong>{enemy.name}</strong></div>
        <div>HP: {enemyHp} / {enemy.hp}</div>
        <div>ATK: {enemy.attack}</div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        {player.spells.map((spellName) => {
          const spellData = SPELLS[spellName];
          if (!spellData) return null;

          const spell = new Spell(spellData);
          const boosted = isSpellBoosted(player, spell);
          const ready = isSpellReady(spellName, spellCooldowns, SPELLS);
          const damageText = spell.baseHeal
            ? `Heal: +${spell.calculateHeal(player.level, boosted)}`
            : `Damage: ${spell.calculateDamage(player.level, boosted)}`;

          return (
            <button
              key={spellName}
              onClick={() => ready && useSpell(spellName)}
              disabled={!ready || playerHp <= 0 || enemyHp <= 0}
              title={spell.desc}
              className={`min-w-[130px] p-2 flex flex-col items-center justify-center rounded text-white text-sm font-bold ${ready ? 'bg-blue-500' : 'bg-gray-600 cursor-not-allowed'}`}
            >
              <div>{spellName} <span className="text-xs text-gray-300">({spell.classType})</span></div>
              <div className="text-xs">{damageText}</div>
              <div className="text-xs">
                CD: {spell.cooldown} {spell.cooldown > 0 && !ready && `(Ready in ${spell.cooldown - (spellCooldowns[spellName] || 0)})`}
              </div>
            </button>
          );
        })}
      </div>

      {player.companions && player.companions.length > 0 && (
        <div className="mb-4 text-cyan-200 font-bold">
          Companions: {player.companions.join(', ')}
        </div>
      )}

      <div className="min-h-[40px] bg-gray-900 text-white font-bold text-center p-2 rounded">
        {message}
      </div>
    </div>
  );
};

export default CombatScreen;

