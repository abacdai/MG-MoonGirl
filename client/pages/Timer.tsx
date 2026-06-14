import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Clock,
  Users,
  LayoutGrid,
  ChevronLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music,
  BookOpen,
  BarChart3,
  Globe,
  Shield,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { useStats } from "@/hooks/useStats";
import { toast } from "sonner";

type TimerMode = "infinite" | "normal" | "strict";

export default function Timer() {
  const [mode, setMode] = useState<TimerMode>("normal");
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const [totalSeconds] = useState(25 * 60);
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [sessions, setSessions] = useState(4);
  const { stats, addFocusSession } = useStats();
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          // Timer completed - record the focus session
          setTimeout(() => {
            addFocusSession(focusTime);
            setShowCompletionModal(true);
            toast.success(`✨ Bạn kiếm được ${Math.round(focusTime * (100 / 60))} MoonCoins!`);
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, focusTime, addFocusSession]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  const getModeIcon = (m: TimerMode) => {
    switch (m) {
      case "infinite":
        return "∞";
      case "strict":
        return "🔒";
      default:
        return "⏱️";
    }
  };

  const getModeLabel = (m: TimerMode) => {
    switch (m) {
      case "infinite":
        return "Vô hạn";
      case "strict":
        return "Nghiêm ngặt";
      default:
        return "Bình thường";
    }
  };

  const getModeDescription = (m: TimerMode) => {
    switch (m) {
      case "infinite":
        return "Không giới hạn";
      case "strict":
        return "Không thể dừng sớm";
      default:
        return "Tập trung";
    }
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

      {/* Hero Section */}
      <div className="relative h-72 overflow-hidden bg-gradient-to-b from-blue-300 via-blue-100 to-emerald-100">
        {/* Sun */}
        <div className="absolute top-12 right-16 w-16 h-16 bg-yellow-300 rounded-full border-4 border-yellow-400 shadow-lg"></div>

        {/* Clouds */}
        <div className="absolute top-20 left-12 w-24 h-8 bg-white rounded-full opacity-80"></div>
        <div className="absolute top-32 right-32 w-20 h-6 bg-white rounded-full opacity-75"></div>

        {/* Ground */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-emerald-200 to-emerald-300 rounded-t-3xl"></div>

        {/* Header */}
        <div className="absolute top-8 left-6 right-6 flex justify-between items-center z-10">
          <Link
            to="/"
            className="w-9 h-9 rounded-full bg-white bg-opacity-65 border border-white border-opacity-90 flex items-center justify-center text-gray-700 hover:bg-opacity-75"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-lg font-semibold text-gray-800">Tập trung</h2>
          <div className="w-9"></div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-12 relative z-10 space-y-4">
        {/* Mode Tabs */}
        <div className="flex gap-3">
          {(["infinite", "normal", "strict"] as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 rounded-3xl px-3 py-3 transition-all text-center ${
                mode === m
                  ? "bg-purple-500 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 shadow-sm hover:border-gray-300"
              }`}
            >
              <div className="text-xl mb-1">{getModeIcon(m)}</div>
              <div className="text-xs font-medium">{getModeLabel(m)}</div>
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="relative w-56 h-56">
            <svg className="w-full h-full -rotate-90">
              {/* Background circle */}
              <circle
                cx="112"
                cy="112"
                r="100"
                fill="none"
                stroke="#E5E1DB"
                strokeWidth="10"
              />
              {/* Progress circle */}
              <circle
                cx="112"
                cy="112"
                r="100"
                fill="none"
                stroke={mode === "strict" ? "#EF4444" : "#7c6ff7"}
                strokeWidth="10"
                strokeDasharray={`${(progress / 100) * 628}`}
                strokeLinecap="round"
                style={{
                  transition: "stroke-dasharray 0.5s ease",
                }}
              />
            </svg>

            {/* Inner content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-gray-900 font-mono tracking-wider">
                {String(minutes).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </div>
              <div className="text-xs uppercase text-gray-500 font-semibold mt-2 tracking-wide">
                {getModeDescription(mode)}
              </div>
              <div className="flex gap-2 mt-3">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <div className="w-2 h-2 rounded-full bg-purple-500 ring-2 ring-purple-400 ring-offset-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6">
            <button className="w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 shadow-sm">
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all shadow-lg ${
                isPlaying
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-purple-500 hover:bg-purple-600 text-white"
              }`}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7" />
              ) : (
                <Play className="w-7 h-7 ml-1" />
              )}
            </button>
            <button className="w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 shadow-sm">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 space-y-3">
          {[
            { label: "Thời gian học", value: focusTime, unit: " phút", max: 60 },
            { label: "Nghỉ giải lao", value: breakTime, unit: " phút", max: 30 },
            {
              label: "Số buổi",
              value: sessions,
              unit: " buổi",
              max: 10,
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-b-0">
              <label className="text-xs uppercase text-gray-500 font-semibold w-24">
                {item.label}
              </label>
              <div className="flex-1 h-1 bg-gray-200 rounded-full relative">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{
                    width: `${(
                      ((item.value as number) / item.max) *
                      100
                    ).toFixed(0)}%`,
                  }}
                ></div>
              </div>
              <div className="text-xs font-semibold text-gray-700 w-16 text-right">
                {item.value}
                {item.unit}
              </div>
            </div>
          ))}
        </div>

        {/* Tools Row */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Globe, label: "Tra cứu" },
            { icon: Music, label: "Âm nhạc" },
            { icon: BookOpen, label: "Ghi chú" },
            { icon: BarChart3, label: "Thống kê" },
          ].map((tool, i) => (
            <button
              key={i}
              className="bg-white rounded-2xl p-3 flex flex-col items-center gap-2 text-purple-600 border border-gray-100 hover:bg-purple-50 transition-colors shadow-sm"
            >
              <tool.icon className="w-5 h-5" />
              <span className="text-xs text-gray-700">{tool.label}</span>
            </button>
          ))}
        </div>

        {/* Block Apps Row */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-red-500" />
            <span className="font-medium text-gray-900">Chặn ứng dụng</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-5 bg-purple-500 rounded-full relative transition-all">
              <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full"></div>
            </button>
            <span className="text-sm font-medium text-gray-600">8 apps</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm border-t border-gray-200 z-30">
        <div className="flex justify-around items-center py-3">
          <Link
            to="/"
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link
            to="/my-apps"
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600"
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-xs font-medium">My apps</span>
          </Link>
          <Link
            to="/timer"
            className="flex flex-col items-center gap-1 text-purple-600"
          >
            <Clock className="w-5 h-5" />
            <span className="text-xs font-medium">Timer</span>
          </Link>
          <Link
            to="/community"
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600"
          >
            <Users className="w-5 h-5" />
            <span className="text-xs font-medium">Community</span>
          </Link>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowCompletionModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-8 flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white text-center">
                  Tuyệt vời!
                </h2>
                <p className="text-emerald-100 text-center">
                  Bạn hoàn thành {focusTime} phút tập trung
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🪙</span>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">
                        MoonCoins kiếm được
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        +{focusTime === 25 ? 41 : focusTime === 45 ? 75 : focusTime}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
                    <p className="text-xs text-blue-600 uppercase font-semibold">
                      Tập trung
                    </p>
                    <p className="text-lg font-bold text-blue-900">
                      +{(focusTime / 60).toFixed(1)}h
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-center">
                    <p className="text-xs text-orange-600 uppercase font-semibold">
                      Màn hình
                    </p>
                    <p className="text-lg font-bold text-orange-900">
                      +{(focusTime / 200).toFixed(1)}h
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
