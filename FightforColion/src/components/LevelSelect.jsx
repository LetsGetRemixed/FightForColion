import React from "react";

function LevelSelect({ level, setLevel }) {
  return (
    <div>
      <h2>Select Level</h2>
      <div>
        {[1, 2, 3, 4, 5].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setLevel(lvl)}
            style={{ margin: 4, fontWeight: lvl === level ? "bold" : "normal" }}
          >
            Level {lvl}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LevelSelect;
