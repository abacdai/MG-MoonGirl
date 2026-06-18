import { useState, useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { STATS_KEY } from "./useStats";

type FocusMode = "infinite" | "normal" | "strict";

interface ActiveSession {
  sessionId: string;
  mode: FocusMode;
  focusMinutes: number;
  startedAt: number;
  clientHash: string;
}

const API_BASE = import.meta.env.VITE_API_URL || "";

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("auth_token");
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const useFocus = () => {
  const qc = useQueryClient();

  const [mode, setMode] = useState<FocusMode>("normal");
  const [focusTime, setFocusTime] = useState(25);   // minutes
  const [breakTime, setBreakTime] = useState(5);    // minutes
  const [sessions, setSessions] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);

  const activeSession = useRef<ActiveSession | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Keep remainingSeconds in sync with focusTime when NOT playing ──
  useEffect(() => {
    if (!isPlaying) {
      setRemainingSeconds(focusTime * 60);
    }
  }, [focusTime, isPlaying]);

  // ── Slider handlers — reset countdown boundary immediately ─────────
  // When NOT playing: just update state (useEffect above syncs seconds).
  // When playing: stop session, update focusTime, reset counter so user
  //               can start a fresh session with the new duration.
  const handleFocusTimeChange = useCallback((minutes: number) => {
    if (isPlaying) {
      // Stop current session before changing duration
      setIsPlaying(false);
      activeSession.current = null;
      toast.info("Đã dừng phiên — chỉnh lại thời gian và bắt đầu lại.");
    }
    setFocusTime(minutes);
    // remainingSeconds will sync via useEffect above
  }, [isPlaying]);

  const handleBreakTimeChange = useCallback((minutes: number) => {
    setBreakTime(minutes);
  }, []);

  const handleSessionsChange = useCallback((count: number) => {
    setSessions(count);
  }, []);

  // ── Timer tick ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsPlaying(false);
          handleSessionComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying]);

  // ── Heartbeat every 30s ────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying || !activeSession.current) return;
    const hb = setInterval(async () => {
      if (!activeSession.current) return;
      try {
        await apiFetch("/api/focus/heartbeat", {
          method: "POST",
          body: JSON.stringify({
            sessionId: activeSession.current.sessionId,
            elapsedSeconds: focusTime * 60 - remainingSeconds,
          }),
        });
      } catch { /* non-fatal — server will close orphaned sessions */ }
    }, 30_000);
    return () => clearInterval(hb);
  }, [isPlaying, focusTime, remainingSeconds]);

  // ── Tab visibility penalty for strict mode ─────────────────────────
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden && isPlaying && mode === "strict" && activeSession.current) {
        setIsPlaying(false);
        apiFetch("/api/focus/penalty", {
          method: "POST",
          body: JSON.stringify({
            sessionId: activeSession.current.sessionId,
            reason: "strict_mode_tab_switch",
          }),
        }).catch(() => {});
        activeSession.current = null;
        toast.error("Ngừng tập trung trong Strict Mode! Phiên bị hủy.");
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [isPlaying, mode]);

  // ── Start session ──────────────────────────────────────────────────
  const startSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await apiFetch<{ sessionId: string; serverTick: number; clientHash: string }>(
        "/api/focus/start",
        { method: "POST", body: JSON.stringify({ mode, focusTime }) }
      );
      activeSession.current = {
        sessionId: result.sessionId,
        mode,
        focusMinutes: focusTime,
        startedAt: Date.now(),
        clientHash: result.clientHash,
      };
      setRemainingSeconds(focusTime * 60);
      setIsPlaying(true);
      toast.success("✨ Phiên tập trung bắt đầu!");
    } catch (err) {
      toast.error(`Lỗi: ${err instanceof Error ? err.message : "Unknown"}`);
    } finally {
      setIsLoading(false);
    }
  }, [mode, focusTime]);

  // ── Complete session — called when timer hits 0 ────────────────────
  const handleSessionComplete = useCallback(async () => {
    if (!activeSession.current) return;
    const sess = activeSession.current;
    activeSession.current = null;
    setIsLoading(true);
    try {
      const result = await apiFetch<{ pointsEarned: number; newBalance: number }>(
        "/api/focus/end",
        {
          method: "POST",
          body: JSON.stringify({
            sessionId: sess.sessionId,
            clientEndTimestamp: Date.now(),
            claimedDuration: sess.focusMinutes * 60 * 1000,
            clientHash: sess.clientHash,
          }),
        }
      );
      toast.success(`🎉 Bạn kiếm được ${result.pointsEarned} MoonCoins!`);
      // Invalidate stats so Dashboard re-fetches fresh numbers
      qc.invalidateQueries({ queryKey: STATS_KEY });
    } catch (err) {
      toast.error(`Lỗi lưu kết quả: ${err instanceof Error ? err.message : "Unknown"}`);
    } finally {
      setIsLoading(false);
    }
  }, [qc]);

  // ── Toggle play/pause (strict mode cannot pause) ───────────────────
  const toggleTimer = useCallback(async () => {
    if (!activeSession.current && !isPlaying) {
      await startSession();
      return;
    }
    if (mode === "strict" && isPlaying) {
      toast.error("Strict Mode: không thể dừng sớm!");
      return;
    }
    setIsPlaying((p) => !p);
  }, [isPlaying, mode, startSession]);

  const resetTimer = useCallback(() => {
    setIsPlaying(false);
    activeSession.current = null;
    setRemainingSeconds(focusTime * 60);
  }, [focusTime]);

  // ── Mode change — reset if infinite ───────────────────────────────
  const handleModeChange = useCallback((newMode: FocusMode) => {
    if (isPlaying) {
      toast.info("Dừng phiên trước khi đổi chế độ.");
      return;
    }
    setMode(newMode);
    if (newMode === "infinite") {
      setFocusTime(999);
      setRemainingSeconds(999 * 60);
    } else if (focusTime === 999) {
      setFocusTime(25);
    }
  }, [isPlaying, focusTime]);

  return {
    mode,
    focusTime,
    breakTime,
    sessions,
    isPlaying,
    isLoading,
    remainingSeconds,
    // Actions
    handleModeChange,
    handleFocusTimeChange,   // ← replaces raw setFocusTime on slider
    handleBreakTimeChange,
    handleSessionsChange,
    toggleTimer,
    resetTimer,
    // Kept for backward compat
    setMode,
    setFocusTime,
    setBreakTime,
    setSessions,
  };
};
