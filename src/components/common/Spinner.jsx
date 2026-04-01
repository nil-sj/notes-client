import styles from './Spinner.module.css'

function Spinner({ message = 'Loading...' }) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  )
}

export default Spinner