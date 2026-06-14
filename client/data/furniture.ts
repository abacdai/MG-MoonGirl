export interface FurnitureItem {
  id: string;
  name: string;
  nameVi: string;
  icon: string;
  category: string;
  width: number;    // Grid units
  height: number;   // Grid units
  rarity: "common" | "rare" | "epic" | "legendary";
  colors?: string[]; // Available colors (hex)
  unlockLevel?: number;
  description?: string;
}

export const FURNITURE_CATALOG: FurnitureItem[] = [
  // BEDS & SLEEP
  {
    id: "bed_single",
    name: "Single Bed",
    nameVi: "Giường đơn",
    icon: "🛏️",
    category: "bedroom",
    width: 2,
    height: 2,
    rarity: "common",
    colors: ["#8B4513", "#2F4F4F", "#4B0082"],
    description: "A comfortable single bed",
  },
  {
    id: "bed_double",
    name: "Double Bed",
    nameVi: "Giường đôi",
    icon: "🛌",
    category: "bedroom",
    width: 3,
    height: 2,
    rarity: "rare",
    colors: ["#D2691E", "#4B0082", "#FF69B4"],
    description: "Spacious double bed",
  },
  {
    id: "pillow",
    name: "Pillow",
    nameVi: "Gối",
    icon: "🤍",
    category: "bedroom",
    width: 1,
    height: 1,
    rarity: "common",
    colors: ["#FFFFFF", "#FFB6C1", "#87CEEB"],
  },

  // CHAIRS & SEATING
  {
    id: "chair_office",
    name: "Office Chair",
    nameVi: "Ghế công sở",
    icon: "🪑",
    category: "study",
    width: 1,
    height: 1,
    rarity: "common",
    colors: ["#000000", "#FF6347", "#4169E1"],
    description: "Ergonomic office chair",
  },
  {
    id: "sofa",
    name: "Sofa",
    nameVi: "Sofa",
    icon: "🛋️",
    category: "living",
    width: 2,
    height: 1,
    rarity: "rare",
    colors: ["#8B4513", "#DCDCDC", "#FF69B4"],
    description: "Comfortable seating",
  },
  {
    id: "armchair",
    name: "Armchair",
    nameVi: "Ghế bành",
    icon: "🪺",
    category: "living",
    width: 1,
    height: 1,
    rarity: "rare",
    colors: ["#DAA520", "#4B0082", "#228B22"],
  },

  // DESKS & TABLES
  {
    id: "desk_computer",
    name: "Computer Desk",
    nameVi: "Bàn máy tính",
    icon: "🖥️",
    category: "study",
    width: 2,
    height: 1,
    rarity: "common",
    colors: ["#8B4513", "#2F4F4F", "#696969"],
    description: "Gaming/work desk",
  },
  {
    id: "desk_dining",
    name: "Dining Table",
    nameVi: "Bàn ăn",
    icon: "🍽️",
    category: "kitchen",
    width: 2,
    height: 2,
    rarity: "common",
    colors: ["#D2691E", "#FFFACD", "#FFD700"],
  },
  {
    id: "coffee_table",
    name: "Coffee Table",
    nameVi: "Bàn cà phê",
    icon: "☕",
    category: "living",
    width: 1,
    height: 1,
    rarity: "common",
    colors: ["#8B4513", "#D2B48C", "#696969"],
  },

  // PLANTS & NATURE
  {
    id: "plant_potted",
    name: "Potted Plant",
    nameVi: "Cây trong chậu",
    icon: "🪴",
    category: "garden",
    width: 1,
    height: 1,
    rarity: "common",
    colors: ["#228B22", "#3CB371", "#90EE90"],
    description: "Indoor plant",
  },
  {
    id: "plant_money",
    name: "Money Plant",
    nameVi: "Cây lúa may mắn",
    icon: "🌱",
    category: "garden",
    width: 1,
    height: 1,
    rarity: "rare",
    colors: ["#228B22", "#6B8E23", "#32CD32"],
    description: "Brings good luck",
  },
  {
    id: "tree_bonsai",
    name: "Bonsai Tree",
    nameVi: "Cây bonsai",
    icon: "🌳",
    category: "garden",
    width: 1,
    height: 2,
    rarity: "epic",
    colors: ["#228B22", "#556B2F", "#9ACD32"],
    description: "Miniature tree",
  },
  {
    id: "flowers",
    name: "Flowers",
    nameVi: "Hoa",
    icon: "🌸",
    category: "garden",
    width: 1,
    height: 1,
    rarity: "rare",
    colors: ["#FF69B4", "#FFB6C1", "#DDA0DD"],
  },

  // LIGHTS & LAMPS
  {
    id: "lamp_desk",
    name: "Desk Lamp",
    nameVi: "Đèn bàn",
    icon: "💡",
    category: "study",
    width: 1,
    height: 1,
    rarity: "common",
    colors: ["#FFD700", "#FFA500", "#FF6347"],
    description: "Adjustable desk lamp",
  },
  {
    id: "lamp_floor",
    name: "Floor Lamp",
    nameVi: "Đèn sàn",
    icon: "🕯️",
    category: "living",
    width: 1,
    height: 2,
    rarity: "common",
    colors: ["#FFD700", "#696969", "#2F4F4F"],
  },
  {
    id: "lamp_ceiling",
    name: "Ceiling Light",
    nameVi: "Đèn trần",
    icon: "✨",
    category: "living",
    width: 2,
    height: 1,
    rarity: "rare",
    colors: ["#FFD700", "#FF8C00", "#FFFFFF"],
  },

  // DECORATIONS
  {
    id: "wall_art",
    name: "Wall Art",
    nameVi: "Tranh treo tường",
    icon: "🎨",
    category: "decoration",
    width: 1,
    height: 1,
    rarity: "rare",
    colors: ["#FF6347", "#4169E1", "#9370DB"],
    description: "Adds personality",
  },
  {
    id: "mirror",
    name: "Mirror",
    nameVi: "Gương",
    icon: "🪞",
    category: "decoration",
    width: 1,
    height: 1,
    rarity: "common",
    colors: ["#C0C0C0", "#DCDCDC", "#696969"],
  },
  {
    id: "bookshelf",
    name: "Bookshelf",
    nameVi: "Kệ sách",
    icon: "📚",
    category: "study",
    width: 1,
    height: 2,
    rarity: "common",
    colors: ["#8B4513", "#D2691E", "#4B0082"],
    description: "Knowledge storage",
  },
  {
    id: "carpet",
    name: "Carpet",
    nameVi: "Thảm",
    icon: "🧵",
    category: "living",
    width: 2,
    height: 2,
    rarity: "common",
    colors: ["#8B4513", "#FF6347", "#4169E1"],
  },

  // ELECTRONICS
  {
    id: "computer",
    name: "Computer",
    nameVi: "Máy tính",
    icon: "💻",
    category: "study",
    width: 1,
    height: 1,
    rarity: "common",
    colors: ["#000000", "#696969", "#2F4F4F"],
  },
  {
    id: "monitor",
    name: "Monitor",
    nameVi: "Màn hình",
    icon: "🖥️",
    category: "study",
    width: 1,
    height: 1,
    rarity: "common",
    colors: ["#000000", "#696969"],
  },
  {
    id: "speakers",
    name: "Speakers",
    nameVi: "Loa",
    icon: "🔊",
    category: "music",
    width: 1,
    height: 1,
    rarity: "rare",
    colors: ["#000000", "#FF6347", "#4169E1"],
  },
  {
    id: "guitar",
    name: "Guitar",
    nameVi: "Đàn guitar",
    icon: "🎸",
    category: "music",
    width: 1,
    height: 2,
    rarity: "epic",
    colors: ["#8B4513", "#FFD700", "#FF6347"],
  },

  // KITCHEN
  {
    id: "stove",
    name: "Stove",
    nameVi: "Lò nấu",
    icon: "🍳",
    category: "kitchen",
    width: 1,
    height: 1,
    rarity: "common",
    colors: ["#2F4F4F", "#696969", "#FF6347"],
  },
  {
    id: "fridge",
    name: "Refrigerator",
    nameVi: "Tủ lạnh",
    icon: "🧊",
    category: "kitchen",
    width: 1,
    height: 2,
    rarity: "rare",
    colors: ["#FFFFFF", "#C0C0C0", "#696969"],
  },
  {
    id: "sink",
    name: "Sink",
    nameVi: "Bồn rửa",
    icon: "🚰",
    category: "kitchen",
    width: 1,
    height: 1,
    rarity: "common",
    colors: ["#C0C0C0", "#DCDCDC", "#696969"],
  },

  // AQUARIUM
  {
    id: "aquarium",
    name: "Aquarium",
    nameVi: "Bể cá",
    icon: "🐠",
    category: "aquarium",
    width: 2,
    height: 1,
    rarity: "epic",
    colors: ["#4169E1", "#87CEEB", "#00CED1"],
    description: "Living aquatic life",
  },
  {
    id: "fish",
    name: "Fish",
    nameVi: "Cá",
    icon: "🐟",
    category: "aquarium",
    width: 1,
    height: 1,
    rarity: "rare",
    colors: ["#FFD700", "#FF6347", "#FFA500"],
  },

  // COLLECTIBLES
  {
    id: "statue_gold",
    name: "Gold Statue",
    nameVi: "Tượng vàng",
    icon: "🏆",
    category: "decoration",
    width: 1,
    height: 1,
    rarity: "legendary",
    colors: ["#FFD700"],
    description: "Lucky charm",
  },
  {
    id: "crystal",
    name: "Crystal",
    nameVi: "Pha lê",
    icon: "💎",
    category: "decoration",
    width: 1,
    height: 1,
    rarity: "legendary",
    colors: ["#FF69B4", "#87CEEB", "#9370DB"],
  },
  {
    id: "statue_marble",
    name: "Marble Statue",
    nameVi: "Tượng đá cẩm thạch",
    icon: "🗿",
    category: "decoration",
    width: 1,
    height: 2,
    rarity: "epic",
    colors: ["#DCDCDC", "#A9A9A9"],
  },
];

