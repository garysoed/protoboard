gz = {};
gz.device = "Device";
gz.minion = "Minion";
gz.enchantment = "Enchantment";
gz.spell = "Spell";

gz.neutral = "Neutral";
gz.fire = "Fire";
gz.water = "Water";
gz.earth = "Earth";
gz.air = "Air";

gz.base = [
  {
    "name": "Energy Orb",
    "type": gz.device,
    "element": gz.neutral,
    "count": 10,
    "life": 5,
    "description": "Tap: +1 Energy",
    "cost": 3
  },

  {
    "name": "Bot",
    "type": gz.minion,
    "element": gz.neutral,
    "count": 10,
    "life": 3,
    "attack": 2,
    "defense": 0,
    "description": "",
    "cost": 3
  },

  {
    "name": "Mind Link",
    "type": gz.enchantment,
    "element": gz.neutral,
    "count": 10,
    "description": "At the beginning of the turn, draw a card",
    "cost": 3
  },

  {
    "name": "Meditate",
    "type": gz.spell,
    "element": gz.neutral,
    "count": 10,
    "description": "Discard a non " + gz.neutral + " Element card. Reveal cards from the top of " +
        "the draft deck until you reveal a card of the same Element. Draft it to your hand.",
    "cost": 1
  },
];