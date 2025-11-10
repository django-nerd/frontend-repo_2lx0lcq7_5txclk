import { useEffect, useState } from 'react'
import { db, firebaseReady, auth } from '../../firebase'
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { useAuthState } from '../../hooks/useAuthState'

export default function NgoDashboard() {
  const { user } = useAuthState()
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!firebaseReady) return
    const q = query(collection(db, 'donations'), where('status','==','available'), orderBy('createdAt','desc'))
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [])

  const requestPickup = async (donationId) => {
    if (!user || !firebaseReady) return
    await updateDoc(doc(db, 'donations', donationId), {
      status: 'accepted',
      acceptedBy: user.uid,
      acceptedAt: serverTimestamp(),
    })
  }

  const markCompleted = async (donationId) => {
    if (!user || !firebaseReady) return
    await updateDoc(doc(db, 'donations', donationId), {
      status: 'completed',
      completedAt: serverTimestamp(),
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold">NGO Dashboard</h1>
      <p className="text-gray-600 mt-1">Browse available nearby donations in real-time and request pickups.</p>

      <div className="mt-6 grid gap-4">
        {items.map((d) => (
          <div key={d.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-semibold text-gray-900">{d.name} • <span className="text-gray-600">{d.type}</span></p>
              <p className="text-sm text-gray-600">Qty: {d.quantity} • Expires: {d.expiry || 'N/A'} • Pickup: {d.pickupTime || 'N/A'}</p>
              <p className="text-sm text-gray-600">Location: {d.location}</p>
              <p className="text-sm"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">{d.status}</span></p>
            </div>
            <div className="flex items-center gap-2">
              {d.status === 'available' && (
                <button onClick={()=>requestPickup(d.id)} className="px-3 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Request Pickup</button>
              )}
              {d.status === 'accepted' && d.acceptedBy === auth?.currentUser?.uid && (
                <button onClick={()=>markCompleted(d.id)} className="px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50">Mark Completed</button>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-gray-600">No available donations right now. Please check back later.</p>
        )}
      </div>
    </div>
  )
}
