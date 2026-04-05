import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNoteById, editNote, clearCurrentNote, clearNotesError } from '../store/notesSlice'
import NoteForm from '../components/notes/NoteForm'
import Spinner  from '../components/common/Spinner'
import styles   from './EditNotePage.module.css'

function EditNotePage() {
  const { id }   = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentNote: note, loading, error } = useSelector(state => state.notes)

  useEffect(() => {
    dispatch(fetchNoteById(id))
    return () => dispatch(clearCurrentNote())
  }, [dispatch, id])

  const handleSubmit = async (formData) => {
    dispatch(clearNotesError())
    const result = await dispatch(editNote({ id, formData }))
    if (editNote.fulfilled.match(result)) {
      navigate(`/notes/${id}`)
    }
  }

  if (loading && !note) return <Spinner message="Loading note..." />

  if (error && !note) return (
    <div className={styles.page}>
      <div className={styles.error}>{error}</div>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Edit note</h1>
          <p>Changes are saved immediately and stay private until re-published</p>
        </div>
        {note && (
          <NoteForm
            initialData={note}
            onSubmit={handleSubmit}
            submitting={loading}
            error={error}
          />
        )}
      </div>
    </div>
  )
}

export default EditNotePage