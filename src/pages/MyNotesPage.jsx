import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getMyNotes, deleteNote, publishNote } from '../api/notesApi'
import Spinner    from '../components/common/Spinner'
import Pagination from '../components/common/Pagination'
import styles     from './MyNotesPage.module.css'

const STATUS_FILTERS = [
  { label: 'All',     value: '' },
  { label: 'Private', value: 'private' },
  { label: 'Pending', value: 'pending' },
  { label: 'Public',  value: 'public' },
]

function MyNotesPage() {
  const [notes,      setNotes]      = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [status,     setStatus]     = useState('')
  const [page,       setPage]       = useState(1)

  const fetchNotes = useCallback(() => {
    setLoading(true)
    setError(null)

    const params = { page, limit: 10 }
    if (status) params.status = status

    getMyNotes(params)
      .then(res => {
        setNotes(res.data.notes)
        setPagination(res.data.pagination)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [page, status])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const handleStatusFilter = (value) => {
    setStatus(value)
    setPage(1)
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await deleteNote(id)
      fetchNotes()
    } catch (err) {
      setError(err.message)
    }
  }

  const handlePublish = async (id) => {
    try {
      await publishNote(id)
      fetchNotes()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>My notes</h1>
          <p>Manage and publish your notes</p>
        </div>
        <Link to="/notes/new" className={styles.newBtn}>
          + New note
        </Link>
      </div>

      {/* status filter tabs */}
      <div className={styles.tabs}>
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            className={`${styles.tab} ${status === f.value ? styles.activeTab : ''}`}
            onClick={() => handleStatusFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <Spinner message="Loading your notes..." />
      ) : notes.length === 0 ? (
        <div className={styles.empty}>
          <p>
            {status
              ? `No ${status} notes yet.`
              : 'You haven\'t created any notes yet.'}
          </p>
          <Link to="/notes/new" className={styles.newBtn}>
            Create your first note
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {notes.map(note => (
              <MyNoteRow
                key={note._id}
                note={note}
                onDelete={handleDelete}
                onPublish={handlePublish}
              />
            ))}
          </div>

          {pagination && (
            <Pagination pagination={pagination} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  )
}

// ── inline sub-component — only used by this page ──────────────────
function MyNoteRow({ note, onDelete, onPublish }) {
  const [publishing, setPublishing] = useState(false)
  const [deleting,   setDeleting]   = useState(false)

  const handlePublish = async () => {
    setPublishing(true)
    await onPublish(note._id)
    setPublishing(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    await onDelete(note._id, note.title)
    setDeleting(false)
  }

  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })

  return (
    <div className={styles.row}>
      {note.imageUrl && (
        <img
          src={`http://localhost:5000${note.imageUrl}`}
          alt={note.title}
          className={styles.rowThumb}
        />
      )}

      <div className={styles.rowBody}>
        <div className={styles.rowTop}>
          <Link to={`/notes/${note._id}`} className={styles.rowTitle}>
            {note.title}
          </Link>
          <span className={`${styles.statusBadge} ${styles[note.status]}`}>
            {note.status}
          </span>
        </div>

        <div className={styles.rowMeta}>
          {note.category && (
            <span
              className={styles.category}
              style={{ color: note.category.color }}
            >
              {note.category.name}
            </span>
          )}
          {note.tags?.length > 0 && (
            <span className={styles.tags}>
              {note.tags.map(t => `#${t}`).join(' ')}
            </span>
          )}
          <span className={styles.date}>{formattedDate}</span>
        </div>
      </div>

      <div className={styles.rowActions}>
        <Link
          to={`/notes/${note._id}/edit`}
          className={styles.editBtn}
        >
          Edit
        </Link>

        {note.status === 'private' && (
          <button
            onClick={handlePublish}
            disabled={publishing}
            className={styles.publishBtn}
          >
            {publishing ? '...' : 'Publish'}
          </button>
        )}

        {note.status === 'pending' && (
          <span className={styles.pendingBadge}>Pending review</span>
        )}

        <button
          onClick={handleDelete}
          disabled={deleting}
          className={styles.deleteBtn}
        >
          {deleting ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}

export default MyNotesPage