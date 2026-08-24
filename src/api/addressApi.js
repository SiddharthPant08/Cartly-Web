import apiClient from './axiosClient'

export const getAddresses = async () => {
  const response = await apiClient.get('/auth/addresses')
  return response.data
}

export const addAddressApi = async (address) => {
  const response = await apiClient.post('/auth/addresses', address)
  return response.data
}

export const removeAddressApi = async (addressId) => {
  const response = await apiClient.delete(`/auth/addresses/${addressId}`)
  return response.data
}