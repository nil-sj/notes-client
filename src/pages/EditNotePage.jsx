import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getNoteById, updateNote } from '../api/notesApi'
import NoteForm from '../components/notes/NoteForm'
import Spinner  from '../components/common/Spinner'
import styles   from './EditNotePage.module.css'

function EditNotePage() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [note,       setNote]       = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState(null)

  useEffect(() => {
    getNoteById(id)
      .then(res => setNote(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (formData) => {
    setError(null)
    setSubmitting(true)
    try {
      await updateNote(id, formData)
      navigate(`/notes/${id}`)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  if (loading) return <Spinner message="Loading note..." />

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
        <NoteForm
          initialData={note}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
        />
      </div>
    </div>
  )
}

export default EditNotePage