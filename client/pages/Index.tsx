import { Link } from "react-router-dom";
import { Flame, Clock, Users, LayoutGrid, Home, Coins, X, Globe, Cloud, Shield, Info } from "lucide-react";
import { useState } from "react";
import { useStats } from "@/hooks/useStats";
import { useLanguage, type Language } from "@/hooks/useLanguage";

export default function Index() {
  const [showProfile, setShowProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [displayName, setDisplayName] = useState("Moon Girl");
  const [userId, setUserId] = useState("moongirl_2024");
  const [birthday, setBirthday] = useState("15/06/2004");
  const [linkedAccounts, setLinkedAccounts] = useState<string[]>(["gmail"]);
  const [birthdayError, setBirthdayError] = useState("");
  const { stats } = useStats();
  const { t, language, changeLanguage } = useLanguage();

  const validateBirthday = (value: string) => {
    if (!value) {
      setBirthdayError("");
      return true;
    }

    const parts = value.split("/");
    if (parts.length !== 3) {
      setBirthdayError("Định dạng phải là DD/MM/YYYY");
      return false;
    }

    const [dayStr, monthStr, yearStr] = parts;

    // Validate day (2 digits, 01-31)
    if (!/^\d{2}$/.test(dayStr)) {
      setBirthdayError("Ngày phải là 2 chữ số");
      return false;
    }
    const day = parseInt(dayStr);
    if (day < 1 || day > 31) {
      setBirthdayError("Ngày phải từ 01 đến 31");
      return false;
    }

    // Validate month (1-12)
    if (!/^\d{1,2}$/.test(monthStr)) {
      setBirthdayError("Tháng phải là số");
      return false;
    }
    const month = parseInt(monthStr);
    if (month < 1 || month > 12) {
      setBirthdayError("Tháng phải từ 1 đến 12");
      return false;
    }

    // Validate year (not 0000)
    if (!/^\d{4}$/.test(yearStr)) {
      setBirthdayError("Năm phải là 4 chữ số");
      return false;
    }
    const year = parseInt(yearStr);
    if (year === 0) {
      setBirthdayError("Năm không được là 0000");
      return false;
    }

    setBirthdayError("");
    return true;
  };

  const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBirthday(value);
    validateBirthday(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-emerald-50 pb-24 relative">
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

      {/* Hero Section with Sky */}
      <div className="relative h-80 overflow-hidden">
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-300 via-blue-100 to-emerald-100"></div>

        {/* Sun */}
        <div className="absolute top-12 right-16 w-16 h-16 bg-yellow-300 rounded-full border-4 border-yellow-400 shadow-lg"></div>

        {/* Clouds */}
        <div className="absolute top-20 left-12 w-24 h-8 bg-white rounded-full opacity-80"></div>
        <div className="absolute top-32 right-32 w-20 h-6 bg-white rounded-full opacity-75"></div>
        <div className="absolute top-28 left-1/3 w-28 h-8 bg-white rounded-full opacity-70"></div>

        {/* Ground */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-emerald-200 to-emerald-300 rounded-t-3xl"></div>

        {/* Header Text - overlaid on sky */}
        <div className="absolute top-16 left-0 right-0 px-6 z-10">
          <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
            {displayName}
          </p>
          <h1 className="text-3xl font-bold text-gray-800 mt-1">
            Xin chào, {displayName.split(" ")[0]} ✦
          </h1>
        </div>

        {/* Top right stats */}
        <div className="absolute top-16 right-6 flex gap-2 z-10">
          <div className="flex items-center gap-1 bg-white bg-opacity-70 px-3 py-1 rounded-full text-sm font-semibold text-amber-700">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>12</span>
          </div>
          <button
            onClick={() => setShowProfile(true)}
            className="w-9 h-9 rounded-full bg-white bg-opacity-70 border-2 border-purple-400 flex items-center justify-center hover:bg-opacity-100 transition-all active:scale-95 overflow-hidden"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fba72f63a5bba44549447920eb5aafca6%2F53c67ac6403e4d22b9b5c08cce16eaad?format=webp&width=800&height=1200"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>

        {/* Empty House State - centered on ground */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-5">
          <div className="w-16 h-16 rounded-2xl bg-white bg-opacity-60 border border-white border-opacity-70 flex items-center justify-center backdrop-blur-sm">
            <span className="text-4xl">🏚️</span>
          </div>
          <p className="text-sm font-semibold text-gray-700">Chưa có căn nhà nào</p>
          <p className="text-xs text-gray-600 text-center max-w-xs px-4">
            Tập trung không dùng điện thoại để kiếm MoonCoins
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 -mt-12 relative z-10 space-y-4">
        {/* MoonCoins Score Bubble */}
        <div className="bg-white bg-opacity-50 backdrop-blur-md rounded-3xl shadow-lg px-6 py-5 flex justify-between items-center border border-white border-opacity-60">
          <div>
            <p className="text-xs uppercase text-gray-600 font-semibold tracking-wider">
              MoonCoins
            </p>
            <p className="text-4xl font-bold text-gray-900 mt-2 flex items-center gap-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fba72f63a5bba44549447920eb5aafca6%2Fd39b6cc16c8f41a8a542a275af35e5c4?format=webp&width=800&height=1200"
                alt="MoonCoins"
                className="w-7 h-7 drop-shadow-md"
              />
              {stats.moonCoins.toLocaleString()}
            </p>
          </div>
          <div className="text-5xl opacity-40">✦</div>
        </div>

        {/* Stats Pills */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white bg-opacity-40 backdrop-blur-md rounded-2xl shadow-md border border-white border-opacity-60 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.sleepHours.toFixed(1)}h</div>
            <p className="text-xs text-gray-700 font-medium mt-2">Ngủ</p>
          </div>
          <div className="bg-white bg-opacity-40 backdrop-blur-md rounded-2xl shadow-md border border-white border-opacity-60 p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{stats.focusHours.toFixed(1)}h</div>
            <p className="text-xs text-gray-700 font-medium mt-2">Tập trung</p>
          </div>
          <div className="bg-white bg-opacity-40 backdrop-blur-md rounded-2xl shadow-md border border-white border-opacity-60 p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{stats.screenTimeHours.toFixed(1)}h</div>
            <p className="text-xs text-gray-700 font-medium mt-2">Màn hình</p>
          </div>
        </div>

        {/* Insight Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-3">
            Hôm nay
          </p>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">▶️</span>
            </div>
            <p className="text-sm text-gray-700">
              YouTube chiếm <span className="font-semibold text-purple-600">3 giờ 17 phút</span> thời gian của bạn hôm nay
            </p>
          </div>
        </div>

        {/* Focus CTA Button */}
        <Link
          to="/timer"
          className="block bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-2xl p-4 shadow-lg text-white font-semibold transition-all active:scale-95"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-80 font-medium">
                Cách duy nhất kiếm điểm
              </p>
              <p className="text-lg font-bold mt-1">Bắt đầu tập trung</p>
              <p className="text-xs opacity-70 mt-1">
                Đặt máy xuống · nhận MoonCoins · xây nhà
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xl flex-shrink-0">
              ▶️
            </div>
          </div>
        </Link>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm border-t border-gray-200 z-30">
        <div className="flex justify-around items-center py-3">
          <Link
            to="/"
            className="flex flex-col items-center gap-1 text-purple-600"
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
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600"
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

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={() => setShowEditProfile(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 relative">
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <h2 className="text-2xl font-bold text-white">Chỉnh sửa hồ sơ</h2>
                <p className="text-blue-100 text-sm mt-1">Cập nhật thông tin cá nhân của bạn</p>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-5">
                {/* Display Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Nhập tên hiển thị"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* User ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Nhập tên ID"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tên ID không thể thay đổi sau khi tạo
                    </p>
                  </div>
                </div>

                {/* Birthday */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày sinh
                  </label>
                  <input
                    type="text"
                    value={birthday}
                    onChange={handleBirthdayChange}
                    placeholder="DD/MM/YYYY"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      birthdayError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {birthdayError && (
                    <p className="text-xs text-red-600 mt-1">{birthdayError}</p>
                  )}
                </div>

                {/* Linked Accounts */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Tài khoản được liên kết
                  </label>
                  <p className="text-xs text-gray-600 mb-3">
                    Liên kết tài khoản để sao lưu dữ liệu của bạn
                  </p>

                  <div className="space-y-2">
                    {/* Gmail */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-lg">
                          📧
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">Gmail</p>
                          <p className="text-xs text-gray-500">
                            {linkedAccounts.includes("gmail")
                              ? "Đã liên kết"
                              : "Chưa liên kết"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setLinkedAccounts((prev) =>
                            prev.includes("gmail")
                              ? prev.filter((acc) => acc !== "gmail")
                              : [...prev, "gmail"]
                          );
                        }}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                          linkedAccounts.includes("gmail")
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {linkedAccounts.includes("gmail") ? "Bỏ liên kết" : "Liên kết"}
                      </button>
                    </div>

                    {/* Facebook */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                          👥
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">Facebook</p>
                          <p className="text-xs text-gray-500">
                            {linkedAccounts.includes("facebook")
                              ? "Đã liên kết"
                              : "Chưa liên kết"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setLinkedAccounts((prev) =>
                            prev.includes("facebook")
                              ? prev.filter((acc) => acc !== "facebook")
                              : [...prev, "facebook"]
                          );
                        }}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                          linkedAccounts.includes("facebook")
                            ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {linkedAccounts.includes("facebook") ? "Bỏ liên kết" : "Liên kết"}
                      </button>
                    </div>

                    {/* Apple */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                          🍎
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">Apple</p>
                          <p className="text-xs text-gray-500">
                            {linkedAccounts.includes("apple")
                              ? "Đã liên kết"
                              : "Chưa liên kết"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setLinkedAccounts((prev) =>
                            prev.includes("apple")
                              ? prev.filter((acc) => acc !== "apple")
                              : [...prev, "apple"]
                          );
                        }}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                          linkedAccounts.includes("apple")
                            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {linkedAccounts.includes("apple") ? "Bỏ liên kết" : "Liên kết"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={() => setShowProfile(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 relative">
                <button
                  onClick={() => setShowProfile(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="flex flex-col items-center gap-4 pt-2">
                  <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 border-3 border-white flex items-center justify-center backdrop-blur-sm overflow-hidden">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2Fba72f63a5bba44549447920eb5aafca6%2F53c67ac6403e4d22b9b5c08cce16eaad?format=webp&width=800&height=1200"
                      alt="Profile Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">{displayName}</h2>
                    <p className="text-purple-100 text-sm mt-1">@{userId}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="p-6 space-y-4 border-b border-gray-100">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center border border-blue-200">
                    <p className="text-2xl font-bold text-blue-600">{stats.moonCoins.toLocaleString()}</p>
                    <p className="text-xs text-blue-600 mt-1 font-medium">MoonCoins</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 text-center border border-purple-200">
                    <p className="text-2xl font-bold text-purple-600">{Math.floor(stats.focusHours / 2)}</p>
                    <p className="text-xs text-purple-600 mt-1 font-medium">Level</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-3 text-center border border-amber-200">
                    <p className="text-2xl font-bold text-amber-600">{stats.sessions.length}</p>
                    <p className="text-xs text-amber-600 mt-1 font-medium">Streak</p>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="p-6 space-y-4 border-b border-gray-100">
                <h3 className="text-sm font-bold uppercase text-gray-700 tracking-wide">
                  Thành tích
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-lg bg-yellow-100 border-2 border-yellow-400 flex items-center justify-center text-xl">
                      🏆
                    </div>
                    <p className="text-xs text-center text-gray-600">Sao Vàng</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-lg bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-xl">
                      🌱
                    </div>
                    <p className="text-xs text-center text-gray-600">Mầm Mống</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl opacity-50">
                      🎯
                    </div>
                    <p className="text-xs text-center text-gray-600">Tinh Xảo</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl opacity-50">
                      👑
                    </div>
                    <p className="text-xs text-center text-gray-600">Vua</p>
                  </div>
                </div>
              </div>

              {/* Settings/Actions */}
              <div className="p-6 space-y-3">
                <button
                  onClick={() => {
                    setShowProfile(false);
                    setShowEditProfile(true);
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
                >
                  {t("editProfile")}
                </button>
                <button
                  onClick={() => {
                    setShowProfile(false);
                    setShowSettings(true);
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
                >
                  {t("settings")}
                </button>
                <button
                  onClick={() => setShowProfile(false)}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={() => setShowSettings(false)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 my-8">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 relative">
                <button
                  onClick={() => setShowSettings(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <h2 className="text-2xl font-bold text-white">{t("settings")}</h2>
                <p className="text-blue-100 text-sm mt-1">Quản lý cài đặt ứng dụng</p>
              </div>

              {/* Settings Content */}
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {/* About */}
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{t("about")}</p>
                    <p className="text-xs text-gray-600">Thông tin về Moon Girl</p>
                  </div>
                </div>

                {/* Language */}
                <div className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="font-semibold text-gray-900">{t("language")}</p>
                  </div>
                  <div className="flex gap-2 ml-8">
                    {(["vi", "en"] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => changeLanguage(lang)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          language === lang
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {lang === "vi" ? t("vietnamese") : t("english")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sync */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 text-purple-600">🔄</div>
                    <div>
                      <p className="font-semibold text-gray-900">{t("sync")}</p>
                      <p className="text-xs text-gray-600">{t("syncDesc")}</p>
                    </div>
                  </div>
                  <button className="bg-purple-100 text-purple-600 hover:bg-purple-200 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                    {t("sync")}
                  </button>
                </div>

                {/* Upload to Cloud */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Cloud className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">{t("uploadCloud")}</p>
                      <p className="text-xs text-gray-600">{t("uploadDesc")}</p>
                    </div>
                  </div>
                  <button className="bg-orange-100 text-orange-600 hover:bg-orange-200 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                    {t("uploadCloud")}
                  </button>
                </div>

                {/* Privacy Policy */}
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                  <Shield className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{t("privacy")}</p>
                    <p className="text-xs text-gray-600">Đọc chính sách bảo mật</p>
                  </div>
                </div>

                {/* Version */}
                <div className="pt-4 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-600">
                    {t("version")}: <span className="font-semibold text-gray-900">{t("vbeta")}</span>
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <div className="p-6 border-t border-gray-100">
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  {t("close")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
