import { useState, useEffect, useCallback } from "react";
import { useApi } from "./useApi";
import type { FocusSession as ApiFocusSession, StatsResponse } from "@shared/api";

export interface FocusSession extends ApiFocusSession {}

export interface UserStats {
  moonCoins: number;
  focusHours: number;
  sleepHours: number;
  screenTimeHours: number;
  sessions: FocusSession[];
  level: number;
  streak: number;
}

const STORAGE_KEY = "moonGirl_stats";

const getDefaultStats = (): UserStats => ({
  moonCoins: 0,
  focusHours: 0,
  sleepHours: 0,
  screenTimeHours: 0,
  sessions: [],
  level: 1,
  streak: 0,
});

export const useStats = () => {
  const api = useApi();
  const [stats, setStats] = useState<UserStats>(getDefaultStats());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load stats from API on mount
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = useCallback(async () => {
    if (!api.getToken()) {
      // Use localStorage as fallback
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setStats(JSON.parse(saved));
        } catch {
          setStats(getDefaultStats());
        }
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await api.getStats();

      if (result) {
        const statsData = result as StatsResponse;
        setStats((prev) => ({
          ...prev,
          moonCoins: statsData.moonCoins,
          focusHours: statsData.focusHours,
          sleepHours: statsData.sleepHours,
          screenTimeHours: statsData.screenTimeHours,
          level: statsData.level,
          streak: statsData.streak,
        }));

        // Also update localStorage as fallback
        localStorage.setItem(STORAGE_KEY, JSON.stringify(statsData));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stats");
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const addFocusSession = useCallback(
    async (durationMinutes: number, mode: string = "normal") => {
      if (!api.getToken()) {
        // Fallback to local update
        setStats((prev) => ({
          ...prev,
          focusHours: prev.focusHours + durationMinutes / 60,
          moonCoins: prev.moonCoins + Math.floor((durationMinutes / 60) * 100),
        }));
        return null;
      }

      setIsLoading(true);

      try {
        // Start session
        const startResult = await api.startSession(mode, durationMinutes);
        if (!startResult) {
          setError("Failed to start session");
          return null;
        }

        const { sessionId, serverTick, clientHash } = startResult as any;

        // Simulate session completion (in real app, wait for actual completion)
        const endTimestamp = Date.now();
        const claimedDuration = durationMinutes * 60 * 1000; // milliseconds

        // End session
        const endResult = await api.endSession(
          sessionId,
          endTimestamp,
          claimedDuration,
          clientHash
        );

        if (endResult) {
          const { pointsEarned } = endResult as any;

          // Reload stats from API
          await loadStats();

          return pointsEarned;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to complete session");
      } finally {
        setIsLoading(false);
      }

      return null;
    },
    [api, loadStats]
  );

  const updateSleepHours = useCallback((hours: number) => {
    setStats((prev) => ({
      ...prev,
      sleepHours: parseFloat(hours.toFixed(1)),
    }));
  }, []);

  const resetStats = useCallback(() => {
    setStats(getDefaultStats());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    stats,
    isLoading,
    error,
    addFocusSession,
    updateSleepHours,
    resetStats,
    loadStats,
  };
};
