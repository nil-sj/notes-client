import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/authSlice'
import styles from './Navbar.module.css'

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>
        <Link to="/">NotesApp</Link>
      </div>

      <div className={styles.links}>
        <Link to="/">Home</Link>
        {user && (
          <>
            <Link to="/notes/new">New Note</Link>
            <Link to="/my-notes">My Notes</Link>
            {user.role === 'admin' && (
              <Link to="/admin">Admin</Link>
            )}
          </>
        )}
      </div>

      <div className={styles.auth}>
        {user ? (
          <>
            <span className={styles.username}>Hi, {user.name}</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login"    className={styles.loginLink}>Sign in</Link>
            <Link to="/register" className={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar