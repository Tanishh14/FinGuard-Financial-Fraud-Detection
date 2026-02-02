import { create } from 'zustand'

export type Role = 'admin' | 'user'

interface AuthState {
  token: string | null
  role: Role | null
  login: (token: string, role: Role) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,

  login: (token, role) =>
    set({
      token,
      role
    }),

  logout: () =>
    set({
      token: null,
      role: null
    })
}))
