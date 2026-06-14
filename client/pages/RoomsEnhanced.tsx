import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Clock, Users, LayoutGrid, ChevronLeft, Plus, Lock, Trash2, RotateCw } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { FURNITURE_CATALOG, FURNITURE_BY_CATEGORY, getRarityColor, getRarityLabel } from "@/data/furniture";

interface PlacedFurniture {
  id: string;
  furnitureId: string;
  posX: number;
  posY: number;
  rotation: number;
  color?: string;
  scale: number;
}

interface Room {
  id: string;
  type: "bedroom" | "kitchen" | "study" | "music" | "aquarium" | "garden";
  name: string;
  icon: string;
  pointsCost: number;
  unlocked: boolean;
  theme: string;
  bgColor: string;
  furniture: PlacedFurniture[];
}

const ROOMS: Room[] = [
  {
    id: "bedroom",
    type: "bedroom",
    name: "Phòng ngủ",
    icon: "🛏️",
    pointsCost: 0,
    unlocked: true,
    theme: "default",
    bgColor: "#FBE8E4",
    furniture: [],
  },
  {
    id: "kitchen",
    type: "kitchen",
    name: "Bếp",
    icon: "🍳",
    pointsCost: 500,
    unlocked: true,
    theme: "modern",
    bgColor: "#F3F4F6",
    furniture: [],
  },
  {
    id: "study",
    type: "study",
    name: "Phòng học",
    icon: "📚",
    pointsCost: 800,
    unlocked: false,
    theme: "classic",
    bgColor: "#FEF08A",
    furniture: [],
  },
  {
    id: "music",
    type: "music",
    name: "Phòng nhạc",
    icon: "🎹",
    pointsCost: 1200,
    unlocked: false,
    theme: "vibrant",
    bgColor: "#F3E8FF",
    furniture: [],
  },
  {
    id: "aquarium",
    type: "aquarium",
    name: "Bể cá",
    icon: "🐠",
    pointsCost: 1500,
    unlocked: false,
    theme: "aquatic",
    bgColor: "#CFFAFE",
    furniture: [],
  },
  {
    id: "garden",
    type: "garden",
    name: "Vườn",
    icon: "🌿",
    pointsCost: 2000,
    unlocked: false,
    theme: "natural",
    bgColor: "#DCFCE7",
    furniture: [],
  },
];

