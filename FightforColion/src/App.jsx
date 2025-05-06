import React, { useState } from "react";
import CombatScreen from "./components/CombatScreen.jsx";
import UpgradeShop from "./components/UpgradeShop.jsx";
import FighterRoster from "./components/FighterRoster.jsx";
import LevelSelect from "./components/LevelSelect.jsx";

const SCREENS = {
  COMBAT: "combat",
  SHOP: "shop",
  ROSTER: "roster",
  LEVEL: "level",
};

function App() {
  const [screen, setScreen] = useState(SCREENS.COMBAT);
  const [level, setLevel] = useState(1);
  const [player, setPlayer] = useState({
    hp: 100,
    maxHp: 100,
    xp: 0,
    gold: 0,
    level: 1,
    spells: ["Strike"],
    fighters: ["Hero"],
    companions: [],
    equippedSpells: [],
  });

  return (
    <div className="max-w-3xl mx-auto p-4 bg-gray-900 min-h-screen text-white">
      <nav className="flex justify-around mb-6 space-x-2">
        <button
          onClick={() => setScreen(SCREENS.COMBAT)}
          className={`px-4 py-2 rounded ${
            screen === SCREENS.COMBAT
              ? "bg-yellow-500 text-black"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Fight
        </button>
        <button
          onClick={() => setScreen(SCREENS.SHOP)}
          className={`px-4 py-2 rounded ${
            screen === SCREENS.SHOP
              ? "bg-yellow-500 text-black"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Shop
        </button>
        <button
          onClick={() => setScreen(SCREENS.ROSTER)}
          className={`px-4 py-2 rounded ${
            screen === SCREENS.ROSTER
              ? "bg-yellow-500 text-black"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Fighters
        </button>
        <button
          onClick={() => setScreen(SCREENS.LEVEL)}
          className={`px-4 py-2 rounded ${
            screen === SCREENS.LEVEL
              ? "bg-yellow-500 text-black"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Levels
        </button>
      </nav>

      {screen === SCREENS.COMBAT && (
        <CombatScreen
          player={player}
          setPlayer={setPlayer}
          level={level}
          setLevel={setLevel}
        />
      )}
      {screen === SCREENS.SHOP && (
        <UpgradeShop player={player} setPlayer={setPlayer} />
      )}
      {screen === SCREENS.ROSTER && (
        <FighterRoster player={player} setPlayer={setPlayer} />
      )}
      {screen === SCREENS.LEVEL && (
        <LevelSelect level={level} setLevel={setLevel} />
      )}
    </div>
  );
}

export default App;

