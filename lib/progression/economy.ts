// ==============================================================================
// ASCEND - GUILD SHOP ECONOMY & INVENTORY ENGINE
// ==============================================================================

import { ShopItem, InventoryItem } from '@/types/rpg';

export const STATIC_SHOP_ITEMS: ShopItem[] = [
  // Themes
  {
    id: 'item-theme-void',
    name: 'Obsidian Void Theme',
    description: 'A pitch-black interface with deep violet luminescent accents and sleek high-contrast borders.',
    category: 'Theme',
    price: 200,
    icon: 'Palette',
    rarity: 'Rare',
    effect_type: 'theme_unlock',
    effect_value: 'theme-void',
  },
  {
    id: 'item-theme-solar',
    name: 'Solar Flare Theme',
    description: 'A radiant gold and amber cyberpunk UI inspired by glowing solar fusion reactors.',
    category: 'Theme',
    price: 300,
    icon: 'Sun',
    rarity: 'Epic',
    effect_type: 'theme_unlock',
    effect_value: 'theme-solar',
  },
  {
    id: 'item-theme-matrix',
    name: 'Emerald Matrix Theme',
    description: 'High-tech matrix green terminal glow, digital rain motifs, and cyber holographic accents.',
    category: 'Theme',
    price: 350,
    icon: 'Terminal',
    rarity: 'Epic',
    effect_type: 'theme_unlock',
    effect_value: 'theme-matrix',
  },
  {
    id: 'item-theme-crimson',
    name: 'Crimson Vanguard Theme',
    description: 'Aggressive tactical red and crimson HUD styling designed for high-intensity execution.',
    category: 'Theme',
    price: 450,
    icon: 'Flame',
    rarity: 'Legendary',
    effect_type: 'theme_unlock',
    effect_value: 'theme-crimson',
  },

  // Badges
  {
    id: 'item-badge-novice',
    name: 'Novice Slayer Crest',
    description: 'Official proof of taking your first steps in the Ascend universe.',
    category: 'Badge',
    price: 100,
    icon: 'ShieldCheck',
    rarity: 'Common',
    effect_type: 'badge_unlock',
    effect_value: 'badge-novice',
  },
  {
    id: 'item-badge-architect',
    name: 'Neural Architect Crest',
    description: 'Awarded to master thinkers, programmers, and intellect specialists.',
    category: 'Badge',
    price: 250,
    icon: 'BrainCircuit',
    rarity: 'Rare',
    effect_type: 'badge_unlock',
    effect_value: 'badge-architect',
  },
  {
    id: 'item-badge-iron-will',
    name: 'Iron Will Crest',
    description: 'Worn by disciples of unrelenting daily discipline and physical power.',
    category: 'Badge',
    price: 300,
    icon: 'Dumbbell',
    rarity: 'Epic',
    effect_type: 'badge_unlock',
    effect_value: 'badge-iron-will',
  },
  {
    id: 'item-badge-titan',
    name: 'Titan of the Grid',
    description: 'Legendary emblem worn only by Grandmaster productivity warriors.',
    category: 'Badge',
    price: 600,
    icon: 'Crown',
    rarity: 'Legendary',
    effect_type: 'badge_unlock',
    effect_value: 'badge-titan',
  },
  {
    id: 'item-badge-singularity',
    name: 'Ascendant Singularity',
    description: 'Mythic crest representing absolute balance and mastery over all six life attributes.',
    category: 'Badge',
    price: 1200,
    icon: 'Infinity',
    rarity: 'Mythic',
    effect_type: 'badge_unlock',
    effect_value: 'badge-singularity',
  },

  // Titles
  {
    id: 'item-title-relentless',
    name: 'The Relentless',
    description: 'Display title: "Ayush the Relentless"',
    category: 'Title',
    price: 150,
    icon: 'Tag',
    rarity: 'Rare',
    effect_type: 'title_unlock',
    effect_value: 'The Relentless',
  },
  {
    id: 'item-title-overlord',
    name: 'Neural Overlord',
    description: 'Display title: "Ayush, Neural Overlord"',
    category: 'Title',
    price: 350,
    icon: 'Zap',
    rarity: 'Epic',
    effect_type: 'title_unlock',
    effect_value: 'Neural Overlord',
  },
  {
    id: 'item-title-shadow',
    name: 'Shadow Operator',
    description: 'Display title: "Ayush, Shadow Operator"',
    category: 'Title',
    price: 400,
    icon: 'EyeOff',
    rarity: 'Epic',
    effect_type: 'title_unlock',
    effect_value: 'Shadow Operator',
  },
  {
    id: 'item-title-grand',
    name: 'Grand Ascendant',
    description: 'Display title: "Ayush, Grand Ascendant"',
    category: 'Title',
    price: 800,
    icon: 'Award',
    rarity: 'Legendary',
    effect_type: 'title_unlock',
    effect_value: 'Grand Ascendant',
  },

  // Avatar Frames
  {
    id: 'item-frame-hex',
    name: 'Neon Hexagon Frame',
    description: 'Glowing cyan polygon border around your avatar portrait.',
    category: 'Frame',
    price: 180,
    icon: 'Hexagon',
    rarity: 'Rare',
    effect_type: 'frame_unlock',
    effect_value: 'frame-hex',
  },
  {
    id: 'item-frame-plasma',
    name: 'Plasma Holo-Ring',
    description: 'Rotating quantum plasma ring surrounding your character icon.',
    category: 'Frame',
    price: 320,
    icon: 'CircleDot',
    rarity: 'Epic',
    effect_type: 'frame_unlock',
    effect_value: 'frame-plasma',
  },
  {
    id: 'item-frame-celestial',
    name: 'Celestial Aureole',
    description: 'Divine golden aura with pulsing particle glow.',
    category: 'Frame',
    price: 750,
    icon: 'Sparkles',
    rarity: 'Legendary',
    effect_type: 'frame_unlock',
    effect_value: 'frame-celestial',
  },

  // Consumables
  {
    id: 'item-streak-freeze',
    name: 'Streak Freeze Relic',
    description: 'Protects your streak from resetting if you miss a calendar day. Can hold up to 3.',
    category: 'Consumable',
    price: 120,
    icon: 'ShieldAlert',
    rarity: 'Common',
    effect_type: 'streak_freeze',
    effect_value: '1',
  },
  // Characters Roster
  {
    id: 'item-char-iron-titan',
    name: 'Iron Titan',
    description: 'Fitness & Strength Specialist. Builds unbreakable stamina with +15% Strength & Vitality XP.',
    category: 'Character',
    price: 250,
    icon: 'Shield',
    rarity: 'Rare',
    effect_type: 'archetype_unlock',
    effect_value: 'Iron Titan',
  },
  {
    id: 'item-char-shadow-rogue',
    name: 'Shadow Rogue',
    description: 'Speed & Task Execution Ninja. Fast daily execution with +15% bonus Gold on Medium & Hard quests.',
    category: 'Character',
    price: 600,
    icon: 'Zap',
    rarity: 'Epic',
    effect_type: 'archetype_unlock',
    effect_value: 'Shadow Rogue',
  },
  {
    id: 'item-char-bio-hacker',
    name: 'Bio Hacker',
    description: 'Health & Energy Optimizer. Unlocked by reaching a 7-day streak. +20% longer Streak protection.',
    category: 'Character',
    price: 0,
    icon: 'Activity',
    rarity: 'Epic',
    effect_type: 'archetype_unlock',
    effect_value: 'Bio Hacker',
  },
  {
    id: 'item-char-astral-sage',
    name: 'Astral Sage',
    description: 'Creativity & Mindfulness Guide. Unlocked at Level 10. +20% bonus XP on Creative & Social quests.',
    category: 'Character',
    price: 0,
    icon: 'Sparkles',
    rarity: 'Legendary',
    effect_type: 'archetype_unlock',
    effect_value: 'Astral Sage',
  },
  {
    id: 'item-char-nova-paladin',
    name: 'Nova Paladin',
    description: 'Leadership & Community Champion. Unlocked by completing 50 quests. +25% bonus Charisma XP.',
    category: 'Character',
    price: 0,
    icon: 'Crown',
    rarity: 'Legendary',
    effect_type: 'archetype_unlock',
    effect_value: 'Nova Paladin',
  },
];

