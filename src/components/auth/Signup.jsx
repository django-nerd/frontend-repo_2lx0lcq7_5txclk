import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('donor')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', cred.user.uid), {
        email,
        role,
        createdAt: serverTimestamp(),
      })
      navigate('/')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
        <p className="text-gray-600 mt-1">Join EcoPlates and pick your role</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="mt-1 w-full rounded-md border-gray-300 focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="mt-1 w-full rounded-md border-gray-300 focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select value={role} onChange={(e)=>setRole(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
              <option value="donor">Donor</option>
              <option value="ngo">NGO</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button disabled={loading} className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50">{loading? 'Creating...':'Create account'}</button>
        </form>
        <p className="mt-4 text-sm text-gray-600">Already have an account? <Link to="/login" className="text-emerald-600 hover:underline">Log in</Link></p>
      </div>
    </div>
  )
}
