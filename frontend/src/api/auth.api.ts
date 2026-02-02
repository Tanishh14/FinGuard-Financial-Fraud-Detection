import api from './axios'

export const loginApi = async (email: string, password: string) =>
  (await api.post('/auth/login', { email, password })).data

export const registerApi = async (payload: any) =>
  (await api.post('/auth/register', payload)).data
