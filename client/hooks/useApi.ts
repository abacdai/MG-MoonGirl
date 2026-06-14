import { useState, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface ApiError {
  error: string;
  [key: string]: any;
}

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const getToken = () => localStorage.getItem("auth_token");
  const setToken = (token: string) => localStorage.setItem("auth_token", token);
  const clearToken = () => localStorage.removeItem("auth_token");

  const request = useCallback(
    async <T,>(
      method: string,
      endpoint: string,
      data?: any
    ): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        const token = getToken();
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const options: RequestInit = {
          method,
          headers,
        };

        if (data && (method === "POST" || method === "PATCH" || method === "PUT")) {
          options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE}${endpoint}`, options);

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData);
          return null;
        }

        const result = await response.json();
        return result as T;
      } catch (err) {
        const errorObj = {
          error: err instanceof Error ? err.message : "Network error",
        };
        setError(errorObj);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Auth endpoints
  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      const result = await request<{ token: string; user: any }>(
        "POST",
        "/api/auth/register",
        { email, password, displayName }
      );
      if (result?.token) {
        setToken(result.token);
      }
      return result;
    },
    [request]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await request<{ token: string; user: any }>(
        "POST",
        "/api/auth/login",
        { email, password }
      );
      if (result?.token) {
        setToken(result.token);
      }
      return result;
    },
    [request]
  );

  const getProfile = useCallback(async () => {
    return request("GET", "/api/auth/profile");
  }, [request]);

  const updateProfile = useCallback(
    async (displayName: string, birthday: string, linkedAccounts: string[]) => {
      return request("PATCH", "/api/auth/profile", {
        displayName,
        birthday,
        linkedAccounts,
      });
    },
    [request]
  );

  const linkAccount = useCallback(
    async (account: string) => {
      return request("POST", "/api/auth/link-account", { account });
    },
    [request]
  );

  const unlinkAccount = useCallback(
    async (account: string) => {
      return request("POST", "/api/auth/unlink-account", { account });
    },
    [request]
  );

  // Focus endpoints
  const startSession = useCallback(
    async (mode: string, focusTime: number) => {
      return request("POST", "/api/focus/start", { mode, focusTime });
    },
    [request]
  );

  const endSession = useCallback(
    async (sessionId: string, clientEndTimestamp: number, claimedDuration: number, clientHash: string) => {
      return request("POST", "/api/focus/end", {
        sessionId,
        clientEndTimestamp,
        claimedDuration,
        clientHash,
      });
    },
    [request]
  );

  const getSessions = useCallback(async () => {
    return request("GET", "/api/focus/sessions");
  }, [request]);

  const getStats = useCallback(async () => {
    return request("GET", "/api/focus/stats");
  }, [request]);

  // Room endpoints
  const getRooms = useCallback(async () => {
    return request("GET", "/api/rooms");
  }, [request]);

  const unlockRoom = useCallback(
    async (roomType: string) => {
      return request("POST", "/api/rooms/unlock", { roomType });
    },
    [request]
  );

  const placeFurniture = useCallback(
    async (roomId: string, catalogId: string, posX: number, posY: number, rotation: number = 0, scale: number = 1) => {
      return request("POST", "/api/rooms/furniture/place", {
        roomId,
        catalogId,
        posX,
        posY,
        rotation,
        scale,
      });
    },
    [request]
  );

  const moveFurniture = useCallback(
    async (itemId: string, posX: number, posY: number, rotation: number = 0) => {
      return request("PATCH", "/api/rooms/furniture/move", {
        itemId,
        posX,
        posY,
        rotation,
      });
    },
    [request]
  );

  const getRoomFurniture = useCallback(
    async (roomId: string) => {
      return request("GET", `/api/rooms/${roomId}/furniture`);
    },
    [request]
  );

  return {
    loading,
    error,
    getToken,
    setToken,
    clearToken,
    // Auth
    register,
    login,
    getProfile,
    updateProfile,
    linkAccount,
    unlinkAccount,
    // Focus
    startSession,
    endSession,
    getSessions,
    getStats,
    // Rooms
    getRooms,
    unlockRoom,
    placeFurniture,
    moveFurniture,
    getRoomFurniture,
  };
};
