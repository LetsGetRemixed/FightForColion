import React from "react";

function UpgradeShop({ player, setPlayer }) {
  // Simple upgrades: +max HP, +attack, buy new spell
  const SPELL_SHOP = [
    // --- Mage ---
    { key: "Fireball", name: "Fireball", cost: 20, desc: "Big fire damage! (5 attacks cooldown)" },
    { key: "Ice Shard", name: "Ice Shard", cost: 15, desc: "A sharp blast of ice. Short cooldown." },
    { key: "Lightning Bolt", name: "Lightning Bolt", cost: 30, desc: "A powerful bolt of lightning. Long cooldown." },
    { key: "Heal", name: "Heal", cost: 18, desc: "Restore your own health. (6 attacks cooldown)" },
    { key: "Arcane Nova", name: "Arcane Nova", cost: 50, desc: "Massive arcane damage to all foes." },
    { key: "Frost Barrier", name: "Frost Barrier", cost: 26, desc: "Gain a shield that absorbs damage." },
    { key: "Mana Surge", name: "Mana Surge", cost: 24, desc: "Increase spell damage for next 2 turns." },
    // --- Warrior ---
    { key: "Strike", name: "Strike", cost: 10, desc: "Basic attack." },
    { key: "Double Strike", name: "Double Strike", cost: 22, desc: "Strike twice in quick succession. (4 attacks cooldown)" },
    { key: "Shield Bash", name: "Shield Bash", cost: 28, desc: "Damage and reduce next enemy attack." },
    { key: "Power Slam", name: "Power Slam", cost: 32, desc: "Heavy blow. Extra damage if enemy is stunned." },
    { key: "Whirlwind", name: "Whirlwind", cost: 25, desc: "Hits all enemies." },
    { key: "Battle Cry", name: "Battle Cry", cost: 24, desc: "Increase own damage for next 2 turns." },
    // --- Rogue ---
    { key: "Poison Dagger", name: "Poison Dagger", cost: 20, desc: "Damage and poison enemy over time." },
    { key: "Shadowstep", name: "Shadowstep", cost: 23, desc: "Attack and dodge next hit." },
    { key: "Backstab", name: "Backstab", cost: 34, desc: "Extra damage if enemy is debuffed." },
    { key: "Evasion", name: "Evasion", cost: 18, desc: "Greatly increase dodge chance for 2 turns." },
    { key: "Fan of Knives", name: "Fan of Knives", cost: 26, desc: "Hits all enemies with blades." },
    { key: "Smoke Bomb", name: "Smoke Bomb", cost: 30, desc: "Escape and avoid all attacks next turn." },
  ];

  const buyUpgrade = (type, spellKey) => {
    if (type === "hp" && player.gold >= 10) {
      setPlayer((p) => ({ ...p, maxHp: p.maxHp + 10, gold: p.gold - 10 }));
    } else if (type === "spell" && spellKey) {
      const spell = SPELL_SHOP.find(s => s.key === spellKey);
      if (spell && player.gold >= spell.cost && !player.spells.includes(spell.key)) {
        setPlayer((p) => ({ ...p, spells: [...p.spells, spell.key], gold: p.gold - spell.cost }));
      }
    }
  };

  // Companion shop
  const COMPANIONS = [
    { name: "Lyra the Mage", classType: "Mage", cost: 250, specialSpell: "Arcane Nova", desc: "Boosts Mage spells and grants Arcane Nova." },
    { name: "Brak the Warrior", classType: "Warrior", cost: 250, specialSpell: "Shield Bash", desc: "Boosts Warrior spells and grants Shield Bash." },
    { name: "Shade the Rogue", classType: "Rogue", cost: 250, specialSpell: "Poison Dagger", desc: "Boosts Rogue spells and grants Poison Dagger." },
  ];

  const buyCompanion = (companion) => {
    if (player.gold >= companion.cost && !(player.companions || []).includes(companion.name)) {
      setPlayer((p) => ({
        ...p,
        gold: p.gold - companion.cost,
        companions: [...(p.companions || []), companion.name],
        spells: p.spells.includes(companion.specialSpell) ? p.spells : [...p.spells, companion.specialSpell],
      }));
    }
  };

  // Helper to group spells by class
  const spellGroups = {
    Mage: SPELL_SHOP.filter(s => ["Fireball","Ice Shard","Lightning Bolt","Heal","Arcane Nova","Frost Barrier","Mana Surge"].includes(s.key)),
    Warrior: SPELL_SHOP.filter(s => ["Strike","Double Strike","Shield Bash","Power Slam","Whirlwind","Battle Cry"].includes(s.key)),
    Rogue: SPELL_SHOP.filter(s => ["Poison Dagger","Shadowstep","Backstab","Evasion","Fan of Knives","Smoke Bomb"].includes(s.key)),
  };

  const classColors = {
    Mage: '#3b82f6',
    Warrior: '#dc2626',
    Rogue: '#22c55e',
  };

  const [activeTab, setActiveTab] = React.useState('Mage');
  const tabList = ['Mage', 'Warrior', 'Rogue', 'Companions'];

  // Initialize equippedSpells if missing
  React.useEffect(() => {
    if (!player.equippedSpells || !Array.isArray(player.equippedSpells)) {
      setPlayer({ ...player, equippedSpells: player.spells.slice(0, 5) });
    }
    // eslint-disable-next-line
  }, []);

  const isEquipped = (spellKey) => (player.equippedSpells || []).includes(spellKey);
  const canEquip = (spellKey) => !isEquipped(spellKey) && (player.equippedSpells?.length ?? 0) < 5;

  const handleEquip = (spellKey) => {
    if (!isEquipped(spellKey) && (player.equippedSpells?.length ?? 0) < 5) {
      setPlayer({ ...player, equippedSpells: [...(player.equippedSpells || []), spellKey] });
    }
  };
  const handleUnequip = (spellKey) => {
    setPlayer({ ...player, equippedSpells: (player.equippedSpells || []).filter(s => s !== spellKey) });
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24, background: '#181825', borderRadius: 16, boxShadow: '0 4px 24px #0007' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h2 style={{ color: '#ffd700', margin: 0 }}>Upgrade Shop</h2>
        <div style={{ fontWeight: 'bold', color: '#fff', fontSize: 20, background: '#222', padding: '6px 16px', borderRadius: 8 }}>
          Gold: <span style={{ color: '#ffd700' }}>{player.gold}</span>
        </div>
      </div>
      <button onClick={() => buyUpgrade("hp")} disabled={player.gold < 10} style={{ marginBottom: 18, fontWeight: 'bold', background: '#444', color: '#ffd700', borderRadius: 8, padding: '6px 16px', border: 'none' }}>
        +10 Max HP (10 gold)
      </button>

      {/* Tabs for class/companions */}
      <div style={{ display: 'flex', gap: 12, margin: '18px 0', justifyContent: 'center' }}>
        {tabList.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? (classColors[tab] || '#ffd700') : '#222',
              color: activeTab === tab ? '#fff' : '#aaa',
              border: 'none',
              borderRadius: 8,
              padding: '8px 18px',
              fontWeight: 'bold',
              fontSize: 16,
              opacity: activeTab === tab ? 1 : 0.7,
              boxShadow: activeTab === tab ? '0 0 8px #ffd700' : 'none',
              cursor: 'pointer',
              letterSpacing: 1,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Spell Shop by Class (tabbed) */}
      {activeTab !== 'Companions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {spellGroups[activeTab].map((spell) => {
            const owned = player.spells.includes(spell.key);
            const equipped = isEquipped(spell.key);
            return (
              <div key={spell.key} style={{ background: owned ? (equipped ? '#1e293b' : '#222c') : '#222', border: `2px solid ${classColors[activeTab]}`, borderRadius: 8, marginBottom: 14, padding: 12, boxShadow: equipped ? '0 0 12px #ffd700' : (owned ? '0 0 8px #444' : 'none'), display: 'flex', flexDirection: 'column', gap: 2, opacity: owned ? 1 : 0.5 }}>
                <div style={{ fontWeight: 'bold', fontSize: 16, color: classColors[activeTab] }}>{spell.name}</div>
                <div style={{ fontSize: 13, color: '#fff' }}>{spell.desc}</div>
                <div style={{ fontSize: 12, color: '#ffd700' }}>Cost: {spell.cost} gold</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button
                    onClick={() => buyUpgrade("spell", spell.key)}
                    disabled={player.gold < spell.cost || owned}
                    style={{ background: owned ? '#444' : classColors[activeTab], color: '#fff', border: 'none', borderRadius: 6, padding: '4px 8px', fontWeight: 'bold', opacity: owned ? 0.6 : 1 }}
                  >
                    {owned ? 'Owned' : `Unlock for ${spell.cost} gold`}
                  </button>
                  {owned && (
                    equipped ? (
                      <button
                        onClick={() => handleUnequip(spell.key)}
                        style={{ background: '#ffd700', color: '#222', border: 'none', borderRadius: 6, padding: '4px 8px', fontWeight: 'bold' }}
                      >
                        Unequip
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEquip(spell.key)}
                        disabled={!canEquip(spell.key)}
                        style={{ background: canEquip(spell.key) ? classColors[activeTab] : '#444', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 8px', fontWeight: 'bold', opacity: canEquip(spell.key) ? 1 : 0.5 }}
                      >
                        Equip
                      </button>
                    )
                  )}
                </div>
                {equipped && <div style={{ fontSize: 12, color: '#ffd700', fontWeight: 'bold', marginTop: 2 }}>Equipped</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* Companions Tab */}
      {activeTab === 'Companions' && (
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
          {COMPANIONS.map(comp => (
            <div key={comp.name} style={{ background: classColors[comp.classType], color: '#fff', borderRadius: 8, padding: 12, flex: 1, minWidth: 180, marginBottom: 10, boxShadow: (player.companions||[]).includes(comp.name) ? '0 0 8px #ffd700' : 'none' }}>
              <div style={{ fontWeight: 'bold', fontSize: 16 }}>{comp.name} <span style={{ fontSize: 13 }}>({comp.classType})</span></div>
              <div style={{ fontSize: 13 }}>{comp.desc}</div>
              <div style={{ fontSize: 12, color: '#ffd700' }}>Cost: {comp.cost} gold</div>
              {(player.companions || []).includes(comp.name) ? (
                <span style={{ color: '#ffd700', fontWeight: 'bold' }}>Owned</span>
              ) : (
                <button
                  onClick={() => buyCompanion(comp)}
                  disabled={player.gold < comp.cost}
                  style={{ marginTop: 4, background: '#222', color: classColors[comp.classType], border: 'none', borderRadius: 6, padding: '4px 0', fontWeight: 'bold' }}
                >
                  Hire for {comp.cost} gold
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 20, color: '#fff', fontSize: 15 }}>
        <strong>Equipped Spells ({(player.equippedSpells||[]).length}/5):</strong> {(player.equippedSpells||[]).join(", ")}
      </div>
      <div style={{ marginTop: 4, color: '#aaa', fontSize: 13 }}>
        <strong>Unlocked Spells:</strong> {player.spells.join(", ")}
      </div>
    </div>
  );
}

export default UpgradeShop;
