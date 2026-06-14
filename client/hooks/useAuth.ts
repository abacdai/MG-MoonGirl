import { useState, useCallback, useEffect } from "react";
import { useApi } from "./useApi";
import type { UserProfile, AuthResponse } from "@shared/api";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const api = useApi();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: false,
    error: null,
  });

  // Initialize from localStorage on mount
  useEffect(() => {
    const token = api.getToken();
    if (token) {
      setState((prev) => ({ ...prev, token }));
      // Load user profile
      api.getProfile().then((profile) => {
        if (profile) {
          setState((prev) => ({ ...prev, user: profile as UserProfile }));
        }
      });
    }
  }, [api]);

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await api.register(email, password, displayName);

        if (result?.token && result?.user) {
          setState({
            user: result.user as UserProfile,
            token: result.token,
            isLoading: false,
            error: null,
          });
          return true;
        } else if (api.error) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: api.error?.error || "Registration failed",
          }));
          return false;
        }
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        }));
        return false;
      }
    },
    [api]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await api.login(email, password);

        if (result?.token && result?.user) {
          setState({
            user: result.user as UserProfile,
            token: result.token,
            isLoading: false,
            error: null,
          });
          return true;
        } else if (api.error) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: api.error?.error || "Login failed",
          }));
          return false;
        }
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        }));
        return false;
      }
    },
    [api]
  );

  const logout = useCallback(() => {
    api.clearToken();
    setState({
      user: null,
      token: null,
      isLoading: false,
      error: null,
    });
  }, [api]);

  const updateProfile = useCallback(
    async (displayName: string, birthday: string, linkedAccounts: string[]) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await api.updateProfile(displayName, birthday, linkedAccounts);

        if (result) {
          setState((prev) => ({
            ...prev,
            user: result as UserProfile,
            isLoading: false,
            error: null,
          }));
          return true;
        } else if (api.error) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: api.error?.error || "Update failed",
          }));
          return false;
        }
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        }));
        return false;
      }
    },
    [api]
  );

  const linkAccount = useCallback(
    async (account: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await api.linkAccount(account);

        if (result) {
          setState((prev) => ({
            ...prev,
            user: result as UserProfile,
            isLoading: false,
            error: null,
          }));
          return true;
        } else if (api.error) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: api.error?.error || "Link failed",
          }));
          return false;
        }
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        }));
        return false;
      }
    },
    [api]
  );

  const unlinkAccount = useCallback(
    async (account: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await api.unlinkAccount(account);

        if (result) {
          setState((prev) => ({
            ...prev,
            user: result as UserProfile,
            isLoading: false,
            error: null,
          }));
          return true;
        } else if (api.error) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: api.error?.error || "Unlink failed",
          }));
          return false;
        }
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        }));
        return false;
      }
    },
    [api]
  );

  return {
    ...state,
    register,
    login,
    logout,
    updateProfile,
    linkAccount,
    unlinkAccount,
    isAuthenticated: !!state.token && !!state.user,
  };
};
