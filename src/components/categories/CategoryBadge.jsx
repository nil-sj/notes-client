import styles from './CategoryBadge.module.css'

function CategoryBadge({ category, selected, onClick }) {
  return (
    <button
      className={`${styles.badge} ${selected ? styles.selected : ''}`}
      style={selected ? {
        backgroundColor: category.color,
        borderColor: category.color,
        color: 'white',
      } : {
        borderColor: category.color + '66',
        color: category.color,
      }}
      onClick={() => onClick(category._id)}
    >
      {category.iconUrl && (
        <img
          src={`http://localhost:5000${category.iconUrl}`}
          alt=""
          className={styles.icon}
        />
      )}
      {category.name}
    </button>
  )
}

export default CategoryBadge