export const FURNITURE_BY_CATEGORY = {
  bedroom: FURNITURE_CATALOG.filter((f) => f.category === "bedroom"),
  kitchen: FURNITURE_CATALOG.filter((f) => f.category === "kitchen"),
  study: FURNITURE_CATALOG.filter((f) => f.category === "study"),
  music: FURNITURE_CATALOG.filter((f) => f.category === "music"),
  aquarium: FURNITURE_CATALOG.filter((f) => f.category === "aquarium"),
  garden: FURNITURE_CATALOG.filter((f) => f.category === "garden"),
  living: FURNITURE_CATALOG.filter((f) => f.category === "living"),
  decoration: FURNITURE_CATALOG.filter((f) => f.category === "decoration"),
};

export const getRarityColor = (rarity: string): string => {
  const colors: Record<string, string> = {
    common: "#D1D5DB",      // Gray
    rare: "#3B82F6",        // Blue
    epic: "#8B5CF6",        // Purple
    legendary: "#F59E0B",   // Amber
  };
  return colors[rarity] || colors.common;
};

export const getRarityLabel = (rarity: string): string => {
  const labels: Record<string, string> = {
    common: "Thông thường",
    rare: "Hiếm",
    epic: "Tuyệt vời",
    legendary: "Huyền thoại",
  };
  return labels[rarity] || labels.common;
};
