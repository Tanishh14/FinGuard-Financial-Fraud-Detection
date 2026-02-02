import { useAuthStore } from '../auth/auth.store'

export const useAuth = () => ({
  token: useAuthStore(s => s.token),
  role: useAuthStore(s => s.role),
  login: useAuthStore(s => s.login),
  logout: useAuthStore(s => s.logout)
})
