import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getNotes    as getNotesApi,
  getMyNotes  as getMyNotesApi,
  getNoteById as getNoteByIdApi,
  createNote  as createNoteApi,
  updateNote  as updateNoteApi,
  deleteNote  as deleteNoteApi,
  publishNote as publishNoteApi,
} from '../api/notesApi'

// ── async thunks ──────────────────────────────────────────────────

export const fetchNotes = createAsyncThunk(
  'notes/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const res = await getNotesApi(params)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchMyNotes = createAsyncThunk(
  'notes/fetchMine',
  async (params, { rejectWithValue }) => {
    try {
      const res = await getMyNotesApi(params)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchNoteById = createAsyncThunk(
  'notes/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await getNoteByIdApi(id)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const addNote = createAsyncThunk(
  'notes/add',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await createNoteApi(formData)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const editNote = createAsyncThunk(
  'notes/edit',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await updateNoteApi(id, formData)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const removeNote = createAsyncThunk(
  'notes/remove',
  async (id, { rejectWithValue }) => {
    try {
      await deleteNoteApi(id)
      return id   // return id so slice can remove it from state
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const requestPublish = createAsyncThunk(
  'notes/publish',
  async (id, { rejectWithValue }) => {
    try {
      const res = await publishNoteApi(id)
      return res.data.note
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// ── slice ─────────────────────────────────────────────────────────

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    // public notes list
    items:      [],
    pagination: null,
    // my notes list
    myItems:      [],
    myPagination: null,
    // single note detail
    currentNote: null,
    // shared loading / error
    loading: false,
    error:   null,
  },
  reducers: {
    clearCurrentNote: (state) => {
      state.currentNote = null
    },
    clearNotesError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // fetchNotes
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.items      = action.payload.notes
        state.pagination = action.payload.pagination
        state.loading    = false
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })

    // fetchMyNotes
    builder
      .addCase(fetchMyNotes.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(fetchMyNotes.fulfilled, (state, action) => {
        state.myItems      = action.payload.notes
        state.myPagination = action.payload.pagination
        state.loading      = false
      })
      .addCase(fetchMyNotes.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })

    // fetchNoteById
    builder
      .addCase(fetchNoteById.pending, (state) => {
        state.loading     = true
        state.error       = null
        state.currentNote = null
      })
      .addCase(fetchNoteById.fulfilled, (state, action) => {
        state.currentNote = action.payload
        state.loading     = false
      })
      .addCase(fetchNoteById.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })

    // addNote
    builder
      .addCase(addNote.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.myItems = [action.payload, ...state.myItems]
        state.loading = false
      })
      .addCase(addNote.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })

    // editNote
    builder
      .addCase(editNote.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(editNote.fulfilled, (state, action) => {
        state.loading     = false
        state.currentNote = action.payload
        // update in myItems list if present
        state.myItems = state.myItems.map(n =>
          n._id === action.payload._id ? action.payload : n
        )
      })
      .addCase(editNote.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })

    // removeNote
    builder
      .addCase(removeNote.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(removeNote.fulfilled, (state, action) => {
        state.loading = false
        state.myItems = state.myItems.filter(n => n._id !== action.payload)
        if (state.currentNote?._id === action.payload) {
          state.currentNote = null
        }
      })
      .addCase(removeNote.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })

    // requestPublish
    builder
      .addCase(requestPublish.fulfilled, (state, action) => {
        state.myItems = state.myItems.map(n =>
          n._id === action.payload._id ? action.payload : n
        )
        if (state.currentNote?._id === action.payload._id) {
          state.currentNote = action.payload
        }
      })
  },
})

export const { clearCurrentNote, clearNotesError } = notesSlice.actions
export default notesSlice.reducer