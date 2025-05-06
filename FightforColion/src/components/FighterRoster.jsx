import React from "react";
import { ALL_FIGHTERS } from "../data/fighters";

const classColors = {
  Mage: "bg-blue-600",
  Warrior: "bg-red-600",
  Rogue: "bg-green-600",
  Default: "bg-gray-700",
};

function FighterRoster({ player, setPlayer }) {
  const unlockFighter = (fighter) => {
    if (player.gold >= fighter.cost && !player.fighters.includes(fighter.name)) {
      setPlayer((p) => ({
        ...p,
        gold: p.gold - fighter.cost,
        fighters: [...p.fighters, fighter.name],
        companions: [...(p.companions || []), fighter.name],
        spells: p.spells.includes(fighter.specialSpell)
          ? p.spells
          : [...p.spells, fighter.specialSpell],
      }));
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">Fighter Roster</h2>
      <div className="mb-4 text-lg">
        <strong>Gold:</strong> <span className="text-yellow-300">{player.gold}</span>
      </div>
      <ul className="space-y-4">
        {ALL_FIGHTERS.map((f) => {
          const isUnlocked = player.fighters.includes(f.name);
          const colorClass = classColors[f.classType] || classColors.Default;

          return (
            <li
              key={f.name}
              className={`p-4 rounded shadow-md flex justify-between items-center ${colorClass}`}
            >
              <div>
                <div className="text-lg font-semibold">{f.name}</div>
                {isUnlocked ? (
                  <div className="text-yellow-300 font-bold">(Unlocked)</div>
                ) : (
                  <div className="text-sm">
                    Unlock for <span className="font-bold">{f.cost} gold</span>
                  </div>
                )}
              </div>
              {!isUnlocked && f.cost && (
                <button
                  onClick={() => unlockFighter(f)}
                  disabled={player.gold < f.cost}
                  className={`px-4 py-2 text-sm font-bold rounded ${
                    player.gold >= f.cost
                      ? "bg-yellow-400 text-black hover:bg-yellow-300"
                      : "bg-gray-500 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  Unlock
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FighterRoster;

