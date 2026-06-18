import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Clock, Users, LayoutGrid, ChevronLeft, Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface BlockRule {
  id: string;
  name: string;
  description?: string;
  appBundles: string[];
  startTime: string;
  endTime: string;
  weekdays: number[];
  enabled: boolean;
}

interface App {
  id: string;
  name: string;
  icon: string;
  category: string;
}

const APPS: App[] = [
  { id: "com.instagram.android", name: "Instagram", icon: "📷", category: "social" },
  { id: "com.facebook.katana", name: "Facebook", icon: "👥", category: "social" },
  { id: "com.twitter.android", name: "Twitter", icon: "🐦", category: "social" },
  { id: "com.tiktok.client.android", name: "TikTok", icon: "🎵", category: "social" },
  { id: "com.snapchat.android", name: "Snapchat", icon: "👻", category: "social" },
  { id: "com.youtube.android", name: "YouTube", icon: "📺", category: "video" },
  { id: "com.netflix.mediaclient", name: "Netflix", icon: "🎬", category: "video" },
  { id: "com.spotify.music", name: "Spotify", icon: "🎧", category: "music" },
  { id: "com.discord", name: "Discord", icon: "💜", category: "messaging" },
  { id: "com.whatsapp", name: "WhatsApp", icon: "💬", category: "messaging" },
  { id: "com.telegram", name: "Telegram", icon: "✈️", category: "messaging" },
  { id: "com.reddit.frontpage", name: "Reddit", icon: "🔴", category: "social" },
];

const WEEKDAYS = [
  { value: 0, label: "CN" },
  { value: 1, label: "T2" },
  { value: 2, label: "T3" },
  { value: 3, label: "T4" },
  { value: 4, label: "T5" },
  { value: 5, label: "T6" },
  { value: 6, label: "T7" },
];

