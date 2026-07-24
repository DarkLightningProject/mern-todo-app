import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/navbar.css'

const AUTH_STORAGE_KEY = 'login'

const Navbar = () => {
  const [login, setLogin] = useState(localStorage.getItem(AUTH_STORAGE_KEY))
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setLogin(null)
    window.dispatchEvent(new Event('localStorage-change'))
    navigate('/login')
  }

  useEffect(() => {
    const handleStorageChange = () => {
      setLogin(localStorage.getItem(AUTH_STORAGE_KEY))
    }

    window.addEventListener('localStorage-change', handleStorageChange)

    return () => {
      window.removeEventListener('localStorage-change', handleStorageChange)
    }
  }, [])

  return (
    <div>
      <nav className="navbar">
        <div className="logo">To Do App</div>
        <ul className="nav-links">
          {login ? (
            <>
              <li><Link to="/">List</Link></li>
              <li><Link to="/add">Add Task</Link></li>
              <li><Link to="/login" onClick={logout}>Logout</Link></li>
            </>
          ) : null}
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
