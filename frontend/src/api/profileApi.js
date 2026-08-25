import apiClient from './axiosClient'

export const updateProfileApi = async (profile) => {
  const response = await apiClient.put('/auth/profile', profile)

  return response.data
}