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
  });

  // MVP: pass state/setters as props
  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 12 }}>
      <nav style={{ marginBottom: 16 }}>
        <button onClick={() => setScreen(SCREENS.COMBAT)}>Fight</button>
        <button onClick={() => setScreen(SCREENS.SHOP)}>Shop</button>
        <button onClick={() => setScreen(SCREENS.ROSTER)}>Fighters</button>
        <button onClick={() => setScreen(SCREENS.LEVEL)}>Levels</button>
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
