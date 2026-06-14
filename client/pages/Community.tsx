import { Link } from "react-router-dom";
import { Home, Clock, Users, LayoutGrid, ChevronLeft } from "lucide-react";

export default function Community() {
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
          <h2 className="text-lg font-semibold text-gray-800">Community</h2>
          <div className="w-9"></div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="text-4xl mb-3">👥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Cộng đồng
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Kết nối với những người bạn khác, chia sẻ tiến độ và tham gia các nhóm học tập chung.
          </p>
          <p className="text-xs text-gray-500">
            Tiếp tục nhắn tin để xây dựng trang này theo ý bạn.
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm border-t border-gray-200">
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
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600"
          >
            <Clock className="w-5 h-5" />
            <span className="text-xs font-medium">Timer</span>
          </Link>
          <Link
            to="/community"
            className="flex flex-col items-center gap-1 text-purple-600"
          >
            <Users className="w-5 h-5" />
            <span className="text-xs font-medium">Community</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