export interface PurchaseValidationResult {
  valid: boolean;
  item?: ShopItem;
  newGoldBalance: number;
  errorMessage?: string;
}

/**
 * Server-authoritative purchase validation
 */
export function validatePurchase(params: {
  itemId: string;
  currentGold: number;
  userInventory: InventoryItem[];
}): PurchaseValidationResult {
  const { itemId, currentGold, userInventory } = params;
  const item = STATIC_SHOP_ITEMS.find((i) => i.id === itemId);

  if (!item) {
    return {
      valid: false,
      newGoldBalance: currentGold,
      errorMessage: 'Item not found in Guild Shop catalog.',
    };
  }

  // Prevent duplicate purchase of unique items (Theme, Badge, Title, Frame)
  if (item.category !== 'Consumable') {
    const alreadyOwned = userInventory.some((inv) => inv.item_id === item.id);
    if (alreadyOwned) {
      return {
        valid: false,
        newGoldBalance: currentGold,
        errorMessage: `You already own ${item.name}! Unique items cannot be purchased twice.`,
      };
    }
  }

  // Check gold balance
  if (currentGold < item.price) {
    return {
      valid: false,
      newGoldBalance: currentGold,
      errorMessage: `Insufficient Gold. You have ${currentGold} Gold, but ${item.name} costs ${item.price} Gold. Complete more quests!`,
    };
  }

  return {
    valid: true,
    item,
    newGoldBalance: currentGold - item.price,
  };
}
