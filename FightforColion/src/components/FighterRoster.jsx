import React from "react";

const ALL_FIGHTERS = [
  { name: "Hero", unlocked: true },
  { name: "Lyra the Mage", classType: "Mage", unlocked: false, cost: 250, specialSpell: "Arcane Nova" },
  { name: "Brak the Warrior", classType: "Warrior", unlocked: false, cost: 250, specialSpell: "Shield Bash" },
  { name: "Shade the Rogue", classType: "Rogue", unlocked: false, cost: 250, specialSpell: "Poison Dagger" },
];

function FighterRoster({ player, setPlayer }) {
  const unlockFighter = (fighter) => {
    if (player.gold >= fighter.cost && !player.fighters.includes(fighter.name)) {
      setPlayer((p) => ({
        ...p,
        gold: p.gold - fighter.cost,
        fighters: [...p.fighters, fighter.name],
        companions: [...(p.companions || []), fighter.name],
        spells: p.spells.includes(fighter.specialSpell) ? p.spells : [...p.spells, fighter.specialSpell],
      }));
    }
  };

  return (
    <div>
      <h2>Fighter Roster</h2>
      <div>Gold: {player.gold}</div>
      <ul>
        {ALL_FIGHTERS.map((f) => (
          <li key={f.name}>
            {f.name} {player.fighters.includes(f.name) ? "(Unlocked)" : `- Unlock for ${f.cost} gold`}
            {!player.fighters.includes(f.name) && f.cost && (
              <button onClick={() => unlockFighter(f)} disabled={player.gold < f.cost}>
                Unlock
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FighterRoster;
