import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Clock, Users, LayoutGrid, ChevronLeft, Plus, Lock } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface Room {
  id: string;
  type: "bedroom" | "kitchen" | "study" | "music" | "aquarium" | "garden";
  name: string;
  icon: string;
  pointsCost: number;
  unlocked: boolean;
  unlockedAt?: Date;
  theme: string;
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
  },
  {
    id: "kitchen",
    type: "kitchen",
    name: "Bếp",
    icon: "🍳",
    pointsCost: 500,
    unlocked: true,
    theme: "modern",
  },
  {
    id: "study",
    type: "study",
    name: "Phòng học",
    icon: "📚",
    pointsCost: 800,
    unlocked: false,
    theme: "classic",
  },
  {
    id: "music",
    type: "music",
    name: "Phòng nhạc",
    icon: "🎹",
    pointsCost: 1200,
    unlocked: false,
    theme: "vibrant",
  },
  {
    id: "aquarium",
    type: "aquarium",
    name: "Bể cá",
    icon: "🐠",
    pointsCost: 1500,
    unlocked: false,
    theme: "aquatic",
  },
  {
    id: "garden",
    type: "garden",
    name: "Vườn",
    icon: "🌿",
    pointsCost: 2000,
    unlocked: false,
    theme: "natural",
  },
];

export default function Rooms() {
  const { t } = useLanguage();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(ROOMS[0]);
  const [showFurnitureMenu, setShowFurnitureMenu] = useState(false);

  const bgGradients = {
    default: "from-amber-100 to-yellow-100",
    modern: "from-gray-100 to-slate-100",
    classic: "from-orange-100 to-amber-100",
    vibrant: "from-purple-100 to-pink-100",
    aquatic: "from-cyan-100 to-blue-100",
    natural: "from-green-100 to-emerald-100",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-emerald-50 pb-24">
      {/* Status Bar */}
      <div className="sticky top-0 z-50 bg-transparent px-4 py-2 flex justify-between items-center text-xs text-gray-600">
        <span>9:41</span>
        <div className="flex gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
          </svg>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z" />
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

        {/* House Preview */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="text-6xl drop-shadow-lg">🏠</div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 -mt-8 relative z-10 space-y-4">
        {/* Current Room Display */}
        {selectedRoom && (
          <div
            className={`bg-gradient-to-br ${bgGradients[selectedRoom.theme as keyof typeof bgGradients]} rounded-3xl shadow-lg border border-white border-opacity-60 p-8 min-h-96 flex flex-col items-center justify-center`}
          >
            <div className="text-8xl mb-4">{selectedRoom.icon}</div>
            <h3 className="text-2xl font-bold text-gray-900 text-center">
              {selectedRoom.name}
            </h3>
            <p className="text-sm text-gray-700 mt-2">Kéo và thả để sắp xếp đồ nội thất</p>

            {/* Isometric Grid (Placeholder) */}
            <div className="mt-6 grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 bg-white bg-opacity-50 rounded-lg border-2 border-dashed border-gray-400 flex items-center justify-center cursor-move hover:bg-opacity-75 transition-all"
                >
                  <Plus className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowFurnitureMenu(!showFurnitureMenu)}
              className="mt-6 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              + Thêm đồ nội thất
            </button>
          </div>
        )}

        {/* Furniture Menu */}
        {showFurnitureMenu && (
          <div className="bg-white bg-opacity-50 backdrop-blur-md rounded-3xl p-6 border border-white border-opacity-60">
            <h3 className="font-semibold text-gray-900 mb-4">Bộ sưu tập đồ nội thất</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: "🛋️", name: "Sofa" },
                { icon: "🪑", name: "Ghế" },
                { icon: "🌿", name: "Cây" },
                { icon: "💡", name: "Đèn" },
                { icon: "🎨", name: "Tranh" },
                { icon: "📷", name: "Ảnh" },
                { icon: "🪞", name: "Gương" },
                { icon: "🧸", name: "Gấu bông" },
                { icon: "🎸", name: "Đàn guitar" },
              ].map((item, i) => (
                <button
                  key={i}
                  className="bg-white rounded-xl p-4 text-center hover:bg-purple-50 transition-colors border border-gray-200"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <p className="text-xs font-medium text-gray-700">{item.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Room Selection Grid */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Các phòng khác</h3>
          <div className="grid grid-cols-2 gap-3">
            {ROOMS.map((room) => (
              <button
                key={room.id}
                onClick={() => {
                  setSelectedRoom(room);
                  setShowFurnitureMenu(false);
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
                    <div className="mt-3 flex items-center justify-center gap-1">
                      <Lock className="w-4 h-4 text-gray-600" />
                      <p className="text-xs text-gray-600">{room.pointsCost} điểm</p>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Collectibles Gallery */}
        <div className="bg-white bg-opacity-50 backdrop-blur-md rounded-3xl p-6 border border-white border-opacity-60">
          <h3 className="font-semibold text-gray-900 mb-4">Bộ sưu tập vật phẩm</h3>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-xl flex items-center justify-center text-2xl ${
                  i < 8
                    ? "bg-white bg-opacity-70 cursor-pointer hover:bg-opacity-100"
                    : "bg-gray-300 bg-opacity-30 opacity-50"
                }`}
              >
                {i < 8
                  ? ["🌸", "🌺", "🌻", "🌷", "🌹", "🍀", "🎀", "💎"][i]
                  : "?"}
              </div>
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
            to="/rooms"
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
