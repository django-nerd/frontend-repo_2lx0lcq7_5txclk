import { useEffect, useState } from 'react'
import { db, auth, firebaseReady } from '../../firebase'
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { useAuthState } from '../../hooks/useAuthState'

export default function DonorDashboard() {
  const { user } = useAuthState()
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', type: '', quantity: '', expiry: '', pickupTime: '', location: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user || !firebaseReady) return
    const q = query(collection(db, 'donations'), where('ownerId', '==', user.uid), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [user])

  const submit = async (e) => {
    e.preventDefault()
    if (!firebaseReady) return
    setSaving(true)
    try {
      await addDoc(collection(db, 'donations'), {
        ...form,
        quantity: Number(form.quantity || 0),
        ownerId: auth.currentUser.uid,
        status: 'available',
        createdAt: serverTimestamp(),
      })
      setForm({ name: '', type: '', quantity: '', expiry: '', pickupTime: '', location: '' })
    } finally {
      setSaving(false)
    }
  }

  const update = async (id, data) => {
    if (!firebaseReady) return
    await updateDoc(doc(db, 'donations', id), data)
  }

  const remove = async (id) => {
    if (!firebaseReady) return
    await deleteDoc(doc(db, 'donations', id))
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold">Donor Dashboard</h1>

      <form onSubmit={submit} className="mt-6 grid gap-4 bg-white border border-gray-200 rounded-xl p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Food name" value={form.name} onChange={(v)=>setForm({...form, name: v})} />
          <Input label="Type" value={form.type} onChange={(v)=>setForm({...form, type: v})} />
          <Input label="Quantity (meals)" type="number" value={form.quantity} onChange={(v)=>setForm({...form, quantity: v})} />
          <Input label="Expiry" type="date" value={form.expiry} onChange={(v)=>setForm({...form, expiry: v})} />
          <Input label="Pickup time" type="datetime-local" value={form.pickupTime} onChange={(v)=>setForm({...form, pickupTime: v})} />
          <Input label="Location" value={form.location} onChange={(v)=>setForm({...form, location: v})} />
        </div>
        <button disabled={saving || !firebaseReady} className="self-start inline-flex items-center px-4 py-2 rounded-md bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50">{saving? 'Posting...':'Post Donation'}</button>
      </form>

      <h2 className="text-xl font-semibold mt-8 mb-3">Your Donations</h2>
      <div className="grid gap-4">
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
                <button onClick={()=>update(d.id,{status:'cancelled'})} className="px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50">Cancel</button>
              )}
              <button onClick={()=>remove(d.id)} className="px-3 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-gray-600">No donations yet. Use the form above to post your first donation.</p>
        )}
      </div>
    </div>
  )
}

function Input({ label, type='text', value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input type={type} value={value} onChange={(e)=>onChange(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 focus:border-emerald-500 focus:ring-emerald-500" />
    </div>
  )
}
