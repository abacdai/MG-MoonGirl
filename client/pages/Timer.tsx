import { Link } from "react-router-dom";
import {
  Home,
  Clock,
  Users,
  LayoutGrid,
  ChevronLeft,
  Play,
  Pause,
  Music,
  BookOpen,
  BarChart3,
  Globe,
  Shield,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { useFocus } from "@/hooks/useFocus";
import { useState } from "react";

type TimerMode = "infinite" | "normal" | "strict";

export default function Timer() {
  const {
    mode,
    focusTime,
    breakTime,
    sessions,
    isPlaying,
    isLoading,
    toggleTimer,
    remainingSeconds,
    handleModeChange,
    handleFocusTimeChange,
    handleBreakTimeChange,
    handleSessionsChange,
  } = useFocus();
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const minutes = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const totalSeconds = focusTime * 60;
  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

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
          {(["infinite", "normal", "strict"] as const).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              disabled={isPlaying}
              className={`flex-1 rounded-3xl px-3 py-3 transition-all text-center disabled:opacity-50 ${
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
          <div className="flex items-center justify-center">
            <button
              onClick={toggleTimer}
              disabled={isLoading}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all shadow-lg disabled:opacity-50 ${
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
          </div>
        </div>

        {/* Settings Card - Hidden in Infinite Mode */}
        {mode !== "infinite" && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 space-y-3">
            {/* Focus Time Slider */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <label className="text-xs uppercase text-gray-500 font-semibold w-24">
                Thời gian học
              </label>
              <input
                type="range"
                min="5"
                max="60"
                value={focusTime}
                onChange={(e) => handleFocusTimeChange(Number(e.target.value))}
                disabled={isPlaying}
                className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer appearance-none disabled:opacity-50"
                style={{
                  background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${(focusTime / 60) * 100}%, #e5e1db ${(focusTime / 60) * 100}%, #e5e1db 100%)`,
                }}
              />
              <div className="text-xs font-semibold text-gray-700 w-16 text-right">
                {focusTime} phút
              </div>
            </div>

            {/* Break Time Slider */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <label className="text-xs uppercase text-gray-500 font-semibold w-24">
                Nghỉ giải lao
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={breakTime}
                onChange={(e) => handleBreakTimeChange(Number(e.target.value))}
                disabled={isPlaying}
                className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer appearance-none disabled:opacity-50"
                style={{
                  background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${(breakTime / 30) * 100}%, #e5e1db ${(breakTime / 30) * 100}%, #e5e1db 100%)`,
                }}
              />
              <div className="text-xs font-semibold text-gray-700 w-16 text-right">
                {breakTime} phút
              </div>
            </div>

            {/* Sessions Slider */}
            <div className="flex items-center gap-3">
              <label className="text-xs uppercase text-gray-500 font-semibold w-24">
                Số buổi
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={sessions}
                onChange={(e) => handleSessionsChange(Number(e.target.value))}
                disabled={isPlaying}
                className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer appearance-none disabled:opacity-50"
                style={{
                  background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${(sessions / 10) * 100}%, #e5e1db ${(sessions / 10) * 100}%, #e5e1db 100%)`,
                }}
              />
              <div className="text-xs font-semibold text-gray-700 w-16 text-right">
                {sessions} buổi
              </div>
            </div>
          </div>
        )}

        {/* Infinite Mode Message */}
        {mode === "infinite" && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl shadow-sm border border-purple-200 p-4 text-center">
            <p className="text-sm font-semibold text-purple-700">
              ∞ Chế độ Vô hạn - Không giới hạn thời gian
            </p>
            <p className="text-xs text-purple-600 mt-1">
              Tập trung bao lâu cũng được, dừng lại khi bạn muốn
            </p>
          </div>
        )}

        {/* Stats during session */}
        {isPlaying && (
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-3xl shadow-sm border border-emerald-200 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs uppercase text-emerald-600 font-semibold">Thời gian tập trung</p>
                <p className="text-2xl font-bold text-emerald-700 mt-1">{focusTime}m</p>
              </div>
              <div className="text-center">
                <p className="text-xs uppercase text-blue-600 font-semibold">Chế độ</p>
                <p className="text-2xl font-bold text-blue-700 mt-1 capitalize">{getModeLabel(mode)}</p>
              </div>
            </div>
          </div>
        )}
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
