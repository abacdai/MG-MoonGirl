import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./useAuth";

interface RoomMember {
  userId: string;
  displayName: string;
  avatar: string;
  isFocusing: boolean;
  micOn: boolean;
  joinedAt: Date;
}

interface StudyRoom {
  id: string;
  name: string;
  description: string;
  hostId: string;
  memberCount: number;
  maxMembers: number;
  members?: RoomMember[];
  messages?: any[];
  createdAt: Date;
}

interface ChatMessage {
  userId: string;
  displayName: string;
  content: string;
  timestamp: Date;
}

export const useSocket = () => {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<StudyRoom | null>(null);
  const [roomMembers, setRoomMembers] = useState<RoomMember[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [availableRooms, setAvailableRooms] = useState<StudyRoom[]>([]);

  // ═══════════════════════════════════════
  // CONNECTION
  // ═══════════════════════════════════════

  useEffect(() => {
    if (!user) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

    socketRef.current = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to WebSocket");

      // Authenticate
      socket.emit("user:auth", {
        userId: user.userId,
        displayName: user.displayName,
        avatar: user.avatar_url || "👤",
      });
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      setCurrentRoom(null);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    // ═══════════════════════════════════════
    // ROOM EVENTS
    // ═══════════════════════════════════════

    socket.on("room:joined", (data: { room: StudyRoom }) => {
      setCurrentRoom(data.room);
      setRoomMembers(data.room.members || []);
      setChatMessages(data.room.messages || []);
    });

    socket.on("room:memberJoined", (data: { member: RoomMember; totalMembers: number }) => {
      setRoomMembers((prev) => [...prev, data.member]);
    });

    socket.on("room:memberLeft", (data: { userId: string; totalMembers: number }) => {
      setRoomMembers((prev) => prev.filter((m) => m.userId !== data.userId));
    });

    socket.on("room:list", (data: { rooms: StudyRoom[] }) => {
      setAvailableRooms(data.rooms);
    });

    // ═══════════════════════════════════════
    // FOCUS EVENTS
    // ═══════════════════════════════════════

    socket.on("focus:started", (data: { userId: string; displayName: string }) => {
      setRoomMembers((prev) =>
        prev.map((m) => (m.userId === data.userId ? { ...m, isFocusing: true } : m))
      );
    });

    socket.on("focus:ended", (data: { userId: string; pointsEarned: number }) => {
      setRoomMembers((prev) =>
        prev.map((m) => (m.userId === data.userId ? { ...m, isFocusing: false } : m))
      );
    });

    socket.on("mic:toggled", (data: { userId: string; micOn: boolean }) => {
      setRoomMembers((prev) =>
        prev.map((m) => (m.userId === data.userId ? { ...m, micOn: data.micOn } : m))
      );
    });

    // ═══════════════════════════════════════
    // CHAT EVENTS
    // ═══════════════════════════════════════

    socket.on("chat:received", (data: { message: ChatMessage }) => {
      setChatMessages((prev) => [...prev, data.message]);
    });

    // ═══════════════════════════════════════
    // FURNITURE SYNC
    // ═══════════════════════════════════════

    socket.on("furniture:moved", (data: any) => {
      // Emit to components listening for furniture updates
      window.dispatchEvent(
        new CustomEvent("furniture:moved", { detail: data })
      );
    });

    socket.on("furniture:placed", (data: any) => {
      window.dispatchEvent(
        new CustomEvent("furniture:placed", { detail: data })
      );
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  // ═══════════════════════════════════════
  // ROOM ACTIONS
  // ═══════════════════════════════════════

  const createRoom = useCallback(
    (name: string, description: string, maxMembers: number = 10, isPublic: boolean = true) => {
      if (socketRef.current) {
        socketRef.current.emit("room:create", {
          name,
          description,
          maxMembers,
          isPublic,
          displayName: user?.displayName,
          avatar: user?.avatar_url,
        });
      }
    },
    [user]
  );

  const joinRoom = useCallback(
    (roomId: string) => {
      if (socketRef.current) {
        socketRef.current.emit("room:join", {
          roomId,
          displayName: user?.displayName,
          avatar: user?.avatar_url,
        });
      }
    },
    [user]
  );

  const leaveRoom = useCallback((roomId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("room:leave", { roomId });
      setCurrentRoom(null);
      setRoomMembers([]);
      setChatMessages([]);
    }
  }, []);

  const listRooms = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("room:list");
    }
  }, []);

  // ═══════════════════════════════════════
  // FOCUS ACTIONS
  // ═══════════════════════════════════════

  const startFocus = useCallback((roomId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("focus:start", { roomId });
    }
  }, []);

  const endFocus = useCallback((roomId: string, pointsEarned: number) => {
    if (socketRef.current) {
      socketRef.current.emit("focus:end", { roomId, pointsEarned });
    }
  }, []);

  const toggleMic = useCallback((roomId: string, micOn: boolean) => {
    if (socketRef.current) {
      socketRef.current.emit("mic:toggle", { roomId, micOn });
    }
  }, []);

  // ═══════════════════════════════════════
  // CHAT ACTIONS
  // ═══════════════════════════════════════

  const sendMessage = useCallback(
    (roomId: string, content: string) => {
      if (socketRef.current && user) {
        socketRef.current.emit("chat:send", {
          roomId,
          content,
          displayName: user.displayName,
        });
      }
    },
    [user]
  );

  // ═══════════════════════════════════════
  // FURNITURE ACTIONS
  // ═══════════════════════════════════════

  const moveFurniture = useCallback(
    (roomId: string, itemId: string, posX: number, posY: number, rotation: number = 0) => {
      if (socketRef.current) {
        socketRef.current.emit("furniture:move", {
          roomId,
          itemId,
          posX,
          posY,
          rotation,
        });
      }
    },
    []
  );

  const placeFurniture = useCallback(
    (roomId: string, catalogId: string, posX: number, posY: number) => {
      if (socketRef.current) {
        socketRef.current.emit("furniture:place", {
          roomId,
          catalogId,
          posX,
          posY,
        });
      }
    },
    []
  );

  return {
    // State
    isConnected,
    currentRoom,
    roomMembers,
    chatMessages,
    availableRooms,

    // Room actions
    createRoom,
    joinRoom,
    leaveRoom,
    listRooms,

    // Focus actions
    startFocus,
    endFocus,
    toggleMic,

    // Chat actions
    sendMessage,

    // Furniture actions
    moveFurniture,
    placeFurniture,
  };
};
