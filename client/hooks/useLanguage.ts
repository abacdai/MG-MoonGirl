import { useState, useEffect, createContext, useContext } from "react";

export type Language = "vi" | "en";

export const translations = {
  vi: {
    // Common
    close: "Đóng",
    save: "Lưu thay đổi",
    cancel: "Hủy",
    edit: "Chỉnh sửa",

    // Home Page
    greeting: "Xin chào",
    moonCoins: "MoonCoins",
    sleep: "Ngủ",
    focus: "Tập trung",
    screenTime: "Màn hình",
    noHouse: "Chưa có căn nhà nào",
    focusTip: "Tập trung không dùng điện thoại để kiếm MoonCoins",
    startFocus: "Bắt đầu tập trung",
    putPhoneDown: "Đặt máy xuống",
    earnCoins: "nhận MoonCoins",
    buildHouse: "xây nhà",

    // Profile Modal
    profile: "Hồ sơ",
    user: "Người dùng",
    level: "Level",
    streak: "Streak",
    achievements: "Thành tích",
    editProfile: "Chỉnh sửa hồ sơ",
    settings: "Cài đặt",

    // Edit Profile Modal
    displayName: "Tên hiển thị",
    userId: "Tên ID",
    birthday: "Ngày sinh",
    linkedAccounts: "Tài khoản được liên kết",
    linkBackup: "Liên kết tài khoản để sao lưu dữ liệu của bạn",
    linked: "Đã liên kết",
    notLinked: "Chưa liên kết",
    link: "Liên kết",
    unlink: "Bỏ liên kết",

    // Settings Modal
    about: "Về ứng dụng",
    language: "Ngôn ngữ",
    sync: "Đồng bộ",
    uploadCloud: "Tải lên đám mây",
    privacy: "Chính sách bảo mật",
    version: "Phiên bản",
    vbeta: "vbeta",
    syncDesc: "Đồng bộ điểm số, coin, lửa và tiến độ lên đám mây",
    uploadDesc: "Tải lên dữ liệu của bạn lên đám mây ngay",
    selectLanguage: "Chọn ngôn ngữ",
    vietnamese: "Tiếng Việt",
    english: "English",

    // Timer
    timer: "Tập trung",
    infinite: "Vô hạn",
    normal: "Bình thường",
    strict: "Nghiêm ngặt",
    noLimit: "Không giới hạn",
    focusTime: "Thời gian học",
    breakTime: "Nghỉ giải lao",
    sessions: "Số buổi",
    minute: "phút",
    session: "buổi",
    blockApps: "Chặn ứng dụng",
    research: "Tra cứu",
    music: "Âm nhạc",
    notes: "Ghi chú",
    statistics: "Thống kê",
    wonderful: "Tuyệt vời!",
    focusCompleted: "Bạn hoàn thành",
    coinsEarned: "MoonCoins kiếm được",
    continue: "Tiếp tục",

    // Navigation
    home: "Home",
    myApps: "My apps",
    community: "Community",
  },
  en: {
    // Common
    close: "Close",
    save: "Save Changes",
    cancel: "Cancel",
    edit: "Edit",

    // Home Page
    greeting: "Hello",
    moonCoins: "MoonCoins",
    sleep: "Sleep",
    focus: "Focus",
    screenTime: "Screen Time",
    noHouse: "No house yet",
    focusTip: "Focus without using your phone to earn MoonCoins",
    startFocus: "Start Focus",
    putPhoneDown: "Put phone down",
    earnCoins: "earn MoonCoins",
    buildHouse: "build house",

    // Profile Modal
    profile: "Profile",
    user: "User",
    level: "Level",
    streak: "Streak",
    achievements: "Achievements",
    editProfile: "Edit Profile",
    settings: "Settings",

    // Edit Profile Modal
    displayName: "Display Name",
    userId: "User ID",
    birthday: "Birthday",
    linkedAccounts: "Linked Accounts",
    linkBackup: "Link accounts to backup your data",
    linked: "Linked",
    notLinked: "Not Linked",
    link: "Link",
    unlink: "Unlink",

    // Settings Modal
    about: "About App",
    language: "Language",
    sync: "Sync",
    uploadCloud: "Upload to Cloud",
    privacy: "Privacy Policy",
    version: "Version",
    vbeta: "vbeta",
    syncDesc: "Sync points, coins, streak and progress to cloud",
    uploadDesc: "Upload your data to cloud now",
    selectLanguage: "Select Language",
    vietnamese: "Tiếng Việt",
    english: "English",

    // Timer
    timer: "Focus",
    infinite: "Infinite",
    normal: "Normal",
    strict: "Strict",
    noLimit: "No limit",
    focusTime: "Focus Time",
    breakTime: "Break Time",
    sessions: "Sessions",
    minute: "minute",
    session: "session",
    blockApps: "Block Apps",
    research: "Research",
    music: "Music",
    notes: "Notes",
    statistics: "Statistics",
    wonderful: "Wonderful!",
    focusCompleted: "You completed",
    coinsEarned: "MoonCoins Earned",
    continue: "Continue",

    // Navigation
    home: "Home",
    myApps: "My Apps",
    community: "Community",
  },
};

const LANGUAGE_STORAGE_KEY = "moonGirl_language";

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>("vi");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    if (saved && (saved === "vi" || saved === "en")) {
      setLanguage(saved);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const t = (key: keyof (typeof translations)["vi"]): string => {
    return translations[language][key] || translations.vi[key];
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return { language, t, changeLanguage, isLoaded };
};
