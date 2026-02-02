import api from './axios'

export const fetchTransactions = async () =>
  (await api.get('/transactions/all')).data
