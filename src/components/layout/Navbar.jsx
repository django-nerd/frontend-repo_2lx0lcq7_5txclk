import { Link, NavLink } from 'react-router-dom'
import { useAuthState } from '../../hooks/useAuthState'
import { auth } from '../../firebase'
import { signOut } from 'firebase/auth'

export default function Navbar() {
  const { user, role } = useAuthState()

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="font-extrabold text-xl text-emerald-600">
          EcoPlates
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink to="/" className={({isActive}) => `hover:text-emerald-600 ${isActive? 'text-emerald-600': 'text-gray-600'}`}>Home</NavLink>
          {user && (
            <>
              {(role === 'donor' || role === 'admin') && (
                <NavLink to="/donor" className={({isActive}) => `hover:text-emerald-600 ${isActive? 'text-emerald-600': 'text-gray-600'}`}>Donor</NavLink>
              )}
              {(role === 'ngo' || role === 'admin') && (
                <NavLink to="/ngo" className={({isActive}) => `hover:text-emerald-600 ${isActive? 'text-emerald-600': 'text-gray-600'}`}>NGO</NavLink>
              )}
              {role === 'admin' && (
                <NavLink to="/admin" className={({isActive}) => `hover:text-emerald-600 ${isActive? 'text-emerald-600': 'text-gray-600'}`}>Admin</NavLink>
              )}
            </>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-emerald-600">Log in</Link>
              <Link to="/signup" className="inline-flex items-center px-3 py-2 rounded-md bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">Sign up</Link>
            </>
          ) : (
            <button onClick={() => signOut(auth)} className="inline-flex items-center px-3 py-2 rounded-md bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800">Sign out</button>
          )}
        </div>
      </div>
    </header>
  )
}
