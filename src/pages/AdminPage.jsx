import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getPendingNotes, approveNote } from '../api/notesApi'
import Spinner    from '../components/common/Spinner'
import Pagination from '../components/common/Pagination'
import styles     from './AdminPage.module.css'

function AdminPage() {
  const [notes,      setNotes]      = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [page,       setPage]       = useState(1)

  const fetchPending = useCallback(() => {
    setLoading(true)
    setError(null)

    // reuse getNotes with a status filter — but we need a dedicated
    // admin endpoint for this. For now we call the general notes
    // endpoint with our auth token — the backend visibility logic
    // will include pending notes for admins since they are authenticated.
    // We filter client-side to pending only until we add a proper
    // admin endpoint in a later enhancement.
    getPendingNotes({ page, limit: 10 })
      .then(res => {
        setNotes(res.data.notes)
        setPagination(res.data.pagination)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))  
  }, [page])

  useEffect(() => {
    fetchPending()
  }, [fetchPending])

  const handleApprove = async (id) => {
    try {
      await approveNote(id, 'approve')
      fetchPending()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleReject = async (id) => {
    if (!window.confirm('Reject this note and return it to private?')) return
    try {
      await approveNote(id, 'reject')
      fetchPending()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Admin panel</h1>
          <p>Review notes submitted for publishing</p>
        </div>
        {pagination && (
          <div className={styles.countBadge}>
            {pagination.total} total results
          </div>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <Spinner message="Loading pending notes..." />
      ) : notes.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>✓</div>
          <p>No pending notes — all caught up!</p>
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {notes.map(note => (
              <PendingNoteRow
                key={note._id}
                note={note}
                onApprove={handleApprove}
                onReject={handleReject}
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

// ── inline sub-component ──────────────────────────────────────────
function PendingNoteRow({ note, onApprove, onReject }) {
  const [approving, setApproving] = useState(false)
  const [rejecting, setRejecting] = useState(false)

  const handleApprove = async () => {
    setApproving(true)
    await onApprove(note._id)
    setApproving(false)
  }

  const handleReject = async () => {
    setRejecting(true)
    await onReject(note._id)
    setRejecting(false)
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
          className={styles.thumb}
        />
      )}

      <div className={styles.rowBody}>
        <div className={styles.rowTop}>
          <Link to={`/notes/${note._id}`} className={styles.title}>
            {note.title}
          </Link>
          {note.category && (
            <span
              className={styles.category}
              style={{
                backgroundColor: note.category.color + '22',
                color: note.category.color,
              }}
            >
              {note.category.name}
            </span>
          )}
        </div>

        {note.content && (
          <p className={styles.excerpt}>
            {note.content.length > 100
              ? note.content.slice(0, 100) + '...'
              : note.content}
          </p>
        )}

        <div className={styles.meta}>
          <span>By {note.createdBy?.name || 'Unknown'}</span>
          <span className={styles.dot}>·</span>
          <span>{note.createdBy?.email}</span>
          <span className={styles.dot}>·</span>
          <span>{formattedDate}</span>
          {note.tags?.length > 0 && (
            <>
              <span className={styles.dot}>·</span>
              <span className={styles.tags}>
                {note.tags.map(t => `#${t}`).join(' ')}
              </span>
            </>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={handleApprove}
          disabled={approving || rejecting}
          className={styles.approveBtn}
        >
          {approving ? '...' : 'Approve'}
        </button>
        <button
          onClick={handleReject}
          disabled={approving || rejecting}
          className={styles.rejectBtn}
        >
          {rejecting ? '...' : 'Reject'}
        </button>
      </div>
    </div>
  )
}

export default AdminPage