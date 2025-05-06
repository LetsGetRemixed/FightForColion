import React, { useEffect, useState } from "react";
import { SPELLS } from "../data/spells";
import { ALL_FIGHTERS } from "../data/fighters";
import { Spell } from "../models/Spell";

const UpgradeShop = ({ player, setPlayer }) => {
  const spellGroups = {
    Mage: Object.values(SPELLS).filter(s => s.classType === "Mage"),
    Warrior: Object.values(SPELLS).filter(s => s.classType === "Warrior"),
    Rogue: Object.values(SPELLS).filter(s => s.classType === "Rogue"),
  };

  const COMPANIONS = ALL_FIGHTERS.filter(f => f.cost && f.specialSpell);
  const classColors = {
    Mage: 'text-blue-400',
    Warrior: 'text-red-500',
    Rogue: 'text-green-400',
  };

  const [activeTab, setActiveTab] = useState('Mage');
  const tabList = ['Mage', 'Warrior', 'Rogue', 'Companions'];

  useEffect(() => {
    if (!player.equippedSpells || !Array.isArray(player.equippedSpells)) {
      setPlayer(prev => ({ ...prev, equippedSpells: prev.spells.slice(0, 5) }));
    }
  }, []);

  const isEquipped = (spellKey) => (player.equippedSpells || []).includes(spellKey);
  const canEquip = (spellKey) => !isEquipped(spellKey) && (player.equippedSpells?.length ?? 0) < 5;

  const handleEquip = (spellKey) => {
    if (canEquip(spellKey)) {
      setPlayer(prev => ({ ...prev, equippedSpells: [...(prev.equippedSpells || []), spellKey] }));
    }
  };

  const handleUnequip = (spellKey) => {
    setPlayer(prev => ({
      ...prev,
      equippedSpells: prev.equippedSpells.filter(s => s !== spellKey),
    }));
  };

  const buyUpgrade = (type, spellKey) => {
    setPlayer(prev => {
      if (type === "hp" && prev.gold >= 10) {
        return { ...prev, maxHp: prev.maxHp + 10, gold: prev.gold - 10 };
      }
      if (type === "spell") {
        const spell = SPELLS[spellKey];
        if (spell && prev.gold >= spell.cost && !prev.spells.includes(spellKey)) {
          return {
            ...prev,
            spells: [...prev.spells, spellKey],
            gold: prev.gold - spell.cost,
          };
        }
      }
      return prev;
    });
  };

  const buyCompanion = (companion) => {
    setPlayer(prev => {
      if (prev.gold >= companion.cost && !prev.companions.includes(companion.name)) {
        return {
          ...prev,
          gold: prev.gold - companion.cost,
          companions: [...(prev.companions || []), companion.name],
          spells: prev.spells.includes(companion.specialSpell)
            ? prev.spells
            : [...prev.spells, companion.specialSpell],
        };
      }
      return prev;
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-yellow-400 text-2xl font-bold">Upgrade Shop</h2>
        <div className="bg-gray-800 px-4 py-2 rounded-lg text-yellow-400 font-bold text-lg shadow-inner">
          Gold: <span>{player.gold}</span>
        </div>
      </div>

      <button
        onClick={() => buyUpgrade("hp")}
        disabled={player.gold < 10}
        className="mb-4 font-bold bg-gray-700 text-yellow-400 rounded px-4 py-2 disabled:opacity-50"
      >
        +10 Max HP (10 gold)
      </button>

      <div className="flex gap-4 mb-6 justify-center">
        {tabList.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded font-bold text-sm shadow-md transition-all duration-300 border ${activeTab === tab ? 'bg-yellow-400 text-black border-yellow-300' : 'bg-gray-800 text-gray-300 border-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab !== 'Companions' && (
        <div className="flex flex-col gap-4">
          {spellGroups[activeTab].map(spell => {
            const owned = player.spells.includes(spell.name);
            const equipped = isEquipped(spell.name);
            return (
              <div key={spell.name} className={`rounded-lg p-4 border-2 ${owned ? (equipped ? 'bg-blue-900' : 'bg-gray-800') : 'bg-gray-700'} ${equipped ? 'shadow-yellow-500 shadow-sm' : ''}`}>
                <div className={`font-bold text-lg ${classColors[activeTab]}`}>{spell.name}</div>
                <div className="text-white text-sm">{spell.desc}</div>
                <div className="text-yellow-400 text-xs">Cost: {spell.cost} gold</div>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => buyUpgrade("spell", spell.name)}
                    disabled={player.gold < spell.cost || owned}
                    className={`px-3 py-1 rounded text-white text-sm font-bold ${owned ? 'bg-gray-600 opacity-50' : 'bg-blue-500'}`}
                  >
                    {owned ? 'Owned' : `Unlock`}
                  </button>
                  {owned && (
                    equipped ? (
                      <button
                        onClick={() => handleUnequip(spell.name)}
                        className="px-3 py-1 rounded text-black bg-yellow-400 font-bold"
                      >
                        Unequip
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEquip(spell.name)}
                        disabled={!canEquip(spell.name)}
                        className={`px-3 py-1 rounded text-white font-bold ${canEquip(spell.name) ? 'bg-green-500' : 'bg-gray-600 opacity-50'}`}
                      >
                        Equip
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'Companions' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {COMPANIONS.map(comp => (
            <div key={comp.name} className={`rounded-lg p-4 ${classColors[comp.classType]} bg-opacity-30 bg-gray-800`}>
              <div className="font-bold text-lg">{comp.name} <span className="text-sm">({comp.classType})</span></div>
              <div className="text-white text-sm">{comp.desc}</div>
              <div className="text-yellow-400 text-xs">Cost: {comp.cost} gold</div>
              {player.companions.includes(comp.name) ? (
                <span className="text-yellow-400 font-bold">Owned</span>
              ) : (
                <button
                  onClick={() => buyCompanion(comp)}
                  disabled={player.gold < comp.cost}
                  className="mt-2 px-4 py-1 rounded bg-black text-white font-bold text-sm"
                >
                  Hire
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-white text-sm">
        <strong>Equipped Spells ({(player.equippedSpells || []).length}/5):</strong> {(player.equippedSpells || []).join(", ")}
      </div>
      <div className="text-gray-400 text-xs mt-1">
        <strong>Unlocked Spells:</strong> {player.spells.join(", ")}
      </div>
    </div>
  );
};

export default UpgradeShop;




