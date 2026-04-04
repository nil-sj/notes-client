import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createNote } from '../api/notesApi'
import NoteForm from '../components/notes/NoteForm'
import styles from './CreateNotePage.module.css'

function CreateNotePage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState(null)

  const handleSubmit = async (formData) => {
    setError(null)
    setSubmitting(true)
    try {
      const res = await createNote(formData)
      navigate(`/notes/${res.data._id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Create a note</h1>
          <p>Your note will be private until you request to publish it</p>
        </div>
        <NoteForm
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
        />
      </div>
    </div>
  )
}

export default CreateNotePage