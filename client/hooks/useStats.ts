import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { StatsResponse, EndSessionResponse, StartSessionResponse } from "@shared/api";

const API_BASE = import.meta.env.VITE_API_URL || "";
const STORAGE_KEY = "moonGirl_stats_fallback";

// ─── Typed fetcher ───────────────────────────────────────────
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
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

// ─── Query Keys (typed constants, never magic strings) ───────
export const STATS_KEY = ["stats"] as const;
export const SESSIONS_KEY = ["sessions"] as const;

// ─── Local fallback (unauthenticated / demo mode) ────────────
function getFallbackStats(): StatsResponse {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StatsResponse;
  } catch { /* ignore */ }
  return {
    moonCoins: 0,
    focusHours: 0,
    sleepHours: 0,
    screenTimeHours: 0,
    level: 1,
    streak: 0,
  };
}

// ─── Main hook ───────────────────────────────────────────────
export function useStats() {
  const qc = useQueryClient();
  const isAuthed = Boolean(localStorage.getItem("auth_token"));

  // ── Stats query ──────────────────────────────────────────
  const statsQuery = useQuery<StatsResponse, Error>({
    queryKey: STATS_KEY,
    queryFn: async () => {
      if (!isAuthed) return getFallbackStats();
      const data = await apiFetch<StatsResponse>("/api/focus/stats");
      // Keep localStorage warm as offline fallback
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    },
    staleTime: 30_000,          // treat fresh for 30s
    gcTime: 5 * 60_000,         // keep in cache 5 min
    retry: 2,
    refetchOnWindowFocus: false, // no surprise refetch on tab switch
  });

  // ── Start session mutation ───────────────────────────────
  const startSessionMutation = useMutation<
    StartSessionResponse,
    Error,
    { mode: string; focusTime: number }
  >({
    mutationFn: ({ mode, focusTime }) =>
      apiFetch<StartSessionResponse>("/api/focus/start", {
        method: "POST",
        body: JSON.stringify({ mode, focusTime }),
      }),
  });

  // ── End session mutation — invalidates stats on success ──
  const endSessionMutation = useMutation<
    EndSessionResponse,
    Error,
    {
      sessionId: string;
      clientEndTimestamp: number;
      claimedDuration: number;
      clientHash: string;
    }
  >({
    mutationFn: (payload) =>
      apiFetch<EndSessionResponse>("/api/focus/end", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      // Re-fetch fresh stats from server after session completes
      qc.invalidateQueries({ queryKey: STATS_KEY });
      qc.invalidateQueries({ queryKey: SESSIONS_KEY });
    },
  });

  // ── Convenience: run full focus session flow ─────────────
  async function addFocusSession(
    durationMinutes: number,
    mode: string = "normal"
  ): Promise<number | null> {
    if (!isAuthed) {
      // Optimistic local update for demo / unauthenticated mode
      qc.setQueryData<StatsResponse>(STATS_KEY, (prev) => {
        const next = prev ?? getFallbackStats();
        const updated: StatsResponse = {
          ...next,
          focusHours: +(next.focusHours + durationMinutes / 60).toFixed(2),
          moonCoins: next.moonCoins + Math.floor((durationMinutes / 60) * 100),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      return Math.floor((durationMinutes / 60) * 100);
    }

    try {
      const started = await startSessionMutation.mutateAsync({ mode, focusTime: durationMinutes });
      const ended = await endSessionMutation.mutateAsync({
        sessionId: started.sessionId,
        clientEndTimestamp: Date.now(),
        claimedDuration: durationMinutes * 60 * 1000,
        clientHash: started.clientHash,
      });
      return ended.pointsEarned;
    } catch {
      return null;
    }
  }

  return {
    stats: statsQuery.data ?? getFallbackStats(),
    isLoading: statsQuery.isLoading,
    isFetching: statsQuery.isFetching,
    error: statsQuery.error,
    refetch: statsQuery.refetch,
    addFocusSession,
    isSubmittingSession:
      startSessionMutation.isPending || endSessionMutation.isPending,
  };
}