export default function RoomsEnhanced() {
  const { t } = useLanguage();
  const [rooms, setRooms] = useState<Room[]>(ROOMS);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(ROOMS[0]);
  const [showFurnitureMenu, setShowFurnitureMenu] = useState(false);
  const [selectedFurniture, setSelectedFurniture] = useState<PlacedFurniture | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const getAvailableFurniture = () => {
    if (filterCategory === "all") {
      return FURNITURE_CATALOG;
    }
    return FURNITURE_BY_CATEGORY[filterCategory as keyof typeof FURNITURE_BY_CATEGORY] || [];
  };

  const placeFurniture = (furnitureItem: any) => {
    if (!selectedRoom) return;

    const newFurniture: PlacedFurniture = {
      id: `item_${Date.now()}`,
      furnitureId: furnitureItem.id,
      posX: Math.floor(Math.random() * 6),
      posY: Math.floor(Math.random() * 6),
      rotation: 0,
      color: furnitureItem.colors?.[0],
      scale: 1,
    };

    setRooms((prev) =>
      prev.map((r) =>
        r.id === selectedRoom.id
          ? { ...r, furniture: [...r.furniture, newFurniture] }
          : r
      )
    );
    
    setSelectedRoom((prev) =>
      prev ? { ...prev, furniture: [...prev.furniture, newFurniture] } : null
    );
  };

  const removeFurniture = (itemId: string) => {
    if (!selectedRoom) return;

    setRooms((prev) =>
      prev.map((r) =>
        r.id === selectedRoom.id
          ? { ...r, furniture: r.furniture.filter((f) => f.id !== itemId) }
          : r
      )
    );

    setSelectedRoom((prev) =>
      prev
        ? { ...prev, furniture: prev.furniture.filter((f) => f.id !== itemId) }
        : null
    );
  };

  const rotateFurniture = (itemId: string) => {
    if (!selectedRoom) return;

    setRooms((prev) =>
      prev.map((r) =>
        r.id === selectedRoom.id
          ? {
              ...r,
              furniture: r.furniture.map((f) =>
                f.id === itemId ? { ...f, rotation: (f.rotation + 90) % 360 } : f
              ),
            }
          : r
      )
    );

    setSelectedRoom((prev) =>
      prev
        ? {
            ...prev,
            furniture: prev.furniture.map((f) =>
              f.id === itemId ? { ...f, rotation: (f.rotation + 90) % 360 } : f
            ),
          }
        : null
    );
  };

  const getFurnitureItem = (id: string) => FURNITURE_CATALOG.find((f) => f.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-emerald-50 pb-24">
      {/* Status Bar */}
      <div className="sticky top-0 z-50 bg-transparent px-4 py-2 flex justify-between items-center text-xs text-gray-600">
        <span>9:41</span>
        <div className="flex gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-b from-blue-300 via-blue-100 to-emerald-100">
        <div className="absolute top-8 left-6 right-6 flex justify-between items-center z-10">
          <Link
            to="/"
            className="w-9 h-9 rounded-full bg-white bg-opacity-65 border border-white border-opacity-90 flex items-center justify-center text-gray-700 hover:bg-opacity-75"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-lg font-semibold text-gray-800">Nhà của tôi</h2>
          <div className="w-9"></div>
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="text-6xl drop-shadow-lg">🏠</div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-8 relative z-10 space-y-4">
        {selectedRoom && (
          <>
            {/* Room Display */}
            <div
              style={{ backgroundColor: selectedRoom.bgColor }}
              className="rounded-3xl shadow-lg border border-white border-opacity-60 p-8 min-h-80 flex flex-col items-center justify-center relative overflow-hidden"
            >
              <div className="text-8xl mb-4">{selectedRoom.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 text-center">{selectedRoom.name}</h3>
              <p className="text-sm text-gray-700 mt-2">({selectedRoom.furniture.length} vật dụng)</p>

              {/* Furniture Grid */}
              {selectedRoom.furniture.length > 0 && (
                <div className="mt-6 w-full grid grid-cols-4 gap-2">
                  {selectedRoom.furniture.map((item) => {
                    const furnitureItem = getFurnitureItem(item.furnitureId);
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedFurniture(item)}
                        className={`p-2 rounded-lg cursor-pointer text-center transition-all ${
                          selectedFurniture?.id === item.id
                            ? "ring-2 ring-purple-500 bg-purple-100"
                            : "bg-white bg-opacity-70"
                        }`}
                      >
                        <div className="text-3xl">{furnitureItem?.icon}</div>
                        <p className="text-xs font-medium text-gray-700 mt-1">
                          {furnitureItem?.nameVi}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedRoom.furniture.length === 0 && (
                <p className="text-gray-600 mt-4">Kéo và thả để sắp xếp đồ nội thất</p>
              )}
            </div>

            {/* Furniture Controls */}
            {selectedFurniture && (
              <div className="bg-white bg-opacity-50 backdrop-blur-md rounded-2xl p-4 border border-white border-opacity-60 space-y-3">
                <h4 className="font-semibold text-gray-900">Điều chỉnh vật dụng</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => rotateFurniture(selectedFurniture.id)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded-lg flex items-center justify-center gap-1 font-medium text-sm"
                  >
                    <RotateCw className="w-4 h-4" />
                    Xoay
                  </button>
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="bg-purple-100 hover:bg-purple-200 text-purple-700 py-2 rounded-lg font-medium text-sm"
                  >
                    🎨 Màu
                  </button>
                  <button
                    onClick={() => removeFurniture(selectedFurniture.id)}
                    className="bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg flex items-center justify-center gap-1 font-medium text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </button>
                </div>

                {showColorPicker && getFurnitureItem(selectedFurniture.furnitureId)?.colors && (
                  <div className="flex gap-2 flex-wrap">
                    {getFurnitureItem(selectedFurniture.furnitureId)?.colors?.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setRooms((prev) =>
                            prev.map((r) =>
                              r.id === selectedRoom.id
                                ? {
                                    ...r,
                                    furniture: r.furniture.map((f) =>
                                      f.id === selectedFurniture.id
                                        ? { ...f, color }
                                        : f
                                    ),
                                  }
                                : r
                            )
                          );
                          setShowColorPicker(false);
                        }}
                        className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-gray-600"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Add Furniture Button */}
            <button
              onClick={() => setShowFurnitureMenu(!showFurnitureMenu)}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Thêm đồ nội thất
            </button>

            {/* Furniture Catalog */}
            {showFurnitureMenu && (
              <div className="bg-white bg-opacity-50 backdrop-blur-md rounded-3xl p-6 border border-white border-opacity-60 space-y-4">
                <h3 className="font-semibold text-gray-900">Bộ sưu tập đồ nội thất</h3>

                {/* Filter by Category */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {["all", "bedroom", "kitchen", "study", "music", "aquarium", "garden", "decoration"].map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-3 py-1 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                          filterCategory === cat
                            ? "bg-purple-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {cat === "all"
                          ? "Tất cả"
                          : cat === "bedroom"
                            ? "Phòng ngủ"
                            : cat === "kitchen"
                              ? "Bếp"
                              : cat === "study"
                                ? "Học"
                                : cat === "music"
                                  ? "Nhạc"
                                  : cat === "aquarium"
                                    ? "Cá"
                                    : cat === "garden"
                                      ? "Vườn"
                                      : "Trang trí"}
                      </button>
                    )
                  )}
                </div>

                {/* Furniture Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {getAvailableFurniture().map((item) => (
                    <button
                      key={item.id}
                      onClick={() => placeFurniture(item)}
                      className="p-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-center transition-all hover:shadow-md"
                    >
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <p className="text-xs font-medium text-gray-700">{item.nameVi}</p>
                      <p
                        className="text-xs font-semibold mt-1"
                        style={{ color: getRarityColor(item.rarity) }}
                      >
                        {getRarityLabel(item.rarity)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Room Selection Grid */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Các phòng khác</h3>
          <div className="grid grid-cols-2 gap-3">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => {
                  setSelectedRoom(room);
                  setShowFurnitureMenu(false);
                  setSelectedFurniture(null);
                }}
                disabled={!room.unlocked}
                className={`relative rounded-2xl p-4 transition-all border border-white border-opacity-60 ${
                  selectedRoom?.id === room.id
                    ? "ring-2 ring-purple-500 shadow-lg"
                    : ""
                } ${
                  room.unlocked
                    ? "bg-white bg-opacity-50 backdrop-blur-md hover:bg-opacity-70"
                    : "bg-gray-200 bg-opacity-30 cursor-not-allowed opacity-60"
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{room.icon}</div>
                  <p className="text-sm font-semibold text-gray-900">{room.name}</p>

                  {!room.unlocked && (
                    <div className="mt-3 flex flex-col items-center gap-1">
                      <Lock className="w-4 h-4 text-gray-600" />
                      <p className="text-xs text-gray-600">{room.pointsCost} điểm</p>
                    </div>
                  )}

                  {room.unlocked && (
                    <p className="text-xs text-gray-600 mt-2">{room.furniture.length} vật dụng</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm border-t border-gray-200 z-30">
        <div className="flex justify-around items-center py-3">
          <Link to="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link
            to="/rooms-enhanced"
            className="flex flex-col items-center gap-1 text-purple-600"
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-xs font-medium">Nhà</span>
          </Link>
          <Link to="/timer" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
            <Clock className="w-5 h-5" />
            <span className="text-xs font-medium">Timer</span>
          </Link>
          <Link to="/community" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
            <Users className="w-5 h-5" />
            <span className="text-xs font-medium">Community</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
