import axiosInstance from './axiosInstance'

export const getNotes = (params) =>
  axiosInstance.get('/notes', { params })

export const getMyNotes = (params) =>
  axiosInstance.get('/notes/mine', { params })

export const getNoteById = (id) =>
  axiosInstance.get(`/notes/${id}`)

export const createNote = (formData) =>
  axiosInstance.post('/notes', formData)

export const updateNote = (id, formData) =>
  axiosInstance.put(`/notes/${id}`, formData)

export const updateNoteImage = (id, formData) =>
  axiosInstance.patch(`/notes/${id}/image`, formData)

export const publishNote = (id) =>
  axiosInstance.patch(`/notes/${id}/publish`)

export const approveNote = (id, action) =>
  axiosInstance.patch(`/notes/${id}/approve`, { action })

export const deleteNote = (id) =>
  axiosInstance.delete(`/notes/${id}`)