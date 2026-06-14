import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Clock, Users, LayoutGrid, ChevronLeft, Plus, Send, Mic, MicOff, Flame } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/hooks/useAuth";

export default function Community() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const {
    isConnected,
    currentRoom,
    roomMembers,
    chatMessages,
    availableRooms,
    createRoom,
    joinRoom,
    leaveRoom,
    listRooms,
    sendMessage,
    toggleMic,
  } = useSocket();

  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showRoomList, setShowRoomList] = useState(true);
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [userMicOn, setUserMicOn] = useState(false);

  const handleCreateRoom = () => {
    if (roomName.trim()) {
      createRoom(roomName, roomDescription, 10, true);
      setRoomName("");
      setRoomDescription("");
      setShowCreateRoom(false);
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && currentRoom) {
      sendMessage(currentRoom.id, messageInput);
      setMessageInput("");
    }
  };

  const handleMicToggle = () => {
    if (currentRoom) {
      const newMicState = !userMicOn;
      setUserMicOn(newMicState);
      toggleMic(currentRoom.id, newMicState);
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

      {/* Header */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-b from-blue-300 via-blue-100 to-emerald-100">
        <div className="absolute top-8 left-6 right-6 flex justify-between items-center z-10">
          <Link
            to="/"
            className="w-9 h-9 rounded-full bg-white bg-opacity-65 border border-white border-opacity-90 flex items-center justify-center text-gray-700 hover:bg-opacity-75"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-lg font-semibold text-gray-800">Cộng đồng</h2>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
            ></div>
          </div>
        </div>

        {/* Status */}
        <div className="absolute bottom-8 left-6 right-6">
          <p className="text-sm text-gray-700 font-semibold">
            {isConnected ? "✅ Đã kết nối" : "🔌 Đang kết nối..."}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-8 relative z-10 space-y-4">
        {!currentRoom ? (
          <>
            {/* Create & Browse Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowCreateRoom(true)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Tạo phòng
              </button>
              <button
                onClick={() => {
                  setShowRoomList(!showRoomList);
                  if (!showRoomList) listRooms();
                }}
                className="bg-white bg-opacity-50 backdrop-blur-md hover:bg-opacity-70 text-gray-700 font-semibold py-3 rounded-xl transition-colors border border-white border-opacity-60 flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" />
                Duyệt phòng
              </button>
            </div>

            {/* Create Room Modal */}
            {showCreateRoom && (
              <div className="bg-white bg-opacity-50 backdrop-blur-md rounded-3xl p-6 border border-white border-opacity-60 space-y-4">
                <h3 className="font-semibold text-gray-900">Tạo phòng học tập</h3>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Tên phòng"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <textarea
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  placeholder="Mô tả (tùy chọn)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCreateRoom(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleCreateRoom}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl"
                  >
                    Tạo
                  </button>
                </div>
              </div>
            )}

            {/* Available Rooms */}
            {showRoomList && availableRooms.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Phòng có sẵn</h3>
                {availableRooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-white bg-opacity-50 backdrop-blur-md rounded-2xl p-4 border border-white border-opacity-60"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{room.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{room.description}</p>
                      </div>
                      <button
                        onClick={() => joinRoom(room.id)}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Tham gia
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600 mt-3">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {room.memberCount}/{room.maxMembers}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showRoomList && availableRooms.length === 0 && (
              <div className="bg-white bg-opacity-50 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-60 text-center">
                <p className="text-gray-600">Chưa có phòng nào. Hãy tạo một phòng!</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Current Room */}
            <div className="bg-white bg-opacity-50 backdrop-blur-md rounded-3xl p-6 border border-white border-opacity-60 space-y-4">
              {/* Room Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{currentRoom.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{currentRoom.description}</p>
                </div>
                <button
                  onClick={() => leaveRoom(currentRoom.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
                >
                  Rời
                </button>
              </div>

              {/* Members */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 uppercase">Thành viên ({roomMembers.length})</h4>
                <div className="grid grid-cols-4 gap-2">
                  {roomMembers.map((member) => (
                    <div key={member.userId} className="text-center">
                      <div
                        className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-xl border-2 ${
                          member.isFocusing
                            ? "border-emerald-500 bg-emerald-100"
                            : member.micOn
                              ? "border-purple-400 bg-purple-50"
                              : "border-gray-300 bg-gray-100"
                        }`}
                      >
                        {member.avatar}
                      </div>
                      <p className="text-xs font-medium text-gray-700 truncate">
                        {member.displayName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {member.isFocusing && "🔴 Đang học"}
                        {member.micOn && !member.isFocusing && "🎤"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                <button
                  onClick={handleMicToggle}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                    userMicOn
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {userMicOn ? (
                    <Mic className="w-5 h-5" />
                  ) : (
                    <MicOff className="w-5 h-5" />
                  )}
                  {userMicOn ? "Tắt" : "Bật"} mic
                </button>
              </div>

              {/* Chat */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 uppercase">Chat</h4>
                <div className="bg-white rounded-xl p-3 h-48 overflow-y-auto space-y-2 border border-gray-200">
                  {chatMessages.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-6">Chưa có tin nhắn</p>
                  ) : (
                    chatMessages.map((msg, i) => (
                      <div key={i} className="text-xs">
                        <p className="font-semibold text-gray-800">{msg.displayName}</p>
                        <p className="text-gray-700">{msg.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-xl transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </>
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