export default function BlockRules() {
  const { t } = useLanguage();
  const [rules, setRules] = useState<BlockRule[]>([]);
  const [showCreateRule, setShowCreateRule] = useState(false);
  const [ruleName, setRuleName] = useState("");
  const [ruleDescription, setRuleDescription] = useState("");
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [activeRules, setActiveRules] = useState<BlockRule[]>([]);

  useEffect(() => {
    // Load rules (in real app, from API)
    const savedRules = localStorage.getItem("blockRules");
    if (savedRules) {
      setRules(JSON.parse(savedRules));
    }
  }, []);

  useEffect(() => {
    // Calculate active rules
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentDay = now.getDay();
    const currentTime = `${String(currentHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")}`;

    const active = rules.filter((rule) => {
      if (!rule.enabled) return false;
      if (!rule.weekdays.includes(currentDay)) return false;
      return currentTime >= rule.startTime && currentTime <= rule.endTime;
    });

    setActiveRules(active);
  }, [rules]);

  const handleCreateRule = () => {
    if (!ruleName.trim() || selectedApps.length === 0) {
      alert("Vui lòng nhập tên quy tắc và chọn ít nhất một ứng dụng");
      return;
    }

    const newRule: BlockRule = {
      id: `rule_${Date.now()}`,
      name: ruleName,
      description: ruleDescription,
      appBundles: selectedApps,
      startTime,
      endTime,
      weekdays: selectedWeekdays,
      enabled: true,
    };

    const updatedRules = [...rules, newRule];
    setRules(updatedRules);
    localStorage.setItem("blockRules", JSON.stringify(updatedRules));

    // Reset form
    setRuleName("");
    setRuleDescription("");
    setSelectedApps([]);
    setStartTime("09:00");
    setEndTime("17:00");
    setSelectedWeekdays([1, 2, 3, 4, 5]);
    setShowCreateRule(false);
  };

  const toggleWeekday = (day: number) => {
    setSelectedWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const toggleApp = (appId: string) => {
    setSelectedApps((prev) =>
      prev.includes(appId) ? prev.filter((a) => a !== appId) : [...prev, appId]
    );
  };

  const toggleRule = (ruleId: string) => {
    const updatedRules = rules.map((r) =>
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    );
    setRules(updatedRules);
    localStorage.setItem("blockRules", JSON.stringify(updatedRules));
  };

  const deleteRule = (ruleId: string) => {
    const updatedRules = rules.filter((r) => r.id !== ruleId);
    setRules(updatedRules);
    localStorage.setItem("blockRules", JSON.stringify(updatedRules));
  };

  const getBlockedAppCount = () => {
    return new Set(rules.flatMap((r) => (r.enabled ? r.appBundles : []))).size;
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
      <div className="relative h-56 overflow-hidden bg-gradient-to-b from-blue-300 via-blue-100 to-emerald-100">
        <div className="absolute top-8 left-6 right-6 flex justify-between items-center z-10">
          <Link
            to="/"
            className="w-9 h-9 rounded-full bg-white bg-opacity-65 border border-white border-opacity-90 flex items-center justify-center text-gray-700 hover:bg-opacity-75"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-lg font-semibold text-gray-800">Chặn ứng dụng</h2>
          <div className="w-9"></div>
        </div>

        {/* Status */}
        <div className="absolute bottom-8 left-6 right-6 space-y-2">
          <div className="bg-white bg-opacity-70 rounded-2xl px-4 py-3 backdrop-blur-sm border border-white border-opacity-50">
            <p className="text-xs uppercase text-gray-600 font-semibold">Đang chặn</p>
            <p className="text-2xl font-bold text-gray-900">{getBlockedAppCount()} ứng dụng</p>
            <p className="text-xs text-gray-600 mt-1">{activeRules.length} quy tắc hoạt động</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-8 relative z-10 space-y-4">
        {/* Create Rule Button */}
        <button
          onClick={() => setShowCreateRule(!showCreateRule)}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Tạo quy tắc mới
        </button>

        {/* Create Rule Modal */}
        {showCreateRule && (
          <div className="bg-white bg-opacity-50 backdrop-blur-md rounded-3xl p-6 border border-white border-opacity-60 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Quy tắc chặn mới</h3>

            {/* Rule Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên quy tắc
              </label>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder="ví dụ: Tập trung sáng"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mô tả (tùy chọn)
              </label>
              <textarea
                value={ruleDescription}
                onChange={(e) => setRuleDescription(e.target.value)}
                placeholder="Mô tả về quy tắc này"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows={2}
              />
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Từ giờ
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Đến giờ
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Weekdays */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ngày trong tuần
              </label>
              <div className="grid grid-cols-7 gap-2">
                {WEEKDAYS.map((day) => (
                  <button
                    key={day.value}
                    onClick={() => toggleWeekday(day.value)}
                    className={`py-2 rounded-lg font-medium text-sm transition-colors ${
                      selectedWeekdays.includes(day.value)
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {/* App Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ứng dụng cần chặn ({selectedApps.length})
              </label>
              <div className="grid grid-cols-4 gap-2">
                {APPS.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => toggleApp(app.id)}
                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                      selectedApps.includes(app.id)
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 bg-white hover:border-red-300"
                    }`}
                  >
                    <span className="text-2xl">{app.icon}</span>
                    <span className="text-xs font-medium text-gray-700 text-center">
                      {app.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowCreateRule(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateRule}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl"
              >
                Tạo quy tắc
              </button>
            </div>
          </div>
        )}

        {/* Rules List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Các quy tắc ({rules.length})</h3>

          {rules.length === 0 ? (
            <div className="bg-white bg-opacity-50 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-60 text-center">
              <p className="text-gray-600">Chưa có quy tắc nào. Hãy tạo một quy tắc!</p>
            </div>
          ) : (
            rules.map((rule) => (
              <div
                key={rule.id}
                className={`bg-white bg-opacity-50 backdrop-blur-md rounded-2xl p-4 border border-white border-opacity-60 space-y-3 ${
                  !rule.enabled ? "opacity-60" : ""
                }`}
              >
                {/* Rule Header */}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                    {rule.description && (
                      <p className="text-xs text-gray-600 mt-1">{rule.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      rule.enabled
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {rule.enabled ? "Bật" : "Tắt"}
                  </button>
                </div>

                {/* Rule Details */}
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                  <div>
                    <p className="font-semibold text-gray-700">Giờ</p>
                    <p>
                      {rule.startTime} - {rule.endTime}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Ngày</p>
                    <p>{rule.weekdays.length === 7 ? "Mỗi ngày" : `${rule.weekdays.length} ngày`}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Ứng dụng</p>
                    <p>{rule.appBundles.length} ứng dụng</p>
                  </div>
                </div>

                {/* Blocked Apps */}
                <div className="flex flex-wrap gap-2">
                  {rule.appBundles.map((appId) => {
                    const app = APPS.find((a) => a.id === appId);
                    return app ? (
                      <div
                        key={appId}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-medium"
                      >
                        {app.icon} {app.name}
                      </div>
                    ) : null;
                  })}
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="w-full bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa quy tắc
                </button>
              </div>
            ))
          )}
        </div>

        {/* Active Rules Info */}
        {activeRules.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-2">
            <h4 className="font-semibold text-red-900">⚠️ Quy tắc đang hoạt động</h4>
            <div className="space-y-1 text-sm text-red-800">
              {activeRules.map((rule) => (
                <p key={rule.id}>• {rule.name}</p>
              ))}
            </div>
          </div>
        )}
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
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600"
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-xs font-medium">Nhà</span>
          </Link>
          <Link to="/timer" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
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
    </div>
  );
}
