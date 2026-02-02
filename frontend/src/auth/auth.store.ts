import { create } from 'zustand'

export type Role = 'admin' | 'user'

interface AuthState {
  token: string | null
  role: Role | null
  login: (token: string, role: Role) => void
  logout: () => void
  initializeFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize from localStorage on first load
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('auth')
      if (stored) {
        const { token, role } = JSON.parse(stored)
        return { token, role }
      }
    } catch (e) {
      console.error('Failed to load auth from storage:', e)
    }
    return { token: null, role: null }
  }

  const initialState = loadFromStorage()

  return {
    token: initialState.token,
    role: initialState.role,

    login: (token, role) => {
      localStorage.setItem('auth', JSON.stringify({ token, role }))
      set({ token, role })
    },

    logout: () => {
      localStorage.removeItem('auth')
      set({ token: null, role: null })
    },

    initializeFromStorage: () => {
      const state = loadFromStorage()
      set(state)
    }
  }
})
