import { create } from "zustand";
import axios from "axios";
import api from "../api/axiosInstance";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  checkAuth: async () => {
    try {
      const response = await api.get("/api/auth/me/");
      set({ user: response.data, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },
  logout: async () => {
    await axios.post("/api/auth/logout/", {}, { withCredentials: true });
    set({ user: null });
  },
}));
