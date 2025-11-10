import { useEffect, useState } from 'react'
import { auth, db, firebaseReady } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export function useAuthState() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!firebaseReady) {
      setUser(null)
      setRole(null)
      setLoading(false)
      return
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        try {
          const ref = doc(db, 'users', u.uid)
          const snap = await getDoc(ref)
          if (snap.exists()) {
            setRole(snap.data().role || null)
          } else {
            setRole(null)
          }
        } catch (e) {
          console.error('Failed to fetch role', e)
          setRole(null)
        }
      } else {
        setRole(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  return { user, role, loading, firebaseReady }
}
