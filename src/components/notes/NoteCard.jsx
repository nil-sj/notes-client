import { Link } from 'react-router-dom'
import styles from './NoteCard.module.css'

function NoteCard({ note }) {
  const { _id, title, content, category, tags, imageUrl, createdBy, createdAt } = note

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })

  return (
    <article className={styles.card}>
      {imageUrl && (
        <Link to={`/notes/${_id}`}>
          <img
            src={`http://localhost:5000${imageUrl}`}
            alt={title}
            className={styles.image}
          />
        </Link>
      )}

      <div className={styles.body}>
        {category && (
          <div className={styles.category}>
            {category.iconUrl && (
              <img
                src={`http://localhost:5000${category.iconUrl}`}
                alt={category.name}
                className={styles.categoryIcon}
              />
            )}
            <span
              className={styles.categoryName}
              style={{ backgroundColor: category.color + '22', color: category.color }}
            >
              {category.name}
            </span>
          </div>
        )}

        <Link to={`/notes/${_id}`} className={styles.titleLink}>
          <h2 className={styles.title}>{title}</h2>
        </Link>

        {content && (
          <p className={styles.excerpt}>
            {content.length > 120 ? content.slice(0, 120) + '...' : content}
          </p>
        )}

        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map(tag => (
              <span key={tag} className={styles.tag}>#{tag}</span>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <span className={styles.author}>by {createdBy?.name || 'Unknown'}</span>
          <span className={styles.date}>{formattedDate}</span>
        </div>
      </div>
    </article>
  )
}

export default NoteCard