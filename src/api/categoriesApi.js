import axiosInstance from './axiosInstance'

export const getCategories = (params) =>
  axiosInstance.get('/categories', { params })

export const getCategoryById = (id) =>
  axiosInstance.get(`/categories/${id}`)

export const createCategory = (formData) =>
  axiosInstance.post('/categories', formData)

export const updateCategory = (id, data) =>
  axiosInstance.put(`/categories/${id}`, data)

export const updateCategoryIcon = (id, formData) =>
  axiosInstance.patch(`/categories/${id}/icon`, formData)

export const deleteCategory = (id) =>
  axiosInstance.delete(`/categories/${id}`)