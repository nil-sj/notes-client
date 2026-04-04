import styles from './Pagination.module.css'

function Pagination({ pagination, onPageChange }) {
  const { page, totalPages, hasNextPage, hasPrevPage } = pagination

  if (totalPages <= 1) return null

  // build page number array — show up to 5 pages around current
  const pages = []
  const start = Math.max(1, page - 2)
  const end   = Math.min(totalPages, page + 2)
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className={styles.container}>
      <button
        className={styles.btn}
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevPage}
      >
        ← Prev
      </button>

      {start > 1 && (
        <>
          <button className={styles.btn} onClick={() => onPageChange(1)}>1</button>
          {start > 2 && <span className={styles.ellipsis}>...</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          className={`${styles.btn} ${p === page ? styles.active : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className={styles.ellipsis}>...</span>}
          <button className={styles.btn} onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        className={styles.btn}
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
      >
        Next →
      </button>
    </div>
  )
}

export default Pagination