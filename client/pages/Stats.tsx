import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Clock, Users, LayoutGrid, ChevronLeft, TrendingUp } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useStats } from "@/hooks/useStats";

type TimePeriod = "day" | "week" | "month" | "year";

export default function Stats() {
  const [period, setPeriod] = useState<TimePeriod>("week");
  const { t } = useLanguage();
  const { stats } = useStats();

  // Calculate composite scores (Opal-style)
  const sleepScore = Math.min(100, Math.round((stats.sleepHours / 8) * 100));
  const focusScore = Math.min(100, Math.round((stats.focusHours / 5) * 100));
  const restScore = Math.max(0, 100 - Math.round(stats.screenTimeHours * 5));

  const overallScore = Math.round((sleepScore + focusScore + restScore) / 3);

  const ScoreCard = ({
    label,
    score,
    value,
    unit,
    color,
  }: {
    label: string;
    score: number;
    value: number;
    unit: string;
    color: string;
  }) => (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-4 text-white shadow-lg`}>
      <p className="text-xs uppercase font-semibold opacity-90 tracking-wide">{label}</p>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold">{score}</p>
          <p className="text-xs opacity-80 mt-1">{value.toFixed(1)}{unit}</p>
        </div>
        <div className="text-right">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="white"
                strokeWidth="2"
                opacity="0.2"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeDasharray={`${(score / 100) * 176} 176`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              {score}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
      <div className="relative h-64 overflow-hidden bg-gradient-to-b from-blue-300 via-blue-100 to-emerald-100">
        {/* Sun */}
        <div className="absolute top-8 right-12 w-12 h-12 bg-yellow-300 rounded-full border-4 border-yellow-400 shadow-lg"></div>

        {/* Header */}
        <div className="absolute top-8 left-6 right-6 flex justify-between items-center z-10">
          <Link
            to="/"
            className="w-9 h-9 rounded-full bg-white bg-opacity-65 border border-white border-opacity-90 flex items-center justify-center text-gray-700 hover:bg-opacity-75"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-lg font-semibold text-gray-800">Thống kê</h2>
          <div className="w-9"></div>
        </div>

        {/* Overall Score */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-48 text-center">
            <p className="text-xs uppercase text-gray-600 font-semibold tracking-wider">
              Điểm Tổng Thể
            </p>
            <p className="text-5xl font-bold text-purple-600 mt-2">{overallScore}</p>
            <p className="text-xs text-gray-600 mt-1">Xuất sắc</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 -mt-12 relative z-10 space-y-4 pt-12">
        {/* Time Period Tabs */}
        <div className="flex gap-2 bg-white bg-opacity-50 backdrop-blur-md rounded-2xl p-2 border border-white border-opacity-60">
          {(["day", "week", "month", "year"] as TimePeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2 rounded-xl font-semibold text-sm transition-all ${
                period === p
                  ? "bg-purple-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-white hover:bg-opacity-50"
              }`}
            >
              {p === "day"
                ? "Hôm nay"
                : p === "week"
                  ? "Tuần"
                  : p === "month"
                    ? "Tháng"
                    : "Năm"}
            </button>
          ))}
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 gap-3">
          <ScoreCard
            label="Ngủ"
            score={sleepScore}
            value={stats.sleepHours}
            unit="h"
            color="from-blue-500 to-blue-600"
          />
          <ScoreCard
            label="Tập trung"
            score={focusScore}
            value={stats.focusHours}
            unit="h"
            color="from-emerald-500 to-emerald-600"
          />
          <ScoreCard
            label="Nghỉ ngơi"
            score={restScore}
            value={10 - stats.screenTimeHours}
            unit="h"
            color="from-orange-500 to-orange-600"
          />
        </div>

        {/* Focus Time Chart */}
        <div className="bg-white bg-opacity-50 backdrop-blur-md rounded-3xl p-6 border border-white border-opacity-60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Thời gian tập trung</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>

          <div className="flex items-end justify-between gap-2 h-48">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, i) => {
              const height = [65, 72, 55, 80, 90, 70, 45][i];
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-t-lg transition-all hover:from-purple-600 hover:to-purple-400" style={{ height: `${height}px` }}></div>
                  <p className="text-xs text-gray-600 font-medium">{day}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white bg-opacity-50 backdrop-blur-md rounded-3xl p-6 border border-white border-opacity-60">
          <h3 className="font-semibold text-gray-900 mb-4">Phân bổ hoạt động</h3>

          <div className="flex items-center justify-between mb-6">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />

                {/* Focus segment (50%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray="141 282"
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />

                {/* Sleep segment (35%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeDasharray="99 282"
                  strokeDashoffset="-141"
                  transform="rotate(-90 50 50)"
                />

                {/* Screen time segment (15%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="8"
                  strokeDasharray="42 282"
                  strokeDashoffset="-240"
                  transform="rotate(-90 50 50)"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.focusHours.toFixed(1)}h</p>
                  <p className="text-xs text-gray-600">Tập trung</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <p className="text-sm text-gray-700">Tập trung: {stats.focusHours.toFixed(1)}h</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <p className="text-sm text-gray-700">Ngủ: {stats.sleepHours.toFixed(1)}h</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <p className="text-sm text-gray-700">Màn hình: {stats.screenTimeHours.toFixed(1)}h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Streaks & Achievements */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white bg-opacity-50 backdrop-blur-md rounded-2xl p-4 border border-white border-opacity-60 text-center">
            <p className="text-3xl font-bold text-amber-600">{stats.streak}</p>
            <p className="text-xs text-gray-600 mt-2 font-medium">Phiên tập trung</p>
          </div>
          <div className="bg-white bg-opacity-50 backdrop-blur-md rounded-2xl p-4 border border-white border-opacity-60 text-center">
            <p className="text-3xl font-bold text-red-500">
              {Math.max(0, 7 - Math.floor(stats.screenTimeHours / 2))}
            </p>
            <p className="text-xs text-gray-600 mt-2 font-medium">Ngày liên tiếp</p>
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
          <Link to="/my-apps" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
            <LayoutGrid className="w-5 h-5" />
            <span className="text-xs font-medium">My apps</span>
          </Link>
          <Link to="/timer" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
            <Clock className="w-5 h-5" />
            <span className="text-xs font-medium">Timer</span>
          </Link>
          <Link to="/community" className="flex flex-col items-center gap-1 text-purple-600">
            <Users className="w-5 h-5" />
            <span className="text-xs font-medium">Community</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
