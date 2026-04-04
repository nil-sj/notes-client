import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getNoteById, deleteNote, publishNote } from '../api/notesApi'
import { useAuth } from '../hooks/useAuth'
import Spinner from '../components/common/Spinner'
import styles from './NoteDetailPage.module.css'

function NoteDetailPage() {
  const { id }       = useParams()
  const { user }     = useAuth()
  const navigate     = useNavigate()

  const [note,    setNote]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [deleting,  setDeleting]  = useState(false)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    setLoading(true)
    getNoteById(id)
      .then(res => setNote(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const isOwner = user && note && user.id === note.createdBy?._id

  const handleDelete = async () => {
    if (!window.confirm('Delete this note? This cannot be undone.')) return
    setDeleting(true)
    try {
      await deleteNote(id)
      navigate('/my-notes')
    } catch (err) {
      setError(err.message)
      setDeleting(false)
    }
  }

  const handlePublish = async () => {
    setPublishing(true)
    try {
      const res = await publishNote(id)
      setNote(res.data.note)
    } catch (err) {
      setError(err.message)
    } finally {
      setPublishing(false)
    }
  }

  const formattedDate = note
    ? new Date(note.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    : ''

  if (loading) return <Spinner message="Loading note..." />

  if (error) return (
    <div className={styles.page}>
      <div className={styles.error}>
        <p>{error}</p>
        <Link to="/" className={styles.backLink}>← Back to home</Link>
      </div>
    </div>
  )

  if (!note) return null

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* back link */}
        <Link to="/" className={styles.backLink}>← Back to notes</Link>

        {/* cover image */}
        {note.imageUrl && (
          <img
            src={`http://localhost:5000${note.imageUrl}`}
            alt={note.title}
            className={styles.coverImage}
          />
        )}

        {/* header */}
        <div className={styles.header}>
          {note.category && (
            <div className={styles.category}>
              {note.category.iconUrl && (
                <img
                  src={`http://localhost:5000${note.category.iconUrl}`}
                  alt={note.category.name}
                  className={styles.categoryIcon}
                />
              )}
              <span
                className={styles.categoryName}
                style={{
                  backgroundColor: note.category.color + '22',
                  color: note.category.color,
                }}
              >
                {note.category.name}
              </span>
            </div>
          )}

          {/* status badge */}
          <span className={`${styles.status} ${styles[note.status]}`}>
            {note.status}
          </span>
        </div>

        <h1 className={styles.title}>{note.title}</h1>

        <div className={styles.meta}>
          <span>By {note.createdBy?.name || 'Unknown'}</span>
          <span className={styles.dot}>·</span>
          <span>{formattedDate}</span>
        </div>

        {/* content */}
        {note.content && (
          <div className={styles.content}>
            {note.content.split('\n').map((para, i) => (
              para.trim()
                ? <p key={i}>{para}</p>
                : <br key={i} />
            ))}
          </div>
        )}

        {/* tags */}
        {note.tags?.length > 0 && (
          <div className={styles.tags}>
            {note.tags.map(tag => (
              <span key={tag} className={styles.tag}>#{tag}</span>
            ))}
          </div>
        )}

        {/* owner actions */}
        {isOwner && (
          <div className={styles.actions}>
            <Link
              to={`/notes/${id}/edit`}
              className={styles.editBtn}
            >
              Edit note
            </Link>

            {note.status === 'private' && (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className={styles.publishBtn}
              >
                {publishing ? 'Submitting...' : 'Request publish'}
              </button>
            )}

            {note.status === 'pending' && (
              <span className={styles.pendingNote}>
                Awaiting admin approval
              </span>
            )}

            <button
              onClick={handleDelete}
              disabled={deleting}
              className={styles.deleteBtn}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default NoteDetailPage