import { useEffect, useState } from 'react'
import { db, firebaseReady } from '../../firebase'
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore'

export default function AdminDashboard() {
  const [ngos, setNgos] = useState([])

  useEffect(() => {
    if (!firebaseReady) return
    const q = query(collection(db, 'users'), where('role','==','ngo'))
    const unsub = onSnapshot(q, (snap) => {
      setNgos(snap.docs.map((d)=> ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [])

  const approveNgo = async (id, approved) => {
    if (!firebaseReady) return
    await updateDoc(doc(db, 'users', id), { approved: !!approved })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <p className="text-gray-600 mt-1">Approve NGO registrations and monitor activity.</p>

      <div className="mt-6 grid gap-4">
        {ngos.map((u)=> (
          <div key={u.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{u.email}</p>
              <p className="text-sm text-gray-600">Approved: {u.approved? 'Yes':'No'}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={()=>approveNgo(u.id, true)} className="px-3 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Approve</button>
              <button onClick={()=>approveNgo(u.id, false)} className="px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50">Reject</button>
            </div>
          </div>
        ))}
        {ngos.length === 0 && (
          <p className="text-gray-600">No NGO registrations yet.</p>
        )}
      </div>
    </div>
  )
}
