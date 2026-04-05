import styles from './Skeleton.module.css'

function Skeleton({ width, height, borderRadius, className }) {
  return (
    <div
      className={`${styles.skeleton} ${className || ''}`}
      style={{
        width:        width        || '100%',
        height:       height       || '1rem',
        borderRadius: borderRadius || '6px',
      }}
    />
  )
}

export function NoteCardSkeleton() {
  return (
    <div className={styles.card}>
      <Skeleton height="180px" borderRadius="0" />
      <div className={styles.cardBody}>
        <Skeleton width="80px" height="20px" borderRadius="99px" />
        <Skeleton height="22px" className={styles.mt} />
        <Skeleton width="60%" height="22px" />
        <Skeleton height="14px" className={styles.mt} />
        <Skeleton width="80%" height="14px" />
        <Skeleton width="60%" height="14px" />
        <div className={styles.footer}>
          <Skeleton width="80px" height="12px" />
          <Skeleton width="60px" height="12px" />
        </div>
      </div>
    </div>
  )
}

export function NoteRowSkeleton() {
  return (
    <div className={styles.row}>
      <Skeleton width="64px" height="64px" borderRadius="8px" />
      <div className={styles.rowBody}>
        <Skeleton width="40%" height="18px" />
        <Skeleton width="70%" height="13px" className={styles.mt} />
      </div>
      <div className={styles.rowActions}>
        <Skeleton width="60px" height="32px" borderRadius="8px" />
        <Skeleton width="60px" height="32px" borderRadius="8px" />
      </div>
    </div>
  )
}

export default Skeleton